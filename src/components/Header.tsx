import { RotateCcw, ChevronLeft } from 'lucide-react';
import logo from '@/assets/curadia-logo.png';
import { useAppStore } from '@/stores/appStore';
import type { IntakeStep } from '@/types';

interface HeaderProps {
  showBack?: boolean;
  showStepIndicator?: boolean;
}

const STEP_LABELS = ['Consent', 'Consent', 'Consent', 'Profile', 'Questionnaires', 'Diary Info', 'Review'];

export function Header({ showBack, showStepIndicator }: HeaderProps) {
  const currentIntakeStep = useAppStore((state) => state.currentIntakeStep);
  const setCurrentIntakeStep = useAppStore((state) => state.setCurrentIntakeStep);
  
  const handleBack = () => {
    if (currentIntakeStep > 0) {
      setCurrentIntakeStep((currentIntakeStep - 1) as IntakeStep);
    }
  };
  
  return (
    <header className="border-b border-white/30 flex-shrink-0" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          {showBack && currentIntakeStep > 0 ? (
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          ) : null}
          <img src={logo} alt="CuraDia" className="h-10 w-auto" />
        </div>
        
        {showStepIndicator ? (
          <div className="flex items-center gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= currentIntakeStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        ) : (
          <button
            className="p-2 rounded-full hover:bg-destructive/10 transition-colors"
            aria-label="Reset Demo"
            onClick={() => {
              if (window.confirm('Reset all data and start over?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
          >
            <RotateCcw className="w-5 h-5 text-destructive" />
          </button>
        )}
      </div>
    </header>
  );
}
