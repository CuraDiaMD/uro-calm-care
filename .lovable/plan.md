
Goal: complete the previously approved UI update by finishing the parts that are still missing or inconsistent.

What I found
- The small orange “+” shortcut buttons were added correctly in `DailySummaryCard.tsx`.
- Wake/sleep were restored to their own separate row in `DailySummaryCard.tsx`.
- `DiaryStatusCard.tsx` now has the intended 2/3 progress + 1/3 date-picker layout with a localized calendar popover.
- The shared `selectedDiaryDate` store state is in place and wired up.

What is still incomplete
- `CalendarScreen.tsx` still keeps its own large diary-progress card at the top, so the new compact progress/date pattern is not reflected there.
- `CalendarScreen.tsx` still shows the selected date again above the entries list, which duplicates the new date selector instead of relying on it as the primary control.
- The diary screen summary cards do not yet include the small quick-add “+” shortcuts, so the shortcut behavior is only finished on Home.
- The diary screen still uses a slightly different summary-card layout/style than the updated Home pattern.

Plan to finish it
1. Align the diary screen header
- Remove the large standalone progress block from `CalendarScreen.tsx`.
- Reuse the compact top-row pattern already implemented in `DiaryStatusCard.tsx`, or embed `DiaryStatusCard` at the top of the diary screen if that fits existing structure cleanly.
- Keep the date picker in that compact header as the single source of date selection UI.

2. Remove duplicate date display in the diary screen
- Delete the extra formatted date text above the entries list in `CalendarScreen.tsx`.
- Let the top-right date selector be the only visible date control.

3. Add quick-add shortcuts to diary summary cards
- Add the same small orange lower-right “+” button to the intake summary card in `CalendarScreen.tsx`.
- Add the same small orange lower-right “+” button to the voiding summary card in `CalendarScreen.tsx`.
- Wire them to `openRecordWithTab('intake')` and `openRecordWithTab('voiding')`.

4. Keep leakage behavior consistent
- Preserve the red alert badge in the upper-right of the voiding card on the diary screen.
- Keep leakage rows in the entries list exactly as they are now.

5. Polish consistency
- Match spacing, card heights, and icon/button sizing between Home and Diary so both views feel like the same design system.
- Keep date formatting as `dd MMMM yyyy` with the current language locale.

Files to update
- `src/screens/CalendarScreen.tsx`
- Possibly `src/components/home/DiaryStatusCard.tsx` only if small reuse adjustments are needed

Expected result
- Both Home and Diary use the same compact progress/date header pattern.
- The diary screen no longer duplicates the selected date.
- Intake and voiding quick-add shortcuts work from both Home and Diary.
- Leakage remains clearly signaled and all entries stay visible in the recorded list.
