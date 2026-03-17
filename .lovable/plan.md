
Goal: add a subtle bilingual disclaimer to the first password screen, shown in the active language, without disrupting the existing centered layout.

What I found
- The password screen is `src/components/PasswordGate.tsx`.
- It already uses the i18n system via `useTranslation()` and has a language toggle.
- Password gate copy currently lives under `passwordGate` in both `src/i18n/en.ts` and `src/i18n/fr.ts`.

Implementation plan
1. Extend password-gate translations
- Add a new translation key under `passwordGate` in both English and French for the disclaimer text.
- Keep the copy exactly as provided, localized per language.

2. Render the disclaimer in `PasswordGate`
- Insert a small text block near the top of the form, below the language toggle and above the logo or prompt.
- Use subtle styling such as very small muted text, centered alignment, compact line height, and constrained width so it reads like a header notice rather than a warning banner.

3. Preserve current UX
- Keep the language toggle behavior unchanged so the disclaimer switches instantly between EN/FR.
- Avoid changing password logic, spacing rhythm, or overall gate flow beyond the added notice.

Design notes
- Best fit is a lightweight paragraph, not an alert component.
- Suggested visual treatment: `text-[10px]` or `text-xs`, `text-muted-foreground`, centered, with slightly tighter line-height and maybe a soft max width for readability.
- This keeps it visible enough for compliance/demo context while still feeling subtle.

Files to update
- `src/components/PasswordGate.tsx`
- `src/i18n/en.ts`
- `src/i18n/fr.ts`

Expected result
- The first password page shows a discreet demo-only disclaimer.
- The text appears in English or French based on the selected language.
- The rest of the password screen remains visually consistent.
