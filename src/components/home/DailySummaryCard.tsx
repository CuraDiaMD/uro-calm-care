import { Droplets, Moon, Sun, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useShallow } from 'zustand/react/shallow';

export function DailySummaryCard() {
  const openRecordWithTab = useAppStore((state) => state.openRecordWithTab);
  const summary = useAppStore(useShallow((state) => state.getTodaySummary()));
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <div className="compact-card flex-[4] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Daily Summary</h2>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <button
          onClick={() => openRecordWithTab('voiding')}
          className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 active:scale-95 transition-all cursor-pointer"
        >
          <Droplets className="w-6 h-6 text-primary" />
        </button>
      </div>
      
      {/* Voiding Section */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex-1 flex flex-col justify-center">
        <h3 className="text-sm font-semibold text-primary mb-3">Voiding</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-bold text-foreground">{summary.totalVoided}</p>
            <p className="text-sm text-muted-foreground">Total mL</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-semibold text-foreground">{summary.daytimeFrequency}</p>
                <p className="text-xs text-muted-foreground">Day</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-2xl font-semibold text-foreground">{summary.nighttimeFrequency}</p>
                <p className="text-xs text-muted-foreground">Night</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leakage - only show if there are events */}
      {(summary.leakageCount > 0 || summary.totalLeakage > 0) && (
        <div className="flex items-center justify-between p-3 mt-3 rounded-xl bg-destructive/5 border border-destructive/10">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <span className="text-sm font-medium text-foreground">Leakage</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-semibold text-foreground">{summary.leakageCount}</span>
            <span className="text-sm text-muted-foreground ml-1">events</span>
          </div>
        </div>
      )}
    </div>
  );
}
