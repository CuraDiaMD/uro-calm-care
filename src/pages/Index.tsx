import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { RecordModal } from '@/components/record/RecordModal';
import { HomeScreen } from '@/screens/HomeScreen';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { FormsScreen } from '@/screens/FormsScreen';
import { ChatScreen } from '@/screens/ChatScreen';
import { useAppStore } from '@/stores/appStore';

const Index = () => {
  const activeTab = useAppStore((state) => state.activeTab);
  
  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);
  
  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'forms':
        return <FormsScreen />;
      case 'chat':
        return <ChatScreen />;
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
