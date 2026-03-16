

# Plan: Improve Homepage Readability & Add Demo Reset Button

## Changes

### 1. Header — Replace Settings icon with Demo Reset button (`src/components/Header.tsx`)
- Replace `Settings` icon import with `RotateCcw` from lucide-react
- When not showing step indicator, render a "Reset" button (RotateCcw icon) that clears localStorage and reloads the page
- Add a confirmation via `window.confirm` before resetting

### 2. Homepage readability improvements (`src/screens/CalendarScreen.tsx`)
- Increase summary card padding from `p-3` to `p-4`
- Bump Intake/Voiding value text from `text-2xl` to `text-3xl`
- Increase section heading sizes from `text-sm` to `text-base`
- Increase week date picker day numbers from `text-base` to `text-lg`
- Increase Sleep/Wake label text from `text-[10px]` to `text-xs`, and time input from `text-sm` to `text-base`
- Increase entry list item text sizes slightly for better readability on mobile
- Add slightly more vertical gap between sections (`gap-3` → `gap-4`)

**Files modified:**
- `src/components/Header.tsx`
- `src/screens/CalendarScreen.tsx`

