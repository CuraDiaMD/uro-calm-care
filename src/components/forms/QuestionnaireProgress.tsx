import { useTranslation } from '@/i18n';

interface QuestionnaireProgressProps {
  current: number;
  total: number;
  category: string;
}

export function QuestionnaireProgress({ current, total, category }: QuestionnaireProgressProps) {
  const t = useTranslation();
  return (
    <div className="mb-3 flex-shrink-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {t.questionnaire.question} {current} {t.questionnaire.of} {total}
        </span>
        <span className="text-[10px] text-secondary font-medium">{category}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(current / total) * 100}%` }} />
      </div>
    </div>
  );
}
