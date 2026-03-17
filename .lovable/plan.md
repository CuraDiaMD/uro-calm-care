
Goal: replace the custom-looking DOB calendar dropdown styling with a more standard pre-existing date picker experience that still supports quick year selection.

What I found
- The DOB picker already uses the shared `Calendar` wrapper in `src/components/ui/calendar.tsx`.
- The odd visuals are likely coming from the current custom dropdown classNames inside that shared wrapper:
  - `caption_dropdowns`
  - `dropdown`
  - `dropdown_month`
  - `dropdown_year`
- The DOB field in `src/screens/PatientProfileScreen.tsx` is already configured for year selection with `captionLayout="dropdown"`, `fromYear={1900}`, and `toYear={currentYear}`.
- No other screen is using the dropdown caption variant right now, so this can be improved safely without broad UI impact.

Plan
1. Inspect the supported `react-day-picker` v8 dropdown caption API
- Verify the recommended built-in caption/dropdown behavior and class hooks for the installed version.
- Confirm whether the cleanest option is:
  - using native dropdowns with lighter styling, or
  - using the library’s standard caption layout with minimal overrides.

2. Simplify the shared calendar styling
- Update `src/components/ui/calendar.tsx` so dropdown captions use a more standard, pre-existing visual treatment instead of the current heavily customized look.
- Keep the core shadcn calendar layout intact:
  - same day grid
  - same popover behavior
  - same pointer-events handling
- Reduce or remove custom dropdown-specific classes that are causing the “weird” appearance.

3. Keep the DOB picker on the standard year-select mode
- In `src/screens/PatientProfileScreen.tsx`, continue using the existing mini popover calendar with:
  - `captionLayout="dropdown"`
  - wide DOB year range
  - current disabled rules
- If needed, adjust only DOB-specific props like `defaultMonth` so the picker opens in a practical year without affecting other calendars.

4. Validate consistency with the rest of the app
- Ensure the revised picker still feels like a native/shadcn-style calendar rather than a bespoke control.
- Preserve the current compact clinical-form layout and localized date display.

Files likely involved
- `src/components/ui/calendar.tsx`
- `src/screens/PatientProfileScreen.tsx`

Expected result
- Date of Birth still opens a mini calendar popover.
- Users can choose month and year quickly.
- The calendar looks cleaner and more standard, without the strange custom dropdown visuals.
