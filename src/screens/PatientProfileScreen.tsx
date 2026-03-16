import { useState } from 'react';
import { useAppStore, EMPTY_PROFILE } from '@/stores/appStore';
import { toast } from 'sonner';
import type { 
  PatientProfile, 
  SexAtBirth, 
  ChiefComplaint, 
  IntakeStep,
  SurgicalEntry,
  AllergyEntry,
} from '@/types';
import { 
  CHIEF_COMPLAINT_LABELS,
  PMH_ENDOCRINE, PMH_CARDIOVASCULAR, PMH_NEUROLOGICAL, PMH_KIDNEY_UROLOGIC, PMH_CANCER, PMH_OTHER,
  SURG_UROLOGIC, SURG_GENERAL,
  FAMILY_HX_OPTIONS,
  DIABETES_MEDS, BLOOD_THINNERS, UROLOGIC_MEDS, SUPPLEMENTS,
} from '@/types';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const SECTIONS = ['Demographics', 'Complaints', 'Medical Hx', 'Surgical Hx', 'Family Hx', 'Medications', 'Allergies'];

interface PatientProfileScreenProps {
  isEditMode?: boolean;
  onEditComplete?: () => void;
}

export function PatientProfileScreen({ isEditMode, onEditComplete }: PatientProfileScreenProps = {}) {
  const existingProfile = useAppStore((state) => state.patientProfile);
  const setPatientProfile = useAppStore((state) => state.setPatientProfile);
  const setCurrentIntakeStep = useAppStore((state) => state.setCurrentIntakeStep);
  
  const [profile, setProfile] = useState<PatientProfile>(existingProfile || EMPTY_PROFILE);
  const [section, setSection] = useState(0);
  
  const updateField = <K extends keyof PatientProfile>(key: K, value: PatientProfile[K]) => {
    setProfile(p => ({ ...p, [key]: value }));
  };
  
  const toggleComplaint = (c: ChiefComplaint) => {
    setProfile(p => ({
      ...p,
      chiefComplaints: p.chiefComplaints.includes(c)
        ? p.chiefComplaints.filter(x => x !== c)
        : [...p.chiefComplaints, c],
    }));
  };

  // ── PMH helpers ──
  const togglePMH = (category: keyof typeof profile.pastMedicalHistory, item: string) => {
    if (category === 'cancerOther') return;
    setProfile(p => {
      const arr = p.pastMedicalHistory[category] as string[];
      return {
        ...p,
        pastMedicalHistory: {
          ...p.pastMedicalHistory,
          [category]: arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item],
        },
      };
    });
  };

  // ── Surgical helpers ──
  const toggleSurgery = (category: 'urologic' | 'general', name: string) => {
    setProfile(p => {
      const arr = p.pastSurgicalHistory[category];
      const exists = arr.find(e => e.name === name);
      return {
        ...p,
        pastSurgicalHistory: {
          ...p.pastSurgicalHistory,
          [category]: exists
            ? arr.filter(e => e.name !== name)
            : [...arr, { name } as SurgicalEntry],
        },
      };
    });
  };

  const updateSurgeryYear = (category: 'urologic' | 'general', name: string, year: string) => {
    setProfile(p => ({
      ...p,
      pastSurgicalHistory: {
        ...p.pastSurgicalHistory,
        [category]: p.pastSurgicalHistory[category].map(e =>
          e.name === name ? { ...e, year } : e
        ),
      },
    }));
  };

  const toggleSurgeryMesh = (category: 'urologic' | 'general', name: string) => {
    setProfile(p => ({
      ...p,
      pastSurgicalHistory: {
        ...p.pastSurgicalHistory,
        [category]: p.pastSurgicalHistory[category].map(e =>
          e.name === name ? { ...e, meshUsed: !e.meshUsed } : e
        ),
      },
    }));
  };

  // ── Family Hx helpers ──
  const toggleFamilyHx = (condition: string) => {
    setProfile(p => ({
      ...p,
      familyHistory: {
        ...p.familyHistory,
        conditions: p.familyHistory.conditions.includes(condition)
          ? p.familyHistory.conditions.filter(x => x !== condition)
          : [...p.familyHistory.conditions, condition],
      },
    }));
  };

  // ── Medications helpers ──
  const toggleMedArray = (field: 'diabetesMeds' | 'bloodThinners' | 'urologicMeds' | 'supplements', item: string) => {
    setProfile(p => ({
      ...p,
      medications: {
        ...p.medications,
        [field]: (p.medications[field] as string[]).includes(item)
          ? (p.medications[field] as string[]).filter(x => x !== item)
          : [...(p.medications[field] as string[]), item],
      },
    }));
  };

  // ── Allergy helpers ──
  const addAllergy = () => {
    setProfile(p => ({
      ...p,
      allergies: {
        ...p.allergies,
        entries: [...p.allergies.entries, { allergen: '', reaction: '' }],
      },
    }));
  };

  const updateAllergy = (idx: number, field: keyof AllergyEntry, value: string) => {
    setProfile(p => ({
      ...p,
      allergies: {
        ...p.allergies,
        entries: p.allergies.entries.map((e, i) => i === idx ? { ...e, [field]: value } : e),
      },
    }));
  };

  const removeAllergy = (idx: number) => {
    setProfile(p => ({
      ...p,
      allergies: {
        ...p.allergies,
        entries: p.allergies.entries.filter((_, i) => i !== idx),
      },
    }));
  };

  const hasDiabetes = profile.pastMedicalHistory.endocrine.some(e => e.includes('Diabetes'));
  
  const handleContinue = () => {
    if (section === 0) {
      if (!profile.firstName || !profile.lastName || !profile.sexAtBirth) {
        toast.error('Please fill in required fields (name, sex at birth)');
        return;
      }
    }
    if (section === 1) {
      if (profile.chiefComplaints.length === 0) {
        toast.error('Please select at least one chief complaint');
        return;
      }
    }
    if (section < SECTIONS.length - 1) {
      setSection(section + 1);
    } else {
      setPatientProfile(profile);
      setCurrentIntakeStep(4 as IntakeStep);
    }
  };
  
  const handleBack = () => {
    if (section > 0) setSection(section - 1);
  };

  // Reusable checkbox grid
  const CheckboxGrid = ({ items, selected, onToggle, cols = 2 }: { items: readonly string[]; selected: string[]; onToggle: (item: string) => void; cols?: number }) => (
    <div className={`grid gap-1.5 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {items.map(item => (
        <button
          key={item}
          onClick={() => onToggle(item)}
          className={`compact-btn py-2 text-left ${selected.includes(item) ? 'border-primary bg-primary/10' : ''}`}
        >
          <span className="text-[11px] font-medium text-foreground">{item}</span>
        </button>
      ))}
    </div>
  );

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">{children}</label>
  );
  
  return (
    <div className="screen-container gap-3 justify-between">
      {/* Section indicator - scrollable */}
      <div className="flex gap-1.5 flex-shrink-0 overflow-x-auto pb-1">
        {SECTIONS.map((label, i) => (
          <button
            key={label}
            onClick={() => i < section && setSection(i)}
            className={`whitespace-nowrap text-[10px] font-medium py-1.5 px-2.5 rounded-lg transition-colors flex-shrink-0 ${
              i === section ? 'bg-primary text-primary-foreground' : i < section ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
        {/* Section 0: Demographics */}
        {section === 0 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">Demographics</h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">First Name *</label>
                <input value={profile.firstName} onChange={(e) => updateField('firstName', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="First name" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Last Name *</label>
                <input value={profile.lastName} onChange={(e) => updateField('lastName', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="Last name" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Date of Birth</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !profile.dateOfBirth && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {profile.dateOfBirth ? format(new Date(profile.dateOfBirth), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined}
                    onSelect={(date) => updateField('dateOfBirth', date || null)}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Sex at Birth *</label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'other'] as SexAtBirth[]).map((sex) => (
                  <button key={sex} onClick={() => updateField('sexAtBirth', sex)}
                    className={`compact-btn py-2.5 capitalize ${profile.sexAtBirth === sex ? 'border-primary bg-primary/10' : ''}`}>
                    <span className="text-sm font-medium">{sex}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">RAMQ Number</label>
              <input value={profile.ramqNumber} onChange={(e) => updateField('ramqNumber', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="XXXX 0000 0000" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Cell Phone</label>
              <input value={profile.cellPhone} onChange={(e) => updateField('cellPhone', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="(514) 000-0000" type="tel" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Email</label>
              <input value={profile.email} onChange={(e) => updateField('email', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="email@example.com" type="email" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Family Physician</label>
              <input value={profile.familyPhysician} onChange={(e) => updateField('familyPhysician', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="Dr. Name" />
            </div>
          </>
        )}
        
        {/* Section 1: Chief Complaints */}
        {section === 1 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">Chief Complaints</h2>
            <p className="text-xs text-muted-foreground">Select all that apply *</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(CHIEF_COMPLAINT_LABELS) as [ChiefComplaint, string][]).map(([key, label]) => (
                <button key={key} onClick={() => toggleComplaint(key)}
                  className={`compact-btn py-2.5 text-left ${profile.chiefComplaints.includes(key) ? 'border-primary bg-primary/10' : ''}`}>
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </button>
              ))}
            </div>
          </>
        )}
        
        {/* Section 2: Past Medical History */}
        {section === 2 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">Past Medical History</h2>
            
            <SectionLabel>Endocrine</SectionLabel>
            <CheckboxGrid items={PMH_ENDOCRINE} selected={profile.pastMedicalHistory.endocrine} onToggle={(item) => togglePMH('endocrine', item)} />
            
            <SectionLabel>Cardiovascular</SectionLabel>
            <CheckboxGrid items={PMH_CARDIOVASCULAR} selected={profile.pastMedicalHistory.cardiovascular} onToggle={(item) => togglePMH('cardiovascular', item)} />
            
            <SectionLabel>Neurological</SectionLabel>
            <CheckboxGrid items={PMH_NEUROLOGICAL} selected={profile.pastMedicalHistory.neurological} onToggle={(item) => togglePMH('neurological', item)} />
            
            <SectionLabel>Kidney / Urologic</SectionLabel>
            <CheckboxGrid items={PMH_KIDNEY_UROLOGIC} selected={profile.pastMedicalHistory.kidneyUrologic} onToggle={(item) => togglePMH('kidneyUrologic', item)} />
            
            <SectionLabel>Cancer History</SectionLabel>
            <CheckboxGrid items={PMH_CANCER} selected={profile.pastMedicalHistory.cancer} onToggle={(item) => togglePMH('cancer', item)} />
            <input value={profile.pastMedicalHistory.cancerOther}
              onChange={(e) => setProfile(p => ({ ...p, pastMedicalHistory: { ...p.pastMedicalHistory, cancerOther: e.target.value } }))}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm mt-1.5"
              placeholder="Other cancer (specify)" />
            
            <SectionLabel>Other</SectionLabel>
            <CheckboxGrid items={PMH_OTHER} selected={profile.pastMedicalHistory.other} onToggle={(item) => togglePMH('other', item)} />
          </>
        )}

        {/* Section 3: Surgical History */}
        {section === 3 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">Surgical History</h2>
            
            <SectionLabel>Urologic Surgeries</SectionLabel>
            {SURG_UROLOGIC.map(name => {
              const entry = profile.pastSurgicalHistory.urologic.find(e => e.name === name);
              return (
                <div key={name} className="space-y-1 mb-2">
                  <button onClick={() => toggleSurgery('urologic', name)}
                    className={`w-full compact-btn py-2 text-left ${entry ? 'border-primary bg-primary/10' : ''}`}>
                    <span className="text-[11px] font-medium text-foreground">{name}</span>
                  </button>
                  {entry && (
                    <input value={entry.year || ''} onChange={(e) => updateSurgeryYear('urologic', name, e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                      placeholder="Year (optional)" />
                  )}
                </div>
              );
            })}
            
            <SectionLabel>General Surgeries</SectionLabel>
            {SURG_GENERAL.map(name => {
              const entry = profile.pastSurgicalHistory.general.find(e => e.name === name);
              return (
                <div key={name} className="space-y-1 mb-2">
                  <button onClick={() => toggleSurgery('general', name)}
                    className={`w-full compact-btn py-2 text-left ${entry ? 'border-primary bg-primary/10' : ''}`}>
                    <span className="text-[11px] font-medium text-foreground">{name}</span>
                  </button>
                  {entry && (
                    <div className="flex gap-2">
                      <input value={entry.year || ''} onChange={(e) => updateSurgeryYear('general', name, e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                        placeholder="Year (optional)" />
                      {name === 'Hernia Repair' && (
                        <button onClick={() => toggleSurgeryMesh('general', name)}
                          className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${entry.meshUsed ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}>
                          Mesh
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Section 4: Family History */}
        {section === 4 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">Family History</h2>
            <p className="text-xs text-muted-foreground">Select conditions present in first-degree relatives</p>
            <CheckboxGrid items={FAMILY_HX_OPTIONS} selected={profile.familyHistory.conditions} onToggle={toggleFamilyHx} />
            <input value={profile.familyHistory.other}
              onChange={(e) => setProfile(p => ({ ...p, familyHistory: { ...p.familyHistory, other: e.target.value } }))}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              placeholder="Other family history (specify)" />
          </>
        )}

        {/* Section 5: Medications */}
        {section === 5 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">Medications</h2>
            
            {hasDiabetes && (
              <>
                <SectionLabel>Diabetes Medications</SectionLabel>
                <CheckboxGrid items={DIABETES_MEDS} selected={profile.medications.diabetesMeds} onToggle={(item) => toggleMedArray('diabetesMeds', item)} />
                <input value={profile.medications.diabetesMedsOther}
                  onChange={(e) => setProfile(p => ({ ...p, medications: { ...p.medications, diabetesMedsOther: e.target.value } }))}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm mt-1.5"
                  placeholder="Other diabetes meds" />
              </>
            )}
            
            <SectionLabel>Blood Thinners</SectionLabel>
            <CheckboxGrid items={BLOOD_THINNERS} selected={profile.medications.bloodThinners} onToggle={(item) => toggleMedArray('bloodThinners', item)} />
            
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">BP Meds</label>
                <input value={profile.medications.bpMeds}
                  onChange={(e) => setProfile(p => ({ ...p, medications: { ...p.medications, bpMeds: e.target.value } }))}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                  placeholder="Specify" />
              </div>
              <div className="flex items-end">
                <button onClick={() => setProfile(p => ({ ...p, medications: { ...p.medications, diuretics: !p.medications.diuretics } }))}
                  className={`w-full compact-btn py-2.5 ${profile.medications.diuretics ? 'border-primary bg-primary/10' : ''}`}>
                  <span className="text-[11px] font-medium text-foreground">Diuretics</span>
                </button>
              </div>
            </div>
            
            <SectionLabel>Urologic Medications</SectionLabel>
            <CheckboxGrid items={UROLOGIC_MEDS} selected={profile.medications.urologicMeds} onToggle={(item) => toggleMedArray('urologicMeds', item)} cols={1} />
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Other Prescriptions</label>
              <textarea value={profile.medications.otherPrescriptions}
                onChange={(e) => setProfile(p => ({ ...p, medications: { ...p.medications, otherPrescriptions: e.target.value } }))}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-16 text-sm"
                placeholder="List other prescriptions..." />
            </div>
            
            <SectionLabel>Supplements</SectionLabel>
            <CheckboxGrid items={SUPPLEMENTS} selected={profile.medications.supplements} onToggle={(item) => toggleMedArray('supplements', item)} />
            <input value={profile.medications.supplementsOther}
              onChange={(e) => setProfile(p => ({ ...p, medications: { ...p.medications, supplementsOther: e.target.value } }))}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm mt-1.5"
              placeholder="Other supplements" />
          </>
        )}

        {/* Section 6: Allergies */}
        {section === 6 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">Allergies</h2>
            
            <button onClick={() => setProfile(p => ({ ...p, allergies: { ...p.allergies, noKnownAllergies: !p.allergies.noKnownAllergies, entries: !p.allergies.noKnownAllergies ? [] : p.allergies.entries } }))}
              className={`w-full compact-btn py-2.5 ${profile.allergies.noKnownAllergies ? 'border-primary bg-primary/10' : ''}`}>
              <span className="text-sm font-medium text-foreground">No Known Allergies (NKDA)</span>
            </button>
            
            {!profile.allergies.noKnownAllergies && (
              <>
                {profile.allergies.entries.map((entry, idx) => (
                  <div key={idx} className="compact-card space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Allergy {idx + 1}</span>
                      <button onClick={() => removeAllergy(idx)} className="p-1 rounded-full hover:bg-destructive/10 transition-colors">
                        <X className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                    <input value={entry.allergen} onChange={(e) => updateAllergy(idx, 'allergen', e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-background focus:border-primary outline-none text-sm"
                      placeholder="Allergen (e.g. Penicillin)" />
                    <input value={entry.reaction} onChange={(e) => updateAllergy(idx, 'reaction', e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-background focus:border-primary outline-none text-sm"
                      placeholder="Reaction (e.g. Rash, Anaphylaxis)" />
                  </div>
                ))}
                <button onClick={addAllergy}
                  className="w-full py-2.5 rounded-lg border-2 border-dashed border-border text-muted-foreground text-xs font-medium flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Allergy
                </button>
              </>
            )}
          </>
        )}
      </div>
      
      <div className="flex gap-3 flex-shrink-0">
        {section > 0 && (
          <button onClick={handleBack}
            className="flex-1 py-3 rounded-xl border-2 border-border text-foreground font-semibold text-sm active:scale-[0.98] transition-all">
            Back
          </button>
        )}
        <button onClick={() => {
            if (isEditMode && section === SECTIONS.length - 1) {
              setPatientProfile(profile);
              toast.success('Profile updated');
              onEditComplete?.();
            } else {
              handleContinue();
            }
          }}
          className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform">
          {section === SECTIONS.length - 1 ? (isEditMode ? 'Save Changes' : 'Continue to Questionnaires') : 'Continue'}
        </button>
      </div>
    </div>
  );
}
