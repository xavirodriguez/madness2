import React from 'react';
import { ActiveSection } from '../types';
import {
  Layers,
  Sparkles,
  Sliders,
  UserCheck,
  Flame,
  Radio,
  Gamepad2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  avatarCount: number;
  activeRuleCount: number;
  unlockedCount: number;
  onOpenLivePreview?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  avatarCount,
  activeRuleCount,
  unlockedCount,
  onOpenLivePreview,
}) => {
  const navItems = [
    {
      id: 'catalog' as ActiveSection,
      label: 'Catálogo Maestro',
      subtitle: 'Inventario global & estados',
      icon: Layers,
      count: avatarCount,
      badgeColor: 'text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/30',
    },
    {
      id: 'editor' as ActiveSection,
      label: 'Editor de Avatar',
      subtitle: 'Carga S3/CDN & Guardarraíl',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'rules' as ActiveSection,
      label: 'Motor de Reglas',
      subtitle: 'Triggers LiveOps & Probabilidad',
      icon: Sliders,
      count: activeRuleCount,
      badgeColor: 'text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/30',
    },
    {
      id: 'support' as ActiveSection,
      label: 'Soporte al Jugador',
      subtitle: 'Inventarios & Admin Gifts',
      icon: UserCheck,
      count: unlockedCount,
      badgeColor: 'text-[#FF007F] bg-[#FF007F]/10 border-[#FF007F]/30',
    },
  ];

  return (
    <aside className="w-72 bg-[#07011E] border-r border-[#2E146D] flex flex-col h-screen shrink-0 relative select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#2E146D] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] via-[#D900FF] to-[#39FF14] p-0.5 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            <div className="w-full h-full bg-[#07011E] rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-[#00E5FF]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-widest text-white uppercase font-rajdhani">
                LIVEOPS
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FF007F]/20 text-[#FF007F] border border-[#FF007F]/40">
                PROD
              </span>
            </div>
            <p className="text-[11px] text-purple-300/60 font-medium">Avatar Engine Backoffice</p>
          </div>
        </div>

        {/* Live system pulse */}
        <div className="flex items-center gap-1.5" title="Sistema LiveOps Online">
          <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_8px_#39FF14]" />
        </div>
      </div>

      {/* Quick LiveOps HUD Status */}
      <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-[#16083D]/90 border border-[#2E146D] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-[#00E5FF] animate-spin" />
          <span className="text-xs font-semibold text-slate-300">Live Engine</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-purple-300/80">Reglas Activas:</span>
          <span className="text-xs font-bold text-[#39FF14]">{activeRuleCount}</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="px-3 py-2 flex-1 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-purple-300/50 uppercase">
          Módulos Principales
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full text-left group px-3.5 py-3 rounded-xl transition-all duration-200 flex items-center justify-between relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-[#00E5FF]/20 via-[#C800FF]/15 to-[#07011E] border-2 border-[#00E5FF] shadow-[0_0_16px_rgba(0,229,255,0.35)]'
                  : 'bg-[#16083D]/40 border border-transparent hover:border-[#2E146D] hover:bg-[#16083D] text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Left active glow bar */}
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#00E5FF] to-[#D900FF] shadow-[0_0_10px_#00E5FF]" />
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                      : 'bg-[#2B0E68] text-purple-300 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div
                    className={`text-sm font-bold tracking-wide ${
                      isActive ? 'text-white drop-shadow-[0_1px_4px_rgba(0,229,255,0.5)]' : 'text-slate-300'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[11px] text-purple-300/60">{item.subtitle}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.count !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono-code font-bold border ${
                      isActive
                        ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/50'
                        : item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-[#00E5FF] translate-x-0.5' : 'text-purple-400/40 group-hover:text-purple-300'
                  }`}
                />
              </div>
            </button>
          );
        })}

        {/* Live In-game Simulator Launcher */}
        {onOpenLivePreview && (
          <div className="pt-4">
            <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-purple-300/50 uppercase">
              Simulador HUD
            </div>
            <button
              onClick={onOpenLivePreview}
              className="w-full mt-1 p-3 rounded-xl bg-gradient-to-r from-[#FF007F]/20 via-[#1A0948] to-[#FFDE59]/10 border border-[#FF007F]/50 hover:border-[#FF007F] group transition-all text-left flex items-center justify-between shadow-[0_0_14px_rgba(255,0,127,0.2)]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FF007F]/20 flex items-center justify-center text-[#FF007F] group-hover:scale-105 transition-transform">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Showcase En Juego
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FFDF00] text-black font-extrabold">
                      9:16 HUD
                    </span>
                  </div>
                  <div className="text-[10px] text-[#FFDE59]/80">Pantalla de Recompensa</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#FF007F] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* User / Session Info Footer */}
      <div className="p-4 border-t border-[#2E146D] bg-[#050014]/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Admin Avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.5)]"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#39FF14] ring-2 ring-[#07011E]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">Elena Vance</div>
            <div className="text-[10px] text-purple-300/70 truncate flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-[#FFDF00]" />
              Lead LiveOps Engineer
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
