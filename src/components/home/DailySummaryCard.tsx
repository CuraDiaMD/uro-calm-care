import { AlertCircle, Droplets, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import { useShallow } from 'zustand/react/shallow';

const formatDiaryDate = (date: Date) => {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export function DailySummaryCard() {
  const openRecordWithTab = useAppStore((state) => state.openRecordWithTab);
  const selectedDiaryDate = useAppStore((state) => state.selectedDiaryDate);
  const sleepTime = useAppStore((state) => state.sleepTime);
  const wakeTime = useAppStore((state) => state.wakeTime);
  const summary = useAppStore(useShallow((state) => state.getSummaryForDate(state.selectedDiaryDate)));
  const t = useTranslation();
  const hasLeakage = summary.leakageCount > 0 || summary.totalLeakage > 0;

  return (
    <div className="compact-card flex-[4] flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 min-h-14 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Date</p>
          <p className="text-sm font-semibold text-foreground">{formatDiaryDate(new Date(selectedDiaryDate))}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 min-h-14 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{t.calendar.wake}</p>
          <p className="text-sm font-semibold text-foreground">{wakeTime || '06:00'}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 min-h-14 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{t.calendar.sleep}</p>
          <p className="text-sm font-semibold text-foreground">{sleepTime || '22:00'}</p>
        </div>
      </div>

      <div className="relative p-4 rounded-xl bg-primary/5 border border-primary/10 flex-1 flex flex-col justify-center">
        {hasLeakage && (
          <div className="absolute right-3 top-3 w-8 h-8 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
        )}
        <div className="flex items-center justify-between mb-3 pr-10">
          <h3 className="text-sm font-semibold text-primary">{t.calendar.voiding}</h3>
          <button
            onClick={() => openRecordWithTab('voiding')}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 active:scale-95 transition-all cursor-pointer"
          >
            <Droplets className="w-5 h-5 text-primary" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
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
        </div>
      </div>
    </div>
  );
}
