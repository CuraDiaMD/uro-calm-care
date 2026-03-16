import { useState } from 'react';
import { X, Droplet, Coffee, CupSoda, Citrus, Beer, GlassWater } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { VOLUME_PRESETS, URGE_SCALE_LABELS, type BeverageType, type LeakageSize, type LeakageType, type RecordTab } from '@/types';
import { toast } from 'sonner';

const beverages: { type: BeverageType; icon: typeof Droplet; label: string }[] = [
  { type: 'water', icon: Droplet, label: 'Water' },
  { type: 'caffeine', icon: Coffee, label: 'Caffeine' },
  { type: 'soda', icon: CupSoda, label: 'Soda' },
  { type: 'juice', icon: Citrus, label: 'Juice' },
  { type: 'alcohol', icon: Beer, label: 'Alcohol' },
  { type: 'other', icon: GlassWater, label: 'Other' },
];

export function RecordModal() {
  const { isRecordOpen, setRecordOpen, recordTab, setRecordTab, addIntakeEntry, addVoidingEntry, addLeakageEntry } = useAppStore();
  
  // Intake state
  const [selectedBeverage, setSelectedBeverage] = useState<BeverageType | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<number>(240);
  const [customVolume, setCustomVolume] = useState('');
  const [intakeMemo, setIntakeMemo] = useState('');
  
  // Voiding state
  const [voidVolume, setVoidVolume] = useState('');
  const [urgeScale, setUrgeScale] = useState<0 | 1 | 2 | 3 | 4>(2);
  const [isSleep, setIsSleep] = useState(false);
  const [hasLeak, setHasLeak] = useState(false);
  const [voidMemo, setVoidMemo] = useState('');
  
  // Leakage state
  const [leakageSize, setLeakageSize] = useState<LeakageSize>('small');
  const [leakageActivity, setLeakageActivity] = useState('');
  const [leakageType, setLeakageType] = useState<LeakageType>('unknown');
  const [padUsed, setPadUsed] = useState(false);
  const [leakageMemo, setLeakageMemo] = useState('');
  
  if (!isRecordOpen) return null;
  
  const resetForm = () => {
    setSelectedBeverage(null);
    setSelectedVolume(240);
    setCustomVolume('');
    setIntakeMemo('');
    setVoidVolume('');
    setUrgeScale(2);
    setIsSleep(false);
    setHasLeak(false);
    setVoidMemo('');
    setLeakageSize('small');
    setLeakageActivity('');
    setLeakageType('unknown');
    setPadUsed(false);
    setLeakageMemo('');
  };
  
  const handleSave = () => {
    if (recordTab === 'intake') {
      if (!selectedBeverage) {
        toast.error('Please select a beverage type');
        return;
      }
      const volume = customVolume ? parseInt(customVolume) : selectedVolume;
      addIntakeEntry({ type: selectedBeverage, volume, memo: intakeMemo || undefined });
      toast.success(`Added ${volume}mL ${selectedBeverage} intake`);
    } else if (recordTab === 'voiding') {
      if (!voidVolume) {
        toast.error('Please enter a volume');
        return;
      }
      addVoidingEntry({
        volume: parseInt(voidVolume),
        urgeScale,
        isSleep,
        hasLeak,
        memo: voidMemo || undefined,
      });
      toast.success('Voiding entry saved');
    } else {
      addLeakageEntry({
        size: leakageSize,
        activity: leakageActivity,
        type: leakageType,
        padUsed,
        memo: leakageMemo || undefined,
      });
      toast.success('Leakage entry saved');
    }
    
    resetForm();
    setRecordOpen(false);
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-x-0 bottom-0 max-w-md mx-auto rounded-t-3xl shadow-2xl animate-slide-up max-h-[80vh] overflow-hidden flex flex-col border border-white/40 border-b-0" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/30 flex-shrink-0">
          <h2 className="text-base font-semibold text-foreground">Record Entry</h2>
          <button
            onClick={() => { resetForm(); setRecordOpen(false); }}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-border flex-shrink-0">
          {(['intake', 'voiding', 'leakage'] as RecordTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setRecordTab(tab)}
              className={`tab-btn py-2 text-sm ${recordTab === tab ? 'active' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          {recordTab === 'intake' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Beverage Type</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {beverages.map((bev) => {
                    const Icon = bev.icon;
                    const isSelected = selectedBeverage === bev.type;
                    return (
                      <button
                        key={bev.type}
                        onClick={() => setSelectedBeverage(bev.type)}
                        className={`compact-btn ${isSelected ? 'border-primary bg-primary/5' : ''}`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-[10px] font-medium">{bev.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Volume</label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {Object.entries(VOLUME_PRESETS).map(([size, vol]) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedVolume(vol); setCustomVolume(''); }}
                      className={`compact-btn py-2 ${selectedVolume === vol && !customVolume ? 'border-primary bg-primary/10' : ''}`}
                    >
                      <span className="text-sm font-semibold">{vol}</span>
                      <span className="text-[9px] text-muted-foreground">mL</span>
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom volume (mL)"
                  value={customVolume}
                  onChange={(e) => setCustomVolume(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Memo (optional)</label>
                <textarea
                  placeholder="Add any notes..."
                  value={intakeMemo}
                  onChange={(e) => setIntakeMemo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-14 text-sm"
                />
              </div>
            </div>
          )}
          
          {recordTab === 'voiding' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Volume (mL)</label>
                <input
                  type="number"
                  placeholder="Enter volume"
                  value={voidVolume}
                  onChange={(e) => setVoidVolume(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Urgency (0-4)</label>
                <div className="flex gap-1.5">
                  {([0, 1, 2, 3, 4] as const).map((scale) => (
                    <button
                      key={scale}
                      onClick={() => setUrgeScale(scale)}
                      className={`flex-1 py-2 rounded-lg border-2 font-semibold text-sm transition-all ${
                        urgeScale === scale
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {scale}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 text-center">
                  {URGE_SCALE_LABELS[urgeScale]}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsSleep(!isSleep)}
                  className={`flex-1 p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                    isSleep ? 'border-secondary bg-secondary/10 text-secondary' : 'border-border'
                  }`}
                >
                  🌙 During Sleep
                </button>
                <button
                  onClick={() => setHasLeak(!hasLeak)}
                  className={`flex-1 p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                    hasLeak ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border'
                  }`}
                >
                  💧 Had Leakage
                </button>
              </div>
              
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Memo (optional)</label>
                <textarea
                  placeholder="Add any notes..."
                  value={voidMemo}
                  onChange={(e) => setVoidMemo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-14 text-sm"
                />
              </div>
            </div>
          )}
          
          {recordTab === 'leakage' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Leakage Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['drops', 'small', 'large'] as LeakageSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setLeakageSize(size)}
                      className={`compact-btn py-3 ${leakageSize === size ? 'border-primary bg-primary/10' : ''}`}
                    >
                      <span className="text-xl">
                        {size === 'drops' ? '💧' : size === 'small' ? '💧💧' : '💧💧💧'}
                      </span>
                      <span className="text-xs font-medium capitalize">{size}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Leakage Type</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['stress', 'urge', 'mixed', 'unknown'] as LeakageType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setLeakageType(type)}
                      className={`compact-btn py-2 capitalize ${leakageType === type ? 'border-primary bg-primary/10' : ''}`}
                    >
                      <span className="text-xs font-medium">{type}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Activity at time of leak</label>
                <input
                  placeholder="e.g., coughing, walking, laughing..."
                  value={leakageActivity}
                  onChange={(e) => setLeakageActivity(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                />
              </div>
              
              <button
                onClick={() => setPadUsed(!padUsed)}
                className={`w-full p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                  padUsed ? 'border-primary bg-primary/10 text-primary' : 'border-border'
                }`}
              >
                🩹 Pad Used: {padUsed ? 'Yes' : 'No'}
              </button>
              
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Memo (optional)</label>
                <textarea
                  placeholder="Describe the situation..."
                  value={leakageMemo}
                  onChange={(e) => setLeakageMemo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-14 text-sm"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Save Button */}
        <div className="p-3 border-t border-border flex-shrink-0">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base active:scale-[0.98] transition-transform"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}
