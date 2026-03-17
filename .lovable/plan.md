
Goal: replace the current DOB popover calendar with an iPhone-style wheel picker while keeping year selection fast and the overall form visually cleaner.

What I found
- The current DOB field in `src/screens/PatientProfileScreen.tsx` uses `Popover + Calendar`.
- The shared `Calendar` in `src/components/ui/calendar.tsx` is based on `react-day-picker`, which is a month-grid calendar, not an iOS wheel-style picker.
- The project already has reusable primitives that fit this redesign well:
  - `Drawer` for a bottom-sheet mobile picker
  - `Select` for a quick year dropdown
  - `ScrollArea` if needed for wheel-like scrolling columns

Recommended approach
- Do not keep trying to force the shared month-grid calendar to look like Apple.
- Build a dedicated DOB picker component with:
  - an iOS-style bottom sheet
  - 3 columns for month, day, and year
  - a year dropdown or fast year jump control
- Keep the shared `Calendar` component unchanged for other date uses.

Implementation plan
1. Create a dedicated DOB picker component
- Add a new reusable component such as `src/components/forms/DateOfBirthPicker.tsx`.
- Use `Drawer` so the picker opens like a native iPhone date selector from the bottom.
- Show the currently selected DOB in the existing button field on the profile form.

2. Build the Apple-like picker UI
- Inside the drawer, create 3 vertically scrollable selector columns:
  - Month
  - Day
  - Year
- Style them to resemble iOS wheels:
  - centered selected row
  - faded rows above and below
  - subtle highlight band across the selected row
- Use a year dropdown or jump control above the year column so users can move quickly to older years.

3. Wire DOB logic safely
- Generate valid day options based on selected month/year.
- Handle leap years correctly.
- Keep bounds:
  - minimum year 1900
  - maximum date today
- Preserve the existing `profile.dateOfBirth` state shape and `updateField('dateOfBirth', ...)` flow.

4. Integrate into demographics form
- Replace only the DOB `Popover + Calendar` block in `src/screens/PatientProfileScreen.tsx`.
- Keep the current trigger button pattern and localized formatted date display.
- Maintain compact form spacing so it still fits the clinical intake layout.

5. Keep visuals isolated
- Avoid changing `src/components/ui/calendar.tsx` unless another screen truly needs it.
- This prevents unintended design regressions in any existing calendar usage.

Files likely involved
- New: `src/components/forms/DateOfBirthPicker.tsx`
- Update: `src/screens/PatientProfileScreen.tsx`

Expected result
- Tapping DOB opens a cleaner iPhone-style date picker instead of the current grid calendar.
- Users can quickly choose old birth years without repeated month navigation.
- The redesign is isolated to DOB and won’t disturb other calendar UI in the app.

Technical notes
- A true Apple-style picker is better implemented as a custom wheel-style selector, not by skinning `react-day-picker`.
- `Drawer` is already available in the codebase, so it matches the desired mobile-native interaction well.
- The year control can be either:
  - a dropdown tied to the year column, or
  - direct scrolling in the year wheel plus a quick-jump dropdown.
- I recommend the second option: wheel columns for the Apple feel, plus a compact year dropdown for speed.
