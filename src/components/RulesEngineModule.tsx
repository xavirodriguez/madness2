import React, { useState, useMemo } from 'react';
import {
  Avatar,
  AvatarUnlockRule,
  TriggerType,
  AccumulationMode,
} from '../types';
import { RarityBadge, RuleValidityBadge } from './Badges';
import {
  formatCurrency,
  parseCurrencyInput,
  formatPercentage,
  parsePercentageInput,
  computeRuleValidity,
  formatDateUtc,
} from '../lib/formatters';
import {
  Sliders,
  Plus,
  Zap,
  Calendar,
  DollarSign,
  Edit2,
  Search,
  Filter,
  TrendingUp,
  Trash2,
} from 'lucide-react';

interface RulesEngineModuleProps {
  rules: AvatarUnlockRule[];
  avatars: Avatar[];
  selectedAvatarIdForFilter?: string;
  onSaveRule: (rule: AvatarUnlockRule) => void;
  onToggleRuleActive: (ruleId: string, isActive: boolean) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const RulesEngineModule: React.FC<RulesEngineModuleProps> = ({
  rules,
  avatars,
  selectedAvatarIdForFilter,
  onSaveRule,
  onToggleRuleActive,
  onDeleteRule,
}) => {
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // Form Fields State
  const [avatarId, setAvatarId] = useState<string>(
    selectedAvatarIdForFilter || avatars[0]?.id || ''
  );
  const [ruleName, setRuleName] = useState<string>('');
  const [triggerType, setTriggerType] = useState<TriggerType>('BET_AMOUNT');
  const [thresholdValue, setThresholdValue] = useState<number>(1000000);
  const [thresholdRawInput, setThresholdRawInput] = useState<string>('$1,000,000');
  const [accumulationMode, setAccumulationMode] = useState<AccumulationMode>('SINGLE_SPIN');
  const [dropChancePct, setDropChancePct] = useState<number>(0.05);
  const [dropChanceRawInput, setDropChanceRawInput] = useState<string>('0.0500%');
  const [startDateUtc, setStartDateUtc] = useState<string>('2026-09-01T00:00:00Z');
  const [endDateUtc, setEndDateUtc] = useState<string>('2026-12-31T23:59:59Z');
  const [isActive, setIsActive] = useState<boolean>(true);

  // Filter for table
  const [tableFilterAvatarId, setTableFilterAvatarId] = useState<string>(
    selectedAvatarIdForFilter || 'ALL'
  );
  const [tableValidityFilter, setTableValidityFilter] = useState<string>('ALL');

  // Autocomplete avatar search in form
  const [avatarSearchTerm, setAvatarSearchTerm] = useState('');
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);

  const selectedAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const filteredAvatarsForSelect = useMemo(() => {
    return avatars.filter(
      (av) =>
        av.slug.toLowerCase().includes(avatarSearchTerm.toLowerCase()) ||
        av.name_display.toLowerCase().includes(avatarSearchTerm.toLowerCase()) ||
        av.name_i18n_key.toLowerCase().includes(avatarSearchTerm.toLowerCase())
    );
  }, [avatars, avatarSearchTerm]);

  // Handle threshold formatting as currency (e.g. $1,000,000)
  const handleThresholdChange = (val: string) => {
    const num = parseCurrencyInput(val);
    setThresholdValue(num);
    setThresholdRawInput(formatCurrency(num));
  };

  // Handle percentage formatting (e.g. 0.0500%)
  const handleDropChanceChange = (val: string) => {
    const num = parsePercentageInput(val);
    setDropChancePct(num);
    setDropChanceRawInput(formatPercentage(num));
  };

  // Populate form if editing existing rule
  const handleStartEdit = (rule: AvatarUnlockRule) => {
    setEditingRuleId(rule.id);
    setAvatarId(rule.avatar_id);
    setRuleName(rule.name);
    setTriggerType(rule.trigger_type);
    setThresholdValue(rule.threshold_value);
    setThresholdRawInput(formatCurrency(rule.threshold_value));
    setAccumulationMode(rule.accumulation_mode);
    setDropChancePct(rule.drop_chance_pct);
    setDropChanceRawInput(formatPercentage(rule.drop_chance_pct));
    setStartDateUtc(rule.start_date_utc);
    setEndDateUtc(rule.end_date_utc);
    setIsActive(rule.is_active);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingRuleId(null);
    setRuleName('');
    setTriggerType('BET_AMOUNT');
    setThresholdValue(1000000);
    setThresholdRawInput('$1,000,000');
    setAccumulationMode('SINGLE_SPIN');
    setDropChancePct(0.05);
    setDropChanceRawInput('0.0500%');
    setStartDateUtc('2026-09-01T00:00:00Z');
    setEndDateUtc('2026-12-31T23:59:59Z');
    setIsActive(true);
  };

  const handleSubmitRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarId) return;

    const targetAvatar = avatars.find((a) => a.id === avatarId);
    const generatedName =
      ruleName.trim() ||
      `${triggerType === 'BET_AMOUNT' ? 'Bet' : 'Win'} ${formatCurrency(
        thresholdValue
      )} (${accumulationMode === 'SINGLE_SPIN' ? 'Single Spin' : 'Cumulative'}) → ${
        targetAvatar?.slug || 'Avatar'
      }`;

    const newRule: AvatarUnlockRule = {
      id: editingRuleId || `RUL-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar_id: avatarId,
      name: generatedName,
      trigger_type: triggerType,
      threshold_value: thresholdValue,
      accumulation_mode: accumulationMode,
      drop_chance_pct: dropChancePct,
      start_date_utc: startDateUtc,
      end_date_utc: endDateUtc,
      is_active: isActive,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    };

    onSaveRule(newRule);
    resetForm();
  };

  // Filtered rules for table
  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchesAvatar =
        tableFilterAvatarId === 'ALL' || rule.avatar_id === tableFilterAvatarId;

      const validity = computeRuleValidity(rule.start_date_utc, rule.end_date_utc);
      const matchesValidity =
        tableValidityFilter === 'ALL' ||
        (tableValidityFilter === 'ACTIVE' && rule.is_active) ||
        (tableValidityFilter === 'INACTIVE' && !rule.is_active) ||
        validity === tableValidityFilter;

      return matchesAvatar && matchesValidity;
    });
  }, [rules, tableFilterAvatarId, tableValidityFilter]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* CREATE FORM CARD */}
      <div className="bg-[#16083D] rounded-2xl border border-[#2E146D] p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-[0_8px_30px_rgba(5,0,20,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2E146D] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#D900FF] p-0.5 shadow-[0_0_12px_rgba(0,229,255,0.4)]">
              <div className="w-full h-full bg-[#16083D] rounded-[10px] flex items-center justify-center">
                <Sliders className="w-5 h-5 text-[#00E5FF]" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase font-rajdhani tracking-wide">
                {editingRuleId ? `Modify Rule: ${editingRuleId}` : 'Create LiveOps Unlock Rule'}
              </h2>
              <p className="text-xs text-purple-300/60">
                Configure hot parameters for drop algorithms and casino triggers.
              </p>
            </div>
          </div>

          {editingRuleId && (
            <button
              onClick={resetForm}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#07011E] text-xs font-bold text-slate-300 hover:text-white border border-[#2E146D]"
            >
              Cancel Editing
            </button>
          )}
        </div>

        <form onSubmit={handleSubmitRule} className="space-y-6">
          {/* Row 1: Autocomplete Avatar selector & Rule name */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Avatar Selector with Autocomplete */}
            <div className="lg:col-span-6 space-y-1.5 relative">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                Associated Avatar (`avatar_id`) *
              </label>

              <div
                onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                className="w-full p-2.5 bg-[#07011E] border border-[#2E146D] hover:border-[#00E5FF]/60 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
              >
                {selectedAvatar ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedAvatar.asset_url}
                      alt={selectedAvatar.slug}
                      className="w-9 h-9 rounded-lg object-cover border border-[#2E146D]"
                    />
                    <div>
                      <div className="text-xs font-bold text-white font-mono-code flex items-center gap-2">
                        {selectedAvatar.slug}
                        <RarityBadge rarity={selectedAvatar.rarity} size="sm" />
                      </div>
                      <div className="text-[10px] text-purple-300/60">{selectedAvatar.name_display}</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-purple-400">Select an avatar...</span>
                )}
                <span className="text-xs text-purple-400">▼</span>
              </div>

              {/* Dropdown list */}
              {isAvatarDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A0948] border border-[#00E5FF]/40 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-30 p-2 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={avatarSearchTerm}
                      onChange={(e) => setAvatarSearchTerm(e.target.value)}
                      placeholder="Search by slug..."
                      className="w-full pl-8 pr-3 py-1.5 bg-[#07011E] border border-[#2E146D] rounded-lg text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredAvatarsForSelect.map((av) => (
                      <div
                        key={av.id}
                        onClick={() => {
                          setAvatarId(av.id);
                          setIsAvatarDropdownOpen(false);
                          setAvatarSearchTerm('');
                        }}
                        className={`p-2 rounded-lg flex items-center justify-between cursor-pointer hover:bg-[#2B0E68] transition-colors ${
                          avatarId === av.id ? 'bg-[#2B0E68] border border-[#00E5FF]/40' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={av.asset_url}
                            alt={av.slug}
                            className="w-7 h-7 rounded object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-white font-mono-code">{av.slug}</div>
                            <div className="text-[10px] text-purple-300/60">{av.name_display}</div>
                          </div>
                        </div>
                        <RarityBadge rarity={av.rarity} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rule Name */}
            <div className="lg:col-span-6 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Descriptive Rule Name
              </label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g. Cyber Ronin Supreme Spin ($1M Bet)"
                className="w-full px-4 py-2.5 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-xs text-white focus:outline-none"
              />
              <p className="text-[10px] text-purple-300/50">
                Optional: If left blank, the system will auto-generate a normalized label.
              </p>
            </div>
          </div>

          {/* Row 2: Trigger Type & Threshold Value */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-6 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#00E5FF]" />
                Trigger Type (`trigger_type`) *
              </label>

              <div className="grid grid-cols-2 gap-2 bg-[#07011E] p-1.5 rounded-xl border border-[#2E146D]">
                <button
                  type="button"
                  onClick={() => setTriggerType('BET_AMOUNT')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    triggerType === 'BET_AMOUNT'
                      ? 'bg-gradient-to-r from-[#00E5FF]/20 to-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  BET_AMOUNT (Bet)
                </button>

                <button
                  type="button"
                  onClick={() => setTriggerType('WIN_AMOUNT')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    triggerType === 'WIN_AMOUNT'
                      ? 'bg-gradient-to-r from-[#39FF14]/20 to-[#39FF14]/10 text-[#39FF14] border border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                      : 'text-purple-300/70 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  WIN_AMOUNT (Win)
                </button>
              </div>
            </div>

            <div className="md:col-span-6 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  Threshold Value (`threshold_value`) *
                </label>
                <span className="text-[10px] text-[#FFDE59] font-mono-code font-bold">
                  Base Currency USD
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={thresholdRawInput}
                  onChange={(e) => handleThresholdChange(e.target.value)}
                  placeholder="$1,000,000"
                  className="w-full px-4 py-2.5 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-sm font-bold font-mono-code text-[#FFDE59] focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-purple-300/50">
                Minimum amount required for the engine to evaluate spin drop odds ({triggerType}).
              </p>
            </div>
          </div>

          {/* Row 3: Accumulation Mode & Drop Chance % */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-6 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                Accumulation Mode (`accumulation_mode`) *
              </label>

              <select
                value={accumulationMode}
                onChange={(e) => setAccumulationMode(e.target.value as AccumulationMode)}
                className="w-full px-4 py-2.5 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-xs text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="SINGLE_SPIN" className="bg-[#07011E]">
                  SINGLE_SPIN (Individual Single Spin)
                </option>
                <option value="CUMULATIVE" className="bg-[#07011E]">
                  CUMULATIVE (Cumulative Session/Event Total)
                </option>
              </select>
              <p className="text-[10px] text-purple-300/50">
                `SINGLE_SPIN` rewards instant high-rollers; `CUMULATIVE` rewards persistence and retention.
              </p>
            </div>

            <div className="md:col-span-6 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  Drop Probability (`drop_chance_pct`) *
                </label>
                <span className="text-[10px] text-[#00E5FF] font-mono-code font-bold">
                  {dropChancePct} / 100
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={dropChanceRawInput}
                  onChange={(e) => handleDropChanceChange(e.target.value)}
                  placeholder="0.0500%"
                  className="w-full px-4 py-2.5 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-sm font-bold font-mono-code text-[#00E5FF] focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-purple-300/50">
                Valid range: 0.0001% to 100.0000%.
              </p>
            </div>
          </div>

          {/* Row 4: Date Range & Switch Toggle `is_active` */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 pt-2">
            <div className="sm:col-span-6 md:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Start Date (UTC)
              </label>
              <input
                type="datetime-local"
                value={startDateUtc.replace('Z', '').substring(0, 16)}
                onChange={(e) => setStartDateUtc(new Date(e.target.value).toISOString())}
                className="w-full px-3 py-2 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-xs text-white font-mono-code focus:outline-none"
              />
            </div>

            <div className="sm:col-span-6 md:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                End Date (UTC)
              </label>
              <input
                type="datetime-local"
                value={endDateUtc.replace('Z', '').substring(0, 16)}
                onChange={(e) => setEndDateUtc(new Date(e.target.value).toISOString())}
                className="w-full px-3 py-2 bg-[#07011E] border border-[#2E146D] focus:border-[#00E5FF] rounded-xl text-xs text-white font-mono-code focus:outline-none"
              />
            </div>

            <div className="sm:col-span-12 md:col-span-4 space-y-1.5 flex flex-col justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Operational State (`is_active`)
              </label>

              <div className="flex items-center gap-3 bg-[#07011E] p-2.5 rounded-xl border border-[#2E146D]">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                    isActive
                      ? 'bg-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.5)]'
                      : 'bg-[#402B6D]'
                  }`}
                >
                  <div
                    className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      isActive ? 'translate-x-6 bg-[#050014]' : 'translate-x-0 bg-slate-300'
                    }`}
                  />
                </button>
                <div className="text-xs font-bold">
                  {isActive ? (
                    <span className="text-[#39FF14] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
                      ACTIVE IN PRODUCTION
                    </span>
                  ) : (
                    <span className="text-purple-300/70">PAUSED / INACTIVE</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#2E146D] flex items-center justify-end gap-3">
            {editingRuleId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl bg-[#07011E] text-xs font-bold text-slate-400 hover:text-white border border-[#2E146D]"
              >
                Discard
              </button>
            )}
            <button
              type="submit"
              className="btn-cta-green px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(57,255,20,0.5)]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              {editingRuleId ? 'Update LiveOps Rule' : 'Register LiveOps Rule'}
            </button>
          </div>
        </form>
      </div>

      {/* ACTIVE RULES TABLE */}
      <div className="bg-[#16083D] rounded-2xl border border-[#2E146D] p-6 space-y-4 shadow-[0_8px_30px_rgba(5,0,20,0.6)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E146D] pb-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-black text-white uppercase font-rajdhani tracking-wider">
                Configured Rules (`avatar_unlock_rules`)
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono-code font-bold bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30">
                {filteredRules.length} registered
              </span>
            </div>
            <p className="text-xs text-purple-300/60">
              Toggle hot switches live to pause or enable drops at runtime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-[#07011E] px-3 py-1.5 rounded-xl border border-[#2E146D]">
              <Filter className="w-3.5 h-3.5 text-[#00E5FF]" />
              <select
                value={tableFilterAvatarId}
                onChange={(e) => setTableFilterAvatarId(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer pr-2"
              >
                <option value="ALL" className="bg-[#07011E]">All Avatars</option>
                {avatars.map((av) => (
                  <option key={av.id} value={av.id} className="bg-[#07011E]">
                    {av.slug}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#07011E] px-3 py-1.5 rounded-xl border border-[#2E146D]">
              <select
                value={tableValidityFilter}
                onChange={(e) => setTableValidityFilter(e.target.value)}
                className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer pr-2"
              >
                <option value="ALL" className="bg-[#07011E]">All States</option>
                <option value="Active" className="bg-[#07011E]">Active Only</option>
                <option value="Scheduled" className="bg-[#07011E]">Scheduled Only</option>
                <option value="Expired" className="bg-[#07011E]">Expired Only</option>
                <option value="ACTIVE" className="bg-[#07011E]">Switch ON Only</option>
                <option value="INACTIVE" className="bg-[#07011E]">Switch OFF Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2E146D] bg-[#07011E]/80 text-[11px] font-bold uppercase tracking-wider text-purple-300/70 select-none">
                <th className="py-3 px-4">Switch State</th>
                <th className="py-3 px-4">ID / Rule</th>
                <th className="py-3 px-4">Associated Avatar</th>
                <th className="py-3 px-4">Trigger & Threshold</th>
                <th className="py-3 px-4">Accumulation</th>
                <th className="py-3 px-4">Probability</th>
                <th className="py-3 px-4">Validity (UTC)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E146D]/50 text-xs">
              {filteredRules.map((rule) => {
                const targetAvatar = avatars.find((a) => a.id === rule.avatar_id);
                const validity = computeRuleValidity(rule.start_date_utc, rule.end_date_utc);

                return (
                  <tr
                    key={rule.id}
                    className="hover:bg-[#1A0948]/70 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleRuleActive(rule.id, !rule.is_active)}
                        className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                          rule.is_active
                            ? 'bg-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.5)]'
                            : 'bg-[#402B6D]'
                        }`}
                        title={rule.is_active ? 'Deactivate rule' : 'Activate rule'}
                      >
                        <div
                          className={`w-4 h-4 rounded-full transition-transform duration-200 ${
                            rule.is_active
                              ? 'translate-x-5 bg-[#050014]'
                              : 'translate-x-0 bg-slate-300'
                          }`}
                        />
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-white font-mono-code">{rule.id}</div>
                      <div className="text-[11px] text-purple-300/70 truncate max-w-xs">{rule.name}</div>
                    </td>

                    <td className="py-3 px-4">
                      {targetAvatar ? (
                        <div className="flex items-center gap-2.5">
                          <img
                            src={targetAvatar.asset_url}
                            alt={targetAvatar.slug}
                            className="w-8 h-8 rounded-lg object-cover border border-[#2E146D]"
                          />
                          <div>
                            <div className="font-bold text-white font-mono-code group-hover:text-[#00E5FF] transition-colors">
                              {targetAvatar.slug}
                            </div>
                            <RarityBadge rarity={targetAvatar.rarity} size="sm" />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Deleted Avatar ({rule.avatar_id})</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono-code ${
                            rule.trigger_type === 'BET_AMOUNT'
                              ? 'bg-[#00E5FF]/20 text-[#00E5FF]'
                              : 'bg-[#39FF14]/20 text-[#39FF14]'
                          }`}
                        >
                          {rule.trigger_type}
                        </span>
                      </div>
                      <div className="text-[#FFDE59] font-bold font-mono-code mt-0.5">
                        {formatCurrency(rule.threshold_value)}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-xs font-mono-code text-purple-200">
                        {rule.accumulation_mode}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono-code font-bold text-[#00E5FF]">
                        {formatPercentage(rule.drop_chance_pct)}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <RuleValidityBadge validity={validity} isActive={rule.is_active} />
                      </div>
                      <div className="text-[10px] text-purple-300/50 font-mono-code mt-1">
                        {formatDateUtc(rule.start_date_utc).split(' ')[0]} →{' '}
                        {formatDateUtc(rule.end_date_utc).split(' ')[0]}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleStartEdit(rule)}
                          className="p-1.5 rounded-lg bg-[#2B0E68] text-purple-300 hover:text-white hover:bg-[#3D1E6D] transition-colors"
                          title="Edit rule"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRule(rule.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                          title="Delete rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
    </div>
  );
};
