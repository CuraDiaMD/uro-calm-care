import { ClipboardList, Droplets, Clock, BookOpen } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export function DiaryLandingScreen() {
  const setIntakeStatus = useAppStore((state) => state.setIntakeStatus);
  const setDiaryStartDate = useAppStore((state) => state.setDiaryStartDate);
  
  const handleStart = () => {
    setDiaryStartDate(new Date());
    setIntakeStatus('completed');
  };
  
  return (
    <div className="screen-container gap-4 justify-between">
      <div className="flex-1 flex flex-col gap-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">3-Day Voiding Diary</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your fluid intake and bathroom visits for 3 days
          </p>
        </div>
        
        <div className="compact-card space-y-3">
          <h2 className="text-sm font-semibold text-foreground">How it works</h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Droplets className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Log every drink</p>
                <p className="text-xs text-muted-foreground">Record type and volume of each fluid intake</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Log every void</p>
                <p className="text-xs text-muted-foreground">Record volume, urgency level, and any leakage</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Set sleep &amp; wake times</p>
                <p className="text-xs text-muted-foreground">Helps distinguish daytime vs. nighttime events</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="compact-card">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Tip:</strong> Keep a measuring cup near the toilet. 
            Accuracy matters more than guessing — even approximate volumes help your care team.
          </p>
        </div>
      </div>
      
      <button
        onClick={handleStart}
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base active:scale-[0.98] transition-transform flex-shrink-0"
      >
        Start Diary
      </button>
    </div>
  );
}
