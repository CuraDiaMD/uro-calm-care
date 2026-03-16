Goal: add small orange shortcut “+” buttons on the intake and voiding cards, restore wake/sleep to their previous separate row, and place a compact editable date selector beside the diary progress bar.

What I found

- `DailySummaryCard.tsx` currently has one large voiding card and a merged date/wake/sleep row.
- `CalendarScreen.tsx` still contains the entries list and already reads `selectedDiaryDate` from the global store.
- `RecordModal` already supports opening directly to `intake` or `voiding` via `openRecordWithTab(...)`.
- The project already includes the shadcn `Calendar`, `Popover`, and `Button` components needed for an inline date picker.

Implementation plan

1. Add mini AFB shortcut buttons on the summary cards

- Update `DailySummaryCard.tsx` so both the intake and voiding rectangles have a small orange circular “+” button anchored at the lower-right.
- Clicking these buttons will call:
  - `openRecordWithTab('intake')`
  - `openRecordWithTab('voiding')`
- Keep the existing leak alert badge on the voiding card in the upper-right.

2. Rebuild the home summary layout

- Replace the current merged date/wake/sleep row in `DailySummaryCard.tsx`.
- Restore wake and sleep as their own separate row/cards, without the date mixed into that row.
- Make the main summary area a two-card layout:
  - intake card
  - voiding card with leak badge and mini plus shortcut

3. Put date selection beside the progress bar

- Update `DiaryStatusCard.tsx` to become a 2-part top row:
  - right: resized diary progress area
  - left: compact date selection rectangle taking about one-third of the row
- Display the date as `dd MMMM yyyy` using the active language/locale.
- Make the date rectangle pressable and open a shadcn popover calendar to change `selectedDiaryDate`.

4. Use a proper localized date picker

- Use the existing shadcn calendar/popover pattern.
- Ensure the calendar uses `pointer-events-auto`.
- Wire selection to `setSelectedDiaryDate`.
- Use `date-fns` formatting with French locale when the app language is French.

5. Keep the diary screen aligned

- Reuse the same selected date from the store in `CalendarScreen.tsx`.
- Remove the duplicate standalone date box from the diary screen if the new top-row selector becomes the primary control there, or visually align it with the new compact date-selection pattern.
- Keep the entries list and leak-in-list behavior unchanged.

Files likely to change

- `src/components/home/DailySummaryCard.tsx`
- `src/components/home/DiaryStatusCard.tsx`
- `src/screens/CalendarScreen.tsx`
- `src/i18n/en.ts`
- `src/i18n/fr.ts`

Expected result

- Home becomes faster to use with one-tap mini shortcuts for adding intake and voiding.
- Wake/sleep return to a clearer dedicated row.
- The selected diary date is visible and editable from a compact top-LEFT date card beside the progress bar.
- Date formatting matches the requested style and respects French/English locale.