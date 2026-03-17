import { AlertCircle, CalendarDays, Droplets, Moon, Plus, Toilet, Sun } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import { format, isSameDay } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const shortcutButtonClass = 'absolute bottom-3 right-3 h-7 w-7 rounded-full border border-primary/20 bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center';

export function CalendarScreen() {
  const intakeEntries = useAppStore((state) => state.intakeEntries);
  const voidingEntries = useAppStore((state) => state.voidingEntries);
  const leakageEntries = useAppStore((state) => state.leakageEntries);
  const diaryStartDate = useAppStore((state) => state.diaryStartDate);
  const selectedDate = useAppStore((state) => state.selectedDiaryDate);
  const sleepTime = useAppStore((state) => state.sleepTime);
  const wakeTime = useAppStore((state) => state.wakeTime);
  const setSleepWakeTimes = useAppStore((state) => state.setSleepWakeTimes);
  const setSelectedDiaryDate = useAppStore((state) => state.setSelectedDiaryDate);
  const getDiaryDaysCompleted = useAppStore((state) => state.getDiaryDaysCompleted);
  const getSummaryForDate = useAppStore((state) => state.getSummaryForDate);
  const openRecordWithTab = useAppStore((state) => state.openRecordWithTab);
  const language = useAppStore((state) => state.language);
  const t = useTranslation();

  const daysCompleted = getDiaryDaysCompleted();
  const locale = language === 'fr' ? frLocale : undefined;
  const dayIntakes = intakeEntries.filter((e) => isSameDay(new Date(e.timestamp), selectedDate));
  const dayVoidings = voidingEntries.filter((e) => isSameDay(new Date(e.timestamp), selectedDate));
  const dayLeakages = leakageEntries.filter((e) => isSameDay(new Date(e.timestamp), selectedDate));
  const summary = getSummaryForDate(selectedDate);
  const hasLeakage = summary.leakageCount > 0 || summary.totalLeakage > 0;

  return (
    <div className="screen-container gap-4">
      {diaryStartDate && (
        <div className="grid grid-cols-3 gap-3 flex-shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="compact-card col-span-1 min-h-20 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Date</span>
                </div>
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {format(new Date(selectedDate), 'dd MMMM yyyy', { locale })}
                </p>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDiaryDate(date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <div className="compact-card col-span-2 flex-shrink-0">
            <div className="flex items-center justify-between mb-2 gap-3">
              <h2 className="text-base font-semibold text-foreground">{t.diary.diaryProgress}</h2>
              <span className="text-xs font-medium text-primary whitespace-nowrap">{Math.min(daysCompleted, 3)}/3 {t.diary.days}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(Math.min(daysCompleted, 3) / 3) * 100}%` }} />
            </div>
            {daysCompleted >= 3 && (
              <p className="text-xs text-success mt-1.5 font-medium">{t.diary.diaryComplete}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 flex-shrink-0">
        <div className="compact-card rounded-xl border border-border bg-muted/30 px-3 py-2 min-h-14 flex flex-col justify-center">
          <label className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
            <Sun className="h-3 w-3 text-primary" />
            <span>{t.calendar.wake}</span>
          </label>
          <input
            type="time"
            value={wakeTime || '06:00'}
            onChange={(e) => setSleepWakeTimes(sleepTime || '22:00', e.target.value)}
            className="w-full text-sm font-semibold text-foreground bg-transparent outline-none"
          />
        </div>
        <div className="compact-card rounded-xl border border-border bg-muted/30 px-3 py-2 min-h-14 flex flex-col justify-center">
          <label className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground">
            <Moon className="h-3 w-3 text-secondary" />
            <span>{t.calendar.sleep}</span>
          </label>
          <input
            type="time"
            value={sleepTime || '22:00'}
            onChange={(e) => setSleepWakeTimes(e.target.value, wakeTime || '06:00')}
            className="w-full text-sm font-semibold text-foreground bg-transparent outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-shrink-0">
        <div className="compact-card relative">
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
            <Toilet className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">{t.calendar.voiding}</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{summary.totalVoided}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground pr-10">
            <span>{summary.daytimeFrequency} {t.home.day}</span>
            <span>{summary.nighttimeFrequency} {t.home.night}</span>
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
