import { useState, useEffect } from 'react';
import { FileText, ChevronRight, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import type { QuestionnaireType, IntakeStep } from '@/types';
import { IPSSQuestionnaire } from '@/components/forms/IPSSQuestionnaire';
import { OABqQuestionnaire } from '@/components/forms/OABqQuestionnaire';
import { ICIQUIQuestionnaire } from '@/components/forms/ICIQUIQuestionnaire';

type FormView = 'list' | QuestionnaireType;

interface QuestionnaireInfo {
  id: QuestionnaireType;
  name: string;
  description: string;
  getLastScore: () => string | null;
}

interface FormsScreenProps {
  isIntakeMode?: boolean;
}

export function FormsScreen({ isIntakeMode }: FormsScreenProps) {
  const [view, setView] = useState<FormView>('list');
  const ipssResults = useAppStore((state) => state.ipssResults);
  const oabqResults = useAppStore((state) => state.oabqResults);
  const iciqUiResults = useAppStore((state) => state.iciqUiResults);
  const patientProfile = useAppStore((state) => state.patientProfile);
  const setCurrentIntakeStep = useAppStore((state) => state.setCurrentIntakeStep);
  const t = useTranslation();
  
  useEffect(() => { window.scrollTo(0, 0); }, [view]);
  
  const getRelevantQuestionnaires = (): QuestionnaireInfo[] => {
    const all: QuestionnaireInfo[] = [];
    const sex = patientProfile?.sexAtBirth;
    const complaints = patientProfile?.chiefComplaints || [];
    
    if (sex === 'male' || !sex) {
      all.push({
        id: 'ipss', name: t.forms.ipss, description: t.forms.ipssDesc,
        getLastScore: () => ipssResults.length > 0 ? `${t.forms.score}: ${ipssResults[ipssResults.length - 1].totalScore}/35` : null,
      });
    }
    
    const hasOABComplaints = complaints.some(c => ['frequency', 'urgency', 'nocturia', 'incontinence'].includes(c));
    if (hasOABComplaints || complaints.length === 0) {
      all.push({
        id: 'oabq', name: t.forms.oabq, description: t.forms.oabqDesc,
        getLastScore: () => oabqResults.length > 0 ? `${t.forms.score}: ${oabqResults[oabqResults.length - 1].symptomScore}/30` : null,
      });
    }
    
    const hasIncontinence = complaints.some(c => ['incontinence'].includes(c));
    if (hasIncontinence || complaints.length === 0) {
      all.push({
        id: 'iciq-ui', name: t.forms.iciqui, description: t.forms.iciquiDesc,
        getLastScore: () => iciqUiResults.length > 0 ? `${t.forms.score}: ${iciqUiResults[iciqUiResults.length - 1].totalScore}/21` : null,
      });
    }
    return all;
  };
  
  const questionnaires = getRelevantQuestionnaires();
  const allCompleted = questionnaires.every(q => q.getLastScore() !== null);
  const handleComplete = () => setView('list');
  const handleContinueToDiary = () => setCurrentIntakeStep(5 as IntakeStep);
  
  if (view === 'ipss') return <IPSSQuestionnaire onComplete={handleComplete} />;
  if (view === 'oabq') return <OABqQuestionnaire onComplete={handleComplete} />;
  if (view === 'iciq-ui') return <ICIQUIQuestionnaire onComplete={handleComplete} />;
  
  return (
    <div className="screen-container gap-2">
      <div className="mb-1 flex-shrink-0">
        <h1 className="text-lg font-bold text-foreground">{t.forms.questionnaires}</h1>
        <p className="text-xs text-muted-foreground">
          {isIntakeMode ? t.forms.completeBelow : t.forms.completeAssessments}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {questionnaires.map((q) => {
          const lastScore = q.getLastScore();
          const hasCompleted = lastScore !== null;
          return (
            <button key={q.id} onClick={() => setView(q.id)}
              className="w-full compact-card flex items-center gap-2 hover:bg-muted/50 transition-colors">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${hasCompleted ? 'bg-success/10' : 'bg-primary/10'}`}>
                {hasCompleted ? <CheckCircle className="w-4 h-4 text-success" /> : <FileText className="w-4 h-4 text-primary" />}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-foreground">{q.name}</p>
                <p className="text-xs text-muted-foreground truncate">{q.description}</p>
                {lastScore && <p className="text-[10px] text-success">{lastScore}</p>}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </button>
          );
        })}
      </div>
      {isIntakeMode && (
        <button onClick={handleContinueToDiary}
          className={`w-full py-3 rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform flex-shrink-0 ${
            allCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
          {allCompleted ? t.forms.continueToDiary : t.forms.completeAll}
        </button>
      )}
    </div>
  );
}
