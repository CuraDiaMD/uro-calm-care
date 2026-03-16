import { useState, useEffect } from 'react';
import { FileText, ChevronRight, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import type { QuestionnaireType } from '@/types';
import { IPSSQuestionnaire } from '@/components/forms/IPSSQuestionnaire';
import { OABqQuestionnaire } from '@/components/forms/OABqQuestionnaire';
import { ICIQOABQuestionnaire } from '@/components/forms/ICIQOABQuestionnaire';
import { ICIQUIQuestionnaire } from '@/components/forms/ICIQUIQuestionnaire';

type FormView = 'list' | QuestionnaireType;

interface QuestionnaireInfo {
  id: QuestionnaireType;
  name: string;
  description: string;
  getLastScore: () => string | null;
}

export function FormsScreen() {
  const [view, setView] = useState<FormView>('list');
  const ipssResults = useAppStore((state) => state.ipssResults);
  
  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);
  const oabqResults = useAppStore((state) => state.oabqResults);
  const iciqOabResults = useAppStore((state) => state.iciqOabResults);
  const iciqUiResults = useAppStore((state) => state.iciqUiResults);
  
  const questionnaires: QuestionnaireInfo[] = [
    {
      id: 'ipss',
      name: 'IPSS',
      description: 'Prostate Symptom Score',
      getLastScore: () => ipssResults.length > 0 
        ? `Score: ${ipssResults[ipssResults.length - 1].totalScore}/35`
        : null,
    },
    {
      id: 'oabq',
      name: 'OAB-q',
      description: 'Overactive Bladder',
      getLastScore: () => oabqResults.length > 0 
        ? `Score: ${oabqResults[oabqResults.length - 1].symptomScore}/30`
        : null,
    },
    {
      id: 'iciq-oab',
      name: 'ICIQ-OAB',
      description: 'OAB Assessment',
      getLastScore: () => iciqOabResults.length > 0 
        ? `Score: ${iciqOabResults[iciqOabResults.length - 1].totalScore}`
        : null,
    },
    {
      id: 'iciq-ui',
      name: 'ICIQ-UI',
      description: 'Urinary Incontinence',
      getLastScore: () => iciqUiResults.length > 0 
        ? `Score: ${iciqUiResults[iciqUiResults.length - 1].totalScore}/21`
        : null,
    },
  ];
  
  const handleComplete = () => {
    setView('list');
  };
  
  if (view === 'ipss') {
    return <IPSSQuestionnaire onComplete={handleComplete} />;
  }
  
  if (view === 'oabq') {
    return <OABqQuestionnaire onComplete={handleComplete} />;
  }
  
  if (view === 'iciq-oab') {
    return <ICIQOABQuestionnaire onComplete={handleComplete} />;
  }
  
  if (view === 'iciq-ui') {
    return <ICIQUIQuestionnaire onComplete={handleComplete} />;
  }
  
  return (
    <div className="screen-container gap-2">
      <div className="mb-1 flex-shrink-0">
        <h1 className="text-lg font-bold text-foreground">Questionnaires</h1>
        <p className="text-xs text-muted-foreground">Complete validated assessments</p>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2">
        {questionnaires.map((q) => {
          const lastScore = q.getLastScore();
          const hasCompleted = lastScore !== null;
          
          return (
            <button
              key={q.id}
              onClick={() => setView(q.id)}
              className="w-full compact-card flex items-center gap-2 hover:bg-muted/50 transition-colors"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                hasCompleted ? 'bg-success/10' : 'bg-primary/10'
              }`}>
                {hasCompleted ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <FileText className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-foreground">{q.name}</p>
                <p className="text-xs text-muted-foreground truncate">{q.description}</p>
                {lastScore && (
                  <p className="text-[10px] text-success">{lastScore}</p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
