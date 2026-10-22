import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Star,
  FolderKanban,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  LayoutGrid,
  X,
} from 'lucide-react';
import { KanbanBoard } from '../types/kanban';
import { BOARD_THEMES } from '../data/initialData';

interface BoardGalleryProps {
  boards: KanbanBoard[];
  onSelectBoard: (boardId: string) => void;
  onCreateBoard: (title: string, description: string, themeId: string) => void;
  onDeleteBoard: (boardId: string) => void;
  onToggleStarBoard: (boardId: string) => void;
}

export const BoardGallery: React.FC<BoardGalleryProps> = ({
  boards,
  onSelectBoard,
  onCreateBoard,
  onDeleteBoard,
  onToggleStarBoard,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(BOARD_THEMES[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateBoard(
      title.trim(),
      description.trim() || 'Quadro de gestão visual ágil e tarefas.',
      selectedTheme
    );
    setTitle('');
    setDescription('');
    setSelectedTheme(BOARD_THEMES[0].id);
    setIsCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-purple-500/25 bg-gradient-to-br from-purple-950/50 via-[#0e0e18] to-[#08080d] p-6 sm:p-10 mb-10 shadow-glow"
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Workspace Sincronizado Localmente</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Seus Quadros de Projetos
            </h1>
            <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed">
              Organize sprints, roadmaps e fluxos de trabalho com animações elásticas em tempo real, checklists inteligentes e temas escuros de alto contraste.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsCreating(true)}
            className="self-start md:self-center flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold text-sm shadow-glow transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Quadro</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Create Board Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 15 }}
              className="w-full max-w-lg rounded-3xl bg-[#11111b] border border-purple-500/30 shadow-glow-lg p-6 sm:p-8 relative"
            >
              <button
                onClick={() => setIsCreating(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Criar Novo Quadro
                  </h2>
                  <p className="text-xs text-slate-400">
                    Já inicia com as colunas A Fazer, Em Andamento, Revisão e Concluído
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Título do Projeto *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Redesign Plataforma Mobile Q4"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder-slate-500 outline-none text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Descrição Curta
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Objetivo principal ou escopo deste quadro..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 text-white placeholder-slate-500 outline-none text-sm resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
                    Plano de Fundo (Tema Cyberpunk / Gradiente)
                  </label>
                  <div className="grid grid-cols-5 gap-2.5">
                    {BOARD_THEMES.map((theme) => {
                      const active = selectedTheme === theme.id;
                      return (
                        <button
                          type="button"
                          key={theme.id}
                          onClick={() => setSelectedTheme(theme.id)}
                          className={`group relative h-14 rounded-xl bg-gradient-to-br ${theme.previewGradient} border-2 transition-all flex items-center justify-center ${
                            active
                              ? 'border-white scale-105 shadow-glow'
                              : 'border-white/15 opacity-75 hover:opacity-100'
                          }`}
                          title={theme.name}
                        >
                          {active && (
                            <CheckCircle2 className="w-5 h-5 text-white drop-shadow" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-semibold shadow-glow"
                  >
                    Criar Quadro
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Boards Grid */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">
            Quadros Ativos ({boards.length})
          </h2>
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {boards.map((board) => {
            const theme =
              BOARD_THEMES.find((t) => t.id === board.themeId) ||
              BOARD_THEMES[0];
            const totalCards = Object.keys(board.cards).length;
            const totalColumns = board.columns.length;

            return (
              <motion.div
                layout
                key={board.id}
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                onClick={() => onSelectBoard(board.id)}
                className="group relative rounded-3xl bg-[#0f0f19] border border-white/10 hover:border-purple-500/50 overflow-hidden cursor-pointer shadow-lg hover:shadow-glow transition-all flex flex-col justify-between"
              >
                {/* Top Gradient Preview Strip */}
                <div
                  className={`h-28 w-full bg-gradient-to-br ${theme.previewGradient} p-5 flex items-start justify-between relative`}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <span className="relative z-10 px-2.5 py-1 rounded-lg bg-black/45 backdrop-blur-md border border-white/15 text-[11px] font-medium text-purple-200">
                    {theme.name}
                  </span>

                  <div
                    className="relative z-10 flex items-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onToggleStarBoard(board.id)}
                      title={board.starred ? 'Remover destaque' : 'Destacar quadro'}
                      className={`p-2 rounded-xl backdrop-blur-md border transition-colors ${
                        board.starred
                          ? 'bg-amber-500/25 border-amber-400/50 text-amber-300'
                          : 'bg-black/40 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          board.starred ? 'fill-amber-300' : ''
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => onDeleteBoard(board.id)}
                      title="Excluir quadro"
                      className="p-2 rounded-xl bg-black/40 hover:bg-rose-500/30 border border-white/10 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 backdrop-blur-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                        {board.title}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {board.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-slate-300 font-medium">
                        {totalColumns} {totalColumns === 1 ? 'lista' : 'listas'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium">
                        {totalCards} {totalCards === 1 ? 'cartão' : 'cartões'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Abrir quadro →
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Add New Board Card Tile */}
          <motion.button
            layout
            whileHover={{ scale: 1.01, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreating(true)}
            className="min-h-[240px] rounded-3xl border-2 border-dashed border-purple-500/25 hover:border-purple-500/60 bg-purple-950/10 hover:bg-purple-950/20 flex flex-col items-center justify-center gap-3 p-6 text-slate-400 hover:text-purple-200 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm text-white">
                Criar Novo Quadro
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Adicione um novo espaço de projeto
              </p>
            </div>
          </motion.button>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
