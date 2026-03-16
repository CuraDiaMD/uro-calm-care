import { useState } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Activity, AlertCircle, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';

export function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const intakeEntries = useAppStore((state) => state.intakeEntries);
  const voidingEntries = useAppStore((state) => state.voidingEntries);
  const leakageEntries = useAppStore((state) => state.leakageEntries);
  const diaryStartDate = useAppStore((state) => state.diaryStartDate);
  const sleepTime = useAppStore((state) => state.sleepTime);
  const wakeTime = useAppStore((state) => state.wakeTime);
  const setSleepWakeTimes = useAppStore((state) => state.setSleepWakeTimes);
  const getDiaryDaysCompleted = useAppStore((state) => state.getDiaryDaysCompleted);
  const language = useAppStore((state) => state.language);
  const t = useTranslation();
  
  const daysCompleted = getDiaryDaysCompleted();
  const locale = language === 'fr' ? frLocale : undefined;
  
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(subDays(selectedDate, 3), i));
  
  const dayIntakes = intakeEntries.filter(e => isSameDay(new Date(e.timestamp), selectedDate));
  const dayVoidings = voidingEntries.filter(e => isSameDay(new Date(e.timestamp), selectedDate));
  const dayLeakages = leakageEntries.filter(e => isSameDay(new Date(e.timestamp), selectedDate));
  
  const summary = {
    totalIntake: dayIntakes.reduce((sum, e) => sum + e.volume, 0),
    totalVoided: dayVoidings.reduce((sum, e) => sum + e.volume, 0),
    voidCount: dayVoidings.length,
    leakCount: dayLeakages.length,
  };
  
  return (
    <div className="screen-container gap-4">
      {diaryStartDate && (
        <div className="compact-card flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-foreground">{t.diary.diaryProgress}</h2>
            <span className="text-xs font-medium text-primary">{Math.min(daysCompleted, 3)}/3 {t.diary.days}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(Math.min(daysCompleted, 3) / 3) * 100}%` }} />
          </div>
          {daysCompleted >= 3 && (
            <p className="text-xs text-success mt-1.5 font-medium">{t.diary.diaryComplete}</p>
          )}
        </div>
      )}
      
      <div className="compact-card flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 flex-1">
          <Moon className="w-4 h-4 text-secondary" />
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">{t.calendar.sleep}</label>
            <input type="time" value={sleepTime || '22:00'} onChange={(e) => setSleepWakeTimes(e.target.value, wakeTime || '06:00')}
              className="w-full text-base font-medium text-foreground bg-transparent outline-none" />
          </div>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="flex items-center gap-2 flex-1">
          <Sun className="w-4 h-4 text-warning" />
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">{t.calendar.wake}</label>
            <input type="time" value={wakeTime || '06:00'} onChange={(e) => setSleepWakeTimes(sleepTime || '22:00', e.target.value)}
              className="w-full text-base font-medium text-foreground bg-transparent outline-none" />
          </div>
        </div>
      </div>
      
      <div className="compact-card flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setSelectedDate(subDays(selectedDate, 7))} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <h2 className="text-base font-semibold text-foreground">
            {format(selectedDate, 'MMMM yyyy', { locale })}
          </h2>
          <button onClick={() => setSelectedDate(addDays(selectedDate, 7))} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex justify-between gap-1">
          {weekDates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            return (
              <button key={date.toISOString()} onClick={() => setSelectedDate(date)}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  isSelected ? 'bg-primary text-primary-foreground' : isToday ? 'bg-primary/10' : 'hover:bg-muted'
                }`}>
                <p className="text-[10px] uppercase font-medium opacity-70">{format(date, 'EEE', { locale })}</p>
                <p className="text-lg font-semibold">{format(date, 'd')}</p>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 flex-shrink-0">
        <div className="compact-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Droplets className="w-3.5 h-3.5 text-secondary" />
            <span className="text-xs font-medium text-foreground">{t.calendar.intake}</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{summary.totalIntake}</p>
          <p className="text-xs text-muted-foreground">{t.calendar.mlTotal}</p>
        </div>
        <div className="compact-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">{t.calendar.voiding}</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{summary.totalVoided}</p>
          <p className="text-xs text-muted-foreground">{summary.voidCount} {t.calendar.voids}</p>
        </div>
      </div>
      
      {summary.leakCount > 0 && (
        <div className="compact-card flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {summary.leakCount} {summary.leakCount > 1 ? t.calendar.leakages : t.calendar.leakage}
            </p>
            <p className="text-xs text-muted-foreground">{t.calendar.recorded}</p>
          </div>
        </div>
      )}
      
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <h3 className="text-base font-semibold text-foreground mb-2 flex-shrink-0">{t.calendar.entries}</h3>
        {dayIntakes.length === 0 && dayVoidings.length === 0 && dayLeakages.length === 0 ? (
          <div className="compact-card text-center py-4 flex-shrink-0">
            <p className="text-sm text-muted-foreground">{t.calendar.noEntries}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t.calendar.tapToAdd}</p>
          </div>
        ) : (
          <div className="scroll-area space-y-1.5">
            {[...dayIntakes, ...dayVoidings, ...dayLeakages]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 10)
              .map((entry, idx) => (
                <div key={idx} className="compact-card flex items-center gap-2 py-2">
                  <div className={`w-2 h-2 rounded-full ${
                    'type' in entry && !('padUsed' in entry) ? 'bg-secondary' : 'padUsed' in entry ? 'bg-destructive' : 'bg-primary'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {'type' in entry && !('padUsed' in entry) && `${(entry as any).type} ${t.calendar.intakeEntry}`}
                      {'urgeScale' in entry && t.calendar.voidingEntry}
                      {'padUsed' in entry && t.calendar.leakageEntry}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(entry.timestamp), 'h:mm a', { locale })}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {'volume' in entry && `${entry.volume} mL`}
                    {'size' in entry && !('volume' in entry) && (entry as any).size}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
