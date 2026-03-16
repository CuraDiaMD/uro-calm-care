import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface QuestionnaireNavProps {
  currentQuestion: number;
  totalQuestions: number;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  showSubmit?: boolean;
}

export function QuestionnaireNav({
  currentQuestion,
  totalQuestions,
  canProceed,
  onBack,
  onNext,
  onSubmit,
  showSubmit = false,
}: QuestionnaireNavProps) {
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  
  return (
    <div className="flex items-center justify-between pt-3 border-t border-border mt-2 flex-shrink-0">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors text-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>
      
      {isLastQuestion || showSubmit ? (
        <button
          onClick={onSubmit}
          disabled={!canProceed}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-50 text-sm"
        >
          Submit
          <CheckCircle className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-primary font-medium disabled:opacity-50 text-sm"
        >
          Next
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
