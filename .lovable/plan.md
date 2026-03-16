

# Plan: Add French/English Language Toggle with Full Translation

## Approach
Create a centralized i18n (internationalization) system with EN/FR translation dictionaries and a React context. Add a language toggle button in the Header. All hardcoded UI strings across the app will be replaced with translation lookups.

## Technical Design

### 1. Create translation files (`src/i18n/en.ts`, `src/i18n/fr.ts`, `src/i18n/index.ts`)
- Define a flat/nested dictionary of all UI strings keyed by identifiers
- EN file contains current English text; FR file contains full French translations
- `index.ts` exports a `useTranslation` hook and `LanguageProvider` context
- Language preference stored in `appStore` (persisted to localStorage)

### 2. Add `language` to appStore (`src/stores/appStore.ts`)
- New state: `language: 'en' | 'fr'`, default `'en'`
- New action: `setLanguage(lang)`
- Persisted alongside other state

### 3. Add language toggle to Header (`src/components/Header.tsx`)
- Small "EN | FR" toggle button next to the reset button (top-right area)
- Clicking toggles between `'en'` and `'fr'`

### 4. Replace all hardcoded strings across ~15 files
Files requiring translation lookups:
- **Screens**: `MagicLinkLandingScreen`, `ConsentScreen`, `PatientProfileScreen`, `FormsScreen`, `DiaryLandingScreen`, `CalendarScreen`, `ReviewAndApproveScreen`
- **Components**: `Header`, `BottomNav`, `RecordModal`, `DailySummaryCard`, `DiaryStatusCard`, `QuickIntakeSection`
- **Forms**: `IPSSQuestionnaire`, `OABqQuestionnaire`, `ICIQUIQuestionnaire`
- **Types**: `BEVERAGE_INFO`, `URGE_SCALE_LABELS`, `CHIEF_COMPLAINT_LABELS`, questionnaire questions/options — these will have FR equivalents in the translation files, accessed via the hook

### 5. Translation scope (key content areas)
- Navigation labels (Home, Record, Summary)
- Consent screens (3 screens with titles, descriptions, bullet points, buttons)
- Patient profile form (all section headers, field labels, medical terms, button text)
- Questionnaire text (IPSS 8 questions + options, OAB-q 7 questions + options, ICIQ-UI 4 questions + options + leakage situations)
- Diary landing (instructions, tips)
- Calendar/home screen (section headings, summary labels, entry labels)
- Record modal (tab names, field labels, placeholders, button text)
- Review screen (section titles, field labels, submit button)
- Toast messages
- Medical history terms (PMH categories, surgical options, medications, etc.)

### Files created
- `src/i18n/en.ts` — English dictionary (~300+ keys)
- `src/i18n/fr.ts` — French dictionary (same keys, French values)
- `src/i18n/index.ts` — `useTranslation` hook

### Files modified
- `src/stores/appStore.ts` — add `language` state
- `src/components/Header.tsx` — add FR/EN toggle
- All screen and component files listed above — replace hardcoded strings with `t('key')` calls

