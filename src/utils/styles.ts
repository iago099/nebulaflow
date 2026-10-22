import { LabelColor } from '../types/kanban';

export const LABEL_COLOR_MAP: Record<
  LabelColor,
  { bg: string; text: string; border: string; dot: string; solid: string }
> = {
  purple: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    border: 'border-purple-500/35',
    dot: 'bg-purple-400',
    solid: 'bg-purple-600',
  },
  fuchsia: {
    bg: 'bg-fuchsia-500/15',
    text: 'text-fuchsia-300',
    border: 'border-fuchsia-500/35',
    dot: 'bg-fuchsia-400',
    solid: 'bg-fuchsia-600',
  },
  indigo: {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-300',
    border: 'border-indigo-500/35',
    dot: 'bg-indigo-400',
    solid: 'bg-indigo-600',
  },
  emerald: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    border: 'border-emerald-500/35',
    dot: 'bg-emerald-400',
    solid: 'bg-emerald-600',
  },
  amber: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/35',
    dot: 'bg-amber-400',
    solid: 'bg-amber-600',
  },
  rose: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-300',
    border: 'border-rose-500/35',
    dot: 'bg-rose-400',
    solid: 'bg-rose-600',
  },
  cyan: {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-300',
    border: 'border-cyan-500/35',
    dot: 'bg-cyan-400',
    solid: 'bg-cyan-600',
  },
};

export function formatShortDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  const date = new Date(year, month, day);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

export function isDateOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dateStr.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  return due < today;
}
