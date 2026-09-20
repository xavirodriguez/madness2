import React, { useState, useEffect } from 'react';
import { ActiveSection } from '../types';
import { Clock, Wifi, Bell, ShieldCheck, Terminal, Menu } from 'lucide-react';

interface HeaderProps {
  activeSection: ActiveSection;
  onOpenTerminalLogs?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onOpenTerminalLogs,
  onToggleSidebar,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const sectionTitles: Record<ActiveSection, { title: string; desc: string }> = {
    catalog: {
      title: 'Master Avatar Catalog',
      desc: 'Centralized management of game assets, i18n metadata, rarities, and status states.',
    },
    editor: {
      title: 'Avatar Editor & S3/CDN Ingestion',
      desc: 'Graphical asset uploading, slug validation, and LiveOps guardrail protection.',
    },
    rules: {
      title: 'LiveOps Rules Engine',
      desc: 'Unlock algorithm configuration, bet/win triggers, and probability rates.',
    },
    support: {
      title: 'Player Support & Inventory Granting',
      desc: 'Avatar inspection by player UUID and administrative assignment with audit ticketing.',
    },
  };

  const current = sectionTitles[activeSection];

  return (
    <header className="min-h-[64px] bg-[#07011E]/95 backdrop-blur-md border-b border-[#2E146D] px-4 sm:px-6 py-2.5 flex items-center justify-between z-10 select-none shrink-0 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile / Tablet Hamburger Toggle */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-[#16083D] text-[#00E5FF] hover:bg-[#2B0E68] border border-[#2E146D] transition-colors shrink-0"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-black tracking-wide text-white font-rajdhani uppercase truncate">
              {current.title}
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#2B0E68] text-purple-300 border border-[#8A57D8]/40 shrink-0">
              LiveOps
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-purple-300/60 truncate hidden sm:block">
            {current.desc}
          </p>
        </div>
      </div>

      {/* Right system HUD bar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* UTC Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#16083D] border border-[#2E146D] text-[11px] font-mono-code text-purple-200">
          <Clock className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
          <span className="truncate">{utcTime || '2026-09-17 04:00:00 UTC'}</span>
        </div>

        {/* Server & DB Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#16083D] border border-[#2E146D] text-[11px] font-semibold text-slate-300">
          <Wifi className="w-3.5 h-3.5 text-[#39FF14] shrink-0" />
          <span>EU-West (18ms)</span>
        </div>

        {/* Audit status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#16083D] border border-[#2E146D] text-[11px] text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FFDF00] shrink-0" />
          <span className="hidden sm:inline">RBAC:</span>
          <span className="text-emerald-400 font-bold">Enforced</span>
        </div>

        {/* Quick action: terminal logs */}
        {onOpenTerminalLogs && (
          <button
            onClick={onOpenTerminalLogs}
            className="p-1.5 sm:p-2 rounded-lg bg-[#2B0E68] text-purple-300 hover:text-white hover:bg-[#3D1E6D] border border-[#8A57D8]/40 transition-colors"
            title="Audit Console"
          >
            <Terminal className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
