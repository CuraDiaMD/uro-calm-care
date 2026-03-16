import { useState, useEffect } from 'react';
import { FileText, ChevronRight, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
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
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);
  
  // Determine which questionnaires to show based on profile
  const getRelevantQuestionnaires = (): QuestionnaireInfo[] => {
    const all: QuestionnaireInfo[] = [];
    const sex = patientProfile?.sexAtBirth;
    const complaints = patientProfile?.chiefComplaints || [];
    
    // Male → always show IPSS
    if (sex === 'male' || !sex) {
      all.push({
        id: 'ipss',
        name: 'IPSS',
        description: 'Prostate Symptom Score',
        getLastScore: () => ipssResults.length > 0 
          ? `Score: ${ipssResults[ipssResults.length - 1].totalScore}/35`
          : null,
      });
    }
    
    // Frequency/Urgency/Nocturia → show OAB-q
    const hasOABComplaints = complaints.some(c => 
      ['frequency', 'urgency', 'nocturia', 'incontinence'].includes(c)
    );
    if (hasOABComplaints || complaints.length === 0) {
      all.push({
        id: 'oabq',
        name: 'OAB-q',
        description: 'Overactive Bladder',
        getLastScore: () => oabqResults.length > 0 
          ? `Score: ${oabqResults[oabqResults.length - 1].symptomScore}/30`
          : null,
      });
    }
    
    // Incontinence/Leakage → show ICIQ-UI SF
    const hasIncontinence = complaints.some(c => 
      ['incontinence'].includes(c)
    );
    if (hasIncontinence || complaints.length === 0) {
      all.push({
        id: 'iciq-ui',
        name: 'ICIQ-UI SF',
        description: 'Urinary Incontinence',
        getLastScore: () => iciqUiResults.length > 0 
          ? `Score: ${iciqUiResults[iciqUiResults.length - 1].totalScore}/21`
          : null,
      });
    }
    
    return all;
  };
  
  const questionnaires = getRelevantQuestionnaires();
  
  const allCompleted = questionnaires.every(q => q.getLastScore() !== null);
  
  const handleComplete = () => {
    setView('list');
  };
  
  const handleContinueToDiary = () => {
    setCurrentIntakeStep(5 as IntakeStep);
  };
  
  if (view === 'ipss') return <IPSSQuestionnaire onComplete={handleComplete} />;
  if (view === 'oabq') return <OABqQuestionnaire onComplete={handleComplete} />;
  if (view === 'iciq-ui') return <ICIQUIQuestionnaire onComplete={handleComplete} />;
  
  return (
    <div className="screen-container gap-2">
      <div className="mb-1 flex-shrink-0">
        <h1 className="text-lg font-bold text-foreground">Questionnaires</h1>
        <p className="text-xs text-muted-foreground">
          {isIntakeMode 
            ? 'Complete the questionnaires below based on your symptoms'
            : 'Complete validated assessments'
          }
        </p>
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
      
      {isIntakeMode && (
        <button
          onClick={handleContinueToDiary}
          className={`w-full py-3 rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform flex-shrink-0 ${
            allCompleted 
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {allCompleted ? 'Continue to Diary' : 'Complete all questionnaires to continue'}
        </button>
      )}
    </div>
  );
}
