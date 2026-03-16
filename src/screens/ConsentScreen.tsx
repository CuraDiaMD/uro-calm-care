import { useState } from 'react';
import { ShieldCheck, Brain, Bell } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';
import type { IntakeStep, Consent } from '@/types';

const CONSENT_SCREENS = [
  {
    icon: ShieldCheck,
    title: 'Clinical Data Consent',
    subtitle: 'Required to proceed',
    required: true,
    description:
      'Your health information will be securely stored and shared with your clinical care team to support your diagnosis and treatment.',
    details: [
      'Your profile, questionnaire scores, and diary data will be accessible to your care team',
      'Data is encrypted and stored in compliance with healthcare privacy regulations',
      'You can request data deletion at any time by contacting your clinic',
    ],
    field: 'clinicalData' as const,
  },
  {
    icon: Brain,
    title: 'Research & AI Training',
    subtitle: 'Optional',
    required: false,
    description:
      'Help improve urological care by allowing your anonymized data to be used for medical research and AI model training.',
    details: [
      'All data is fully anonymized before use — your identity is never linked',
      'Contributes to better diagnostic tools and treatment recommendations',
      'You can withdraw consent at any time without affecting your care',
    ],
    field: 'researchData' as const,
  },
  {
    icon: Bell,
    title: 'Communication Preferences',
    subtitle: 'Optional',
    required: false,
    description:
      'Allow your care team to send you reminders and updates about your diary, appointments, and health tips.',
    details: [
      'Receive diary reminders to help you complete your 3-day voiding diary',
      'Get appointment notifications and follow-up messages',
      'You can unsubscribe at any time',
    ],
    field: 'communication' as const,
  },
];

export function ConsentScreen() {
  const currentIntakeStep = useAppStore((state) => state.currentIntakeStep);
  const setCurrentIntakeStep = useAppStore((state) => state.setCurrentIntakeStep);
  const consents = useAppStore((state) => state.consents);
  const setConsents = useAppStore((state) => state.setConsents);
  
  // currentIntakeStep 0-2 maps to consent sub-screens 0-2
  const screenIndex = currentIntakeStep;
  const screen = CONSENT_SCREENS[screenIndex];
  const Icon = screen.icon;
  
  const handleAccept = () => {
    const current: Consent = consents || {
      clinicalData: false,
      researchData: false,
      communication: false,
      timestamps: {},
    };
    
    const updated: Consent = {
      ...current,
      [screen.field]: true,
      timestamps: {
        ...current.timestamps,
        [screen.field.replace('Data', '').replace('communication', 'communication')]: new Date(),
      },
    };
    
    // Fix timestamp keys
    if (screen.field === 'clinicalData') updated.timestamps.clinical = new Date();
    if (screen.field === 'researchData') updated.timestamps.research = new Date();
    if (screen.field === 'communication') updated.timestamps.communication = new Date();
    
    setConsents(updated);
    
    if (screenIndex < 2) {
      setCurrentIntakeStep((screenIndex + 1) as IntakeStep);
    } else {
      setCurrentIntakeStep(3);
    }
  };
  
  const handleDecline = () => {
    if (screen.required) {
      toast.error('Clinical data consent is required to proceed.');
      return;
    }
    
    const current: Consent = consents || {
      clinicalData: false,
      researchData: false,
      communication: false,
      timestamps: {},
    };
    
    const updated: Consent = {
      ...current,
      [screen.field]: false,
    };
    
    setConsents(updated);
    
    if (screenIndex < 2) {
      setCurrentIntakeStep((screenIndex + 1) as IntakeStep);
    } else {
      setCurrentIntakeStep(3);
    }
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
        <button
          onClick={handleDecline}
          className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all active:scale-[0.98] ${
            screen.required
              ? 'border-muted text-muted-foreground opacity-50'
              : 'border-border text-foreground hover:bg-muted'
          }`}
        >
          I Decline
        </button>
        <button
          onClick={handleAccept}
          className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          I Accept
        </button>
      </div>
      
      <div className="flex justify-center gap-1.5 flex-shrink-0">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i === screenIndex ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
    </div>
  );
}
