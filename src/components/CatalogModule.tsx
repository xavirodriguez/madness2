import React, { useState, useMemo } from 'react';
import { Avatar, AvatarRarity, AvatarStatus } from '../types';
import { RarityBadge, StatusBadge } from './Badges';
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  Edit3,
  Sliders,
  Sparkles,
  Eye,
  ArrowUpDown,
  MoreVertical,
  Filter,
  RefreshCw,
  Tag,
  CheckCircle2,
} from 'lucide-react';

interface CatalogModuleProps {
  avatars: Avatar[];
  activeRuleAvatarIds: Set<string>;
  onEditAvatar: (avatar: Avatar) => void;
  onCreateAvatar: () => void;
  onNavigateToRules: (avatarId?: string) => void;
  onPreviewInGame: (avatar: Avatar) => void;
}

type SortField = 'slug' | 'name_i18n_key' | 'rarity' | 'status' | 'updated_at';
type SortOrder = 'asc' | 'desc';

export const CatalogModule: React.FC<CatalogModuleProps> = ({
  avatars,
  activeRuleAvatarIds,
  onEditAvatar,
  onCreateAvatar,
  onNavigateToRules,
  onPreviewInGame,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortField, setSortField] = useState<SortField>('updated_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtered and sorted avatars
  const filteredAvatars = useMemo(() => {
    return avatars
      .filter((av) => {
        const matchesSearch =
          searchTerm.trim() === '' ||
          av.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          av.name_i18n_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          av.name_display.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRarity = rarityFilter === 'ALL' || av.rarity === rarityFilter;
        const matchesStatus = statusFilter === 'ALL' || av.status === statusFilter;

        return matchesSearch && matchesRarity && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? valA.localeCompare(valB as string)
            : (valB as string).localeCompare(valA);
        }
        return 0;
      });
  }, [avatars, searchTerm, rarityFilter, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Main Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#16083D]/90 p-5 rounded-2xl border border-[#2E146D] shadow-[0_8px_30px_rgba(5,0,20,0.6)]">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-white tracking-wide font-rajdhani uppercase">
              Catálogo Maestro (`avatars`)
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
              {filteredAvatars.length} de {avatars.length} activos
            </span>
          </div>
          <p className="text-xs text-purple-300/70">
            Filtra en tiempo real por slug técnico, clave i18n o estado de despliegue en CDN.
          </p>
        </div>

        {/* Primary CTA Button */}
        <div className="flex items-center gap-3 self-start lg:self-auto">
          <button
            onClick={onCreateAvatar}
            className="btn-cta-green px-5 py-2.5 rounded-full flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            + Crear Avatar
          </button>
        </div>
      </div>

      {/* Filter Toolbar & View Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#07011E] p-4 rounded-xl border border-[#2E146D]">
        {/* Real-time search by slug or i18n_key */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por slug (ej. cyber_ronin) o clave i18n (AVATAR_NAME_...)"
            className="w-full pl-10 pr-4 py-2 bg-[#16083D] border border-[#2E146D] focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF] rounded-xl text-xs text-white placeholder-purple-300/40 transition-all font-mono-code"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Rarity filter */}
          <div className="flex items-center gap-1.5 bg-[#16083D] px-3 py-1.5 rounded-xl border border-[#2E146D]">
            <Filter className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="text-xs text-purple-300/70">Rareza:</span>
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer pr-2"
            >
              <option value="ALL" className="bg-[#16083D]">Todas</option>
              <option value="COMMON" className="bg-[#16083D]">COMMON (Slate)</option>
              <option value="RARE" className="bg-[#16083D]">RARE (Blue)</option>
              <option value="EPIC" className="bg-[#16083D]">EPIC (Purple)</option>
              <option value="LEGENDARY" className="bg-[#16083D]">LEGENDARY (Gold)</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-[#16083D] px-3 py-1.5 rounded-xl border border-[#2E146D]">
            <span className="text-xs text-purple-300/70">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer pr-2"
            >
              <option value="ALL" className="bg-[#16083D]">Todos</option>
              <option value="ACTIVE" className="bg-[#16083D]">ACTIVE (Emerald)</option>
              <option value="DRAFT" className="bg-[#16083D]">DRAFT (Amber)</option>
              <option value="ARCHIVED" className="bg-[#16083D]">ARCHIVED (Rose)</option>
            </select>
          </div>

          {/* View Toggle: Grid vs Table */}
          <div className="flex items-center bg-[#16083D] p-1 rounded-xl border border-[#2E146D]">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#D900FF] text-white shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-purple-300 hover:text-white'
              }`}
              title="Vista Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#D900FF] text-white shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-purple-300 hover:text-white'
              }`}
              title="Vista Tabla"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tabla</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredAvatars.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#16083D]/50 border border-[#2E146D] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#2B0E68] text-purple-300 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No se encontraron avatares</h3>
          <p className="text-xs text-purple-300/60 max-w-sm mx-auto">
            Intenta relajar los filtros de rareza/estado o limpia el término de búsqueda.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setRarityFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="btn-cta-purple px-4 py-1.5 rounded-lg text-xs font-semibold"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* VISTA GRID (Tarjetas aspecto 1:1, preview, slug, badges, acciones al pie) */}
      {viewMode === 'grid' && filteredAvatars.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAvatars.map((avatar) => {
            const hasActiveRules = activeRuleAvatarIds.has(avatar.id);

            // Border color by rarity
            const rarityBorder =
              avatar.rarity === 'LEGENDARY'
                ? 'border-[#FFDF00]/50 hover:border-[#FFDF00] hover:shadow-[0_0_20px_rgba(255,223,0,0.35)]'
                : avatar.rarity === 'EPIC'
                ? 'border-purple-600/50 hover:border-purple-500 hover:shadow-[0_0_18px_rgba(147,51,234,0.35)]'
                : avatar.rarity === 'RARE'
                ? 'border-blue-600/50 hover:border-blue-400 hover:shadow-[0_0_18px_rgba(37,99,235,0.35)]'
                : 'border-slate-500/50 hover:border-slate-400';

            return (
              <div
                key={avatar.id}
                className={`group bg-[#16083D] rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${rarityBorder}`}
              >
                {/* 1:1 Aspect Ratio Asset Preview Container */}
                <div className="relative aspect-square w-full bg-[#050014] overflow-hidden">
                  {/* Subtle radial glow background based on rarity */}
                  <div
                    className="absolute inset-0 opacity-40 group-hover:opacity-75 transition-opacity"
                    style={{
                      background:
                        avatar.rarity === 'LEGENDARY'
                          ? 'radial-gradient(circle at center, rgba(255,223,0,0.3) 0%, transparent 70%)'
                          : avatar.rarity === 'EPIC'
                          ? 'radial-gradient(circle at center, rgba(147,51,234,0.35) 0%, transparent 70%)'
                          : avatar.rarity === 'RARE'
                          ? 'radial-gradient(circle at center, rgba(0,229,255,0.25) 0%, transparent 70%)'
                          : 'radial-gradient(circle at center, rgba(100,116,139,0.2) 0%, transparent 70%)',
                    }}
                  />

                  {/* Asset Image */}
                  <img
                    src={avatar.asset_url}
                    alt={avatar.slug}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top Badges Overlay */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <RarityBadge rarity={avatar.rarity} size="sm" showStars={avatar.rarity === 'LEGENDARY'} />
                    <StatusBadge status={avatar.status} size="sm" />
                  </div>

                  {/* LiveOps Rules Badge Overlay */}
                  {hasActiveRules && (
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#050014]/90 text-[#39FF14] border border-[#39FF14]/50 shadow-[0_0_8px_rgba(57,255,20,0.4)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-ping" />
                        LiveOps Activo
                      </span>
                    </div>
                  )}

                  {/* Quick HUD Showcase Button */}
                  <button
                    onClick={() => onPreviewInGame(avatar)}
                    className="absolute bottom-2.5 right-2.5 z-10 p-2 rounded-lg bg-[#050014]/80 backdrop-blur-md text-white hover:text-[#00E5FF] hover:bg-[#07011E] border border-white/20 transition-all opacity-0 group-hover:opacity-100"
                    title="Simular pantalla de recompensa 9:16"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Info Body */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-white tracking-wide truncate group-hover:text-[#00E5FF] transition-colors">
                        {avatar.slug}
                      </h3>
                    </div>
                    <p className="text-[11px] font-mono-code text-purple-300/70 truncate mt-0.5" title={avatar.name_i18n_key}>
                      {avatar.name_i18n_key}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {avatar.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {avatar.tags && avatar.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {avatar.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] px-1.5 py-0.2 rounded bg-[#07011E] text-purple-300/60 border border-[#2E146D]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions Footer ("Editar", "Reglas") */}
                  <div className="pt-3 border-t border-[#2E146D] grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => onEditAvatar(avatar)}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#2B0E68] hover:bg-[#3D1E6D] text-white text-xs font-bold border border-[#8A57D8]/40 hover:border-[#8A57D8] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-[#00E5FF]" />
                      Editar
                    </button>
                    <button
                      onClick={() => onNavigateToRules(avatar.id)}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#1A0948] hover:bg-[#250F5C] text-purple-200 text-xs font-bold border border-[#2E146D] hover:border-[#00E5FF]/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sliders className="w-3 h-3 text-[#FF007F]" />
                      Reglas
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VISTA TABLA (Filas ordenables con miniatura, slug, name_i18n_key, rareza, estado, fecha de actualización, menú ...) */}
      {viewMode === 'table' && filteredAvatars.length > 0 && (
        <div className="bg-[#16083D] rounded-2xl border border-[#2E146D] overflow-hidden shadow-[0_8px_30px_rgba(5,0,20,0.6)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2E146D] bg-[#07011E]/80 text-[11px] font-bold uppercase tracking-wider text-purple-300/70 select-none">
                  <th className="py-3.5 px-4 w-16">Miniatura</th>
                  <th
                    onClick={() => handleSort('slug')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Slug Técnico
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('name_i18n_key')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Clave i18n
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('rarity')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Rareza
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Estado
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('updated_at')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Actualización
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E146D]/60 text-xs">
                {filteredAvatars.map((avatar) => {
                  const hasActiveRules = activeRuleAvatarIds.has(avatar.id);

                  return (
                    <tr
                      key={avatar.id}
                      className="hover:bg-[#1A0948]/70 transition-colors group"
                    >
                      {/* Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#050014] border border-[#2E146D] group-hover:border-[#00E5FF]/50 transition-colors">
                          <img
                            src={avatar.asset_url}
                            alt={avatar.slug}
                            className="w-full h-full object-cover"
                          />
                          {hasActiveRules && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#39FF14] ring-2 ring-[#050014]" />
                          )}
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-3 px-4 font-bold text-white font-mono-code">
                        <div className="flex items-center gap-2">
                          <span className="group-hover:text-[#00E5FF] transition-colors">{avatar.slug}</span>
                          {hasActiveRules && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30">
                              LIVEOPS
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-purple-300/50 font-sans font-normal mt-0.5">
                          {avatar.name_display}
                        </div>
                      </td>

                      {/* i18n key */}
                      <td className="py-3 px-4 font-mono-code text-purple-200">
                        <span className="px-2 py-0.5 rounded bg-[#07011E] border border-[#2E146D]">
                          {avatar.name_i18n_key}
                        </span>
                      </td>

                      {/* Rarity */}
                      <td className="py-3 px-4">
                        <RarityBadge rarity={avatar.rarity} size="sm" showStars={avatar.rarity === 'LEGENDARY'} />
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <StatusBadge status={avatar.status} size="sm" />
                      </td>

                      {/* Updated date */}
                      <td className="py-3 px-4 text-purple-300/70 font-mono-code text-[11px]">
                        {avatar.updated_at}
                      </td>

                      {/* Actions Menu */}
                      <td className="py-3 px-4 text-right relative">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onEditAvatar(avatar)}
                            className="p-1.5 rounded-lg bg-[#2B0E68] text-purple-300 hover:text-white hover:bg-[#3D1E6D] border border-[#8A57D8]/30 transition-colors"
                            title="Editar avatar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onNavigateToRules(avatar.id)}
                            className="p-1.5 rounded-lg bg-[#16083D] text-purple-300 hover:text-[#FF007F] hover:bg-[#1A0948] border border-[#2E146D] transition-colors"
                            title="Ver o configurar reglas"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onPreviewInGame(avatar)}
                            className="p-1.5 rounded-lg bg-[#16083D] text-[#FFDE59] hover:bg-[#1A0948] border border-[#2E146D] transition-colors"
                            title="Simular HUD de desbloqueo"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
