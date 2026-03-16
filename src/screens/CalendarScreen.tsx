import { useState } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Activity, AlertCircle, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { format, addDays, subDays, isSameDay } from 'date-fns';

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
  
  const daysCompleted = getDiaryDaysCompleted();
  
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
      {/* Diary Progress */}
      {diaryStartDate && (
        <div className="compact-card flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-foreground">3-Day Diary Progress</h2>
            <span className="text-xs font-medium text-primary">{Math.min(daysCompleted, 3)}/3 days</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(Math.min(daysCompleted, 3) / 3) * 100}%` }}
            />
          </div>
          {daysCompleted >= 3 && (
            <p className="text-xs text-success mt-1.5 font-medium">✅ Diary complete! You can review and submit.</p>
          )}
        </div>
      )}
      
      {/* Sleep/Wake Times */}
      <div className="compact-card flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 flex-1">
          <Moon className="w-4 h-4 text-secondary" />
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Sleep</label>
            <input
              type="time"
              value={sleepTime || '22:00'}
              onChange={(e) => setSleepWakeTimes(e.target.value, wakeTime || '06:00')}
              className="w-full text-base font-medium text-foreground bg-transparent outline-none"
            />
          </div>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="flex items-center gap-2 flex-1">
          <Sun className="w-4 h-4 text-warning" />
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Wake</label>
            <input
              type="time"
              value={wakeTime || '06:00'}
              onChange={(e) => setSleepWakeTimes(sleepTime || '22:00', e.target.value)}
              className="w-full text-sm font-medium text-foreground bg-transparent outline-none"
            />
          </div>
        </div>
      </div>
      
      {/* Date Picker */}
      <div className="compact-card flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setSelectedDate(subDays(selectedDate, 7))}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <h2 className="text-sm font-semibold text-foreground">
            {format(selectedDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setSelectedDate(addDays(selectedDate, 7))}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        <div className="flex justify-between gap-1">
          {weekDates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : isToday
                    ? 'bg-primary/10'
                    : 'hover:bg-muted'
                }`}
              >
                <p className="text-[9px] uppercase font-medium opacity-70">{format(date, 'EEE')}</p>
                <p className="text-base font-semibold">{format(date, 'd')}</p>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2 flex-shrink-0">
        <div className="compact-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Droplets className="w-3.5 h-3.5 text-secondary" />
            <span className="text-xs font-medium text-foreground">Intake</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.totalIntake}</p>
          <p className="text-xs text-muted-foreground">mL total</p>
        </div>
        
        <div className="compact-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">Voiding</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{summary.totalVoided}</p>
          <p className="text-xs text-muted-foreground">{summary.voidCount} voids</p>
        </div>
      </div>
      
      {summary.leakCount > 0 && (
        <div className="compact-card flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{summary.leakCount} Leakage{summary.leakCount > 1 ? 's' : ''}</p>
            <p className="text-xs text-muted-foreground">Recorded</p>
          </div>
        </div>
      )}
      
      {/* Recent Entries */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <h3 className="text-sm font-semibold text-foreground mb-2 flex-shrink-0">Entries</h3>
        {dayIntakes.length === 0 && dayVoidings.length === 0 && dayLeakages.length === 0 ? (
          <div className="compact-card text-center py-4 flex-shrink-0">
            <p className="text-sm text-muted-foreground">No entries for this day</p>
            <p className="text-xs text-muted-foreground mt-0.5">Tap + to add records</p>
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
                    <p className="text-xs font-medium text-foreground">
                      {'type' in entry && !('padUsed' in entry) && `${(entry as any).type} intake`}
                      {'urgeScale' in entry && 'Voiding'}
                      {'padUsed' in entry && 'Leakage'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(entry.timestamp), 'h:mm a')}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-foreground">
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
