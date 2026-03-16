
Goal: fix the profile multi-select UI so every selected complaint/history/medication stays visibly highlighted until deselected, and make the summary show complaints in French.

What I found
- The toggle logic in `src/screens/PatientProfileScreen.tsx` is already multi-select and correctly adds/removes items from arrays.
- The fact that selections still appear in the summary strongly suggests this is a rendering/styling issue, not a data issue.
- The reusable selection UI currently relies on adding Tailwind classes like `border-primary bg-primary/10` on top of `.compact-btn`. That is likely too fragile/inconsistent across all these buttons.
- In `src/screens/ReviewAndApproveScreen.tsx`, complaints are rendered with `patientProfile.chiefComplaints.join(', ')`, which outputs the stored enum keys (`frequency`, `weak-stream`, etc.) instead of translated French labels.

Implementation approach
1. Centralize selected-state styling
- In `PatientProfileScreen.tsx`, stop relying on ad hoc `border-primary bg-primary/10` strings.
- Add a dedicated selected marker such as:
  - `data-selected={selected.includes(item)}`
  - or a shared `selected` class
- Apply it consistently to:
  - chief complaints
  - PMH grids
  - surgical options
  - family history
  - medication options
  - diuretics
  - NKDA

2. Make selected styling stronger than base button styles
- Update `src/index.css` so `.compact-btn[data-selected="true"]` (or `.compact-btn.selected`) has a clear persistent active style:
  - stronger border
  - tinted background
  - optional text color / shadow
- Keep the unselected base appearance unchanged.
- This ensures multiple selected items stay highlighted at the same time and clicking again removes the highlight.

3. Fix complaints translation in the summary
- In `ReviewAndApproveScreen.tsx`, map `patientProfile.chiefComplaints` through `t.chiefComplaints[key]` before joining.
- This will display French labels when the app is in French instead of the raw stored keys.

4. Verify summary formatting stays correct
- Keep the existing summary structure for PMH/surgery/allergies/medications.
- Ensure deselecting an item removes it both from the highlight state and from the final summary output.

Files to update
- `src/screens/PatientProfileScreen.tsx`
- `src/index.css`
- `src/screens/ReviewAndApproveScreen.tsx`

Expected result
- Multiple boxes remain visibly highlighted across complaints, PMH, surgery, family history, and medications.
- Clicking a selected box again removes the highlight and removes that item from saved selections/summary.
- Chief complaints appear in French in the summary.
