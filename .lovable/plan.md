
Goal: restore the intended diary/home layout without reapplying changes blindly, and implement the small orange shortcut buttons plus the compact editable date selector safely.

What I would update

1. Daily summary cards
- In `src/components/home/DailySummaryCard.tsx`, split the current content into:
  - a separate wake/sleep row, matching the earlier layout pattern
  - a two-card summary area underneath:
    - Intake card
    - Voiding card
- Add a small orange circular `+` shortcut anchored at the lower-right of each card:
  - intake card opens `openRecordWithTab('intake')`
  - voiding card opens `openRecordWithTab('voiding')`
- Keep the leak alert badge in the upper-right of the voiding card.

2. Diary progress + date selector row
- In `src/components/home/DiaryStatusCard.tsx`, replace the current single full-width button with a 2-part top row:
  - left: diary progress card taking about two-thirds width
  - right: compact date card taking about one-third width
- The date card will display the shared `selectedDiaryDate` as `dd MMMM yyyy`.
- Pressing the date card will open a shadcn `Popover` + `Calendar` so the user can change the selected diary day directly.
- The progress area will still show current completion state and keep navigation to the diary tab.

3. Localized interactive date picker
- Use the existing `Calendar`, `Popover`, and `PopoverContent` components.
- Format the date with `date-fns`, using French locale when the app language is `fr`.
- Ensure the calendar gets `pointer-events-auto` so it remains clickable inside the popover.
- Wire date selection to `setSelectedDiaryDate`.

4. Keep diary screen aligned
- In `src/screens/CalendarScreen.tsx`, remove or simplify the duplicate static date block so the new compact top selector is the primary date control on Home.
- Keep the entries list and leak rows unchanged.
- Keep summary calculations driven by `selectedDiaryDate`.

5. Translation support
- Add any small missing labels in `src/i18n/en.ts` and `src/i18n/fr.ts` only if needed for the compact date card or shortcut UI.
- Reuse existing wake/sleep and diary labels where possible to minimize changes.

Design notes
- I would keep the orange shortcut buttons visually smaller than the existing large action buttons so they read as quick-add shortcuts, not primary CTAs.
- The date card should be compact but still readable at the current narrow mobile viewport.
- I would avoid reintroducing the full calendar strip; only the popover date picker should control day selection.

Files to change
- `src/components/home/DailySummaryCard.tsx`
- `src/components/home/DiaryStatusCard.tsx`
- `src/screens/CalendarScreen.tsx`
- `src/i18n/en.ts`
- `src/i18n/fr.ts`

Expected result
- Home is faster to scan and use.
- Wake/sleep return to a clearer dedicated row.
- Intake and voiding each get a small one-tap add shortcut.
- The selected diary date is visible beside progress and can be changed inline with a localized calendar picker.
- Leakage remains visible through the red badge and the recorded entries list.
