import { Slider } from '@/components/ui/slider';

interface BotherSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function BotherSlider({ value, onChange }: BotherSliderProps) {
  return (
    <div className="mt-6 p-4 summary-card">
      <label className="block text-sm font-medium text-foreground mb-4">
        How much does this bother you?
      </label>
      <div className="px-2">
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={0}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Not at all (0)</span>
          <span className="text-primary font-semibold">{value}</span>
          <span>A great deal (10)</span>
        </div>
      </div>
    </div>
  );
}
