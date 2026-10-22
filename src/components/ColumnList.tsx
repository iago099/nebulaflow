import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
} from 'lucide-react';
import { KanbanCard, KanbanColumn } from '../types/kanban';
import { TaskCard } from './TaskCard';

interface ColumnListProps {
  column: KanbanColumn;
  cards: KanbanCard[];
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onAddCard: (columnId: string, title: string) => void;
  onSelectCard: (card: KanbanCard) => void;
}

export const ColumnList: React.FC<ColumnListProps> = ({
  column,
  cards,
  onRenameColumn,
  onDeleteColumn,
  onAddCard,
  onSelectCard,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleSaveTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    } else {
      setTitleDraft(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    onAddCard(column.id, newCardTitle.trim());
    setNewCardTitle('');
    setIsAddingCard(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 12 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="w-80 shrink-0 flex flex-col max-h-[calc(100vh-11.5rem)] rounded-3xl bg-[#0d0d17]/85 backdrop-blur-xl border border-white/10 shadow-xl"
    >
      {/* Column Header */}
      <div className="p-4 pb-3 flex items-center justify-between gap-2 border-b border-white/5">
        {isEditingTitle ? (
          <div className="flex items-center gap-1.5 flex-1">
            <input
              type="text"
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') {
                  setTitleDraft(column.title);
                  setIsEditingTitle(false);
                }
              }}
              onBlur={handleSaveTitle}
              className="w-full px-2.5 py-1 rounded-xl bg-white/10 border border-purple-500 text-sm font-bold text-white outline-none"
            />
            <button
              onClick={handleSaveTitle}
              className="p-1.5 rounded-lg bg-purple-600 text-white"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => {
              setTitleDraft(column.title);
              setIsEditingTitle(true);
            }}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group/title flex-1"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400 shadow-glow" />
            <h3 className="text-sm font-bold text-white truncate group-hover/title:text-purple-300 transition-colors">
              {column.title}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-[11px] font-semibold text-purple-300">
              {cards.length}
            </span>
          </div>
        )}

        {/* Column Actions */}
        {!isEditingTitle && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setTitleDraft(column.title);
                setIsEditingTitle(true);
              }}
              title="Renomear lista"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteColumn(column.id)}
              title="Excluir lista"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/15 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Droppable Cards Container */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto px-3.5 pt-3 pb-2 min-h-[120px] transition-colors rounded-b-2xl ${
              snapshot.isDraggingOver
                ? 'bg-purple-500/10 ring-1 ring-inset ring-purple-500/30'
                : ''
            }`}
          >
            {cards.map((card, index) => (
              <TaskCard
                key={card.id}
                card={card}
                index={index}
                onClick={onSelectCard}
              />
            ))}
            {provided.placeholder}

            {cards.length === 0 && !snapshot.isDraggingOver && !isAddingCard && (
              <div className="h-24 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-3 text-xs text-slate-500">
                Arraste um cartão para cá ou crie um novo abaixo
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Footer: Add Card Button or Form */}
      <div className="p-3 pt-2 border-t border-white/5">
        <AnimatePresence mode="wait">
          {isAddingCard ? (
            <motion.form
              key="add-card-form"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              onSubmit={handleCreateCard}
              className="space-y-2.5"
            >
              <textarea
                rows={2}
                autoFocus
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateCard(e);
                  }
                  if (e.key === 'Escape') {
                    setIsAddingCard(false);
                  }
                }}
                placeholder="Digite o título do cartão..."
                className="w-full px-3 py-2 rounded-xl bg-[#161625] border border-purple-500/50 text-sm text-white placeholder-slate-400 outline-none resize-none"
              />
              <div className="flex items-center justify-between gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-semibold shadow-glow"
                >
                  Adicionar Cartão
                </motion.button>
                <button
                  type="button"
                  onClick={() => setIsAddingCard(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button
              key="add-card-btn"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddingCard(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-purple-500/15 border border-white/5 hover:border-purple-500/30 text-slate-300 hover:text-purple-200 text-xs font-semibold transition-all"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              <span>Novo Cartão</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
