import { CalendarIcon, CheckCircle, ChevronRight, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function DiaryStatusCard() {
  const diaryStartDate = useAppStore((state) => state.diaryStartDate);
  const selectedDiaryDate = useAppStore((state) => state.selectedDiaryDate);
  const setSelectedDiaryDate = useAppStore((state) => state.setSelectedDiaryDate);
  const language = useAppStore((state) => state.language);
  const getDiaryDaysCompleted = useAppStore((state) => state.getDiaryDaysCompleted);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const t = useTranslation();

  const daysCompleted = getDiaryDaysCompleted();

  if (!diaryStartDate) return null;

  const isComplete = daysCompleted >= 3;
  const locale = language === 'fr' ? frLocale : undefined;

  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={() => setActiveTab('diary')}
        className="compact-card col-span-2 flex items-center gap-3 w-full text-left hover:bg-muted/50 transition-colors"
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isComplete ? 'bg-success/10' : 'bg-primary/10'
        }`}>
          {isComplete ? <CheckCircle className="w-5 h-5 text-success" /> : <ClipboardList className="w-5 h-5 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="text-sm font-semibold text-foreground truncate">
              {isComplete ? t.home.diaryComplete : `${t.home.dayOf} ${Math.min(daysCompleted + 1, 3)} ${t.home.of} 3`}
            </p>
            <span className="text-[11px] font-medium text-primary whitespace-nowrap">{Math.min(daysCompleted, 3)}/3 {t.diary.days}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(Math.min(daysCompleted, 3) / 3) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 truncate">
            {isComplete ? t.home.reviewSubmit : `${3 - daysCompleted} ${t.diary.days} ${t.home.remaining}`}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <button className="compact-card min-w-0 flex flex-col justify-center text-left hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
              <CalendarIcon className="w-3 h-3" />
              <span>Date</span>
            </div>
            <span className="text-sm font-semibold text-foreground leading-tight break-words">
              {format(new Date(selectedDiaryDate), 'dd MMMM yyyy', { locale })}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={new Date(selectedDiaryDate)}
            onSelect={(date) => date && setSelectedDiaryDate(date)}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
