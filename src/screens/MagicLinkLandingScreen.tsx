import logo from '@/assets/curadia-logo.png';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';

export function MagicLinkLandingScreen() {
  const setIntakeStatus = useAppStore((state) => state.setIntakeStatus);
  const setCurrentIntakeStep = useAppStore((state) => state.setCurrentIntakeStep);
  const t = useTranslation();
  
  const handleStart = () => {
    setIntakeStatus('in-progress');
    setCurrentIntakeStep(0);
  };
  
  return (
    <div className="app-container items-center justify-center p-6">
      <div className="flex flex-col items-center text-center max-w-sm mx-auto gap-8">
        <img src={logo} alt="CuraDia Uro-OS" className="h-16 w-auto" />
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">{t.landing.welcome}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.landing.description}</p>
        </div>
        
        <div className="compact-card w-full space-y-2 text-left">
          <p className="text-xs font-semibold text-foreground">{t.landing.whatToExpect}</p>
          <ul className="text-xs text-muted-foreground space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>{t.landing.step1}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>{t.landing.step2}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>{t.landing.step3}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>{t.landing.step4}</span>
            </li>
          </ul>
        </div>
        
        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base active:scale-[0.98] transition-transform shadow-[var(--shadow-fab)]"
        >
          {t.landing.startIntake}
        </button>
        
        <p className="text-[10px] text-muted-foreground">{t.landing.encrypted}</p>
      </div>
    </div>
  );
}
