
Goal: replace the current DOB picker with a plain text DOB field that auto-formats user input as `DD / MM / YYYY`.

What I found
- The DOB field is currently rendered via `DateOfBirthPicker` in `src/screens/PatientProfileScreen.tsx`.
- The stored profile shape expects `dateOfBirth: Date | null` in `src/types/index.ts`, so the new text input should still parse to a real `Date` before saving to state.
- The app already uses simple styled text inputs in this screen, so the new DOB field can match the existing form design without introducing a new UI primitive.
- Current section validation does not require DOB, so this change can stay optional unless you want DOB to become required.

Plan
1. Remove the custom DOB picker from the demographics section
- Replace the `DateOfBirthPicker` usage in `src/screens/PatientProfileScreen.tsx` with a normal text input styled like the other demographic fields.
- Use a DOB-specific placeholder such as `DD / MM / YYYY`.

2. Add live formatting behavior
- As the user types digits, auto-insert separators so:
  - `1` stays `1`
  - `1804` becomes `18 / 04`
  - `18041994` becomes `18 / 04 / 1994`
- Ignore non-numeric characters and cap input at 8 digits.

3. Parse safely into the existing profile state
- Keep the visible input as text, but convert it into `Date | null` for `profile.dateOfBirth`.
- Only save a `Date` when all 8 digits are present and the value is valid.
- Reject impossible dates like `32 / 13 / 1994`, leap-year-invalid dates, and future dates by keeping the stored value null until valid.

4. Keep editing behavior intuitive
- Initialize the text field from an existing DOB in the same `DD / MM / YYYY` format when the profile already has a date.
- Preserve partial typing so users can type naturally without the field fighting them.

5. Clean up unused DOB picker code
- Remove the `DateOfBirthPicker` import from `PatientProfileScreen.tsx`.
- Since this picker appears DOB-specific, I would also remove the dedicated component file if it is no longer used anywhere else; otherwise leave it in place.

Files likely involved
- `src/screens/PatientProfileScreen.tsx`
- Possibly `src/components/forms/DateOfBirthPicker.tsx` if it becomes unused

Technical notes
- Best implementation path is a small pair of helpers inside `PatientProfileScreen.tsx`:
  - one function to format raw digits into `DD / MM / YYYY`
  - one function to parse/validate the formatted string into a `Date | null`
- Validation should confirm the constructed date matches the entered day, month, and year exactly, and is not in the future.
- This keeps the UI simple for users while preserving the existing typed data model in the store.
