import { DailySummaryCard } from '@/components/home/DailySummaryCard';
import { QuickIntakeSection } from '@/components/home/QuickIntakeSection';

export function HomeScreen() {
  return (
    <div className="screen-container gap-6 p-4">
      <DailySummaryCard />
      <QuickIntakeSection />
    </div>
  );
}
