import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import { toast } from 'sonner';
import { QuestionnaireProgress } from './QuestionnaireProgress';
import { QuestionnaireNav } from './QuestionnaireNav';

interface OABqQuestionnaireProps {
  onComplete: () => void;
}

export function OABqQuestionnaire({ onComplete }: OABqQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(7).fill(null));
  const addOABqResult = useAppStore((state) => state.addOABqResult);
  const t = useTranslation();
  
  useEffect(() => { window.scrollTo(0, 0); }, [currentQuestion]);
  
  const getOptionsForQuestion = (index: number) => {
    if (index < 5) return t.oabq.optionsSymptom.map((label, i) => ({ score: i + 1, label }));
    if (index === 5) return t.ipss.optionsQoL.map((label, i) => ({ score: i, label }));
    return t.oabq.optionsTreatment.map((label, i) => ({ score: i === 0 ? 1 : 0, label }));
  };
  
  const handleSelectAnswer = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);
    if (currentQuestion < 6) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };
  
  const handleSubmit = () => {
    const unanswered = answers.findIndex(a => a === null);
    if (unanswered !== -1) {
      toast.error(`${t.questionnaire.answerError} ${unanswered + 1}`);
      setCurrentQuestion(unanswered);
      return;
    }
    const symptomScore = answers.slice(0, 5).reduce((sum, a) => sum + (a ?? 0), 0);
    const qolScore = answers[5] ?? 0;
    const treatmentInterest = answers[6] === 1;
    addOABqResult({
      answers: answers.map((score, idx) => ({ questionIndex: idx, score: score ?? 0 })),
      symptomScore, qolScore, treatmentInterest,
    });
    toast.success(t.oabq.completed);
    onComplete();
  };
  
  const question = t.oabq.questions[currentQuestion];
  const options = getOptionsForQuestion(currentQuestion);
  
  return (
    <div className="screen-container">
      <QuestionnaireProgress current={currentQuestion + 1} total={7} category={question.category} />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <h2 className="text-lg font-semibold text-foreground mb-3 leading-snug flex-shrink-0">{question.question}</h2>
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {options.map((option) => (
            <button key={option.score} onClick={() => handleSelectAnswer(option.score)}
              className={`compact-option ${answers[currentQuestion] === option.score ? 'selected' : ''}`}>
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  answers[currentQuestion] === option.score ? 'border-primary bg-primary' : 'border-border'
                }`}>
                  {answers[currentQuestion] === option.score && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span className="text-sm font-medium text-foreground">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <QuestionnaireNav
        currentQuestion={currentQuestion} totalQuestions={7}
        canProceed={answers[currentQuestion] !== null}
        onBack={() => currentQuestion > 0 ? setCurrentQuestion(currentQuestion - 1) : onComplete()}
        onNext={() => setCurrentQuestion(currentQuestion + 1)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
