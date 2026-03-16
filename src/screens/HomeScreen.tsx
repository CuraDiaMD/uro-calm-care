import { DailySummaryCard } from '@/components/home/DailySummaryCard';
import { QuickIntakeSection } from '@/components/home/QuickIntakeSection';
import { DiaryStatusCard } from '@/components/home/DiaryStatusCard';

export function HomeScreen() {
  return (
    <div className="screen-container gap-4 p-4">
      <DiaryStatusCard />
      <DailySummaryCard />
      <QuickIntakeSection />
    </div>
  );
}
