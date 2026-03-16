
Goal: make French the default language from the very first screen, fully translate the password gate and welcome screen, and keep EN/FR switching available throughout the app.

What I found
- `PasswordGate.tsx` is still hardcoded in English and sits outside the routed app, so it does not yet participate in the existing i18n flow.
- `MagicLinkLandingScreen.tsx` already uses translations.
- `Header.tsx` already has an EN/FR toggle for the main intake/app experience.
- `appStore.ts` currently defaults `language` to `'en'`; this must change to `'fr'`.

Implementation plan
1. Make French the default app language
- Update `src/stores/appStore.ts` so `language` defaults to `'fr'`.
- Keep persistence so once a user switches to English, that choice carries through the rest of the flow.

2. Bring the password gate into the i18n system
- Update `src/components/PasswordGate.tsx` to read/write `language` from `useAppStore`.
- Add the same EN/FR toggle directly on the password gate.
- Toggle behavior:
  - Default selected state = FR
  - If user switches to EN on the gate, it immediately sets the global language for the rest of the experience
  - If they stay in FR, the whole experience remains in French

3. Fully translate the password gate copy
- Replace hardcoded strings with translation keys:
  - intro/help text
  - password placeholder
  - incorrect password error
  - continue button
  - any accessibility labels tied to the language toggle
- Add matching keys to both `src/i18n/en.ts` and `src/i18n/fr.ts`.

4. Ensure the welcome screen is fully French-first
- Confirm `MagicLinkLandingScreen.tsx` continues to read all copy from `t.landing.*`.
- Verify the French strings are the primary/default experience now that store default becomes FR.
- If any remaining welcome-screen labels or alt/accessibility text are still hardcoded, move them into translations too.

5. Keep language switching available throughout the full UX
- Reuse the existing header toggle for all post-gate screens.
- Make the password gate toggle visually consistent with the header toggle so users understand language can be changed at any time.
- Ensure switching on the gate and switching later in the header both update the same global store state.

Files to update
- `src/stores/appStore.ts`
- `src/components/PasswordGate.tsx`
- `src/i18n/en.ts`
- `src/i18n/fr.ts`
- Possibly minor cleanup in `src/screens/MagicLinkLandingScreen.tsx` if any non-translated text remains

Expected result
- First load opens in French by default
- Password gate is fully French by default
- User can switch to English on the password gate before entering
- That choice persists into the welcome screen and the rest of intake
- Users can continue toggling EN/FR throughout the experience via the existing header control

Technical note
- Because the password gate wraps the router in `App.tsx`, using the shared Zustand store inside `PasswordGate.tsx` is the simplest way to keep one source of truth for language across both the gate and the rest of the app.
