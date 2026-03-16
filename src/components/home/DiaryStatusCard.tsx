import { ClipboardList, CheckCircle, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';

export function DiaryStatusCard() {
  const diaryStartDate = useAppStore((state) => state.diaryStartDate);
  const getDiaryDaysCompleted = useAppStore((state) => state.getDiaryDaysCompleted);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const t = useTranslation();
  
  const daysCompleted = getDiaryDaysCompleted();
  
  if (!diaryStartDate) return null;
  
  const isComplete = daysCompleted >= 3;
  
  return (
    <button onClick={() => setActiveTab('diary')}
      className="compact-card flex items-center gap-3 w-full text-left hover:bg-muted/50 transition-colors">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        isComplete ? 'bg-success/10' : 'bg-primary/10'
      }`}>
        {isComplete ? <CheckCircle className="w-5 h-5 text-success" /> : <ClipboardList className="w-5 h-5 text-primary" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {isComplete ? t.home.diaryComplete : `${t.home.dayOf} ${Math.min(daysCompleted + 1, 3)} ${t.home.of} 3`}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {isComplete
            ? t.home.reviewSubmit
            : `${3 - daysCompleted} ${t.diary.days} ${t.home.remaining}`
          }
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </button>
  );
}
