import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { KanbanBoard } from './types/kanban';
import { INITIAL_BOARDS } from './data/initialData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Navbar } from './components/Navbar';
import { BoardGallery } from './components/BoardGallery';
import { BoardView } from './components/BoardView';

export function App() {
  const [boards, setBoards] = useLocalStorage<KanbanBoard[]>(
    'nebulaflow_boards_v1',
    INITIAL_BOARDS
  );
  const [activeBoardId, setActiveBoardId] = useLocalStorage<string | null>(
    'nebulaflow_active_board_v1',
    INITIAL_BOARDS[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');

  const activeBoard = boards.find((b) => b.id === activeBoardId) || null;

  const handleCreateBoard = (
    title: string,
    description: string,
    themeId: string
  ) => {
    const newBoard: KanbanBoard = {
      id: `board-${Date.now()}`,
      title,
      description,
      themeId,
      starred: false,
      updatedAt: new Date().toISOString(),
      columns: [
        { id: `col-1-${Date.now()}`, title: 'A Fazer', cardIds: [] },
        { id: `col-2-${Date.now()}`, title: 'Em Andamento', cardIds: [] },
        { id: `col-3-${Date.now()}`, title: 'Revisão', cardIds: [] },
        { id: `col-4-${Date.now()}`, title: 'Concluído', cardIds: [] },
      ],
      cards: {},
    };
    setBoards((prev) => [newBoard, ...prev]);
    setActiveBoardId(newBoard.id);
  };

  const handleDeleteBoard = (boardId: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    if (activeBoardId === boardId) {
      setActiveBoardId(null);
    }
  };

  const handleToggleStarBoard = (boardId: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, starred: !b.starred } : b))
    );
  };

  const handleUpdateBoard = (updatedBoard: KanbanBoard) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === updatedBoard.id ? updatedBoard : b))
    );
  };

  const handleChangeBoardTheme = (themeId: string) => {
    if (!activeBoard) return;
    handleUpdateBoard({
      ...activeBoard,
      themeId,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleResetDemo = () => {
    setBoards(INITIAL_BOARDS);
    setActiveBoardId(INITIAL_BOARDS[0].id);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-slate-100 flex flex-col">
      <Navbar
        activeBoard={activeBoard}
        onBackToGallery={() => {
          setActiveBoardId(null);
          setSearchQuery('');
        }}
        onChangeBoardTheme={handleChangeBoardTheme}
        onResetDemo={handleResetDemo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeBoard ? (
            <motion.div
              key={`board-${activeBoard.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <BoardView
                board={activeBoard}
                searchQuery={searchQuery}
                onUpdateBoard={handleUpdateBoard}
              />
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <BoardGallery
                boards={boards}
                onSelectBoard={(id) => setActiveBoardId(id)}
                onCreateBoard={handleCreateBoard}
                onDeleteBoard={handleDeleteBoard}
                onToggleStarBoard={handleToggleStarBoard}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
