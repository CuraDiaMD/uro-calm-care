import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';
import type { 
  PatientProfile, 
  SexAtBirth, 
  ChiefComplaint, 
  IntakeStep 
} from '@/types';
import { CHIEF_COMPLAINT_LABELS, PAST_MEDICAL_OPTIONS } from '@/types';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const EMPTY_PROFILE: PatientProfile = {
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  sexAtBirth: null,
  ramqNumber: '',
  ramqExpiry: '',
  cellPhone: '',
  email: '',
  familyPhysician: '',
  chiefComplaints: [],
  pastMedicalHistory: [],
  pastSurgicalHistory: '',
  familyHistory: '',
  medications: '',
  allergies: '',
};

export function PatientProfileScreen() {
  const existingProfile = useAppStore((state) => state.patientProfile);
  const setPatientProfile = useAppStore((state) => state.setPatientProfile);
  const setCurrentIntakeStep = useAppStore((state) => state.setCurrentIntakeStep);
  
  const [profile, setProfile] = useState<PatientProfile>(existingProfile || EMPTY_PROFILE);
  const [section, setSection] = useState(0); // 0=demographics, 1=complaints, 2=history
  
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
  
  const toggleMedicalHistory = (item: string) => {
    setProfile(p => ({
      ...p,
      pastMedicalHistory: p.pastMedicalHistory.includes(item)
        ? p.pastMedicalHistory.filter(x => x !== item)
        : [...p.pastMedicalHistory, item],
    }));
  };
  
  const handleContinue = () => {
    if (section === 0) {
      if (!profile.firstName || !profile.lastName || !profile.sexAtBirth) {
        toast.error('Please fill in required fields (name, sex at birth)');
        return;
      }
      setSection(1);
    } else if (section === 1) {
      if (profile.chiefComplaints.length === 0) {
        toast.error('Please select at least one chief complaint');
        return;
      }
      setSection(2);
    } else {
      setPatientProfile(profile);
      setCurrentIntakeStep(4 as IntakeStep);
    }
  };
  
  const handleBack = () => {
    if (section > 0) {
      setSection(section - 1);
    }
  };
  
  return (
    <div className="screen-container gap-3 justify-between">
      {/* Section indicator */}
      <div className="flex gap-2 flex-shrink-0">
        {['Demographics', 'Complaints', 'History'].map((label, i) => (
          <button
            key={label}
            onClick={() => i < section && setSection(i)}
            className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors ${
              i === section ? 'bg-primary text-primary-foreground' : i < section ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
        {section === 0 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">Demographics</h2>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">First Name *</label>
                <input
                  value={profile.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Last Name *</label>
                <input
                  value={profile.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                  placeholder="Last name"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Date of Birth</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !profile.dateOfBirth && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {profile.dateOfBirth ? format(new Date(profile.dateOfBirth), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined}
                    onSelect={(date) => updateField('dateOfBirth', date || null)}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Sex at Birth *</label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'other'] as SexAtBirth[]).map((sex) => (
                  <button
                    key={sex}
                    onClick={() => updateField('sexAtBirth', sex)}
                    className={`compact-btn py-2.5 capitalize ${profile.sexAtBirth === sex ? 'border-primary bg-primary/10' : ''}`}
                  >
                    <span className="text-sm font-medium">{sex}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">RAMQ Number</label>
              <input
                value={profile.ramqNumber}
                onChange={(e) => updateField('ramqNumber', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                placeholder="XXXX 0000 0000"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Cell Phone</label>
              <input
                value={profile.cellPhone}
                onChange={(e) => updateField('cellPhone', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                placeholder="(514) 000-0000"
                type="tel"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Email</label>
              <input
                value={profile.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                placeholder="email@example.com"
                type="email"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Family Physician</label>
              <input
                value={profile.familyPhysician}
                onChange={(e) => updateField('familyPhysician', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                placeholder="Dr. Name"
              />
            </div>
          </>
        )}
        
        {section === 1 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">Chief Complaints</h2>
            <p className="text-xs text-muted-foreground">Select all that apply *</p>
            
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(CHIEF_COMPLAINT_LABELS) as [ChiefComplaint, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleComplaint(key)}
                  className={`compact-btn py-2.5 text-left ${
                    profile.chiefComplaints.includes(key) ? 'border-primary bg-primary/10' : ''
                  }`}
                >
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </button>
              ))}
            </div>
          </>
        )}
        
        {section === 2 && (
          <>
            <h2 className="text-lg font-semibold text-foreground">Medical History</h2>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Past Medical History</label>
              <div className="grid grid-cols-2 gap-1.5">
                {PAST_MEDICAL_OPTIONS.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleMedicalHistory(item)}
                    className={`compact-btn py-2 text-left ${
                      profile.pastMedicalHistory.includes(item) ? 'border-primary bg-primary/10' : ''
                    }`}
                  >
                    <span className="text-[11px] font-medium text-foreground">{item}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Past Surgical History</label>
              <textarea
                value={profile.pastSurgicalHistory}
                onChange={(e) => updateField('pastSurgicalHistory', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-16 text-sm"
                placeholder="List any previous surgeries..."
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Family History</label>
              <textarea
                value={profile.familyHistory}
                onChange={(e) => updateField('familyHistory', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-16 text-sm"
                placeholder="Relevant family medical history..."
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Medications</label>
              <textarea
                value={profile.medications}
                onChange={(e) => updateField('medications', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-16 text-sm"
                placeholder="List current medications..."
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Allergies</label>
              <input
                value={profile.allergies}
                onChange={(e) => updateField('allergies', e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                placeholder="List any allergies..."
              />
            </div>
          </>
        )}
      </div>
      
      <div className="flex gap-3 flex-shrink-0">
        {section > 0 && (
          <button
            onClick={handleBack}
            className="flex-1 py-3 rounded-xl border-2 border-border text-foreground font-semibold text-sm active:scale-[0.98] transition-all"
          >
            Back
          </button>
        )}
        <button
          onClick={handleContinue}
          className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          {section === 2 ? 'Continue to Questionnaires' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
