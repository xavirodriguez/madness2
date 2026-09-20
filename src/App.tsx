import React, { useState, useMemo } from 'react';
import {
  ActiveSection,
  Avatar,
  AvatarUnlockRule,
  Player,
  PlayerAvatar,
} from './types';
import {
  INITIAL_AVATARS,
  INITIAL_RULES,
  INITIAL_PLAYERS,
  INITIAL_PLAYER_AVATARS,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CatalogModule } from './components/CatalogModule';
import { EditorModule } from './components/EditorModule';
import { RulesEngineModule } from './components/RulesEngineModule';
import { PlayerSupportModule } from './components/PlayerSupportModule';
import { GamePreviewModal } from './components/GamePreviewModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // Navigation State
  const [activeSection, setActiveSection] = useState<ActiveSection>('catalog');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Core Data Collections in simulated React state
  const [avatars, setAvatars] = useState<Avatar[]>(INITIAL_AVATARS);
  const [rules, setRules] = useState<AvatarUnlockRule[]>(INITIAL_RULES);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [playerAvatars, setPlayerAvatars] = useState<PlayerAvatar[]>(INITIAL_PLAYER_AVATARS);

  // Cross-module interaction states
  const [editingAvatar, setEditingAvatar] = useState<Avatar | null>(null);
  const [selectedAvatarIdForRules, setSelectedAvatarIdForRules] = useState<string | undefined>(undefined);
  const [previewAvatarInGame, setPreviewAvatarInGame] = useState<Avatar | null>(null);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'info', title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Set of avatar IDs that have at least one active LiveOps rule
  const activeRuleAvatarIds = useMemo(() => {
    const activeIds = new Set<string>();
    rules.forEach((r) => {
      if (r.is_active) {
        activeIds.add(r.avatar_id);
      }
    });
    return activeIds;
  }, [rules]);

  // Catalog Navigation Handlers
  const handleCreateAvatar = () => {
    setEditingAvatar(null);
    setActiveSection('editor');
  };

  const handleEditAvatar = (avatar: Avatar) => {
    setEditingAvatar(avatar);
    setActiveSection('editor');
  };

  const handleNavigateToRules = (avatarId?: string) => {
    setSelectedAvatarIdForRules(avatarId);
    setActiveSection('rules');
  };

  // Editor Actions
  const handleSaveAvatar = (savedAvatar: Avatar) => {
    setAvatars((prev) => {
      const exists = prev.some((a) => a.id === savedAvatar.id);
      if (exists) {
        return prev.map((a) => (a.id === savedAvatar.id ? savedAvatar : a));
      }
      return [savedAvatar, ...prev];
    });

    addToast(
      'success',
      'Avatar Saved',
      `The avatar "${savedAvatar.slug}" (${savedAvatar.rarity}) has been updated in the master catalog.`
    );
    setActiveSection('catalog');
    setEditingAvatar(null);
  };

  // Guardrail action: Deactivate rules & archive avatar
  const handleDeactivateRulesAndArchive = (avatarId: string) => {
    // Deactivate rules
    setRules((prev) =>
      prev.map((r) => (r.avatar_id === avatarId ? { ...r, is_active: false } : r))
    );

    // Update avatar to ARCHIVED
    setAvatars((prev) =>
      prev.map((a) => (a.id === avatarId ? { ...a, status: 'ARCHIVED' } : a))
    );

    addToast(
      'warning',
      'Rules Deactivated & Avatar Archived',
      `All active rules linked to avatar "${avatarId}" were paused. Status is now ARCHIVED.`
    );
  };

  // Rules Engine Actions
  const handleSaveRule = (savedRule: AvatarUnlockRule) => {
    setRules((prev) => {
      const exists = prev.some((r) => r.id === savedRule.id);
      if (exists) {
        return prev.map((r) => (r.id === savedRule.id ? savedRule : r));
      }
      return [savedRule, ...prev];
    });

    addToast(
      'success',
      'LiveOps Rule Saved',
      `Rule "${savedRule.id}" registered with threshold ${savedRule.threshold_value} USD and drop rate ${savedRule.drop_chance_pct}%.`
    );
  };

  const handleToggleRuleActive = (ruleId: string, isNowActive: boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, is_active: isNowActive } : r))
    );

    const rule = rules.find((r) => r.id === ruleId);
    if (isNowActive) {
      addToast(
        'success',
        'Rule Activated in Production',
        `Rule ${ruleId} (${rule?.name || ''}) now evaluates spins live.`
      );
    } else {
      addToast(
        'info',
        'Rule Paused',
        `Rule ${ruleId} has been temporarily paused from the LiveOps Engine.`
      );
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
    addToast('warning', 'Rule Deleted', `Rule ${ruleId} was removed from the configuration.`);
  };

  // Player Support Actions
  const handleGrantAdminGift = (playerId: string, avatarId: string, reason: string) => {
    const grantedAvatar = avatars.find((a) => a.id === avatarId);
    const targetPlayer = players.find((p) => p.id === playerId);

    const newRecord: PlayerAvatar = {
      id: `pa_${Date.now()}`,
      player_id: playerId,
      avatar_id: avatarId,
      unlocked_at: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      unlocked_via: 'ADMIN_GIFT',
      applied_rule_id: null,
      admin_notes: reason,
    };

    setPlayerAvatars((prev) => [newRecord, ...prev]);

    // Update player avatar count
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId ? { ...p, avatar_count: p.avatar_count + 1 } : p
      )
    );

    addToast(
      'success',
      'Admin Gift Granted',
      `Granted "${grantedAvatar?.slug || avatarId}" to player ${targetPlayer?.username || playerId}. Ticket registered.`
    );
  };

  const handleEquipAvatar = (playerId: string, avatarId: string) => {
    const nowUtc = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === playerId
          ? { ...p, equipped_avatar_id: avatarId, equipped_at: nowUtc }
          : p
      )
    );

    const avatarObj = avatars.find((a) => a.id === avatarId);
    addToast(
      'info',
      'Avatar Equipped on Profile',
      `Avatar ${avatarObj?.slug || avatarId} is now equipped in the game client.`
    );
  };

  return (
    <div className="flex h-screen w-screen bg-[#050014] text-slate-100 overflow-hidden relative">
      {/* Navigation Sidebar with 4 Main Sections */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={(section) => {
          setActiveSection(section);
          setIsSidebarOpen(false);
          if (section === 'editor' && !editingAvatar) {
            setEditingAvatar(null);
          }
        }}
        avatarCount={avatars.length}
        activeRuleCount={rules.filter((r) => r.is_active).length}
        unlockedCount={playerAvatars.length}
        onOpenLivePreview={() => {
          setPreviewAvatarInGame(avatars[0]);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Backoffice Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#050014]">
        {/* Global Top HUD Header */}
        <Header
          activeSection={activeSection}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Dynamic Module Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,50,220,0.15),rgba(5,0,20,1))]">
          {/* MODULE 1: Master Avatar Catalog */}
          {activeSection === 'catalog' && (
            <CatalogModule
              avatars={avatars}
              activeRuleAvatarIds={activeRuleAvatarIds}
              onEditAvatar={handleEditAvatar}
              onCreateAvatar={handleCreateAvatar}
              onNavigateToRules={handleNavigateToRules}
              onPreviewInGame={(av) => setPreviewAvatarInGame(av)}
            />
          )}

          {/* MODULE 2: Avatar Editor & Asset Uploader */}
          {activeSection === 'editor' && (
            <EditorModule
              editingAvatar={editingAvatar}
              activeRules={rules}
              onSaveAvatar={handleSaveAvatar}
              onCancel={() => {
                setActiveSection('catalog');
                setEditingAvatar(null);
              }}
              onDeactivateRulesAndArchive={handleDeactivateRulesAndArchive}
              onNavigateToRules={handleNavigateToRules}
            />
          )}

          {/* MODULE 3: LiveOps Rules Engine */}
          {activeSection === 'rules' && (
            <RulesEngineModule
              rules={rules}
              avatars={avatars}
              selectedAvatarIdForFilter={selectedAvatarIdForRules}
              onSaveRule={handleSaveRule}
              onToggleRuleActive={handleToggleRuleActive}
              onDeleteRule={handleDeleteRule}
            />
          )}

          {/* MODULE 4: Player Support & Inventory */}
          {activeSection === 'support' && (
            <PlayerSupportModule
              players={players}
              playerAvatars={playerAvatars}
              avatars={avatars}
              onGrantAdminGift={handleGrantAdminGift}
              onEquipAvatar={handleEquipAvatar}
            />
          )}
        </main>
      </div>

      {/* Mobile Game HUD Reward Showcase Preview Modal */}
      {previewAvatarInGame && (
        <GamePreviewModal
          avatar={previewAvatarInGame}
          onClose={() => setPreviewAvatarInGame(null)}
        />
      )}

      {/* Toast Feedback System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
