import { Home, Plus, ClipboardList } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import type { TabType } from '@/types';

const navItems: { id: TabType; icon: typeof Home; label: string }[] = [
  { id: 'diary', icon: Home, label: 'Home' },
  { id: 'record', icon: Plus, label: 'Record' },
  { id: 'summary', icon: ClipboardList, label: 'Summary' },
];

export function BottomNav() {
  const { activeTab, setActiveTab, setRecordOpen } = useAppStore();
  
  const handleNavClick = (id: TabType) => {
    if (id === 'record') {
      setRecordOpen(true);
    } else {
      setActiveTab(id);
    }
  };
  
  return (
    <nav className="bottom-nav border-t border-white/30 flex-shrink-0" style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="max-w-md mx-auto flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isRecord = item.id === 'record';
          const isActive = activeTab === item.id;
          
          if (isRecord) {
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="fab -mt-5 w-12 h-12"
                aria-label={item.label}
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
              </button>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
