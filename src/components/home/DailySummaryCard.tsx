import { AlertCircle, Droplets, Moon, Plus, Sun } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import { useShallow } from 'zustand/react/shallow';

const shortcutButtonClass = 'absolute bottom-3 right-3 h-7 w-7 rounded-full border border-primary/20 bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center';

export function DailySummaryCard() {
  const openRecordWithTab = useAppStore((state) => state.openRecordWithTab);
  const summary = useAppStore(useShallow((state) => state.getSummaryForDate(state.selectedDiaryDate)));
  const t = useTranslation();
  const hasLeakage = summary.leakageCount > 0 || summary.totalLeakage > 0;

  return (
    <div className="flex-[4] flex flex-col gap-3">
      <div className="relative compact-card">
        <div className="flex items-center gap-1.5 mb-1 pr-10">
          <Droplets className="w-3.5 h-3.5 text-secondary" />
          <span className="text-xs font-medium text-foreground">{t.calendar.intake}</span>
        </div>
        <p className="text-3xl font-bold text-foreground">{summary.totalIntake}</p>
        <p className="text-xs text-muted-foreground">{t.calendar.mlTotal}</p>
        <button
          type="button"
          aria-label={`Add ${t.calendar.intake}`}
          onClick={() => openRecordWithTab('intake')}
          className={shortcutButtonClass}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="compact-card relative">
        {hasLeakage && (
          <div className="absolute right-3 top-3 w-8 h-8 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
        )}
        <div className="flex items-center gap-1.5 mb-1 pr-10">
          <Moon className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">{t.calendar.voiding}</span>
        </div>
        <p className="text-3xl font-bold text-foreground">{summary.totalVoided}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground pr-10">
          <span className="inline-flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-warning" />
            {summary.daytimeFrequency} {t.home.day}
          </span>
          <span className="inline-flex items-center gap-1">
            <Moon className="w-3.5 h-3.5 text-secondary" />
            {summary.nighttimeFrequency} {t.home.night}
          </span>
        </div>
        <button
          type="button"
          aria-label={`Add ${t.calendar.voiding}`}
          onClick={() => openRecordWithTab('voiding')}
          className={shortcutButtonClass}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
