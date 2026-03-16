

# Plan: Move Daily Symptom Check from Homepage to Record Modal

## Changes

### 1. Remove Daily Symptom Check from CalendarScreen (`src/screens/CalendarScreen.tsx`)
- Delete lines 181-231 (the entire "Daily Symptom Check" section: symptom toggle buttons, pad use selector, save button)
- Remove unused state/imports: `symptoms` state, `todayCheck`, `handleSaveSymptoms`, `dailySymptomChecks`, `addDailySymptomCheck`, `DailySymptomCheck` type import
- Increase summary card text sizes (e.g. `text-xl` → `text-2xl`) for better readability with the freed space

### 2. Add "Symptoms" tab to RecordModal (`src/components/record/RecordModal.tsx`)
- Add `'symptoms'` to the `RecordTab` type in `src/types/index.ts`
- Add a 4th tab button "Symptoms" in the modal tab bar
- Add symptom check form content (moved from CalendarScreen): 4 symptom toggles (dysuria, pain, hematuria, fever), pad use selector (none/1-2/3+), and save button
- Add local state for symptoms within the modal
- On save, call `addDailySymptomCheck` from the store with today's date, show toast, and close modal

### 3. Update store record tab (`src/stores/appStore.ts`)
- Update `RecordTab` default or ensure the `setRecordTab` action accepts `'symptoms'`

**Files modified:**
- `src/types/index.ts` — add `'symptoms'` to `RecordTab`
- `src/screens/CalendarScreen.tsx` — remove symptom section + related state, enlarge summary cards
- `src/components/record/RecordModal.tsx` — add Symptoms tab with the relocated symptom check UI

