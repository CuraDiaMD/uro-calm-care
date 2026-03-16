import { Droplet, Coffee, CupSoda, Citrus, Beer, GlassWater } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { useState } from 'react';
import { VOLUME_PRESETS, type BeverageType } from '@/types';
import { toast } from 'sonner';

const beverages: { type: BeverageType; icon: typeof Droplet; label: string }[] = [
  { type: 'water', icon: Droplet, label: 'Water' },
  { type: 'caffeine', icon: Coffee, label: 'Caffeine' },
  { type: 'soda', icon: CupSoda, label: 'Soda' },
  { type: 'juice', icon: Citrus, label: 'Juice' },
  { type: 'alcohol', icon: Beer, label: 'Alcohol' },
  { type: 'other', icon: GlassWater, label: 'Other' },
];

export function QuickIntakeSection() {
  const [selectedBeverage, setSelectedBeverage] = useState<BeverageType | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<keyof typeof VOLUME_PRESETS | null>(null);
  const addIntakeEntry = useAppStore((state) => state.addIntakeEntry);
  const getTodaySummary = useAppStore((state) => state.getTodaySummary);
  const summary = getTodaySummary();
  
  const handleBeverageClick = (type: BeverageType) => {
    setSelectedBeverage(type);
  };
  
  const handleVolumeClick = (size: keyof typeof VOLUME_PRESETS) => {
    if (!selectedBeverage) {
      toast.error('Please select a beverage type first');
      return;
    }
    
    addIntakeEntry({
      type: selectedBeverage,
      volume: VOLUME_PRESETS[size],
    });
    
    toast.success(`Added ${VOLUME_PRESETS[size]}mL ${selectedBeverage}`);
    setSelectedBeverage(null);
    setSelectedVolume(null);
  };
  
  return (
    <div className="compact-card flex-[6] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Quick Intake</h2>
          <p className="text-sm text-muted-foreground">Tap to add</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{summary.totalIntake}</p>
          <p className="text-sm text-muted-foreground">mL Today</p>
        </div>
      </div>
      
      {/* Beverage Grid - 3 columns for larger buttons */}
      <div className="grid grid-cols-3 gap-3 flex-1 content-start">
        {beverages.map((bev) => {
          const Icon = bev.icon;
          const isSelected = selectedBeverage === bev.type;
          
          return (
            <button
              key={bev.type}
              onClick={() => handleBeverageClick(bev.type)}
              className={`compact-btn py-4 ${isSelected ? 'border-primary bg-primary/10' : ''}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-foreground">{bev.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Volume Selection */}
      {selectedBeverage && (
        <div className="animate-fade-in mt-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Select volume:</p>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => handleVolumeClick('small')} className="compact-btn py-3">
              <span className="text-lg font-semibold text-foreground">240</span>
              <span className="text-sm text-muted-foreground">mL</span>
            </button>
            <button onClick={() => handleVolumeClick('medium')} className="compact-btn py-3">
              <span className="text-lg font-semibold text-foreground">360</span>
              <span className="text-sm text-muted-foreground">mL</span>
            </button>
            <button onClick={() => handleVolumeClick('large')} className="compact-btn py-3">
              <span className="text-lg font-semibold text-foreground">480</span>
              <span className="text-sm text-muted-foreground">mL</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
