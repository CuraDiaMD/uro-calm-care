import logo from '@/assets/curadia-logo.png';
import { useAppStore } from '@/stores/appStore';

export function MagicLinkLandingScreen() {
  const setIntakeStatus = useAppStore((state) => state.setIntakeStatus);
  const setCurrentIntakeStep = useAppStore((state) => state.setCurrentIntakeStep);
  
  const handleStart = () => {
    setIntakeStatus('in-progress');
    setCurrentIntakeStep(0);
  };
  
  return (
    <div className="app-container items-center justify-center p-6">
      <div className="flex flex-col items-center text-center max-w-sm mx-auto gap-8">
        <img src={logo} alt="CuraDia Uro-OS" className="h-16 w-auto" />
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to Uro-OS
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your clinic has invited you to complete a pre-visit intake. This will help your care team understand your symptoms better before your appointment.
          </p>
        </div>
        
        <div className="compact-card w-full space-y-2 text-left">
          <p className="text-xs font-semibold text-foreground">What to expect:</p>
          <ul className="text-xs text-muted-foreground space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Consent &amp; privacy preferences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>Your health profile &amp; history</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>Validated symptom questionnaires</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>3-day voiding diary</span>
            </li>
          </ul>
        </div>
        
        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base active:scale-[0.98] transition-transform shadow-[var(--shadow-fab)]"
        >
          Start Intake
        </button>
        
        <p className="text-[10px] text-muted-foreground">
          Your data is encrypted and only shared with your care team.
        </p>
      </div>
    </div>
  );
}
