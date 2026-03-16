import { useState, useEffect } from 'react';
import { CheckCircle, Check } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import { toast } from 'sonner';
import { QuestionnaireProgress } from './QuestionnaireProgress';
import { QuestionnaireNav } from './QuestionnaireNav';
import { Slider } from '@/components/ui/slider';

interface ICIQUIQuestionnaireProps {
  onComplete: () => void;
}

interface Answer {
  score: number | null;
  sliderValue?: number;
  selectedSituations?: string[];
}

export function ICIQUIQuestionnaire({ onComplete }: ICIQUIQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([
    { score: null }, { score: null }, { score: null, sliderValue: 0 }, { score: null, selectedSituations: [] },
  ]);
  const addICIQUIResult = useAppStore((state) => state.addICIQUIResult);
  const t = useTranslation();
  
  useEffect(() => { window.scrollTo(0, 0); }, [currentQuestion]);
  
  const question = t.iciqui.questions[currentQuestion];
  const questionType = currentQuestion === 2 ? 'slider' : currentQuestion === 3 ? 'multiselect' : 'options';
  const currentAnswer = answers[currentQuestion];
  
  const handleSelectAnswer = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = { ...newAnswers[currentQuestion], score };
    setAnswers(newAnswers);
    if (questionType === 'options' && currentQuestion < 2) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    }
  };
  
  const handleSliderChange = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = { ...newAnswers[currentQuestion], sliderValue: value, score: value };
    setAnswers(newAnswers);
  };
  
  const handleSituationToggle = (situation: string) => {
    const newAnswers = [...answers];
    const current = newAnswers[3].selectedSituations || [];
    const updated = current.includes(situation) ? current.filter(s => s !== situation) : [...current, situation];
    newAnswers[3] = { ...newAnswers[3], selectedSituations: updated, score: updated.length > 0 ? 1 : null };
    setAnswers(newAnswers);
  };
  
  const handleSubmit = () => {
    if (answers[0].score === null || answers[1].score === null) {
      toast.error(t.questionnaire.answerAllError);
      return;
    }
    const totalScore = (answers[0].score ?? 0) + (answers[1].score ?? 0) + (answers[2].sliderValue ?? 0);
    addICIQUIResult({
      answers: answers.map((a, idx) => ({ 
        questionIndex: idx, 
        score: idx === 3 ? (a.selectedSituations || []) : (a.score ?? a.sliderValue ?? 0)
      })),
      totalScore,
      leakageSituations: answers[3].selectedSituations || [],
    });
    toast.success(t.iciqui.completed);
    onComplete();
  };
  
  const canProceed = () => {
    if (questionType === 'multiselect') return (currentAnswer.selectedSituations?.length ?? 0) > 0;
    if (questionType === 'slider') return true;
    return currentAnswer.score !== null;
  };
  
  const renderQuestionContent = () => {
    if (questionType === 'slider') {
      return (
        <div className="compact-card p-3">
          <div className="px-2">
            <Slider value={[currentAnswer.sliderValue ?? 0]} onValueChange={([v]) => handleSliderChange(v)} min={0} max={10} step={1} className="w-full" />
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
              <span>{t.iciqui.notAtAll}</span>
              <span className="text-lg text-primary font-bold">{currentAnswer.sliderValue ?? 0}</span>
              <span>{t.iciqui.greatDeal}</span>
            </div>
          </div>
        </div>
      );
    }
    if (questionType === 'multiselect') {
      return (
        <div className="space-y-2">
          {t.iciqui.situations.map((situation) => {
            const isSelected = currentAnswer.selectedSituations?.includes(situation);
            return (
              <button key={situation} onClick={() => handleSituationToggle(situation)}
                className={`compact-option ${isSelected ? 'selected' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <span className="text-sm font-medium text-foreground text-left">{situation}</span>
                </div>
              </button>
            );
          })}
        </div>
      );
    }
    const options = currentQuestion === 0
      ? t.iciqui.optionsFrequency.map((label, i) => ({ score: i, label }))
      : t.iciqui.optionsAmount.map((label, i) => ({ score: [0, 2, 4, 6][i], label }));
    return (
      <div className="space-y-2">
        {options.map((option) => (
          <button key={option.score} onClick={() => handleSelectAnswer(option.score)}
            className={`compact-option ${currentAnswer.score === option.score ? 'selected' : ''}`}>
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                currentAnswer.score === option.score ? 'border-primary bg-primary' : 'border-border'
              }`}>
                {currentAnswer.score === option.score && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
              </div>
              <span className="text-sm font-medium text-foreground">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="screen-container">
      <QuestionnaireProgress current={currentQuestion + 1} total={4} category={question.category} />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <h2 className="text-lg font-semibold text-foreground mb-3 leading-snug flex-shrink-0">{question.question}</h2>
        <div className="flex-1 overflow-y-auto min-h-0">{renderQuestionContent()}</div>
      </div>
      <QuestionnaireNav
        currentQuestion={currentQuestion} totalQuestions={4}
        canProceed={canProceed()}
        onBack={() => currentQuestion > 0 ? setCurrentQuestion(currentQuestion - 1) : onComplete()}
        onNext={() => setCurrentQuestion(currentQuestion + 1)}
        onSubmit={handleSubmit}
        showSubmit={questionType === 'multiselect'}
      />
    </div>
  );
}
