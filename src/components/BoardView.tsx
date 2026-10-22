import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Sparkles, CheckSquare, Users } from 'lucide-react';
import { KanbanBoard, KanbanCard } from '../types/kanban';
import { BOARD_THEMES, WORKSPACE_MEMBERS } from '../data/initialData';
import { ColumnList } from './ColumnList';
import { CardModal } from './CardModal';

interface BoardViewProps {
  board: KanbanBoard;
  searchQuery: string;
  onUpdateBoard: (updated: KanbanBoard) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  board,
  searchQuery,
  onUpdateBoard,
}) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [activeMemberFilter, setActiveMemberFilter] = useState<string | null>(
    null
  );

  const theme =
    BOARD_THEMES.find((t) => t.id === board.themeId) || BOARD_THEMES[0];

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startCol = board.columns.find((c) => c.id === source.droppableId);
    const finishCol = board.columns.find(
      (c) => c.id === destination.droppableId
    );
    if (!startCol || !finishCol) return;

    // Moving within the same column
    if (startCol.id === finishCol.id) {
      const newCardIds = Array.from(startCol.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);

      const newColumns = board.columns.map((col) =>
        col.id === startCol.id ? { ...col, cardIds: newCardIds } : col
      );
      onUpdateBoard({
        ...board,
        columns: newColumns,
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    // Moving across different columns
    const startCardIds = Array.from(startCol.cardIds);
    startCardIds.splice(source.index, 1);

    const finishCardIds = Array.from(finishCol.cardIds);
    finishCardIds.splice(destination.index, 0, draggableId);

    const newColumns = board.columns.map((col) => {
      if (col.id === startCol.id) return { ...col, cardIds: startCardIds };
      if (col.id === finishCol.id) return { ...col, cardIds: finishCardIds };
      return col;
    });

    onUpdateBoard({
      ...board,
      columns: newColumns,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    const newCol = {
      id: `col-${Date.now()}`,
      title: newColumnTitle.trim(),
      cardIds: [],
    };
    onUpdateBoard({
      ...board,
      columns: [...board.columns, newCol],
      updatedAt: new Date().toISOString(),
    });
    setNewColumnTitle('');
    setIsAddingColumn(false);
  };

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    const newColumns = board.columns.map((col) =>
      col.id === columnId ? { ...col, title: newTitle } : col
    );
    onUpdateBoard({
      ...board,
      columns: newColumns,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteColumn = (columnId: string) => {
    const colToDelete = board.columns.find((c) => c.id === columnId);
    if (!colToDelete) return;
    const remainingCards = { ...board.cards };
    colToDelete.cardIds.forEach((id) => {
      delete remainingCards[id];
    });
    const newColumns = board.columns.filter((c) => c.id !== columnId);
    onUpdateBoard({
      ...board,
      columns: newColumns,
      cards: remainingCards,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddCard = (columnId: string, title: string) => {
    const newCardId = `card-${Date.now()}`;
    const newCard: KanbanCard = {
      id: newCardId,
      title,
      description: '',
      labels: [],
      dueDate: null,
      checklist: [],
      memberIds: activeMemberFilter ? [activeMemberFilter] : ['mem-1'],
      createdAt: new Date().toISOString(),
    };

    const newColumns = board.columns.map((col) =>
      col.id === columnId
        ? { ...col, cardIds: [...col.cardIds, newCardId] }
        : col
    );

    onUpdateBoard({
      ...board,
      columns: newColumns,
      cards: {
        ...board.cards,
        [newCardId]: newCard,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateCard = (updatedCard: KanbanCard) => {
    onUpdateBoard({
      ...board,
      cards: {
        ...board.cards,
        [updatedCard.id]: updatedCard,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteCard = (cardId: string) => {
    const remainingCards = { ...board.cards };
    delete remainingCards[cardId];
    const newColumns = board.columns.map((col) => ({
      ...col,
      cardIds: col.cardIds.filter((id) => id !== cardId),
    }));
    onUpdateBoard({
      ...board,
      columns: newColumns,
      cards: remainingCards,
      updatedAt: new Date().toISOString(),
    });
  };

  const selectedCard = selectedCardId ? board.cards[selectedCardId] || null : null;
  const selectedCardColumn = selectedCardId
    ? board.columns.find((col) => col.cardIds.includes(selectedCardId))?.title ||
      ''
    : '';

  // Compute Board Stats
  const allCards = Object.values(board.cards);
  const totalCheckItems = allCards.reduce(
    (acc, c) => acc + c.checklist.length,
    0
  );
  const completedCheckItems = allCards.reduce(
    (acc, c) => acc + c.checklist.filter((i) => i.completed).length,
    0
  );

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] w-full ${theme.bgClass} flex flex-col transition-colors duration-500`}
    >
      {/* Sub-header Bar: Board Description, Stats & Member Quick Filter */}
      <div className="px-4 lg:px-8 py-3.5 border-b border-white/5 bg-black/20 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-semibold text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            {board.columns.length} listas · {allCards.length} cartões
          </span>

          {totalCheckItems > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              Subtarefas: {completedCheckItems}/{totalCheckItems} concluídas
            </span>
          )}

          <p className="text-xs text-slate-400 hidden xl:block truncate max-w-md">
            {board.description}
          </p>
        </div>

        {/* Member Avatar Filter Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Membros:</span>
          </span>
          <div className="flex items-center -space-x-1.5">
            {WORKSPACE_MEMBERS.map((member) => {
              const active = activeMemberFilter === member.id;
              return (
                <motion.button
                  key={member.id}
                  whileHover={{ y: -2, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setActiveMemberFilter(active ? null : member.id)
                  }
                  title={`Filtrar por ${member.name} (${member.role})`}
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${
                    member.avatarGradient
                  } flex items-center justify-center text-[10px] font-bold text-white transition-all ${
                    active
                      ? 'ring-2 ring-white scale-110 z-10 shadow-glow'
                      : 'border-2 border-[#0a0a12] opacity-85 hover:opacity-100'
                  }`}
                >
                  {member.initials}
                </motion.button>
              );
            })}
          </div>
          {activeMemberFilter && (
            <button
              onClick={() => setActiveMemberFilter(null)}
              className="text-[11px] text-purple-300 hover:text-white underline ml-1"
            >
              Todos
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Columns Canvas */}
      <div className="flex-1 overflow-x-auto px-4 lg:px-8 py-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex items-start gap-5 min-w-max pb-4">
            <AnimatePresence initial={false} mode="popLayout">
              {board.columns.map((column) => {
                const columnCards = column.cardIds
                  .map((id) => board.cards[id])
                  .filter(Boolean)
                  .filter((card) => {
                    const matchesQuery =
                      !searchQuery.trim() ||
                      card.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      card.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      card.labels.some((l) =>
                        l.name.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                    const matchesMember =
                      !activeMemberFilter ||
                      card.memberIds.includes(activeMemberFilter);
                    return matchesQuery && matchesMember;
                  });

                return (
                  <ColumnList
                    key={column.id}
                    column={column}
                    cards={columnCards}
                    onRenameColumn={handleRenameColumn}
                    onDeleteColumn={handleDeleteColumn}
                    onAddCard={handleAddCard}
                    onSelectCard={(card) => setSelectedCardId(card.id)}
                  />
                );
              })}
            </AnimatePresence>

            {/* Add New Column Button / Form */}
            <div className="w-80 shrink-0">
              <AnimatePresence mode="wait">
                {isAddingColumn ? (
                  <motion.form
                    key="new-col-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleAddColumn}
                    className="p-4 rounded-3xl bg-[#0d0d17]/90 backdrop-blur-xl border border-purple-500/40 shadow-glow space-y-3"
                  >
                    <input
                      type="text"
                      autoFocus
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      placeholder="Título da lista (ex: QA / Homologação)"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 text-sm text-white placeholder-slate-400 outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-semibold shadow-glow"
                      >
                        Criar Lista
                      </motion.button>
                      <button
                        type="button"
                        onClick={() => setIsAddingColumn(false)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.button
                    key="new-col-btn"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddingColumn(true)}
                    className="w-full py-3.5 px-4 rounded-3xl border-2 border-dashed border-purple-500/30 hover:border-purple-400/60 bg-purple-950/15 hover:bg-purple-950/30 backdrop-blur-md flex items-center justify-center gap-2 text-purple-200 font-semibold text-sm transition-all shadow-lg"
                  >
                    <Plus className="w-4 h-4 text-purple-400" />
                    <span>Adicionar Nova Lista</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </DragDropContext>
      </div>

      {/* Card Detail Modal */}
      <CardModal
        card={selectedCard}
        columnTitle={selectedCardColumn}
        onClose={() => setSelectedCardId(null)}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
      />
    </div>
  );
};
