
Goal: fully translate the patient history portions of the profile into proper French medical terminology, specifically past medical history, surgical history, family history, and medications.

What I found
- The section headers are already translated in `src/i18n/fr.ts`.
- The actual selectable clinical options are still hardcoded in English in `src/types/index.ts`:
  - `PMH_*`
  - `SURG_*`
  - `FAMILY_HX_OPTIONS`
  - `DIABETES_MEDS`
  - `BLOOD_THINNERS`
  - `UROLOGIC_MEDS`
  - `SUPPLEMENTS`
- `PatientProfileScreen.tsx` renders those constants directly, so the French UI still shows English option labels.
- `ReviewAndApproveScreen.tsx` displays stored values directly, so existing saved English data will remain English unless explicitly migrated.
- You chose: new labels only, not converting existing saved local data.

Implementation plan
1. Move patient-history option labels into i18n
- Add a dedicated translation block for clinical history options in:
  - `src/i18n/en.ts`
  - `src/i18n/fr.ts`
- Include all selectable labels for:
  - endocrine, cardiovascular, neurological, renal/urologic, cancer, other PMH
  - urologic surgeries, general surgeries
  - family history
  - diabetes medications, anticoagulants/antiplatelets, urologic medications, supplements
- Use proper French medical terminology, not literal consumer-grade translations.

2. Update the profile screen to render translated option arrays
- Replace direct use of constants from `src/types/index.ts` inside `src/screens/PatientProfileScreen.tsx`.
- Build display arrays from `t...` translation data instead, so the visible checkbox/button labels are localized.

3. Preserve current data model safely
- Keep stored values as display strings for now, since you do not want a migration of existing saved local data.
- Ensure new selections made while in French are saved in French and displayed in French going forward.
- Accept that older persisted English entries may still appear in the review screen until reset.

4. Audit review output
- Check `src/screens/ReviewAndApproveScreen.tsx` to ensure newly saved French labels render cleanly in summary text.
- No migration layer needed for old values per your preference.

Files to update
- `src/i18n/en.ts`
- `src/i18n/fr.ts`
- `src/i18n/types.ts` if the new translation structure requires schema expansion
- `src/screens/PatientProfileScreen.tsx`

Technical details
- Best approach: stop treating these medical option lists as global constants in `src/types/index.ts` for rendering purposes.
- Keep `src/types/index.ts` focused on types/interfaces.
- In `PatientProfileScreen.tsx`, derive arrays like:
  - `const endocrineOptions = t.profileOptions.pmh.endocrine`
  - `const urologicSurgeryOptions = t.profileOptions.surgery.urologic`
- This keeps EN/FR fully synchronized and avoids duplicated translation logic.
- Because current stored values are label strings rather than stable IDs, a future enhancement would be to refactor these options to key-based enums/IDs. That would make translations cleaner and avoid mixed-language persisted data.

Expected result
- All patient history choices shown in the profile flow appear in proper French when the app is in French.
- English remains available when toggled.
- New patient history entries created in French display in French throughout the intake and review flow.
- Existing saved English history entries are left untouched, as requested.
