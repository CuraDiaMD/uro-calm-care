

# Uro-OS Patient Workflow v1.0 — Implementation Plan

This is a significant restructuring of the app from a 4-tab general tracker into a 7-step linear patient intake flow with a post-intake diary interface. The work is broken into 4 phases.

---

## Phase 1: Remove Out-of-Scope Features

**Files to delete:**
- `src/screens/ChatScreen.tsx`
- `src/components/forms/ICIQOABQuestionnaire.tsx`

**Files to modify:**
- `src/types/index.ts` — Remove `'chat'` from `TabType`, remove `ChatMessage` type, remove `'iciq-oab'` from `QuestionnaireType`, remove `ICIQOABAnswer`/`ICIQOABResult` types and related constants (`ICIQ_OAB_QUESTIONS`, `ICIQ_OAB_OPTIONS_*`)
- `src/stores/appStore.ts` — Remove `chatMessages`, `addChatMessage`, `iciqOabResults`, `addICIQOABResult`
- `src/components/BottomNav.tsx` — Remove chat nav item, rename Calendar tab to "Diary"
- `src/screens/FormsScreen.tsx` — Remove ICIQ-OAB questionnaire from the list and its import

---

## Phase 2: Update Data Models & State

**New types in `src/types/index.ts`:**

- `PatientProfile` — demographics (firstName, lastName, dateOfBirth, sexAtBirth, ramqNumber, ramqExpiry, cellPhone, email, familyPhysician), chiefComplaints (structured multi-select), pastMedicalHistory (checkbox arrays), pastSurgicalHistory, familyHistory, medications, allergies
- `Consent` — `{ clinicalData: boolean, researchData: boolean, communication: boolean, timestamps: { clinical?: Date, research?: Date, communication?: Date } }`
- `DailySymptomCheck` — `{ date: Date, dysuria: boolean, pain: boolean, hematuria: boolean, fever: boolean, padUse: 'none' | '1-2' | '3+' }`
- `IntakeStep` — union type for the 7 intake steps
- Update `VoidingEntry.urgeScale` from `1|2|3|4|5` to `0|1|2|3|4`
- Update `LeakageEntry` — add `activity: string`, `type: 'stress' | 'urge' | 'mixed' | 'unknown'`, `padUsed: boolean`; change `size` to include `'drops'`

**New state in `appStore.ts`:**
- `intakeStatus: 'not-started' | 'in-progress' | 'completed'`
- `currentIntakeStep: number` (0-6 for the 7 steps)
- `patientProfile: PatientProfile | null`
- `consents: Consent | null`
- `dailySymptomChecks: DailySymptomCheck[]`
- `diaryStartDate: Date | null`
- `sleepTime: string | null` / `wakeTime: string | null`
- Actions: `setIntakeStatus`, `setCurrentIntakeStep`, `setPatientProfile`, `setConsents`, `addDailySymptomCheck`, `setSleepWakeTimes`
- Persist `intakeStatus`, `currentIntakeStep`, `patientProfile`, `consents` in localStorage

---

## Phase 3: Implement 7-Step Intake Flow

**New screen components in `src/screens/`:**

1. **`MagicLinkLandingScreen.tsx`** — Logo, welcome text, "Start Intake" button. Sets `intakeStatus` to `'in-progress'` and `currentIntakeStep` to 0.

2. **`ConsentScreen.tsx`** — Three sequential sub-screens:
   - Clinical Data (mandatory — cannot proceed without accepting)
   - Research Data / AI Training (optional)
   - Communication Preferences (optional)
   Each shows a card with explanation text, "I Decline" and "I Accept" buttons. Stores timestamps.

3. **`PatientProfileScreen.tsx`** — Multi-section scrollable form using shadcn `Input`, `Select`, `Checkbox`, date pickers. Sections: Demographics, Chief Complaint (multi-select chips), Past Medical History (checkbox groups), Surgical History, Family History, Medications (conditional on diabetes), Allergies. "Continue" button validates required fields.

4. **`DiaryLandingScreen.tsx`** — Instructional screen explaining the 3-day diary. Plain-language bullet points. "Start Diary" button advances to the diary home (sets `intakeStatus` to `'completed'` to show main tabbed UI).

5. **`ReviewAndApproveScreen.tsx`** — Summary accordion showing: profile data, questionnaire scores, diary entry counts/totals. "Approve and Submit to Clinic" button shows confirmation. (Accessible from diary tab after 3 days complete.)

**Routing changes in `pages/Index.tsx`:**
- Read `intakeStatus` from store
- If `'not-started'` → render `MagicLinkLandingScreen`
- If `'in-progress'` → render step-based flow using `currentIntakeStep`:
  - Steps 0-2: Consent screens
  - Step 3: Patient Profile
  - Step 4: Questionnaires (reuse `FormsScreen` in sequential mode)
  - Step 5: Diary Landing
  - Step 6: Transitions to `'completed'`
- If `'completed'` → render the tabbed interface (Home, Diary, Record, Forms)

Header will show a back button during intake flow and a step indicator.

---

## Phase 4: Refine Existing Screens

**`FormsScreen.tsx`:**
- Filter questionnaires by `patientProfile.sexAtBirth` and `patientProfile.chiefComplaints` using the PRD routing rules:
  - Male → always show IPSS
  - Frequency/Urgency/Nocturia → show OAB-q
  - Incontinence/Leakage → show ICIQ-UI SF + OAB-q
- During intake flow (step 4), show questionnaires sequentially with a "Continue to Diary" button after all are complete

**`CalendarScreen.tsx` → Diary tab:**
- Add 3-day progress bar at top ("Day 1 of 3 Complete")
- Add sleep/wake time pickers (time inputs)
- Add daily symptom check section (dysuria, pain, hematuria, fever checkboxes + pad use select)
- Keep the existing date picker and entry list

**`RecordModal.tsx`:**
- Voiding: change urgency scale from 1-5 to 0-4 with labels (0=No urgency, 4=Could not hold)
- Leakage: add `activity` text input, `type` select (stress/urge/mixed/unknown), `padUsed` toggle; change size options to drops/small/large

**`HomeScreen.tsx`:**
- Add `DiaryStatusCard` component showing diary progress ("Day 2 of 3 — keep going!" or "Diary complete! Review and submit.")
- Link to Review screen when diary is complete

**`BottomNav.tsx`:**
- 4 tabs: Home, Diary, Record (+), Forms
- Only shown when `intakeStatus === 'completed'`

---

## Technical Notes

- Mock data dates will be updated to use relative dates (today minus N days) so the diary appears active
- The `PasswordGate` component remains for demo access control
- All new screens use the existing glass card design system (`compact-card`, `glass`, etc.)
- Approximately 8 new files, 8 modified files, 2 deleted files
- No backend needed — all state stays in zustand with localStorage persistence

