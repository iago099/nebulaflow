import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Tag,
  Calendar,
  CheckSquare,
  Users,
  AlignLeft,
  Plus,
  Trash2,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  CardLabel,
  ChecklistItem,
  KanbanCard,
  LabelColor,
} from '../types/kanban';
import { DEFAULT_LABELS, WORKSPACE_MEMBERS } from '../data/initialData';
import { LABEL_COLOR_MAP } from '../utils/styles';

interface CardModalProps {
  card: KanbanCard | null;
  columnTitle: string;
  onClose: () => void;
  onUpdateCard: (updated: KanbanCard) => void;
  onDeleteCard: (cardId: string) => void;
}

const COLOR_OPTIONS: LabelColor[] = [
  'purple',
  'fuchsia',
  'indigo',
  'emerald',
  'amber',
  'rose',
  'cyan',
];

export const CardModal: React.FC<CardModalProps> = ({
  card,
  columnTitle,
  onClose,
  onUpdateCard,
  onDeleteCard,
}) => {
  const [newCheckText, setNewCheckText] = useState('');
  const [customLabelName, setCustomLabelName] = useState('');
  const [customLabelColor, setCustomLabelColor] =
    useState<LabelColor>('purple');
  const [showCustomLabelForm, setShowCustomLabelForm] = useState(false);

  if (!card) return null;

  const totalCheck = card.checklist.length;
  const doneCheck = card.checklist.filter((i) => i.completed).length;
  const progressPct =
    totalCheck > 0 ? Math.round((doneCheck / totalCheck) * 100) : 0;

  const toggleLabel = (label: CardLabel) => {
    const exists = card.labels.some((l) => l.id === label.id);
    const updatedLabels = exists
      ? card.labels.filter((l) => l.id !== label.id)
      : [...card.labels, label];
    onUpdateCard({ ...card, labels: updatedLabels });
  };

  const handleAddCustomLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLabelName.trim()) return;
    const newLabel: CardLabel = {
      id: `lbl-custom-${Date.now()}`,
      name: customLabelName.trim(),
      color: customLabelColor,
    };
    onUpdateCard({ ...card, labels: [...card.labels, newLabel] });
    setCustomLabelName('');
    setShowCustomLabelForm(false);
  };

  const toggleMember = (memberId: string) => {
    const exists = card.memberIds.includes(memberId);
    const updatedMembers = exists
      ? card.memberIds.filter((id) => id !== memberId)
      : [...card.memberIds, memberId];
    onUpdateCard({ ...card, memberIds: updatedMembers });
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckText.trim()) return;
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      text: newCheckText.trim(),
      completed: false,
    };
    onUpdateCard({
      ...card,
      checklist: [...card.checklist, newItem],
    });
    setNewCheckText('');
  };

  const toggleChecklistItem = (itemId: string) => {
    const updated = card.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateCard({ ...card, checklist: updated });
  };

  const removeChecklistItem = (itemId: string) => {
    const updated = card.checklist.filter((item) => item.id !== itemId);
    onUpdateCard({ ...card, checklist: updated });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#10101c] border border-purple-500/30 shadow-glow-lg p-6 sm:p-8 text-slate-100"
        >
          {/* Top Accent Line */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  Lista: {columnTitle}
                </span>
              </div>
              <input
                type="text"
                value={card.title}
                onChange={(e) =>
                  onUpdateCard({ ...card, title: e.target.value })
                }
                className="w-full bg-transparent text-xl sm:text-2xl font-extrabold text-white focus:bg-white/5 focus:px-3 py-1 rounded-xl border border-transparent focus:border-purple-500/50 outline-none transition-all"
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left / Main Content (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Labels & Due Date Summary */}
              <div className="flex flex-wrap items-center gap-2">
                {card.labels.map((label) => {
                  const style =
                    LABEL_COLOR_MAP[label.color] || LABEL_COLOR_MAP.purple;
                  return (
                    <span
                      key={label.id}
                      onClick={() => toggleLabel(label)}
                      title="Clique para remover etiqueta"
                      className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${style.bg} ${style.text} ${style.border} hover:opacity-80 transition-opacity`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${style.dot}`}
                      />
                      {label.name}
                    </span>
                  );
                })}
              </div>

              {/* Description Section */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <AlignLeft className="w-4 h-4 text-purple-400" />
                  Descrição Detalhada
                </label>
                <textarea
                  rows={4}
                  value={card.description}
                  onChange={(e) =>
                    onUpdateCard({ ...card, description: e.target.value })
                  }
                  placeholder="Adicione especificações técnicas, links, critérios de aceite ou notas sobre esta tarefa..."
                  className="w-full p-3.5 rounded-2xl bg-[#161626] border border-white/10 focus:border-purple-500/60 text-sm text-slate-200 placeholder-slate-500 outline-none resize-y leading-relaxed transition-colors"
                />
              </div>

              {/* Checklist Section with Animated Progress Bar */}
              <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#151525]/90 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Checklist de Subtarefas
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {doneCheck}/{totalCheck} ({progressPct}%)
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    initial={false}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                    className={`h-full rounded-full ${
                      progressPct === 100
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                        : 'bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                    }`}
                  />
                </div>

                {/* Checklist Items */}
                <div className="space-y-2 pt-1">
                  <AnimatePresence initial={false}>
                    {card.checklist.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="group flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => toggleChecklistItem(item.id)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                              item.completed
                                ? 'bg-gradient-to-br from-purple-500 to-fuchsia-600 border-purple-400 text-white shadow-glow'
                                : 'border-white/25 bg-black/30 hover:border-purple-400'
                            }`}
                          >
                            {item.completed && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span
                            className={`text-sm transition-all ${
                              item.completed
                                ? 'line-through text-slate-500'
                                : 'text-slate-200'
                            }`}
                          >
                            {item.text}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeChecklistItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add Checklist Item Form */}
                <form
                  onSubmit={handleAddChecklistItem}
                  className="flex items-center gap-2 pt-2"
                >
                  <input
                    type="text"
                    value={newCheckText}
                    onChange={(e) => setNewCheckText(e.target.value)}
                    placeholder="Adicionar item ao checklist..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 text-sm text-white placeholder-slate-500 outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Incluir</span>
                  </motion.button>
                </form>
              </div>
            </div>

            {/* Right Sidebar Controls (Labels, Due Date, Members, Delete) */}
            <div className="space-y-5">
              {/* Due Date Picker */}
              <div className="p-4 rounded-2xl bg-[#161626] border border-white/10 space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Prazo de Entrega
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={card.dueDate || ''}
                    onChange={(e) =>
                      onUpdateCard({
                        ...card,
                        dueDate: e.target.value || null,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-purple-500 text-xs text-white outline-none"
                  />
                  {card.dueDate && (
                    <button
                      type="button"
                      onClick={() => onUpdateCard({ ...card, dueDate: null })}
                      title="Limpar prazo"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Members Assignment */}
              <div className="p-4 rounded-2xl bg-[#161626] border border-white/10 space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Users className="w-4 h-4 text-purple-400" />
                  Membros Responsáveis
                </label>
                <div className="space-y-1.5">
                  {WORKSPACE_MEMBERS.map((member) => {
                    const isAssigned = card.memberIds.includes(member.id);
                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => toggleMember(member.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition-all ${
                          isAssigned
                            ? 'bg-purple-500/15 border-purple-500/40 text-white'
                            : 'bg-black/25 border-white/5 hover:border-white/15 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-full bg-gradient-to-br ${member.avatarGradient} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}
                          >
                            {member.initials}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-semibold truncate">
                              {member.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        {isAssigned && (
                          <Check className="w-4 h-4 text-purple-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colored Labels Selector */}
              <div className="p-4 rounded-2xl bg-[#161626] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <Tag className="w-4 h-4 text-purple-400" />
                    Etiquetas
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCustomLabelForm((p) => !p)}
                    className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    {showCustomLabelForm ? 'Fechar' : '+ Nova'}
                  </button>
                </div>

                {showCustomLabelForm && (
                  <form
                    onSubmit={handleAddCustomLabel}
                    className="p-2.5 rounded-xl bg-black/40 border border-purple-500/30 space-y-2"
                  >
                    <input
                      type="text"
                      value={customLabelName}
                      onChange={(e) => setCustomLabelName(e.target.value)}
                      placeholder="Nome da etiqueta..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none"
                    />
                    <div className="flex items-center justify-between gap-1">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCustomLabelColor(c)}
                          className={`w-5 h-5 rounded-full ${
                            LABEL_COLOR_MAP[c].solid
                          } ${
                            customLabelColor === c
                              ? 'ring-2 ring-white scale-110'
                              : 'opacity-60'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="w-full py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold"
                    >
                      Criar Etiqueta
                    </button>
                  </form>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_LABELS.map((label) => {
                    const active = card.labels.some((l) => l.id === label.id);
                    const style = LABEL_COLOR_MAP[label.color];
                    return (
                      <button
                        key={label.id}
                        type="button"
                        onClick={() => toggleLabel(label)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                          active
                            ? `${style.bg} ${style.text} ${style.border} ring-1 ring-purple-400/40`
                            : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${style.dot}`}
                        />
                        {label.name}
                        {active && <Check className="w-3 h-3 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Danger Zone: Delete Card */}
              <button
                type="button"
                onClick={() => {
                  onDeleteCard(card.id);
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir Cartão</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
