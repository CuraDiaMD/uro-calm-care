import { AlertCircle, Droplets, Moon, Plus, Sun } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import { useShallow } from 'zustand/react/shallow';

export function DailySummaryCard() {
  const openRecordWithTab = useAppStore((state) => state.openRecordWithTab);
  const sleepTime = useAppStore((state) => state.sleepTime);
  const wakeTime = useAppStore((state) => state.wakeTime);
  const summary = useAppStore(useShallow((state) => state.getSummaryForDate(state.selectedDiaryDate)));
  const t = useTranslation();
  const hasLeakage = summary.leakageCount > 0 || summary.totalLeakage > 0;

  return (
    <div className="compact-card flex-[4] flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 min-h-14 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{t.calendar.wake}</p>
          <p className="text-sm font-semibold text-foreground">{wakeTime || '06:00'}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 min-h-14 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{t.calendar.sleep}</p>
          <p className="text-sm font-semibold text-foreground">{sleepTime || '22:00'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="relative rounded-xl border border-secondary/20 bg-secondary/5 p-4 min-h-32 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-semibold text-secondary">{t.calendar.intake}</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{summary.totalIntake}</p>
            <p className="text-sm text-muted-foreground">{t.home.totalMl}</p>
          </div>
          <button
            onClick={() => openRecordWithTab('intake')}
            aria-label={t.record.intake}
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-warning text-warning-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="relative rounded-xl border border-primary/10 bg-primary/5 p-4 min-h-32 flex flex-col justify-between">
          {hasLeakage && (
            <div className="absolute right-3 top-3 w-8 h-8 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-destructive" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-3 pr-10">
              <Droplets className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-primary">{t.calendar.voiding}</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{summary.totalVoided}</p>
            <p className="text-sm text-muted-foreground">{t.home.totalMl}</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-semibold text-foreground">{summary.daytimeFrequency}</p>
                <p className="text-xs text-muted-foreground">{t.home.day}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-2xl font-semibold text-foreground">{summary.nighttimeFrequency}</p>
                <p className="text-xs text-muted-foreground">{t.home.night}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => openRecordWithTab('voiding')}
            aria-label={t.record.voiding}
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-warning text-warning-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
