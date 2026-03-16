Goal: add small orange “+” shortcut buttons on the intake and voiding cards, restore wake/sleep to their own row, and add a compact date picker card beside the progress bar without changing the overall theme.

What I found

- `DailySummaryCard.tsx` already controls the home summary cards and already has `openRecordWithTab('voiding')`.
- `RecordModal.tsx` already supports opening directly to `intake` or `voiding` tabs via `openRecordWithTab`.
- `CalendarScreen.tsx` currently has:
  - a full-width progress card
  - a combined date/wake/sleep row
  - intake/voiding summary cards
  - the recorded entries list
- The project already has shadcn `Calendar`, `Popover`, and shared `selectedDiaryDate` state in the store.
- Current date formatting is numeric `dd/mm/yyyy`; your request needs `dd month yyyy`, localized.

Implementation plan

1. Add a compact date selector next to the progress bar

- Split the top row in `CalendarScreen.tsx` into:
  - right: diary progress card taking about 2/3 width
  - left: compact date selection card taking about 1/3 width
- Make the date card clickable and open a shadcn calendar popover.
- Bind it to `selectedDiaryDate` / `setSelectedDiaryDate` in the store.
- Format the visible date as localized `dd MMMM yyyy`.

2. Revert wake/sleep to a separate row

- Move wake and sleep controls back out of the date row.
- Render them as their own 2-column row below the progress/date row.
- Keep the existing card styling so the design theme stays consistent.

3. Add small orange shortcut buttons to intake and voiding cards

- In both Home and Diary summary cards, add a smaller floating circular orange “+” button at the lower-right corner of:
  - intake card → opens `openRecordWithTab('intake')`
  - voiding card → opens `openRecordWithTab('voiding')`
- Keep the existing summary content intact.
- Preserve the red leakage alert badge in the voiding card’s upper-right.

4. Keep styling aligned with the current theme

- Reuse existing muted/card/border classes and current accent colors.
- Avoid introducing a new visual language; only add compact positioned action buttons and rearrange layout spacing.

Files likely to update

- `src/components/home/DailySummaryCard.tsx`
- `src/components/home/DiaryStatusCard.tsx` if needed for layout balance, but likely not
- `src/screens/CalendarScreen.tsx`
- `src/components/ui/calendar.tsx` to ensure `pointer-events-auto` is present
- possibly `src/i18n/en.ts` and `src/i18n/fr.ts` only if a date label or helper text is needed

Technical notes

- Use `date-fns` `format()` with locale support (`frLocale` when language is French) for `dd MMMM yyyy`.
- Use shadcn `Popover` + `Calendar` for the date picker; ensure the calendar gets `className="p-3 pointer-events-auto"`.
- The shortcut buttons should call the existing store action instead of duplicating modal logic.
- Positioning should account for the existing voiding leak badge so the two controls do not overlap.

Expected result

- The top of the diary view becomes:
  - progress card on the right
  - tappable date card on the left
  - wake/sleep controls on a separate row below
- Intake and voiding cards each get a fast-add small orange “+” shortcut.
- Tapping a shortcut opens the matching “record entry” tab immediately.
- The app keeps the same theme and visual style, just with a denser and more usable layout.