import { useState } from 'react';
import { ShieldCheck, Brain, Bell } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import { toast } from 'sonner';
import type { IntakeStep, Consent } from '@/types';

export function ConsentScreen() {
  const currentIntakeStep = useAppStore((state) => state.currentIntakeStep);
  const setCurrentIntakeStep = useAppStore((state) => state.setCurrentIntakeStep);
  const consents = useAppStore((state) => state.consents);
  const setConsents = useAppStore((state) => state.setConsents);
  const t = useTranslation();
  
  const CONSENT_SCREENS = [
    {
      icon: ShieldCheck,
      title: t.consent.clinicalTitle,
      subtitle: t.consent.clinicalSubtitle,
      required: true,
      description: t.consent.clinicalDesc,
      details: [t.consent.clinicalDetail1, t.consent.clinicalDetail2, t.consent.clinicalDetail3],
      field: 'clinicalData' as const,
    },
    {
      icon: Brain,
      title: t.consent.researchTitle,
      subtitle: t.consent.researchSubtitle,
      required: false,
      description: t.consent.researchDesc,
      details: [t.consent.researchDetail1, t.consent.researchDetail2, t.consent.researchDetail3],
      field: 'researchData' as const,
    },
    {
      icon: Bell,
      title: t.consent.commTitle,
      subtitle: t.consent.commSubtitle,
      required: false,
      description: t.consent.commDesc,
      details: [t.consent.commDetail1, t.consent.commDetail2, t.consent.commDetail3],
      field: 'communication' as const,
    },
  ];

  const screenIndex = currentIntakeStep;
  const screen = CONSENT_SCREENS[screenIndex];
  const Icon = screen.icon;
  
  const handleAccept = () => {
    const current: Consent = consents || {
      clinicalData: false, researchData: false, communication: false, timestamps: {},
    };
    const updated: Consent = {
      ...current, [screen.field]: true, timestamps: { ...current.timestamps },
    };
    if (screen.field === 'clinicalData') updated.timestamps.clinical = new Date();
    if (screen.field === 'researchData') updated.timestamps.research = new Date();
    if (screen.field === 'communication') updated.timestamps.communication = new Date();
    setConsents(updated);
    if (screenIndex < 2) setCurrentIntakeStep((screenIndex + 1) as IntakeStep);
    else setCurrentIntakeStep(3);
  };
  
  const handleDecline = () => {
    if (screen.required) {
      toast.error(t.consent.requiredError);
      return;
    }
    const current: Consent = consents || {
      clinicalData: false, researchData: false, communication: false, timestamps: {},
    };
    const updated: Consent = { ...current, [screen.field]: false };
    setConsents(updated);
    if (screenIndex < 2) setCurrentIntakeStep((screenIndex + 1) as IntakeStep);
    else setCurrentIntakeStep(3);
  };
  
  return (
    <div className="screen-container gap-4 justify-between">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{screen.title}</h1>
            <p className={`text-xs font-medium ${screen.required ? 'text-destructive' : 'text-muted-foreground'}`}>
              {screen.subtitle}
            </p>
          </div>
        </div>
        <div className="compact-card space-y-3">
          <p className="text-sm text-foreground leading-relaxed">{screen.description}</p>
          <ul className="space-y-2">
            {screen.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="text-primary mt-0.5">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex gap-3 flex-shrink-0">
        <button onClick={handleDecline}
          className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all active:scale-[0.98] ${
            screen.required ? 'border-muted text-muted-foreground opacity-50' : 'border-border text-foreground hover:bg-muted'
          }`}>
          {t.consent.decline}
        </button>
        <button onClick={handleAccept}
          className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform">
          {t.consent.accept}
        </button>
      </div>
      <div className="flex justify-center gap-1.5 flex-shrink-0">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${i === screenIndex ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>
    </div>
  );
}
