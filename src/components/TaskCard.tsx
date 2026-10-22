import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import {
  Calendar,
  CheckSquare,
  AlignLeft,
  Sparkles,
} from 'lucide-react';
import { KanbanCard } from '../types/kanban';
import { WORKSPACE_MEMBERS } from '../data/initialData';
import {
  LABEL_COLOR_MAP,
  formatShortDate,
  isDateOverdue,
} from '../utils/styles';

interface TaskCardProps {
  card: KanbanCard;
  index: number;
  onClick: (card: KanbanCard) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ card, index, onClick }) => {
  const totalCheck = card.checklist.length;
  const doneCheck = card.checklist.filter((item) => item.completed).length;
  const progressPct = totalCheck > 0 ? Math.round((doneCheck / totalCheck) * 100) : 0;
  const allCompleted = totalCheck > 0 && doneCheck === totalCheck;
  const overdue = isDateOverdue(card.dueDate) && !allCompleted;

  const assignedMembers = WORKSPACE_MEMBERS.filter((m) =>
    card.memberIds.includes(m.id)
  );

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
          }}
          className="mb-3 outline-none select-none"
        >
          <motion.div
            layout="position"
            onClick={() => onClick(card)}
            animate={{
              scale: snapshot.isDragging ? 1.04 : 1,
              rotate: snapshot.isDragging ? 1.5 : 0,
            }}
            whileHover={
              !snapshot.isDragging
                ? { y: -2, scale: 1.01 }
                : undefined
            }
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 26,
            }}
            className={`group relative rounded-2xl p-4 cursor-grab active:cursor-grabbing border transition-colors ${
              snapshot.isDragging
                ? 'bg-[#19192b]/95 border-purple-400 shadow-card-drag ring-2 ring-purple-500/40 z-50 backdrop-blur-xl'
                : 'bg-[#131320]/90 hover:bg-[#181828] border-white/10 hover:border-purple-500/40 shadow-md'
            }`}
          >
            {/* Subtle top highlight on hover */}
            <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Labels */}
            {card.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {card.labels.map((label) => {
                  const style = LABEL_COLOR_MAP[label.color] || LABEL_COLOR_MAP.purple;
                  return (
                    <span
                      key={label.id}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {label.name}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Card Title */}
            <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white leading-snug mb-2">
              {card.title}
            </h4>

            {/* Animated Checklist Progress Bar (when checklist exists) */}
            {totalCheck > 0 && (
              <div className="mb-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <CheckSquare className="w-3 h-3 text-purple-400" />
                    Progresso
                  </span>
                  <span
                    className={`font-semibold ${
                      allCompleted ? 'text-emerald-400' : 'text-purple-300'
                    }`}
                  >
                    {progressPct}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    className={`h-full rounded-full ${
                      allCompleted
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Footer Metadata & Member Avatars */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center flex-wrap gap-2 text-xs">
                {/* Due Date */}
                {card.dueDate && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-medium ${
                      allCompleted
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : overdue
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    {formatShortDate(card.dueDate)}
                  </span>
                )}

                {/* Description Indicator */}
                {card.description && (
                  <span
                    title="Este cartão possui descrição detalhada"
                    className="inline-flex items-center p-1 rounded-md bg-white/5 text-slate-400"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </span>
                )}

                {/* Checklist Counter */}
                {totalCheck > 0 && (
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-medium ${
                      allCompleted
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {doneCheck}/{totalCheck}
                  </span>
                )}
              </div>

              {/* Member Avatars */}
              {assignedMembers.length > 0 && (
                <div className="flex items-center -space-x-2">
                  {assignedMembers.map((member) => (
                    <div
                      key={member.id}
                      title={`${member.name} (${member.role})`}
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${member.avatarGradient} border-2 border-[#131320] flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                    >
                      {member.initials}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {snapshot.isDragging && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-glow">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </Draggable>
  );
};
