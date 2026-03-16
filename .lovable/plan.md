

# Plan: Restore Home Screen & Restructure Navigation

## Changes

### 1. Bottom Nav: Home | FAB+ | Summary
Update `src/components/BottomNav.tsx`:
- Change first tab from "Questionnaires" (`forms`) to "Home" (`diary`) with a Home icon
- Keep FAB+ center button
- Keep "Summary" right tab

### 2. Home tab = old-style HomeScreen with DailySummaryCard + QuickIntakeSection
Update `src/pages/Index.tsx`:
- Default `diary` tab renders `CalendarScreen` (the diary with big intake/voiding summary cards, sleep/wake times, diary progress, entries list) — this is already the "home" view with the big sections the user liked
- Remove the `forms` case from tab switching since it moves to Summary

### 3. Summary tab = Profile + Questionnaires + Diary data (editable)
Update `src/screens/ReviewAndApproveScreen.tsx` (the Summary screen):
- Add "Edit" buttons/links next to Patient Profile and Questionnaires sections
- Profile edit: navigates to `PatientProfileScreen` in edit mode (add an `onComplete` callback to return to summary)
- Questionnaires edit: navigates to `FormsScreen` inline (same pattern)
- Keep the existing summary cards (profile, consents, questionnaires, diary data)

### 4. Inline editing from Summary
- Add state in `appStore` like `summarySubView: 'main' | 'edit-profile' | 'edit-forms'` to allow navigating to profile/forms editors from summary and returning back
- Or simpler: render FormsScreen/PatientProfileScreen conditionally within the Summary tab based on local state

**Files to modify:**
- `src/components/BottomNav.tsx` — rename first tab to Home
- `src/pages/Index.tsx` — update tab routing
- `src/screens/ReviewAndApproveScreen.tsx` — add edit buttons for profile & questionnaires, with inline sub-navigation
- `src/types/index.ts` — update TabType if needed (keep `diary` as home, keep `summary`)

