import { useState } from 'react';
import { X, Droplet, Coffee, CupSoda, Citrus, Beer, GlassWater } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useTranslation } from '@/i18n';
import { VOLUME_PRESETS, type BeverageType, type LeakageSize, type LeakageType, type RecordTab } from '@/types';
import type { DailySymptomCheck } from '@/types';
import { toast } from 'sonner';

export function RecordModal() {
  const { isRecordOpen, setRecordOpen, recordTab, setRecordTab, addIntakeEntry, addVoidingEntry, addLeakageEntry, addDailySymptomCheck } = useAppStore();
  const t = useTranslation();
  
  const beverages: { type: BeverageType; icon: typeof Droplet; label: string }[] = [
    { type: 'water', icon: Droplet, label: t.beverages.water },
    { type: 'caffeine', icon: Coffee, label: t.beverages.caffeine },
    { type: 'soda', icon: CupSoda, label: t.beverages.soda },
    { type: 'juice', icon: Citrus, label: t.beverages.juice },
    { type: 'alcohol', icon: Beer, label: t.beverages.alcohol },
    { type: 'other', icon: GlassWater, label: t.beverages.other },
  ];

  const tabLabels: Record<RecordTab, string> = {
    intake: t.record.intake,
    voiding: t.record.voiding,
    leakage: t.record.leakage,
    symptoms: t.record.symptoms,
  };
  
  const [selectedBeverage, setSelectedBeverage] = useState<BeverageType | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<number>(240);
  const [customVolume, setCustomVolume] = useState('');
  const [intakeMemo, setIntakeMemo] = useState('');
  const [voidVolume, setVoidVolume] = useState('');
  const [urgeScale, setUrgeScale] = useState<0 | 1 | 2 | 3 | 4>(2);
  const [isSleep, setIsSleep] = useState(false);
  const [hasLeak, setHasLeak] = useState(false);
  const [voidMemo, setVoidMemo] = useState('');
  const [leakageSize, setLeakageSize] = useState<LeakageSize>('small');
  const [leakageActivity, setLeakageActivity] = useState('');
  const [leakageType, setLeakageType] = useState<LeakageType>('unknown');
  const [padUsed, setPadUsed] = useState(false);
  const [leakageMemo, setLeakageMemo] = useState('');
  const [symptoms, setSymptoms] = useState({
    dysuria: false, pain: false, hematuria: false, fever: false,
    padUse: 'none' as 'none' | '1-2' | '3+',
  });
  
  if (!isRecordOpen) return null;
  
  const resetForm = () => {
    setSelectedBeverage(null); setSelectedVolume(240); setCustomVolume(''); setIntakeMemo('');
    setVoidVolume(''); setUrgeScale(2); setIsSleep(false); setHasLeak(false); setVoidMemo('');
    setLeakageSize('small'); setLeakageActivity(''); setLeakageType('unknown'); setPadUsed(false); setLeakageMemo('');
    setSymptoms({ dysuria: false, pain: false, hematuria: false, fever: false, padUse: 'none' });
  };
  
  const handleSave = () => {
    if (recordTab === 'intake') {
      if (!selectedBeverage) { toast.error(t.record.selectBeverage); return; }
      const volume = customVolume ? parseInt(customVolume) : selectedVolume;
      addIntakeEntry({ type: selectedBeverage, volume, memo: intakeMemo || undefined });
      toast.success(`${t.home.added} ${volume}mL ${t.beverages[selectedBeverage]} ${t.record.intakeSaved}`);
    } else if (recordTab === 'voiding') {
      if (!voidVolume) { toast.error(t.record.pleaseEnterVolume); return; }
      addVoidingEntry({ volume: parseInt(voidVolume), urgeScale, isSleep, hasLeak, memo: voidMemo || undefined });
      toast.success(t.record.voidingSaved);
    } else if (recordTab === 'leakage') {
      addLeakageEntry({ size: leakageSize, activity: leakageActivity, type: leakageType, padUsed, memo: leakageMemo || undefined });
      toast.success(t.record.leakageSaved);
    } else if (recordTab === 'symptoms') {
      const check: DailySymptomCheck = { date: new Date(), ...symptoms };
      addDailySymptomCheck(check);
      toast.success(t.record.symptomsSaved);
    }
    resetForm();
    setRecordOpen(false);
  };

  const urgeLabels: Record<number, string> = t.urgeScale;

  const leakageSizeLabels: Record<LeakageSize, string> = {
    drops: t.record.drops, small: t.record.small, large: t.record.large,
  };

  const leakageTypeLabels: Record<LeakageType, string> = {
    stress: t.record.stress, urge: t.record.urge, mixed: t.record.mixed, unknown: t.record.unknown,
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-x-0 bottom-0 max-w-md mx-auto rounded-t-3xl shadow-2xl animate-slide-up max-h-[80vh] overflow-hidden flex flex-col border border-white/40 border-b-0" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/30 flex-shrink-0">
          <h2 className="text-base font-semibold text-foreground">{t.record.title}</h2>
          <button onClick={() => { resetForm(); setRecordOpen(false); }} className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="flex border-b border-border flex-shrink-0">
          {(['intake', 'voiding', 'leakage', 'symptoms'] as RecordTab[]).map((tab) => (
            <button key={tab} onClick={() => setRecordTab(tab)}
              className={`tab-btn py-2 text-xs ${recordTab === tab ? 'active' : ''}`}>
              {tabLabels[tab]}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          {recordTab === 'intake' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t.record.beverageType}</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {beverages.map((bev) => {
                    const Icon = bev.icon;
                    const isSelected = selectedBeverage === bev.type;
                    return (
                      <button key={bev.type} onClick={() => setSelectedBeverage(bev.type)}
                        className={`compact-btn ${isSelected ? 'border-primary bg-primary/5' : ''}`}>
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-[10px] font-medium">{bev.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t.record.volume}</label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {Object.entries(VOLUME_PRESETS).map(([size, vol]) => (
                    <button key={size} onClick={() => { setSelectedVolume(vol); setCustomVolume(''); }}
                      className={`compact-btn py-2 ${selectedVolume === vol && !customVolume ? 'border-primary bg-primary/10' : ''}`}>
                      <span className="text-sm font-semibold">{vol}</span>
                      <span className="text-[9px] text-muted-foreground">mL</span>
                    </button>
                  ))}
                </div>
                <input type="number" placeholder={t.record.customVolume} value={customVolume} onChange={(e) => setCustomVolume(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t.record.memo}</label>
                <textarea placeholder={t.record.addNotes} value={intakeMemo} onChange={(e) => setIntakeMemo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-14 text-sm" />
              </div>
            </div>
          )}
          
          {recordTab === 'voiding' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t.record.volumeMl}</label>
                <input type="number" placeholder={t.record.enterVolume} value={voidVolume} onChange={(e) => setVoidVolume(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t.record.urgency}</label>
                <div className="flex gap-1.5">
                  {([0, 1, 2, 3, 4] as const).map((scale) => (
                    <button key={scale} onClick={() => setUrgeScale(scale)}
                      className={`flex-1 py-2 rounded-lg border-2 font-semibold text-sm transition-all ${
                        urgeScale === scale ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary/50'
                      }`}>
                      {scale}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 text-center">{urgeLabels[urgeScale]}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsSleep(!isSleep)}
                  className={`flex-1 p-2 rounded-lg border-2 text-xs font-medium transition-all ${isSleep ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border'}`}>
                  {t.record.duringSleep}
                </button>
                <button onClick={() => setHasLeak(!hasLeak)}
                  className={`flex-1 p-2 rounded-lg border-2 text-xs font-medium transition-all ${hasLeak ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border'}`}>
                  {t.record.hadLeakage}
                </button>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t.record.memo}</label>
                <textarea placeholder={t.record.addNotes} value={voidMemo} onChange={(e) => setVoidMemo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-14 text-sm" />
              </div>
            </div>
          )}
          
          {recordTab === 'leakage' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t.record.leakageSize}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['drops', 'small', 'large'] as LeakageSize[]).map((size) => (
                    <button key={size} onClick={() => setLeakageSize(size)}
                      className={`compact-btn py-3 ${leakageSize === size ? 'border-primary bg-primary/10' : ''}`}>
                      <span className="text-xl">{size === 'drops' ? '💧' : size === 'small' ? '💧💧' : '💧💧💧'}</span>
                      <span className="text-xs font-medium">{leakageSizeLabels[size]}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t.record.leakageType}</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['stress', 'urge', 'mixed', 'unknown'] as LeakageType[]).map((type) => (
                    <button key={type} onClick={() => setLeakageType(type)}
                      className={`compact-btn py-2 ${leakageType === type ? 'border-primary bg-primary/10' : ''}`}>
                      <span className="text-xs font-medium">{leakageTypeLabels[type]}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t.record.activity}</label>
                <input placeholder={t.record.activityPlaceholder} value={leakageActivity} onChange={(e) => setLeakageActivity(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" />
              </div>
              <button onClick={() => setPadUsed(!padUsed)}
                className={`w-full p-2 rounded-lg border-2 text-xs font-medium transition-all ${padUsed ? 'border-primary bg-primary/10 text-primary' : 'border-border'}`}>
                {t.record.padUsed}: {padUsed ? t.record.yes : t.record.no}
              </button>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t.record.memo}</label>
                <textarea placeholder={t.record.describeSituation} value={leakageMemo} onChange={(e) => setLeakageMemo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-14 text-sm" />
              </div>
            </div>
          )}
          
          {recordTab === 'symptoms' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t.record.symptomsToday}</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { key: 'dysuria', label: t.record.painfulUrination },
                    { key: 'pain', label: t.record.pelvicPain },
                    { key: 'hematuria', label: t.record.bloodInUrine },
                    { key: 'fever', label: t.record.fever },
                  ].map(({ key, label }) => (
                    <button key={key} onClick={() => setSymptoms(s => ({ ...s, [key]: !s[key as keyof typeof s] }))}
                      className={`compact-btn py-3 text-left ${symptoms[key as keyof typeof symptoms] ? 'border-destructive bg-destructive/10' : ''}`}>
                      <span className="text-xs font-medium text-foreground">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">{t.record.padUseToday}</label>
                <div className="flex gap-1.5">
                  {(['none', '1-2', '3+'] as const).map((val) => (
                    <button key={val} onClick={() => setSymptoms(s => ({ ...s, padUse: val }))}
                      className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        symptoms.padUse === val ? 'border-primary bg-primary/10 text-primary' : 'border-border'
                      }`}>
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-border flex-shrink-0">
          <button onClick={handleSave}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base active:scale-[0.98] transition-transform">
            {t.record.saveEntry}
          </button>
        </div>
      </div>
    </div>
  );
}
