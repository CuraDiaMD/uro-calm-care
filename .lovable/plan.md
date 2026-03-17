
Goal: add a small sun icon inside the Wake card and a small moon icon inside the Sleep card as lightweight visual cues, without changing the current layout significantly.

What I found
- The wake/sleep rectangles are in `src/screens/CalendarScreen.tsx`.
- The Wake card currently has only a text label and time input.
- The Sleep card currently has only a text label and time input.
- `lucide-react` is already used in this file, and `Sun` is already imported.
- The existing cards use a compact muted style, so the icons should stay subtle and aligned with the label row.

Plan
1. Update the icon imports in `src/screens/CalendarScreen.tsx`
- Add `Moon` to the existing lucide import list.

2. Add a small icon to each label row
- Wake card: place a small `Sun` icon beside the Wake label.
- Sleep card: place a small `Moon` icon beside the Sleep label.

3. Keep the styling minimal and consistent
- Use a tiny icon size matching the compact UI.
- Apply muted/accented colors so the icons act as cues, not dominant elements.
- Keep the input alignment and card height unchanged.

4. Preserve current behavior
- Do not change the time input logic or state wiring.
- Do not affect the surrounding diary summary layout.

Expected result
- Wake rectangle shows a small sun icon next to its label.
- Sleep rectangle shows a small moon icon next to its label.
- The cards feel slightly clearer visually while keeping the same compact design.

Technical details
- File to update: `src/screens/CalendarScreen.tsx`
- Likely change: convert each label area into a small `flex items-center gap-1` row containing icon + label text.
- Suggested icon treatment:
  - Wake: `Sun` with a subtle warning/amber tone
  - Sleep: `Moon` with a subtle secondary/blue tone
