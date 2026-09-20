import React, { useState } from 'react';
import { Avatar } from '../types';
import { RarityBadge } from './Badges';
import {
  X,
  Sparkles,
  Coins,
  Gem,
  Zap,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';

interface GamePreviewModalProps {
  avatar: Avatar;
  onClose: () => void;
}

export const GamePreviewModal: React.FC<GamePreviewModalProps> = ({ avatar, onClose }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [progressPct, setProgressPct] = useState(84);

  return (
    <div className="fixed inset-0 bg-[#050014]/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      {/* Container with mobile 9:16 simulator frame */}
      <div className="relative max-w-sm w-full bg-[#07011E] rounded-[36px] border-4 border-[#2E146D] shadow-[0_0_60px_rgba(0,229,255,0.35)] overflow-hidden flex flex-col h-[740px] max-h-[90vh] select-none">
        {/* Top phone notch & close control */}
        <div className="absolute top-3 left-0 right-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-purple-300/80 bg-[#050014]/80 px-2 py-0.5 rounded-full border border-[#2E146D]">
            <Smartphone className="w-3 h-3 text-[#00E5FF]" />
            LIVE SIMULATOR 9:16
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#050014]/80 hover:bg-[#2B0E68] text-white flex items-center justify-center border border-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-[#00E5FF]/20 via-[#D900FF]/25 to-transparent blur-3xl" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#39FF14]/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        {/* HUD Top Bar: Fixed Currency Balance */}
        <div className="pt-10 px-6 flex items-center justify-between z-20">
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-purple-300 font-rajdhani">
            SEASON 4 REWARDS
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#16083D]/90 border border-[#2E146D] px-2 py-1 rounded-full shadow-[0_0_8px_rgba(255,223,0,0.2)]">
              <Coins className="w-3.5 h-3.5 text-[#FFDE59]" />
              <span className="text-xs font-black font-mono-code text-[#FFDE59]">14.5M</span>
            </div>
            <div className="flex items-center gap-1 bg-[#16083D]/90 border border-[#2E146D] px-2 py-1 rounded-full shadow-[0_0_8px_rgba(0,229,255,0.2)]">
              <Gem className="w-3 h-3 text-[#00E5FF]" />
              <span className="text-xs font-black font-mono-code text-[#00E5FF]">4,850</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-between px-6 py-4 z-20 overflow-y-auto">
          {/* Collection Progression Header */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black italic tracking-wide text-white uppercase font-rajdhani drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              AVATAR COLLECTION
            </h2>
            <div className="flex items-center justify-between text-[10px] font-bold text-purple-300/80 uppercase px-1">
              <span>SEASON PROGRESS</span>
              <span className="text-[#00E5FF] font-mono-code">18 / 24 UNLOCKED</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#0A031F] overflow-hidden border border-[#2E146D] p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00D2FF] to-[#D900FF] shadow-[0_0_8px_#00d2ff]"
                style={{ width: '75%' }}
              />
            </div>
          </div>

          {/* Showcase Frame */}
          <div className="relative my-auto flex flex-col items-center justify-center">
            <div className="absolute w-52 h-52 rounded-full bg-gradient-to-r from-white/30 via-[#FFDF00]/30 to-[#D900FF]/30 blur-2xl pointer-events-none animate-pulse" />

            {/* Holographic Circular Frame */}
            <div className="relative w-44 h-44 rounded-full p-1 bg-gradient-to-tr from-[#00E5FF] via-[#FFDF00] to-[#FF007F] shadow-[0_0_30px_rgba(0,229,255,0.6)]">
              <div className="w-full h-full rounded-full bg-[#07011E] overflow-hidden relative border-2 border-white/40">
                <img
                  src={avatar.asset_url}
                  alt={avatar.slug}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 rounded-full pointer-events-none shadow-[inset_0_0_20px_rgba(0,229,255,0.6),inset_0_0_15px_rgba(255,0,127,0.5)]" />
              </div>

              <div className="absolute -inset-2 rounded-full border border-dashed border-[#00E5FF]/60 animate-spin [animation-duration:20s] pointer-events-none" />
            </div>

            <div className="mt-4">
              <RarityBadge rarity={avatar.rarity} size="lg" showStars={true} />
            </div>

            <h3 className="text-xl font-black text-white uppercase font-rajdhani tracking-wider mt-1 text-center">
              {avatar.name_display}
            </h3>
            <p className="text-[11px] text-purple-300/70 text-center max-w-xs px-2 line-clamp-2 mt-0.5">
              {avatar.description}
            </p>
          </div>

          {/* Unlock Requirement Card */}
          <div className="bg-[#1A0952]/90 backdrop-blur-md rounded-2xl p-3.5 border border-[#00E5FF]/60 shadow-[0_0_20px_rgba(0,229,255,0.2)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider font-rajdhani">
                <Zap className="w-3.5 h-3.5 text-[#39FF14]" />
                Supreme Spin LiveOps
              </span>
              <span className="text-[10px] font-bold text-[#FFDE59] font-mono-code">
                BET $1,000,000
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono-code font-bold">
                <span className="text-purple-300/80">EVENT PROGRESS</span>
                <span className="text-[#39FF14]">{progressPct}% COMPLETED</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0A031F] overflow-hidden border border-[#2E146D]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00D2FF] to-[#D900FF] shadow-[0_0_8px_#00d2ff] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-2 pt-3">
            <button
              onClick={() => {
                setIsUnlocked(true);
                setProgressPct(100);
              }}
              className="w-full btn-cta-green py-3 px-6 rounded-full text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              {isUnlocked ? (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  AVATAR CLAIMED!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#032403]" />
                  CLAIM & EQUIP
                </>
              )}
            </button>

            <button
              onClick={() => alert('Simulation: Redirecting to premium gems store...')}
              className="w-full btn-cta-cyan-magenta py-2.5 px-5 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gem className="w-3.5 h-3.5" />
              INSTANT UNLOCK 💎 250
            </button>
          </div>
        </div>

        {/* Footer HUD info */}
        <div className="pb-3 text-center text-[9px] font-mono-code text-purple-300/40 border-t border-[#2E146D]/40 pt-1.5 z-20">
          PROD LIVEOPS ENGINE • V4.2 BUILD 9918
        </div>
      </div>
    </div>
  );
};
