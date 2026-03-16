import { FileText, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';

export function ActionPrompts() {
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const ipssResults = useAppStore((state) => state.ipssResults);
  const t = useTranslation();
  
  const hasCompletedIPSS = ipssResults.length > 0;
  
  return (
    <div className="flex flex-col">
      <h2 className="text-sm font-semibold text-foreground mb-2">{t.actions.actionItems}</h2>
      <button onClick={() => setActiveTab('forms')}
        className="compact-card flex items-center gap-2 hover:bg-muted/50 transition-colors">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          hasCompletedIPSS ? 'bg-success/10' : 'bg-secondary/10'
        }`}>
          <FileText className={`w-4 h-4 ${hasCompletedIPSS ? 'text-success' : 'text-secondary'}`} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {hasCompletedIPSS ? t.actions.ipssCompleted : t.actions.completeIPSS}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {hasCompletedIPSS 
              ? `${t.actions.last}: ${new Date(ipssResults[ipssResults.length - 1].completedAt).toLocaleDateString()}`
              : t.actions.prostateScore
            }
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </button>
    </div>
  );
}
