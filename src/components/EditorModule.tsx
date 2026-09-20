import React, { useState, useEffect } from 'react';
import { Avatar, AvatarRarity, AvatarStatus, AvatarUnlockRule } from '../types';
import { RarityBadge, StatusBadge } from './Badges';
import {
  UploadCloud,
  Sun,
  Moon,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Save,
  Sparkles,
  Link,
  Sliders,
} from 'lucide-react';

interface EditorModuleProps {
  editingAvatar: Avatar | null;
  activeRules: AvatarUnlockRule[];
  onSaveAvatar: (avatar: Avatar) => void;
  onCancel: () => void;
  onDeactivateRulesAndArchive?: (avatarId: string) => void;
  onNavigateToRules?: (avatarId: string) => void;
}

export const EditorModule: React.FC<EditorModuleProps> = ({
  editingAvatar,
  activeRules,
  onSaveAvatar,
  onCancel,
  onDeactivateRulesAndArchive,
  onNavigateToRules,
}) => {
  const isEditing = Boolean(editingAvatar);

  // Form State
  const [slug, setSlug] = useState(editingAvatar?.slug || '');
  const [nameKeySuffix, setNameKeySuffix] = useState(
    editingAvatar?.name_i18n_key.replace(/^AVATAR_NAME_/, '') || ''
  );
  const [nameDisplay, setNameDisplay] = useState(editingAvatar?.name_display || '');
  const [rarity, setRarity] = useState<AvatarRarity>(editingAvatar?.rarity || 'RARE');
  const [status, setStatus] = useState<AvatarStatus>(editingAvatar?.status || 'DRAFT');
  const [assetUrl, setAssetUrl] = useState(
    editingAvatar?.asset_url ||
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'
  );
  const [description, setDescription] = useState(editingAvatar?.description || '');
  const [tagsInput, setTagsInput] = useState(editingAvatar?.tags?.join(', ') || 'LiveOps, Season4');

  // Preview State
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light' | 'checker'>('dark');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Guardrail Modal State
  const [showGuardrailModal, setShowGuardrailModal] = useState(false);

  // Find active rules for this avatar
  const offendingRules = editingAvatar
    ? activeRules.filter((r) => r.avatar_id === editingAvatar.id && r.is_active)
    : [];

  useEffect(() => {
    if (editingAvatar) {
      setSlug(editingAvatar.slug);
      setNameKeySuffix(editingAvatar.name_i18n_key.replace(/^AVATAR_NAME_/, ''));
      setNameDisplay(editingAvatar.name_display);
      setRarity(editingAvatar.rarity);
      setStatus(editingAvatar.status);
      setAssetUrl(editingAvatar.asset_url);
      setDescription(editingAvatar.description);
      setTagsInput(editingAvatar.tags?.join(', ') || '');
    } else {
      // New default template
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setSlug(`cyber_phantom_${randomSuffix}`);
      setNameKeySuffix(`PHANTOM_${randomSuffix}`);
      setNameDisplay(`Cyber Phantom ${randomSuffix}`);
      setRarity('RARE');
      setStatus('DRAFT');
      setAssetUrl('https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80');
      setDescription('New avatar under calibration for the upcoming tournament season.');
      setTagsInput('Cyber, Season4, New');
    }
  }, [editingAvatar]);

  // Handle Status change with Guardrail check
  const handleStatusChange = (newStatus: AvatarStatus) => {
    if (newStatus === 'ARCHIVED' && offendingRules.length > 0) {
      // Trigger blocking guardrail modal
      setShowGuardrailModal(true);
      return;
    }
    setStatus(newStatus);
  };

  // Drag & Drop simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const simulateUpload = (_fileName: string) => {
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 15;
        if (prev >= 95) {
          clearInterval(interval);
          const mockAssets = [
            'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
          ];
          const randomAsset = mockAssets[Math.floor(Math.random() * mockAssets.length)];
          setAssetUrl(randomAsset);
          setTimeout(() => setUploadProgress(null), 1200);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      simulateUpload(file.name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      simulateUpload(file.name);
    }
  };

  // Visual validation for i18n key suffix
  const isKeySuffixValid = /^[A-Z0-9_]+$/.test(nameKeySuffix.trim());
  const fullI18nKey = `AVATAR_NAME_${nameKeySuffix.trim().toUpperCase()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!slug.trim()) return;
    if (!nameKeySuffix.trim() || !isKeySuffixValid) return;

    const updated: Avatar = {
      id: editingAvatar ? editingAvatar.id : `av_${slug.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      slug: slug.trim(),
      name_i18n_key: fullI18nKey,
      name_display: nameDisplay.trim() || slug,
      rarity,
      status,
      asset_url: assetUrl,
      description: description.trim(),
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      created_at: editingAvatar ? editingAvatar.created_at : new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    onSaveAvatar(updated);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between bg-[#16083D] p-4 rounded-2xl border border-[#2E146D]">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-[#07011E] text-purple-300 hover:text-white border border-[#2E146D] transition-colors"
            title="Return to Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white uppercase font-rajdhani">
                {isEditing ? `Editor: ${editingAvatar?.slug}` : 'Create New Avatar'}
              </h2>
              <StatusBadge status={status} size="sm" />
            </div>
            <p className="text-xs text-purple-300/60">
              {isEditing
                ? 'The slug is immutable to preserve consistency with game clients.'
                : 'Define permanent slug, i18n localization key, and upload art for CDN.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-[#07011E] text-xs font-bold text-slate-400 hover:text-white border border-[#2E146D] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-cta-green px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(57,255,20,0.5)]"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            Save Avatar
          </button>
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Drag & Drop S3/CDN Zone with Live Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#16083D] rounded-2xl border border-[#2E146D] p-5 space-y-4 shadow-[0_8px_30px_rgba(5,0,20,0.6)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-purple-300 uppercase flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-[#00E5FF]" />
                Asset Upload & CDN Preview
              </span>

              {/* Theme toggle */}
              <div className="flex items-center bg-[#07011E] p-1 rounded-lg border border-[#2E146D]">
                <button
                  type="button"
                  onClick={() => setPreviewTheme('dark')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    previewTheme === 'dark'
                      ? 'bg-[#2B0E68] text-[#00E5FF] shadow-[0_0_6px_#00e5ff]'
                      : 'text-purple-300 hover:text-white'
                  }`}
                  title="Dark Cosmic Background"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('light')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    previewTheme === 'light'
                      ? 'bg-slate-200 text-slate-900 shadow-[0_0_6px_white]'
                      : 'text-purple-300 hover:text-white'
                  }`}
                  title="Light Neutral Background"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('checker')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                    previewTheme === 'checker'
                      ? 'bg-[#FF007F] text-white shadow-[0_0_6px_#ff007f]'
                      : 'text-purple-300 hover:text-white'
                  }`}
                  title="Alpha Checkerboard"
                >
                  PNG
                </button>
              </div>
            </div>

            {/* Live 1:1 Preview Box */}
            <div
              className={`relative aspect-square w-full rounded-2xl overflow-hidden border-2 transition-all flex items-center justify-center ${
                previewTheme === 'dark'
                  ? 'bg-[#050014] border-[#2E146D]'
                  : previewTheme === 'light'
                  ? 'bg-[#f1f5f9] border-slate-300 text-slate-800'
                  : 'bg-[radial-gradient(#2e146d_1px,transparent_1px)] [background-size:16px_16px] bg-[#0c0524] border-[#00E5FF]/40'
              }`}
            >
              <img
                src={assetUrl}
                alt="Avatar preview"
                className="w-full h-full object-cover object-center transition-transform hover:scale-105 duration-300"
              />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <RarityBadge rarity={rarity} size="md" showStars={rarity === 'LEGENDARY'} />
                <StatusBadge status={status} size="md" />
              </div>

              {previewTheme === 'dark' && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow:
                      rarity === 'LEGENDARY'
                        ? 'inset 0 0 40px rgba(255,223,0,0.3)'
                        : rarity === 'EPIC'
                        ? 'inset 0 0 40px rgba(147,51,234,0.35)'
                        : rarity === 'RARE'
                        ? 'inset 0 0 40px rgba(0,229,255,0.3)'
                        : 'inset 0 0 30px rgba(100,116,139,0.2)',
                  }}
                />
              )}

              {uploadProgress !== null && (
                <div className="absolute inset-0 bg-[#07011E]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-3 z-20">
                  <div className="w-12 h-12 rounded-full border-3 border-[#00E5FF] border-t-transparent animate-spin" />
                  <p className="text-xs font-bold text-white font-rajdhani uppercase tracking-wider">
                    Uploading asset to AWS S3 / CloudFront...
                  </p>
                  <div className="w-full max-w-xs bg-[#050014] h-2 rounded-full overflow-hidden border border-[#2E146D]">
                    <div
                      className="h-full bg-gradient-to-r from-[#00E5FF] to-[#39FF14] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono-code text-[#00E5FF]">{uploadProgress}%</span>
                </div>
              )}
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-[#00E5FF] bg-[#00E5FF]/10 scale-[1.01]'
                  : 'border-[#2E146D] hover:border-[#00E5FF]/60 bg-[#07011E]/60'
              }`}
            >
              <input
                type="file"
                id="avatar-file-upload"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileInput}
                className="hidden"
              />
              <label htmlFor="avatar-file-upload" className="cursor-pointer block space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#2B0E68] text-[#00E5FF] mx-auto flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.3)]">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-white">
                  Drag asset here or <span className="text-[#00E5FF] underline">click to browse</span>
                </div>
                <p className="text-[10px] text-purple-300/60">
                  24-bit PNG with transparency or WebP (1024x1024px recommended). Simulates direct push to S3 bucket.
                </p>
              </label>
            </div>

            {/* CDN URL Direct Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-purple-300 uppercase tracking-wide flex items-center gap-1.5">
                <Link className="w-3 h-3 text-[#00E5FF]" />
                Asset URL (S3 / CDN)
              </label>
              <input
                type="url"
                value={assetUrl}
                onChange={(e) => setAssetUrl(e.target.value)}
                placeholder="https://cdn.gameserver.io/avatars/..."
                className="w-full px-3 py-2 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-xs text-purple-200 font-mono-code focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Technical Form */}
        <div className="lg:col-span-7 space-y-5">
          <form onSubmit={handleSubmit} className="bg-[#16083D] rounded-2xl border border-[#2E146D] p-6 space-y-5 shadow-[0_8px_30px_rgba(5,0,20,0.6)]">
            <div className="border-b border-[#2E146D] pb-3 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white uppercase font-rajdhani tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFDE59]" />
                Avatar Metadata & Deployment
              </h3>
              <span className="text-[11px] text-purple-300/60">Required fields *</span>
            </div>

            {/* Input `slug` */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  Technical Slug *
                  {isEditing && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Read-only
                    </span>
                  )}
                </label>
                <span className="text-[10px] text-purple-300/60 font-mono-code">Unique DB Identifier</span>
              </div>
              <input
                type="text"
                value={slug}
                readOnly={isEditing}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="e.g. cyber_ronin_x"
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono-code transition-all ${
                  isEditing
                    ? 'bg-[#07011E]/70 text-slate-400 border border-[#2E146D] cursor-not-allowed select-none'
                    : 'bg-[#07011E] text-white border border-[#2E146D] focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] focus:outline-none'
                }`}
              />
              <p className="text-[10px] text-purple-300/50">
                {isEditing
                  ? '⚠️ Non-editable in update mode to prevent desynchronization with iOS/Android game clients.'
                  : 'Lowercase letters, numbers, and underscores (_) only. Used in `avatars` and `player_avatars` tables.'}
              </p>
            </div>

            {/* Input `name_i18n_key` */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  Localization Key (i18n Key) *
                </label>
                {isKeySuffixValid && nameKeySuffix.trim() ? (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Valid Key
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3 h-3" /> Uppercase, numbers, and '_' only
                  </span>
                )}
              </div>

              <div className="flex items-center rounded-xl bg-[#07011E] border border-[#2E146D] focus-within:border-[#00E5FF] focus-within:ring-1 focus-within:ring-[#00E5FF] overflow-hidden">
                <span className="px-3.5 py-2.5 bg-[#2B0E68]/60 text-purple-300 text-xs font-mono-code font-bold border-r border-[#2E146D] select-none">
                  AVATAR_NAME_
                </span>
                <input
                  type="text"
                  value={nameKeySuffix}
                  onChange={(e) => setNameKeySuffix(e.target.value.toUpperCase())}
                  placeholder="CYBER_RONIN_X"
                  className="flex-1 px-3 py-2.5 bg-transparent text-xs text-white font-mono-code uppercase focus:outline-none"
                />
              </div>
              <div className="text-[10px] font-mono-code text-purple-300/70 bg-[#07011E]/40 px-3 py-1.5 rounded-lg border border-[#2E146D]/60 flex items-center justify-between">
                <span>Composite Result:</span>
                <span className="text-[#00E5FF] font-bold">{fullI18nKey}</span>
              </div>
            </div>

            {/* Display Name & Rarity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Display Name
                </label>
                <input
                  type="text"
                  value={nameDisplay}
                  onChange={(e) => setNameDisplay(e.target.value)}
                  placeholder="Cyber Ronin X"
                  className="w-full px-3 py-2 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  Rarity *
                </label>
                <div className="relative">
                  <select
                    value={rarity}
                    onChange={(e) => setRarity(e.target.value as AvatarRarity)}
                    className="w-full px-3 py-2 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-xs text-white font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="COMMON" className="bg-[#07011E]">COMMON (Slate-500)</option>
                    <option value="RARE" className="bg-[#07011E]">RARE (Blue-600)</option>
                    <option value="EPIC" className="bg-[#07011E]">EPIC (Purple-600)</option>
                    <option value="LEGENDARY" className="bg-[#07011E]">★ LEGENDARY ★ (Amber-500/Gold)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Segmented Control for `status` */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Availability Status (`status`) *
                </label>
                {offendingRules.length > 0 && (
                  <span className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                    <ShieldAlert className="w-3 h-3" />
                    {offendingRules.length} active LiveOps rule(s)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#07011E] p-1.5 rounded-xl border border-[#2E146D]">
                <button
                  type="button"
                  onClick={() => handleStatusChange('DRAFT')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    status === 'DRAFT'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  DRAFT
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('ACTIVE')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('ARCHIVED')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    status === 'ARCHIVED'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  ARCHIVED
                </button>
              </div>
            </div>

            {/* Description / Lore */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Avatar Description / Lore
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descriptive text for the in-game reward card..."
                className="w-full px-3 py-2 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-xs text-white focus:outline-none resize-none"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Tags / Categories (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Cyberpunk, Season4, Event"
                className="w-full px-3 py-2 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            {/* Submit & Cancel */}
            <div className="pt-4 border-t border-[#2E146D] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl bg-[#07011E] text-xs font-bold text-slate-400 hover:text-white border border-[#2E146D]"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                className="btn-cta-green px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(57,255,20,0.5)]"
              >
                <Save className="w-4 h-4 stroke-[2.5]" />
                Save Avatar to Catalog
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* GUARDRAIL MODAL */}
      {showGuardrailModal && (
        <div className="fixed inset-0 bg-[#050014]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A0948] border-2 border-rose-500/80 rounded-2xl max-w-lg w-full p-6 shadow-[0_0_40px_rgba(244,63,94,0.35)] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-white uppercase font-rajdhani tracking-wide">
                  LiveOps Security Guardrail
                </h3>
                <p className="text-xs text-rose-300 font-bold leading-relaxed">
                  "Cannot archive an avatar with active LiveOps rules. Deactivate linked rules first."
                </p>
              </div>
            </div>

            <div className="bg-[#07011E] rounded-xl p-4 border border-rose-500/30 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Active rules linked to this avatar:</span>
                <span className="text-rose-400 font-mono-code font-bold">
                  {offendingRules.length} BLOCKING
                </span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {offendingRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-2.5 rounded-lg bg-[#16083D] border border-[#2E146D] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white font-mono-code">{rule.id}</div>
                      <div className="text-[11px] text-purple-300/70 truncate max-w-[260px]">{rule.name}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-purple-300/80 leading-relaxed">
              Archiving this avatar would cause execution errors or probability overflow if players fulfill spin requirements in mobile clients.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowGuardrailModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#07011E] text-xs font-bold text-slate-300 hover:text-white border border-[#2E146D] transition-colors"
              >
                Go Back & Keep Status
              </button>

              {onDeactivateRulesAndArchive && editingAvatar && (
                <button
                  type="button"
                  onClick={() => {
                    onDeactivateRulesAndArchive(editingAvatar.id);
                    setStatus('ARCHIVED');
                    setShowGuardrailModal(false);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Deactivate Rules & Archive
                </button>
              )}

              {onNavigateToRules && editingAvatar && (
                <button
                  type="button"
                  onClick={() => {
                    setShowGuardrailModal(false);
                    onNavigateToRules(editingAvatar.id);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#2B0E68] hover:bg-[#3D1E6D] text-white text-xs font-bold border border-[#8A57D8] transition-all flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#00E5FF]" />
                  Review in Rules Engine
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
