
Goal: simplify the diary/home experience by moving the date + wake/sleep controls into one compact row on the home page, removing the calendar strip, keeping leakage visible as a badge on the voiding card, and preserving all entries in the recorded list.

What I found
- The current home page is only 3 stacked cards: `DiaryStatusCard`, `DailySummaryCard`, and `QuickIntakeSection`.
- The date, wake/sleep controls, calendar strip, summary tiles, leakage card, and entries list all currently live in `src/screens/CalendarScreen.tsx`.
- `DailySummaryCard.tsx` currently shows only today’s date and the voiding summary.
- `CalendarScreen.tsx` owns its own local `selectedDate`, so the “selected diary day” is not shared with the home page today.
- Leakage is already computed in the store via `getTodaySummary()` as:
  - direct leakage entries
  - voiding entries marked `hasLeak`
- The entries list already includes intake, voiding, and leakage rows, which matches your goal.

Implementation plan
1. Share the selected diary day across screens
- Move the currently local `selectedDate` into the app store so both Home and Diary can use the same selected day.
- Default it to today.
- Add a setter like `setSelectedDiaryDate`.

2. Redesign the top of the home page
- Replace the current “title + date” layout in `DailySummaryCard` with one compact row:
  - date in `dd/mm/yyyy`
  - wake time
  - sleep time
- Use one consistent card height and keep the order exactly as requested: date, wake, sleep.
- Remove the date subtitle formatting currently used in `DailySummaryCard`.

3. Remove the calendar block from the diary screen
- Delete the month/week calendar selector UI from `CalendarScreen.tsx`.
- Keep the diary progress, compact date/wake/sleep area if needed, summary tiles, and entries list.
- Make both Home and Diary read from the shared selected diary date instead of local component state.

4. Add leakage badge onto the voiding card
- Remove the standalone leakage summary card/section from both the daily summary and the diary summary area.
- Add a red alert badge/icon in the upper-right corner of the voiding rectangle whenever there is any leak for the selected day:
  - dedicated leakage entry exists, or
  - a voiding entry has `hasLeak = true`
- Keep the voiding totals/frequencies unchanged.

5. Keep leaks in the recorded entries list
- Do not remove leakage rows from the entries list.
- Continue mixing intake, voiding, and leakage entries in chronological order.
- Update any date filtering to use the shared selected diary date.

6. Update formatting and labels
- Add any missing translation keys needed for:
  - compact date/wake/sleep row labels if shown
  - any home-specific phrasing after removing leakage card/calendar UI
- Format the selected day as `dd/mm/yyyy` consistently on Home.

Files likely to change
- `src/stores/appStore.ts`
- `src/components/home/DailySummaryCard.tsx`
- `src/screens/CalendarScreen.tsx`
- `src/screens/HomeScreen.tsx`
- `src/i18n/en.ts`
- `src/i18n/fr.ts`

Expected result
- The home page becomes denser and easier to scan on mobile.
- The top row shows date, wake time, and sleep time in a single compact line.
- The calendar selector is gone.
- Leakage is still clearly signaled via a red icon on the voiding card, without taking its own section.
- The recorded entries list still includes leakage items, so no data visibility is lost.

Technical note
- The main architectural change is lifting `selectedDate` out of `CalendarScreen` into the global store. Without that, the home page cannot reliably reflect the same “selected diary day” the user chose elsewhere.
