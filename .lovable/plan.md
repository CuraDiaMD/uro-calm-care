
Goal: change the demo password from `DIA-84842486` to `ESG2026`.

What I found
- The password is hardcoded in `src/components/PasswordGate.tsx` as:
  `const DEMO_PASSWORD = "DIA-84842486";`
- The password check happens in the same file inside `handleSubmit`.
- Existing session behavior uses `sessionStorage` with `curadia-demo-access`, so users who already unlocked the app in the same browser session may remain allowed in until that session is cleared.

Plan
1. Update `src/components/PasswordGate.tsx`
- Replace the `DEMO_PASSWORD` value with `ESG2026`.

2. Keep current behavior unchanged
- Do not alter the password form UI, disclaimer, language toggle, or submit logic.
- Do not change the session key unless you also want previously unlocked sessions to be forced to re-enter the new password.

3. Optional follow-up decision
- If you want the new password to apply immediately for anyone already unlocked in this browser session, also change the session key or reset session access logic.
- If not, only the hardcoded password needs updating.

Expected result
- New visitors must enter `ESG2026` to pass the password gate.
- Current layout and bilingual behavior remain unchanged.
