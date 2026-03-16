import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { 
  ICIQ_OAB_QUESTIONS, 
  ICIQ_OAB_OPTIONS_FREQUENCY, 
  ICIQ_OAB_OPTIONS_NOCTURIA, 
  ICIQ_OAB_OPTIONS_URGENCY 
} from '@/types';
import { toast } from 'sonner';
import { QuestionnaireProgress } from './QuestionnaireProgress';
import { QuestionnaireNav } from './QuestionnaireNav';
import { BotherSlider } from './BotherSlider';

interface ICIQOABQuestionnaireProps {
  onComplete: () => void;
}

interface Answer {
  score: number | null;
  botherScore: number;
}

export function ICIQOABQuestionnaire({ onComplete }: ICIQOABQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(
    ICIQ_OAB_QUESTIONS.map(() => ({ score: null, botherScore: 0 }))
  );
  const addICIQOABResult = useAppStore((state) => state.addICIQOABResult);
  
  // Scroll to top on question change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestion]);
  
  const getOptionsForQuestion = (index: number) => {
    switch (index) {
      case 0: return ICIQ_OAB_OPTIONS_FREQUENCY;
      case 1: return ICIQ_OAB_OPTIONS_NOCTURIA;
      case 2:
      case 3: return ICIQ_OAB_OPTIONS_URGENCY;
      default: return ICIQ_OAB_OPTIONS_FREQUENCY;
    }
  };
  
  const handleSelectAnswer = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = { ...newAnswers[currentQuestion], score };
    setAnswers(newAnswers);
  };
  
  const handleBotherChange = (botherScore: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = { ...newAnswers[currentQuestion], botherScore };
    setAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestion < ICIQ_OAB_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handleSubmit = () => {
    const unanswered = answers.findIndex(a => a.score === null);
    if (unanswered !== -1) {
      toast.error(`Please answer question ${unanswered + 1}`);
      setCurrentQuestion(unanswered);
      return;
    }
    
    const totalScore = answers.reduce((sum, a) => sum + (a.score ?? 0) + a.botherScore, 0);
    
    addICIQOABResult({
      answers: answers.map((a, idx) => ({ 
        questionIndex: idx, 
        score: a.score ?? 0,
        botherScore: a.botherScore 
      })),
      totalScore,
    });
    
    toast.success('ICIQ-OAB Questionnaire completed!');
    onComplete();
  };
  
  const question = ICIQ_OAB_QUESTIONS[currentQuestion];
  const options = getOptionsForQuestion(currentQuestion);
  const currentAnswer = answers[currentQuestion];
  
  return (
    <div className="screen-container">
      <QuestionnaireProgress
        current={currentQuestion + 1}
        total={ICIQ_OAB_QUESTIONS.length}
        category={question.category}
      />
      
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <h2 className="text-lg font-semibold text-foreground mb-3 leading-snug flex-shrink-0">
          {question.question}
        </h2>
        
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {options.map((option) => (
            <button
              key={option.score}
              onClick={() => handleSelectAnswer(option.score)}
              className={`compact-option ${currentAnswer.score === option.score ? 'selected' : ''}`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  currentAnswer.score === option.score
                    ? 'border-primary bg-primary'
                    : 'border-border'
                }`}>
                  {currentAnswer.score === option.score && (
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{option.label}</span>
              </div>
            </button>
          ))}
          
          {question.hasBother && currentAnswer.score !== null && (
            <BotherSlider 
              value={currentAnswer.botherScore} 
              onChange={handleBotherChange}
            />
          )}
        </div>
      </div>
      
      <QuestionnaireNav
        currentQuestion={currentQuestion}
        totalQuestions={ICIQ_OAB_QUESTIONS.length}
        canProceed={currentAnswer.score !== null}
        onBack={() => currentQuestion > 0 ? setCurrentQuestion(currentQuestion - 1) : onComplete()}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
