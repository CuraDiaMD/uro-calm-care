import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { RecordModal } from '@/components/record/RecordModal';
import { HomeScreen } from '@/screens/HomeScreen';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { FormsScreen } from '@/screens/FormsScreen';
import { MagicLinkLandingScreen } from '@/screens/MagicLinkLandingScreen';
import { ConsentScreen } from '@/screens/ConsentScreen';
import { PatientProfileScreen } from '@/screens/PatientProfileScreen';
import { DiaryLandingScreen } from '@/screens/DiaryLandingScreen';
import { ReviewAndApproveScreen } from '@/screens/ReviewAndApproveScreen';
import { useAppStore } from '@/stores/appStore';

const Index = () => {
  const intakeStatus = useAppStore((state) => state.intakeStatus);
  const currentIntakeStep = useAppStore((state) => state.currentIntakeStep);
  const activeTab = useAppStore((state) => state.activeTab);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, currentIntakeStep]);
  
  // Not started — show landing
  if (intakeStatus === 'not-started') {
    return <MagicLinkLandingScreen />;
  }
  
  // In progress — show intake steps
  if (intakeStatus === 'in-progress') {
    const renderIntakeStep = () => {
      switch (currentIntakeStep) {
        case 0:
        case 1:
        case 2:
          return <ConsentScreen />;
        case 3:
          return <PatientProfileScreen />;
        case 4:
          return <FormsScreen isIntakeMode />;
        case 5:
          return <DiaryLandingScreen />;
        case 6:
          return <ReviewAndApproveScreen />;
        default:
          return <ConsentScreen />;
      }
    };
    
    return (
      <div className="app-container">
        <Header showBack showStepIndicator />
        <main className="main-content">
          {renderIntakeStep()}
        </main>
      </div>
    );
  }
  
  // Completed — tabbed interface
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'diary':
        return <CalendarScreen />;
      case 'forms':
        return <FormsScreen />;
      default:
        return <HomeScreen />;
    }
  };
  
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {renderScreen()}
      </main>
      <BottomNav />
      <RecordModal />
    </div>
  );
};

export default Index;
