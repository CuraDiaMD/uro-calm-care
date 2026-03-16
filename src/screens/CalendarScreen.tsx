import { useState } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Activity, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { format, addDays, subDays, isSameDay } from 'date-fns';

export function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const intakeEntries = useAppStore((state) => state.intakeEntries);
  const voidingEntries = useAppStore((state) => state.voidingEntries);
  const leakageEntries = useAppStore((state) => state.leakageEntries);
  
  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(subDays(selectedDate, 3), i));
  
  // Filter entries for selected date
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
    <div className="screen-container gap-3">
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
                <p className="text-[9px] uppercase font-medium opacity-70">
                  {format(date, 'EEE')}
                </p>
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
          <p className="text-xl font-bold text-foreground">{summary.totalIntake}</p>
          <p className="text-[10px] text-muted-foreground">mL total</p>
        </div>
        
        <div className="compact-card">
          <div className="flex items-center gap-1.5 mb-1">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">Voiding</span>
          </div>
          <p className="text-xl font-bold text-foreground">{summary.totalVoided}</p>
          <p className="text-[10px] text-muted-foreground">{summary.voidCount} voids</p>
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
      
      {/* Recent Entries - Scrollable */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <h3 className="text-sm font-semibold text-foreground mb-2 flex-shrink-0">Today's Entries</h3>
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
                    'type' in entry ? 'bg-secondary' : 'size' in entry ? 'bg-destructive' : 'bg-primary'
                  }`} />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">
                      {'type' in entry && `${entry.type} intake`}
                      {'urgeScale' in entry && 'Voiding'}
                      {'size' in entry && 'Leakage'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(entry.timestamp), 'h:mm a')}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    {'volume' in entry && `${entry.volume} mL`}
                    {'size' in entry && entry.size}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
