import { Settings } from 'lucide-react';
import logo from '@/assets/curadia-logo.png';

export function Header() {
  return (
    <header className="border-b border-white/30 flex-shrink-0" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <img src={logo} alt="CuraDia" className="h-10 w-auto" />
        </div>
        <button
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
