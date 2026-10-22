export type LabelColor =
  | 'purple'
  | 'fuchsia'
  | 'indigo'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'cyan';

export interface CardLabel {
  id: string;
  name: string;
  color: LabelColor;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  avatarGradient: string;
  initials: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  labels: CardLabel[];
  dueDate: string | null; // ISO date string YYYY-MM-DD
  checklist: ChecklistItem[];
  memberIds: string[];
  createdAt: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardTheme {
  id: string;
  name: string;
  bgClass: string;
  previewGradient: string;
  accentColor: string;
}

export interface KanbanBoard {
  id: string;
  title: string;
  description: string;
  themeId: string;
  starred?: boolean;
  columns: KanbanColumn[];
  cards: Record<string, KanbanCard>;
  updatedAt: string;
}
