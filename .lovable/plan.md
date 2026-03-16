

# Plan: PRD-Compliant Medical History & Bottom Nav Rearrangement

## Two Changes

### 1. Expand Patient Profile Medical History to Match PRD Sections 8.3-8.7

**Current state:** The history section has a flat list of ~11 medical conditions, free-text surgical/family/medications/allergies fields.

**PRD requires structured, categorized data:**

**Types changes (`src/types/index.ts`):**
- Replace `pastMedicalHistory: string[]` with structured object containing categorized checkbox arrays:
  - Endocrine: Diabetes Type 1, Diabetes Type 2
  - Cardiovascular: Hypertension, CAD, Heart failure, Atrial Fibrillation
  - Neurological: Stroke/TIA, Parkinson's, MS, Spinal cord injury, Alzheimer's/Dementia
  - Kidney/Urologic: Kidney stones, CKD, Frequent UTIs, BPH
  - Cancer: Prostate cancer, Bladder cancer, Kidney cancer, Testicular cancer, Other cancer (free-text), Pelvic radiation/chemo
  - Other: Asthma/COPD/Sleep Apnea, Bleeding disorders, Crohn's/UC
- Replace `pastSurgicalHistory: string` with structured checkbox arrays + optional year fields:
  - Urologic: Prostate surgery, Kidney surgery, Bladder surgery, Vasectomy, Hysterectomy/C-section, Pelvic floor repair
  - General: Hernia repair (mesh Y/N), Bowel surgery, Bariatric surgery
- Replace `familyHistory: string` with structured checkboxes (prostate cancer, bladder cancer, kidney cancer, kidney stones, other)
- Replace `medications: string` with structured sections:
  - Diabetes meds (conditional on diabetes checked): Insulin, Metformin, SGLT2 inhibitors, GLP-1 agonists, Other
  - Blood thinners: Aspirin, Plavix, Coumadin, Eliquis/Xarelto, BP meds (free-text), Diuretics
  - Urologic meds (checkboxes for common ones)
  - Other prescriptions (free-text)
  - Supplements: Saw Palmetto, Vitamin C/Calcium, Other (free-text)
- Replace `allergies: string` with array of `{ allergen: string, reaction: string }` plus `noKnownAllergies: boolean`

**PatientProfileScreen changes:** Split "History" section into multiple sub-sections (potentially 4-5 sub-steps within section 2): Past Medical History, Surgical History, Family History, Medications, Allergies. Each uses grouped checkboxes matching the PRD categories.

**Store & EMPTY_PROFILE updates** to match new types.

### 2. Rearrange Bottom Nav for Diary Homepage

**Current:** Home | Diary | FAB+ | Forms (4 tabs)

**New layout:** Questionnaires | FAB+ | Summary (3 tabs)

- Remove `home` and `diary` tabs
- Rename `forms` to display as "Questionnaires"
- Add a `summary` tab that renders the `ReviewAndApproveScreen` (or a dedicated summary view showing diary progress + entries)
- The diary/calendar view becomes the main content area (always visible as the background, or the default view)
- The FAB+ button stays centered

**Files modified:**
- `src/types/index.ts` — update `TabType` to `'diary' | 'record' | 'forms' | 'summary'`, restructure `PatientProfile`
- `src/stores/appStore.ts` — update default tab, update `EMPTY_PROFILE` and related actions
- `src/components/BottomNav.tsx` — 3-item layout: Questionnaires | FAB+ | Summary
- `src/screens/PatientProfileScreen.tsx` — full rewrite of history section with categorized checkboxes
- `src/pages/Index.tsx` — update tab rendering, make diary the default view with questionnaires/summary as overlays or tab switches
- `src/screens/HomeScreen.tsx` — may be removed or merged into diary view

