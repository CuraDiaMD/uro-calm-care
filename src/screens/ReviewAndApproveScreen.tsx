import { useState } from 'react';
import { CheckCircle, User, FileText, ClipboardList, Pencil, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import { toast } from 'sonner';
import { PatientProfileScreen } from './PatientProfileScreen';
import { FormsScreen } from './FormsScreen';

type SubView = 'main' | 'edit-profile' | 'edit-forms';

export function ReviewAndApproveScreen() {
  const [subView, setSubView] = useState<SubView>('main');
  const patientProfile = useAppStore((state) => state.patientProfile);
  const consents = useAppStore((state) => state.consents);
  const ipssResults = useAppStore((state) => state.ipssResults);
  const oabqResults = useAppStore((state) => state.oabqResults);
  const iciqUiResults = useAppStore((state) => state.iciqUiResults);
  const intakeEntries = useAppStore((state) => state.intakeEntries);
  const voidingEntries = useAppStore((state) => state.voidingEntries);
  const leakageEntries = useAppStore((state) => state.leakageEntries);
  const intakeStatus = useAppStore((state) => state.intakeStatus);
  const setIntakeStatus = useAppStore((state) => state.setIntakeStatus);
  const setDiaryStartDate = useAppStore((state) => state.setDiaryStartDate);
  const t = useTranslation();
  
  const isIntakeFlow = intakeStatus === 'in-progress';
  
  const handleSubmit = () => {
    toast.success(t.review.submitted);
    setDiaryStartDate(new Date());
    setIntakeStatus('completed');
  };

  const pmhItems: string[] = [];
  if (patientProfile) {
    const pmh = patientProfile.pastMedicalHistory;
    if (pmh && typeof pmh === 'object' && !Array.isArray(pmh)) {
      pmhItems.push(...(pmh.endocrine || []), ...(pmh.cardiovascular || []), ...(pmh.neurological || []), ...(pmh.kidneyUrologic || []), ...(pmh.cancer || []), ...(pmh.other || []));
      if (pmh.cancerOther) pmhItems.push(pmh.cancerOther);
    }
  }
  
  if (subView === 'edit-profile') {
    return (
      <div className="screen-container gap-3">
        <button onClick={() => setSubView('main')} className="flex items-center gap-1.5 text-sm text-primary font-medium self-start">
          <ArrowLeft className="w-4 h-4" /> {t.review.backToSummary}
        </button>
        <PatientProfileScreen isEditMode onEditComplete={() => setSubView('main')} />
      </div>
    );
  }
  if (subView === 'edit-forms') {
    return (
      <div className="screen-container gap-3">
        <button onClick={() => setSubView('main')} className="flex items-center gap-1.5 text-sm text-primary font-medium self-start">
          <ArrowLeft className="w-4 h-4" /> {t.review.backToSummary}
        </button>
        <FormsScreen />
      </div>
    );
  }

  return (
    <div className="screen-container gap-3 justify-between">
      <h1 className="text-lg font-bold text-foreground flex-shrink-0">
        {isIntakeFlow ? t.review.reviewSubmit : t.review.summary}
      </h1>
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
        <div className="compact-card space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{t.review.patientProfile}</h3>
            </div>
            {!isIntakeFlow && (
              <button onClick={() => setSubView('edit-profile')} className="p-1.5 rounded-lg hover:bg-muted active:scale-95 transition-all">
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          {patientProfile ? (
            <div className="text-xs text-muted-foreground space-y-1">
              <p><span className="text-foreground font-medium">{t.review.name}:</span> {patientProfile.firstName} {patientProfile.lastName}</p>
              <p><span className="text-foreground font-medium">{t.review.sex}:</span> {patientProfile.sexAtBirth}</p>
              <p><span className="text-foreground font-medium">{t.review.complaintsLabel}:</span> {patientProfile.chiefComplaints.join(', ')}</p>
              {pmhItems.length > 0 && (
                <p><span className="text-foreground font-medium">{t.review.medicalHx}:</span> {pmhItems.join(', ')}</p>
              )}
              {patientProfile.pastSurgicalHistory && (patientProfile.pastSurgicalHistory.urologic?.length || 0) + (patientProfile.pastSurgicalHistory.general?.length || 0) > 0 && (
                <p><span className="text-foreground font-medium">{t.review.surgicalHx}:</span> {[
                  ...(patientProfile.pastSurgicalHistory.urologic || []),
                  ...(patientProfile.pastSurgicalHistory.general || []),
                ].map(e => e.year ? `${e.name} (${e.year})` : e.name).join(', ')}</p>
              )}
              {patientProfile.allergies?.noKnownAllergies && (
                <p><span className="text-foreground font-medium">{t.review.allergiesLabel}:</span> {t.review.nkda}</p>
              )}
              {(patientProfile.allergies?.entries?.length || 0) > 0 && (
                <p><span className="text-foreground font-medium">{t.review.allergiesLabel}:</span> {patientProfile.allergies.entries.map(a => a.allergen).join(', ')}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">{t.review.notCompleted}</p>
          )}
        </div>
        
        <div className="compact-card space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <h3 className="text-sm font-semibold text-foreground">{t.review.consents}</h3>
          </div>
          {consents ? (
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{t.review.clinicalData}: {consents.clinicalData ? `✅ ${t.review.accepted}` : `❌ ${t.review.declined}`}</p>
              <p>{t.review.research}: {consents.researchData ? `✅ ${t.review.accepted}` : `❌ ${t.review.declined}`}</p>
              <p>{t.review.communication}: {consents.communication ? `✅ ${t.review.accepted}` : `❌ ${t.review.declined}`}</p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">{t.review.notCompleted}</p>
          )}
        </div>
        
        <div className="compact-card space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-secondary" />
              <h3 className="text-sm font-semibold text-foreground">{t.review.questionnairesTitle}</h3>
            </div>
            {!isIntakeFlow && (
              <button onClick={() => setSubView('edit-forms')} className="p-1.5 rounded-lg hover:bg-muted active:scale-95 transition-all">
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            {ipssResults.length > 0 && <p>IPSS: {t.forms.score} {ipssResults[ipssResults.length - 1].totalScore}/35</p>}
            {oabqResults.length > 0 && <p>OAB-q: Symptom {oabqResults[oabqResults.length - 1].symptomScore}/30</p>}
            {iciqUiResults.length > 0 && <p>ICIQ-UI: {t.forms.score} {iciqUiResults[iciqUiResults.length - 1].totalScore}/21</p>}
            {ipssResults.length === 0 && oabqResults.length === 0 && iciqUiResults.length === 0 && (
              <p>{t.review.noQuestionnaires}</p>
            )}
          </div>
        </div>
        
        <div className="compact-card space-y-2">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">{t.review.diaryData}</h3>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>{intakeEntries.length} {t.review.intakeEntries}</p>
            <p>{voidingEntries.length} {t.review.voidingEntries}</p>
            <p>{leakageEntries.length} {t.review.leakageEntries}</p>
          </div>
        </div>
      </div>
      
      {isIntakeFlow && (
        <button onClick={handleSubmit}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base active:scale-[0.98] transition-transform flex-shrink-0">
          {t.review.approveSubmit}
        </button>
      )}
    </div>
  );
}
