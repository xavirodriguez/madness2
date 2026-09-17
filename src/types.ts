export type AvatarRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export type AvatarStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export type TriggerType = 'BET_AMOUNT' | 'WIN_AMOUNT';

export type AccumulationMode = 'SINGLE_SPIN' | 'CUMULATIVE';

export type UnlockedVia = 'SPIN_REWARD' | 'ADMIN_GIFT' | 'DEFAULT';

export type RuleValidity = 'Vigente' | 'Expirada' | 'Programada';

export interface Avatar {
  id: string;
  slug: string;
  name_i18n_key: string; // Must start with AVATAR_NAME_
  name_display: string;
  rarity: AvatarRarity;
  status: AvatarStatus;
  asset_url: string;
  description: string;
  updated_at: string;
  created_at: string;
  tags?: string[];
  theme_color?: string;
}

export interface AvatarUnlockRule {
  id: string;
  avatar_id: string;
  trigger_type: TriggerType;
  threshold_value: number; // In cents or base units, formatted as currency e.g. $1,000,000
  accumulation_mode: AccumulationMode;
  drop_chance_pct: number; // e.g. 0.0500%
  start_date_utc: string; // ISO string YYYY-MM-DDTHH:mm:ssZ
  end_date_utc: string;
  is_active: boolean;
  name: string;
  created_at: string;
}

export interface Player {
  id: string; // UUID
  username: string;
  vip_tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  equipped_avatar_id: string;
  equipped_at: string;
  balance_soft: number;
  balance_gems: number;
  avatar_count: number;
}

export interface PlayerAvatar {
  id: string;
  player_id: string;
  avatar_id: string;
  unlocked_at: string;
  unlocked_via: UnlockedVia;
  applied_rule_id: string | null;
  admin_notes?: string;
}

export type ActiveSection = 'catalog' | 'editor' | 'rules' | 'support';
