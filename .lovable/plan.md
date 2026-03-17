
Goal: make the Demographics date-of-birth picker much faster for older birth years by adding month/year dropdown navigation inside the existing mini calendar popover.

What I found
- The DOB field is already a shadcn-style `Popover` + `Calendar` in `src/screens/PatientProfileScreen.tsx`.
- It currently uses the shared `src/components/ui/calendar.tsx` wrapper around `react-day-picker`.
- The current calendar only exposes previous/next month arrows, which is why users must step back month-by-month.
- The shared calendar already includes `pointer-events-auto`, so the popover interaction foundation is correct.

Planned changes
1. Upgrade the shared calendar component
- Update `src/components/ui/calendar.tsx` to support month/year dropdown captions using `react-day-picker` options.
- Configure a wide year range, such as 1900 through the current year.
- Keep the existing styling and navigation arrows, while adding dropdown styling that matches the app’s compact UI.

2. Improve the DOB field behavior
- In `src/screens/PatientProfileScreen.tsx`, keep the current mini popover calendar UX.
- Pass DOB-specific props to the calendar so it opens in a birth-date-friendly range:
  - dropdown caption layout
  - bounded years (`fromYear`/`toYear` or equivalent supported props)
  - selected date stays synced with `profile.dateOfBirth`
- Keep the existing disabled rule preventing future dates and dates before 1900.

3. Preserve existing theme and localization
- Reuse current button/popover/calendar patterns instead of introducing a new date input.
- Keep the mini calendar format and existing translated label/placeholder text.
- If needed, ensure the displayed selected DOB remains formatted consistently with current locale behavior.

Files to update
- `src/components/ui/calendar.tsx`
- `src/screens/PatientProfileScreen.tsx`

Expected result
- Tapping Date of Birth still opens a small calendar popover.
- Users can jump directly to older years from a year selector instead of clicking back one month at a time.
- The field remains visually consistent with the rest of the app and still works well on tablet/mobile-sized layouts.

Technical notes
- This project uses `react-day-picker@8`, which supports dropdown-based caption layouts.
- Best implementation path: expose dropdown-friendly `classNames` and pass DOB-specific calendar props from the patient profile screen rather than changing all calendars globally.
- This avoids unintentionally changing the newer diary date picker behavior unless desired later.
