import React, { useState } from "react";
import { Avatar, Player, PlayerAvatar } from "../types";
import { RarityBadge, UnlockedViaBadge } from "./Badges";
import { formatCurrency } from "../lib/formatters";
import {
  Search,
  Gift,
  User,
  Clock,
  Sparkles,
  Coins,
  Gem,
  AlertCircle,
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";

interface PlayerSupportModuleProps {
  players: Player[];
  playerAvatars: PlayerAvatar[];
  avatars: Avatar[];
  onGrantAdminGift: (
    playerId: string,
    avatarId: string,
    reason: string
  ) => void;
  onEquipAvatar?: (playerId: string, avatarId: string) => void;
}

export const PlayerSupportModule: React.FC<PlayerSupportModuleProps> = ({
  players,
  playerAvatars,
  avatars,
  onGrantAdminGift,
  onEquipAvatar,
}) => {
  const [searchUuid, setSearchUuid] = useState<string>(players[0]?.id || "");
  const [activePlayer, setActivePlayer] = useState<Player | null>(
    players[0] || null
  );
  const [searchError, setSearchError] = useState<string | null>(null);

  // Modal State for Admin Gift
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [selectedGiftAvatarId, setSelectedGiftAvatarId] = useState<string>("");
  const [ticketReason, setTicketReason] = useState<string>("");
  const [reasonError, setReasonError] = useState<string | null>(null);

  // Search player handler
  const handleSearch = (uuidToSearch?: string) => {
    const targetUuid = (uuidToSearch || searchUuid).trim();
    if (!targetUuid) {
      setSearchError("Please enter a valid player UUID.");
      return;
    }

    const found = players.find(
      (p) =>
        p.id.toLowerCase() === targetUuid.toLowerCase() ||
        p.username.toLowerCase() === targetUuid.toLowerCase()
    );

    if (found) {
      setActivePlayer(found);
      setSearchError(null);
    } else {
      setSearchError(`No player found with identifier: "${targetUuid}"`);
    }
  };

  // Get current player's inventory
  const currentPlayerInventory = activePlayer
    ? playerAvatars.filter((pa) => pa.player_id === activePlayer.id)
    : [];

  const ownedAvatarIds = new Set(
    currentPlayerInventory.map((pa) => pa.avatar_id)
  );

  // Find equipped avatar object
  const equippedAvatar = activePlayer
    ? avatars.find((a) => a.id === activePlayer.equipped_avatar_id)
    : null;

  // Available avatars for Admin Gift: must be ACTIVE status
  const activeAvatars = avatars.filter((a) => a.status === "ACTIVE");

  // Submit Admin Gift
  const handleConfirmGrant = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGiftAvatarId) {
      return;
    }

    if (!ticketReason.trim() || ticketReason.trim().length < 5) {
      setReasonError(
        "The reason / ticket number is required (minimum 5 characters)."
      );
      return;
    }

    if (activePlayer) {
      onGrantAdminGift(
        activePlayer.id,
        selectedGiftAvatarId,
        ticketReason.trim()
      );
      setIsGiftModalOpen(false);
      setSelectedGiftAvatarId("");
      setTicketReason("");
      setReasonError(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Player Search Bar */}
      <div className="bg-[#16083D] rounded-2xl border border-[#2E146D] p-4 sm:p-6 space-y-4 shadow-[0_8px_30px_rgba(5,0,20,0.6)]">
        <div>
          <h2 className="text-base font-black text-white uppercase font-rajdhani tracking-wider flex items-center gap-2">
            <User className="w-5 h-5 text-[#00E5FF]" />
            Search Player by UUID
          </h2>
          <p className="text-xs text-purple-300/60 mt-0.5">
            Inspect inventory live, verify equipped avatar, and grant
            compensation assets.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchUuid}
              onChange={(e) => {
                setSearchUuid(e.target.value);
                setSearchError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter UUID (e.g. e4a2b918-6c3d-4e21-9a72-f8190c1200a1) or username..."
              className="w-full pl-10 pr-4 py-3 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-xs font-mono-code text-white focus:outline-none focus:ring-1 focus:ring-[#00E5FF]"
            />
          </div>
          <button
            type="button"
            onClick={() => handleSearch()}
            className="btn-cta-purple px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Search className="w-4 h-4 text-[#00E5FF]" />
            Search Player
          </button>
        </div>

        {searchError && (
          <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {searchError}
          </div>
        )}

        {/* Quick-pick sample player chips for fast testing */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-purple-300/60 font-semibold">
            Sample players:
          </span>
          {players.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSearchUuid(p.id);
                handleSearch(p.id);
              }}
              className={`text-xs px-2.5 py-1 rounded-lg font-mono-code transition-all flex items-center gap-1.5 ${
                activePlayer?.id === p.id
                  ? "bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50 shadow-[0_0_8px_rgba(0,229,255,0.3)]"
                  : "bg-[#07011E] text-purple-300 hover:text-white border border-[#2E146D]"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
              {p.username}
              <span className="text-[10px] text-purple-300/50">
                ({p.vip_tier})
              </span>
            </button>
          ))}
        </div>
      </div>

      {activePlayer && (
        <>
          {/* PLAYER PROFILE CARD */}
          <div className="bg-[#16083D] rounded-2xl border border-[#2E146D] p-4 sm:p-6 shadow-[0_8px_30px_rgba(5,0,20,0.6)] space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2E146D]">
              {/* Player Metadata */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#D900FF] p-0.5 shadow-[0_0_20px_rgba(0,229,255,0.3)] shrink-0">
                  <div className="w-full h-full bg-[#07011E] rounded-[14px] flex items-center justify-center">
                    <User className="w-7 h-7 text-[#00E5FF]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-extrabold text-white tracking-wide font-rajdhani">
                      {activePlayer.username}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#FFDF00]/20 text-[#FFDF00] border border-[#7A4B00]">
                      VIP {activePlayer.vip_tier}
                    </span>
                  </div>
                  <p className="text-xs font-mono-code text-purple-300/60 select-all">
                    UUID: {activePlayer.id}
                  </p>
                  <div className="flex items-center gap-4 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[#FFDE59] font-mono-code font-bold">
                      <Coins className="w-3.5 h-3.5" />
                      {formatCurrency(activePlayer.balance_soft)}
                    </div>
                    <div className="flex items-center gap-1.5 text-[#00E5FF] font-mono-code font-bold">
                      <Gem className="w-3.5 h-3.5" />
                      {activePlayer.balance_gems.toLocaleString()} Gems
                    </div>
                    <div className="text-purple-300/70">
                      Unlocked:{" "}
                      <span className="text-white font-bold">
                        {currentPlayerInventory.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary action: "+ Grant Avatar (Admin Gift)" */}
              <div className="self-start lg:self-auto">
                <button
                  onClick={() => setIsGiftModalOpen(true)}
                  className="btn-cta-cyan-magenta px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                >
                  <Gift className="w-4 h-4 stroke-[2.5]" />+ Grant Avatar (Admin
                  Gift)
                </button>
              </div>
            </div>

            {/* CURRENTLY EQUIPPED AVATAR (`equipped_avatar_id`) */}
            <div className="bg-[#07011E] rounded-xl p-4 border border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,229,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={
                      equippedAvatar?.asset_url ||
                      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"
                    }
                    alt={equippedAvatar?.slug || "Equipped Avatar"}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.5)]"
                  />
                  <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#07011E] border border-[#00E5FF]">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFDF00]" />
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-extrabold text-[#00E5FF] tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                    Currently Equipped Avatar
                  </div>
                  <div className="text-base font-extrabold text-white font-rajdhani flex items-center gap-2">
                    {equippedAvatar?.slug || activePlayer.equipped_avatar_id}
                    {equippedAvatar && (
                      <RarityBadge rarity={equippedAvatar.rarity} size="sm" />
                    )}
                  </div>
                  <div className="text-xs text-purple-300/70 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    Equipped since:{" "}
                    <span className="font-mono-code text-purple-200">
                      {activePlayer.equipped_at}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] px-3 py-1 rounded-full font-bold bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/40 shadow-[0_0_8px_rgba(57,255,20,0.3)]">
                  ON MOBILE CLIENT
                </span>
              </div>
            </div>
          </div>

          {/* INVENTORY TABLE (`player_avatars`) */}
          <div className="bg-[#16083D] rounded-2xl border border-[#2E146D] p-6 space-y-4 shadow-[0_8px_30px_rgba(5,0,20,0.6)]">
            <div className="flex items-center justify-between border-b border-[#2E146D] pb-3">
              <div>
                <h3 className="text-base font-black text-white uppercase font-rajdhani tracking-wider">
                  Inventory Table
                </h3>
                <p className="text-xs text-purple-300/60">
                  Historical log of unlocked avatars and associated rules for
                  this user.
                </p>
              </div>
              <span className="text-xs font-mono-code px-3 py-1 rounded-full bg-[#07011E] text-purple-200 border border-[#2E146D]">
                Total: {currentPlayerInventory.length} items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2E146D] bg-[#07011E]/80 text-[11px] font-bold uppercase tracking-wider text-purple-300/70 select-none">
                    <th className="py-3 px-4">Avatar (Thumbnail + Slug)</th>
                    <th className="py-3 px-4">Rarity</th>
                    <th className="py-3 px-4">Unlocked At</th>
                    <th className="py-3 px-4">Source (`unlocked_via`)</th>
                    <th className="py-3 px-4">Applied Rule</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E146D]/50 text-xs">
                  {currentPlayerInventory.map((item) => {
                    const avatarObj = avatars.find(
                      (a) => a.id === item.avatar_id
                    );
                    const isEquipped =
                      activePlayer.equipped_avatar_id === item.avatar_id;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#1A0948]/70 transition-colors group ${
                          isEquipped ? "bg-[#00E5FF]/5" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#050014] border border-[#2E146D]">
                              <img
                                src={avatarObj?.asset_url}
                                alt={avatarObj?.slug || item.avatar_id}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-white font-mono-code group-hover:text-[#00E5FF] transition-colors">
                                {avatarObj?.slug || item.avatar_id}
                              </div>
                              <div className="text-[10px] text-purple-300/50">
                                {avatarObj?.name_display}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {avatarObj && (
                            <RarityBadge rarity={avatarObj.rarity} size="sm" />
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono-code text-purple-200">
                          {item.unlocked_at}
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <UnlockedViaBadge via={item.unlocked_via} />
                            {item.admin_notes && (
                              <p className="text-[10px] text-purple-300/60 italic max-w-xs truncate">
                                {item.admin_notes}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {item.applied_rule_id ? (
                            <span className="inline-flex items-center gap-1 font-mono-code font-bold text-xs px-2 py-0.5 rounded bg-[#2B0E68] text-[#00E5FF] border border-[#8A57D8]/50">
                              {item.applied_rule_id}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono-code text-xs">
                              N/A
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {isEquipped ? (
                            <span className="text-xs font-bold text-[#39FF14] flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Equipped
                            </span>
                          ) : (
                            onEquipAvatar && (
                              <button
                                onClick={() =>
                                  onEquipAvatar(activePlayer.id, item.avatar_id)
                                }
                                className="px-2.5 py-1 rounded bg-[#07011E] text-purple-300 hover:text-white border border-[#2E146D] hover:border-[#00E5FF] transition-colors font-semibold text-[11px]"
                              >
                                Equip
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* MODAL "Grant Avatar (Admin Gift)" */}
      {isGiftModalOpen && activePlayer && (
        <div className="fixed inset-0 bg-[#050014]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A0948] border-2 border-[#00E5FF]/60 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-[0_0_40px_rgba(0,229,255,0.3)] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#2E146D] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center border border-[#00E5FF]/40 shadow-[0_0_12px_rgba(0,229,255,0.3)]">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase font-rajdhani">
                    Grant Avatar (Admin Gift)
                  </h3>
                  <p className="text-xs text-purple-300/60">
                    Manual assignment to inventory for{" "}
                    <span className="text-white font-bold">
                      {activePlayer.username}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGiftModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#07011E] text-purple-300 hover:text-white border border-[#2E146D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmGrant} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  Select Active Avatar *
                </label>

                <select
                  value={selectedGiftAvatarId}
                  onChange={(e) => setSelectedGiftAvatarId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                  required
                >
                  <option value="">-- Choose an avatar to grant --</option>
                  {activeAvatars.map((av) => {
                    const isAlreadyOwned = ownedAvatarIds.has(av.id);
                    return (
                      <option
                        key={av.id}
                        value={av.id}
                        disabled={isAlreadyOwned}
                        className={
                          isAlreadyOwned
                            ? "text-slate-600 bg-[#07011E]"
                            : "bg-[#07011E]"
                        }
                      >
                        {av.slug} ({av.rarity}){" "}
                        {isAlreadyOwned ? "— [ALREADY OWNED]" : ""}
                      </option>
                    );
                  })}
                </select>
                <p className="text-[10px] text-purple-300/50">
                  Only production active avatars are displayed. Avatars already
                  owned in player inventory are disabled.
                </p>
              </div>

              {selectedGiftAvatarId && (
                <div className="p-3 bg-[#07011E] rounded-xl border border-[#2E146D] flex items-center gap-3">
                  {(() => {
                    const chosen = avatars.find(
                      (a) => a.id === selectedGiftAvatarId
                    );
                    if (!chosen) return null;
                    return (
                      <>
                        <img
                          src={chosen.asset_url}
                          alt={chosen.slug}
                          className="w-12 h-12 rounded-lg object-cover border border-[#2E146D]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white font-mono-code truncate">
                            {chosen.slug}
                          </div>
                          <div className="text-[10px] text-purple-300/60 truncate">
                            {chosen.name_display}
                          </div>
                          <div className="mt-1">
                            <RarityBadge rarity={chosen.rarity} size="sm" />
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Grant Reason / Ticket Number *
                </label>
                <textarea
                  rows={3}
                  value={ticketReason}
                  onChange={(e) => {
                    setTicketReason(e.target.value);
                    setReasonError(null);
                  }}
                  placeholder="e.g. Ticket #SUP-10928: Tournament anomaly refund or VIP compensation."
                  className="w-full px-3 py-2 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-xs text-white focus:outline-none resize-none"
                  required
                />
                {reasonError && (
                  <p className="text-[11px] text-rose-400 font-semibold">
                    {reasonError}
                  </p>
                )}
                <p className="text-[10px] text-purple-300/50">
                  Required for compliance and LiveOps audit logs.
                </p>
              </div>

              <div className="pt-3 border-t border-[#2E146D] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsGiftModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#07011E] text-xs font-bold text-slate-400 hover:text-white border border-[#2E146D] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedGiftAvatarId}
                  className="btn-cta-cyan-magenta px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  Confirm Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
