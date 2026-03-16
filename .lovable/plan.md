
Goal: fix the patient-profile selection UI so all previously selected symptom/history/medication boxes stay visibly highlighted, and expand the final summary to include medications plus allergies with reactions.

What I found
- The multi-select state logic already works: `chiefComplaints`, PMH, family history, meds, surgeries, and allergies are being stored correctly in `PatientProfileScreen.tsx`.
- The likely bug is visual only: the reusable `.compact-btn` CSS in `src/index.css` applies its own background and border, which can override or weaken the selected Tailwind styles (`border-primary bg-primary/10`).
- The summary screen already shows complaints, medical history, surgeries, and allergies, but:
  - medications are missing entirely
  - allergies currently show allergen names only, not reactions
  - family history is not shown today, though your main request is medications/allergies

Implementation plan
1. Make selected boxes stay visibly selected
- Update the shared button styling approach used in `PatientProfileScreen.tsx` so selected cards use a stronger, persistent selected state.
- Best fix: give selectable buttons a dedicated selected variant/class or `data-selected` attribute, then style that in `src/index.css` with higher specificity than the base `.compact-btn`.
- Apply this consistently to:
  - chief complaints
  - past medical history grids
  - surgical history buttons
  - family history
  - medication selections
  - diuretics toggle
  - NKDA toggle
- Keep the current toggle logic; only the visual state needs to be hardened.

2. Update the final summary with medications
- In `src/screens/ReviewAndApproveScreen.tsx`, derive one combined medication list from:
  - diabetes meds + “other diabetes meds”
  - blood thinners
  - BP meds text entry
  - diuretics toggle
  - urologic meds
  - other prescriptions
  - supplements + “other supplements”
- Render that as a single combined summary line, per your preference.

3. Update the final summary with allergy reactions
- Keep the existing NKDA behavior.
- For entered allergies, show each item as `Allergen (Reaction)` when a reaction exists.
- If reaction is blank, fall back to allergen only so partial entries still display cleanly.

4. Add/adjust i18n labels for the summary
- Extend `src/i18n/en.ts` and `src/i18n/fr.ts` review strings with any missing labels needed for:
  - medications
  - optionally family history if we decide to expose it while touching the summary
- No data migration needed.

Files to update
- `src/screens/PatientProfileScreen.tsx`
- `src/index.css`
- `src/screens/ReviewAndApproveScreen.tsx`
- `src/i18n/en.ts`
- `src/i18n/fr.ts`

Expected result
- Users can select multiple applicable boxes and every selected one remains clearly highlighted.
- The visual state matches the already-correct stored state.
- The final summary includes a combined medication list.
- Allergies in the summary show allergen plus reaction, or NKDA when applicable.

Technical note
- I would avoid rewriting the form logic; the cleanest fix is to centralize “selected” styling instead of repeating fragile `border-primary bg-primary/10` classes on top of `.compact-btn`.
