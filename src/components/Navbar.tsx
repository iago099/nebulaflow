import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  ChevronLeft,
  Palette,
  RotateCcw,
  Sparkles,
  Check,
  Search,
  X,
} from 'lucide-react';
import { KanbanBoard } from '../types/kanban';
import { BOARD_THEMES } from '../data/initialData';

interface NavbarProps {
  activeBoard: KanbanBoard | null;
  onBackToGallery: () => void;
  onChangeBoardTheme: (themeId: string) => void;
  onResetDemo: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeBoard,
  onBackToGallery,
  onChangeBoardTheme,
  onResetDemo,
  searchQuery,
  onSearchChange,
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-purple-500/15 bg-[#090911]/80 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Brand & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {activeBoard ? (
          <motion.button
            whileHover={{ scale: 1.03, x: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBackToGallery}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 text-slate-200 text-sm font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-purple-400" />
            <span>Quadros</span>
          </motion.button>
        ) : null}

        <div
          onClick={onBackToGallery}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:inline font-bold tracking-tight text-white text-base">
            Nebula<span className="text-purple-400">Flow</span>
          </span>
        </div>

        {activeBoard && (
          <>
            <span className="text-slate-600 hidden md:inline">/</span>
            <h1 className="text-sm md:text-base font-semibold text-white truncate max-w-[180px] sm:max-w-xs md:max-w-md">
              {activeBoard.title}
            </h1>
          </>
        )}
      </div>

      {/* Center/Right: Search & Board Controls */}
      <div className="flex items-center gap-2.5">
        {activeBoard && (
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filtrar cartões..."
              className="w-36 sm:w-56 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-purple-500/60 rounded-xl pl-9 pr-8 py-1.5 text-sm text-white placeholder-slate-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Theme Picker when inside a board */}
        {activeBoard && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowThemeMenu((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 text-sm font-medium transition-colors"
            >
              <Palette className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Tema do Quadro</span>
            </motion.button>

            <AnimatePresence>
              {showThemeMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowThemeMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#11111b]/95 backdrop-blur-2xl border border-purple-500/30 shadow-glow-lg p-3 z-20"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Atmosfera do Quadro
                    </p>
                    <div className="space-y-1.5">
                      {BOARD_THEMES.map((theme) => {
                        const isSelected = activeBoard.themeId === theme.id;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => {
                              onChangeBoardTheme(theme.id);
                              setShowThemeMenu(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all ${
                              isSelected
                                ? 'border-purple-400 bg-purple-500/20 text-white'
                                : 'border-white/5 hover:border-white/15 bg-white/5 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-6 h-6 rounded-lg bg-gradient-to-br ${theme.previewGradient} border border-white/20 shadow-sm`}
                              />
                              <span className="text-xs font-medium">
                                {theme.name}
                              </span>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-purple-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Reset Demo Data Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onResetDemo}
          title="Restaurar quadros de demonstração"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden md:inline">Restaurar Demo</span>
        </motion.button>
      </div>
    </header>
  );
};
