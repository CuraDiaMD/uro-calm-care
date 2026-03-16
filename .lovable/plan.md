

## Fix: Voiding Summary Not Updating

### Root Cause
In `DailySummaryCard.tsx`, the component selects `getTodaySummary` from the store using a Zustand selector. Since `getTodaySummary` is a stable function reference that never changes, Zustand's equality check determines nothing has changed, and the component does **not** re-render when new voiding entries are added.

### Solution
Change how `DailySummaryCard` subscribes to the store. Instead of selecting just the function, also subscribe to the underlying data arrays (`intakeEntries`, `voidingEntries`, `leakageEntries`) so Zustand knows to re-render when those change.

### File Change: `src/components/home/DailySummaryCard.tsx`

Replace the current selectors (lines 5-7):
```typescript
const getTodaySummary = useAppStore((state) => state.getTodaySummary);
const openRecordWithTab = useAppStore((state) => state.openRecordWithTab);
const summary = getTodaySummary();
```

With:
```typescript
const openRecordWithTab = useAppStore((state) => state.openRecordWithTab);
const summary = useAppStore((state) => state.getTodaySummary());
```

By calling `getTodaySummary()` **inside** the selector, Zustand will compare the returned summary object each time the store updates. When entries change, the summary values change, triggering a re-render.

This is a one-line fix -- no other files need to change.

