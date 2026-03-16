import { useState } from 'react';
import { useAppStore, EMPTY_PROFILE } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import { toast } from 'sonner';
import type {
  PatientProfile, SexAtBirth, ChiefComplaint, IntakeStep, SurgicalEntry, AllergyEntry,
} from '@/types';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface PatientProfileScreenProps {
  isEditMode?: boolean;
  onEditComplete?: () => void;
}

export function PatientProfileScreen({ isEditMode, onEditComplete }: PatientProfileScreenProps = {}) {
  const existingProfile = useAppStore((state) => state.patientProfile);
  const setPatientProfile = useAppStore((state) => state.setPatientProfile);
  const setCurrentIntakeStep = useAppStore((state) => state.setCurrentIntakeStep);
  const t = useTranslation();
  
  const SECTIONS = [t.profile.demographics, t.profile.complaints, t.profile.medicalHx, t.profile.surgicalHx, t.profile.familyHx, t.profile.medications, t.profile.allergies];
  const profileOptions = t.profileOptions;
  
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

  const togglePMH = (category: keyof typeof profile.pastMedicalHistory, item: string) => {
    if (category === 'cancerOther') return;
    setProfile(p => {
      const arr = p.pastMedicalHistory[category] as string[];
      return { ...p, pastMedicalHistory: { ...p.pastMedicalHistory, [category]: arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item] } };
    });
  };

  const toggleSurgery = (category: 'urologic' | 'general', name: string) => {
    setProfile(p => {
      const arr = p.pastSurgicalHistory[category];
      const exists = arr.find(e => e.name === name);
      return { ...p, pastSurgicalHistory: { ...p.pastSurgicalHistory, [category]: exists ? arr.filter(e => e.name !== name) : [...arr, { name } as SurgicalEntry] } };
    });
  };

  const updateSurgeryYear = (category: 'urologic' | 'general', name: string, year: string) => {
    setProfile(p => ({ ...p, pastSurgicalHistory: { ...p.pastSurgicalHistory, [category]: p.pastSurgicalHistory[category].map(e => e.name === name ? { ...e, year } : e) } }));
  };

  const toggleSurgeryMesh = (category: 'urologic' | 'general', name: string) => {
    setProfile(p => ({ ...p, pastSurgicalHistory: { ...p.pastSurgicalHistory, [category]: p.pastSurgicalHistory[category].map(e => e.name === name ? { ...e, meshUsed: !e.meshUsed } : e) } }));
  };

  const toggleFamilyHx = (condition: string) => {
    setProfile(p => ({ ...p, familyHistory: { ...p.familyHistory, conditions: p.familyHistory.conditions.includes(condition) ? p.familyHistory.conditions.filter(x => x !== condition) : [...p.familyHistory.conditions, condition] } }));
  };

  const toggleMedArray = (field: 'diabetesMeds' | 'bloodThinners' | 'urologicMeds' | 'supplements', item: string) => {
    setProfile(p => ({ ...p, medications: { ...p.medications, [field]: (p.medications[field] as string[]).includes(item) ? (p.medications[field] as string[]).filter(x => x !== item) : [...(p.medications[field] as string[]), item] } }));
  };

  const addAllergy = () => {
    setProfile(p => ({ ...p, allergies: { ...p.allergies, entries: [...p.allergies.entries, { allergen: '', reaction: '' }] } }));
  };

  const updateAllergy = (idx: number, field: keyof AllergyEntry, value: string) => {
    setProfile(p => ({ ...p, allergies: { ...p.allergies, entries: p.allergies.entries.map((e, i) => i === idx ? { ...e, [field]: value } : e) } }));
  };

  const removeAllergy = (idx: number) => {
    setProfile(p => ({ ...p, allergies: { ...p.allergies, entries: p.allergies.entries.filter((_, i) => i !== idx) } }));
  };

  const hasDiabetes = profile.pastMedicalHistory.endocrine.some(e => e.includes('Diabetes'));
  
  const handleContinue = () => {
    if (section === 0) {
      if (!profile.firstName || !profile.lastName || !profile.sexAtBirth) {
        toast.error(t.profile.requiredFieldsError); return;
      }
    }
    if (section === 1) {
      if (profile.chiefComplaints.length === 0) {
        toast.error(t.profile.complaintsError); return;
      }
    }
    if (section < SECTIONS.length - 1) { setSection(section + 1); }
    else { setPatientProfile(profile); setCurrentIntakeStep(4 as IntakeStep); }
  };
  
  const handleBack = () => { if (section > 0) setSection(section - 1); };

  const CheckboxGrid = ({ items, selected, onToggle, cols = 2 }: { items: readonly string[]; selected: string[]; onToggle: (item: string) => void; cols?: number }) => (
    <div className={`grid gap-1.5 ${cols === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {items.map(item => {
        const isSelected = selected.includes(item);

        return (
          <button
            key={item}
            type="button"
            data-selected={isSelected}
            aria-pressed={isSelected}
            onClick={() => onToggle(item)}
            className="compact-btn py-2 text-left"
          >
            <span className="text-[11px] font-medium text-foreground">{item}</span>
          </button>
        );
      })}
    </div>
  );

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">{children}</label>
  );

  const sexLabels: Record<SexAtBirth, string> = { male: t.profile.male, female: t.profile.female, other: t.profile.other };
  
  return (
    <div className="screen-container gap-3 justify-between">
      <div className="flex gap-1.5 flex-shrink-0 overflow-x-auto pb-1">
        {SECTIONS.map((label, i) => (
          <button key={label} onClick={() => i < section && setSection(i)}
            className={`whitespace-nowrap text-[10px] font-medium py-1.5 px-2.5 rounded-lg transition-colors flex-shrink-0 ${
              i === section ? 'bg-primary text-primary-foreground' : i < section ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
            {label}
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
        {section === 0 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">{t.profile.demographics}</h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">{t.profile.firstName} *</label>
                <input value={profile.firstName} onChange={(e) => updateField('firstName', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" placeholder={t.profile.firstName} />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">{t.profile.lastName} *</label>
                <input value={profile.lastName} onChange={(e) => updateField('lastName', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" placeholder={t.profile.lastName} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">{t.profile.dateOfBirth}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !profile.dateOfBirth && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {profile.dateOfBirth ? format(new Date(profile.dateOfBirth), 'PPP') : <span>{t.profile.pickDate}</span>}
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
              <label className="text-xs font-medium text-foreground mb-1 block">{t.profile.sexAtBirth} *</label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'other'] as SexAtBirth[]).map((sex) => {
                  const isSelected = profile.sexAtBirth === sex;

                  return (
                    <button
                      key={sex}
                      type="button"
                      data-selected={isSelected}
                      aria-pressed={isSelected}
                      onClick={() => updateField('sexAtBirth', sex)}
                      className="compact-btn py-2.5"
                    >
                      <span className="text-sm font-medium">{sexLabels[sex]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">{t.profile.ramqNumber}</label>
              <input value={profile.ramqNumber} onChange={(e) => updateField('ramqNumber', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="XXXX 0000 0000" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">{t.profile.cellPhone}</label>
              <input value={profile.cellPhone} onChange={(e) => updateField('cellPhone', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="(514) 000-0000" type="tel" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">{t.profile.email}</label>
              <input value={profile.email} onChange={(e) => updateField('email', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="email@example.com" type="email" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">{t.profile.familyPhysician}</label>
              <input value={profile.familyPhysician} onChange={(e) => updateField('familyPhysician', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" placeholder="Dr. Name" />
            </div>
          </>
        )}
        
        {section === 1 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">{t.profile.chiefComplaints}</h2>
            <p className="text-xs text-muted-foreground">{t.profile.selectAllApply}</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(t.chiefComplaints) as ChiefComplaint[]).map((key) => {
                const isSelected = profile.chiefComplaints.includes(key);

                return (
                  <button
                    key={key}
                    type="button"
                    data-selected={isSelected}
                    aria-pressed={isSelected}
                    onClick={() => toggleComplaint(key)}
                    className="compact-btn py-2.5 text-left"
                  >
                    <span className="text-xs font-medium text-foreground">{t.chiefComplaints[key]}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
        
        {section === 2 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">{t.profile.pastMedicalHistory}</h2>
            <SectionLabel>{t.profile.endocrine}</SectionLabel>
            <CheckboxGrid items={profileOptions.pmh.endocrine} selected={profile.pastMedicalHistory.endocrine} onToggle={(item) => togglePMH('endocrine', item)} />
            <SectionLabel>{t.profile.cardiovascular}</SectionLabel>
            <CheckboxGrid items={profileOptions.pmh.cardiovascular} selected={profile.pastMedicalHistory.cardiovascular} onToggle={(item) => togglePMH('cardiovascular', item)} />
            <SectionLabel>{t.profile.neurological}</SectionLabel>
            <CheckboxGrid items={profileOptions.pmh.neurological} selected={profile.pastMedicalHistory.neurological} onToggle={(item) => togglePMH('neurological', item)} />
            <SectionLabel>{t.profile.kidneyUrologic}</SectionLabel>
            <CheckboxGrid items={profileOptions.pmh.kidneyUrologic} selected={profile.pastMedicalHistory.kidneyUrologic} onToggle={(item) => togglePMH('kidneyUrologic', item)} />
            <SectionLabel>{t.profile.cancerHistory}</SectionLabel>
            <CheckboxGrid items={profileOptions.pmh.cancer} selected={profile.pastMedicalHistory.cancer} onToggle={(item) => togglePMH('cancer', item)} />
            <input value={profile.pastMedicalHistory.cancerOther}
              onChange={(e) => setProfile(p => ({ ...p, pastMedicalHistory: { ...p.pastMedicalHistory, cancerOther: e.target.value } }))}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm mt-1.5"
              placeholder={t.profile.otherCancer} />
            <SectionLabel>{t.profile.otherPMH}</SectionLabel>
            <CheckboxGrid items={profileOptions.pmh.other} selected={profile.pastMedicalHistory.other} onToggle={(item) => togglePMH('other', item)} />
          </>
        )}

        {section === 3 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">{t.profile.surgicalHistory}</h2>
            <SectionLabel>{t.profile.urologicSurgeries}</SectionLabel>
            {profileOptions.surgery.urologic.map(name => {
              const entry = profile.pastSurgicalHistory.urologic.find(e => e.name === name);
              return (
                <div key={name} className="space-y-1 mb-2">
                  <button
                    type="button"
                    data-selected={!!entry}
                    aria-pressed={!!entry}
                    onClick={() => toggleSurgery('urologic', name)}
                    className="w-full compact-btn py-2 text-left"
                  >
                    <span className="text-[11px] font-medium text-foreground">{name}</span>
                  </button>
                  {entry && (
                    <input value={entry.year || ''} onChange={(e) => updateSurgeryYear('urologic', name, e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                      placeholder={t.profile.yearOptional} />
                  )}
                </div>
              );
            })}
            <SectionLabel>{t.profile.generalSurgeries}</SectionLabel>
            {profileOptions.surgery.general.map(name => {
              const entry = profile.pastSurgicalHistory.general.find(e => e.name === name);
              return (
                <div key={name} className="space-y-1 mb-2">
                  <button
                    type="button"
                    data-selected={!!entry}
                    aria-pressed={!!entry}
                    onClick={() => toggleSurgery('general', name)}
                    className="w-full compact-btn py-2 text-left"
                  >
                    <span className="text-[11px] font-medium text-foreground">{name}</span>
                  </button>
                  {entry && (
                    <div className="flex gap-2">
                      <input value={entry.year || ''} onChange={(e) => updateSurgeryYear('general', name, e.target.value)}
                        className="flex-1 p-2 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                        placeholder={t.profile.yearOptional} />
                      {name === profileOptions.surgery.general[0] && (
                        <button onClick={() => toggleSurgeryMesh('general', name)}
                          className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${entry.meshUsed ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}>
                          {t.profile.mesh}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {section === 4 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">{t.profile.familyHistory}</h2>
            <p className="text-xs text-muted-foreground">{t.profile.familyHxDesc}</p>
            <CheckboxGrid items={profileOptions.familyHistory} selected={profile.familyHistory.conditions} onToggle={toggleFamilyHx} />
            <input value={profile.familyHistory.other}
              onChange={(e) => setProfile(p => ({ ...p, familyHistory: { ...p.familyHistory, other: e.target.value } }))}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              placeholder={t.profile.otherFamilyHx} />
          </>
        )}

        {section === 5 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">{t.profile.medications}</h2>
            {hasDiabetes && (
              <>
                <SectionLabel>{t.profile.diabetesMeds}</SectionLabel>
                <CheckboxGrid items={profileOptions.medications.diabetes} selected={profile.medications.diabetesMeds} onToggle={(item) => toggleMedArray('diabetesMeds', item)} />
                <input value={profile.medications.diabetesMedsOther}
                  onChange={(e) => setProfile(p => ({ ...p, medications: { ...p.medications, diabetesMedsOther: e.target.value } }))}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm mt-1.5"
                  placeholder={t.profile.otherDiabetesMeds} />
              </>
            )}
            <SectionLabel>{t.profile.bloodThinners}</SectionLabel>
            <CheckboxGrid items={profileOptions.medications.bloodThinners} selected={profile.medications.bloodThinners} onToggle={(item) => toggleMedArray('bloodThinners', item)} />
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">{t.profile.bpMeds}</label>
                <input value={profile.medications.bpMeds}
                  onChange={(e) => setProfile(p => ({ ...p, medications: { ...p.medications, bpMeds: e.target.value } }))}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                  placeholder={t.profile.specify} />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  data-selected={profile.medications.diuretics}
                  aria-pressed={profile.medications.diuretics}
                  onClick={() => setProfile(p => ({ ...p, medications: { ...p.medications, diuretics: !p.medications.diuretics } }))}
                  className="w-full compact-btn py-2.5"
                >
                  <span className="text-[11px] font-medium text-foreground">{t.profile.diuretics}</span>
                </button>
              </div>
            </div>
            <SectionLabel>{t.profile.urologicMeds}</SectionLabel>
            <CheckboxGrid items={profileOptions.medications.urologic} selected={profile.medications.urologicMeds} onToggle={(item) => toggleMedArray('urologicMeds', item)} cols={1} />
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">{t.profile.otherPrescriptions}</label>
              <textarea value={profile.medications.otherPrescriptions}
                onChange={(e) => setProfile(p => ({ ...p, medications: { ...p.medications, otherPrescriptions: e.target.value } }))}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-16 text-sm"
                placeholder={t.profile.listOtherPrescriptions} />
            </div>
            <SectionLabel>{t.profile.supplements}</SectionLabel>
            <CheckboxGrid items={profileOptions.medications.supplements} selected={profile.medications.supplements} onToggle={(item) => toggleMedArray('supplements', item)} />
            <input value={profile.medications.supplementsOther}
              onChange={(e) => setProfile(p => ({ ...p, medications: { ...p.medications, supplementsOther: e.target.value } }))}
              className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm mt-1.5"
              placeholder={t.profile.otherSupplements} />
          </>
        )}

        {section === 6 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">{t.profile.allergies}</h2>
            <button onClick={() => setProfile(p => ({ ...p, allergies: { ...p.allergies, noKnownAllergies: !p.allergies.noKnownAllergies, entries: !p.allergies.noKnownAllergies ? [] : p.allergies.entries } }))}
              className={`w-full compact-btn py-2.5 ${profile.allergies.noKnownAllergies ? 'border-primary bg-primary/10' : ''}`}>
              <span className="text-sm font-medium text-foreground">{t.profile.nkda}</span>
            </button>
            {!profile.allergies.noKnownAllergies && (
              <>
                {profile.allergies.entries.map((entry, idx) => (
                  <div key={idx} className="compact-card space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{t.profile.allergyNum} {idx + 1}</span>
                      <button onClick={() => removeAllergy(idx)} className="p-1 rounded-full hover:bg-destructive/10 transition-colors">
                        <X className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                    <input value={entry.allergen} onChange={(e) => updateAllergy(idx, 'allergen', e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-background focus:border-primary outline-none text-sm"
                      placeholder={t.profile.allergenPlaceholder} />
                    <input value={entry.reaction} onChange={(e) => updateAllergy(idx, 'reaction', e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-background focus:border-primary outline-none text-sm"
                      placeholder={t.profile.reactionPlaceholder} />
                  </div>
                ))}
                <button onClick={addAllergy}
                  className="w-full py-2.5 rounded-lg border-2 border-dashed border-border text-muted-foreground text-xs font-medium flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-colors">
                  <Plus className="w-3.5 h-3.5" /> {t.profile.addAllergy}
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
            {t.profile.back}
          </button>
        )}
        <button onClick={() => {
            if (isEditMode && section === SECTIONS.length - 1) {
              setPatientProfile(profile);
              toast.success(t.profile.profileUpdated);
              onEditComplete?.();
            } else {
              handleContinue();
            }
          }}
          className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform">
          {section === SECTIONS.length - 1 ? (isEditMode ? t.profile.saveChanges : t.profile.continueToQuestionnaires) : t.profile.continue}
        </button>
      </div>
    </div>
  );
}
