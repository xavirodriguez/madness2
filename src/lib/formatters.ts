import { RuleValidity } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseCurrencyInput(value: string): number {
  const clean = value.replace(/[^0-9]/g, '');
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatPercentage(pct: number): string {
  return `${pct.toFixed(4)}%`;
}

export function parsePercentageInput(value: string): number {
  const clean = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed));
}

export function computeRuleValidity(startDateIso: string, endDateIso: string): RuleValidity {
  const now = new Date().getTime();
  const start = new Date(startDateIso).getTime();
  const end = new Date(endDateIso).getTime();

  if (now < start) return 'Scheduled';
  if (now > end) return 'Expired';
  return 'Active';
}

export function formatDateUtc(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
  } catch {
    return isoString;
  }
}
