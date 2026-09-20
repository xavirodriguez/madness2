import React from 'react';
import { AvatarRarity, AvatarStatus, UnlockedVia, RuleValidity } from '../types';
import { Sparkles, Shield, Clock, Gift, Dices, Award } from 'lucide-react';

interface RarityBadgeProps {
  rarity: AvatarRarity;
  size?: 'sm' | 'md' | 'lg';
  showStars?: boolean;
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({ rarity, size = 'md', showStars = false }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-widest',
    lg: 'text-sm px-3.5 py-1.5 tracking-widest font-extrabold',
  };

  switch (rarity) {
    case 'LEGENDARY':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-md bg-[#FFDF00]/15 text-[#FFDF00] border border-[#7A4B00] shadow-[0_0_10px_rgba(255,223,0,0.35)] ${sizeClasses[size]} whitespace-nowrap`}
        >
          {showStars ? (
            <>★ LEGENDARY ★</>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-[#FFDF00]" />
              LEGENDARY
            </>
          )}
        </span>
      );
    case 'EPIC':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-md bg-purple-600/20 text-purple-300 border border-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.3)] ${sizeClasses[size]} whitespace-nowrap`}
        >
          <Award className="w-3 h-3 text-purple-400" />
          EPIC
        </span>
      );
    case 'RARE':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-md bg-blue-600/20 text-blue-300 border border-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.3)] ${sizeClasses[size]} whitespace-nowrap`}
        >
          <Shield className="w-3 h-3 text-blue-400" />
          RARE
        </span>
      );
    case 'COMMON':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-md bg-slate-500/20 text-slate-300 border border-slate-500 ${sizeClasses[size]} whitespace-nowrap`}
        >
          COMMON
        </span>
      );
  }
};

interface StatusBadgeProps {
  status: AvatarStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5';

  switch (status) {
    case 'ACTIVE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)] ${sizeClasses} whitespace-nowrap`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
          ACTIVE
        </span>
      );
    case 'DRAFT':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 ${sizeClasses} whitespace-nowrap`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          DRAFT
        </span>
      );
    case 'ARCHIVED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40 ${sizeClasses} whitespace-nowrap`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          ARCHIVED
        </span>
      );
  }
};

export const UnlockedViaBadge: React.FC<{ via: UnlockedVia }> = ({ via }) => {
  switch (via) {
    case 'SPIN_REWARD':
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 font-bold rounded-md bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.25)] whitespace-nowrap">
          <Dices className="w-3.5 h-3.5" />
          SPIN_REWARD
        </span>
      );
    case 'ADMIN_GIFT':
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 font-bold rounded-md bg-[#FF007F]/15 text-[#FF70BA] border border-[#FF007F]/40 shadow-[0_0_8px_rgba(255,0,127,0.25)] whitespace-nowrap">
          <Gift className="w-3.5 h-3.5" />
          ADMIN_GIFT
        </span>
      );
    case 'DEFAULT':
    default:
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 font-medium rounded-md bg-slate-700/40 text-slate-300 border border-slate-600/50 whitespace-nowrap">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          DEFAULT
        </span>
      );
  }
};

export const RuleValidityBadge: React.FC<{ validity: RuleValidity; isActive: boolean }> = ({
  validity,
  isActive,
}) => {
  if (!isActive) {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[#402B6D]/60 text-purple-300/70 border border-[#402B6D]">
        Inactive
      </span>
    );
  }

  switch (validity) {
    case 'Active':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_6px_rgba(16,185,129,0.3)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Active
        </span>
      );
    case 'Scheduled':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 font-semibold rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40">
          <Clock className="w-3 h-3 text-amber-400" />
          Scheduled
        </span>
      );
    case 'Expired':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 font-semibold rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40">
          Expired
        </span>
      );
  }
};
