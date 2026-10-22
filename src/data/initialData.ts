import { BoardTheme, CardLabel, KanbanBoard, Member } from '../types/kanban';

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'cyber-nebula',
    name: 'Cyber Nebula',
    bgClass: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-950/60 via-[#090910] to-[#050508]',
    previewGradient: 'from-purple-600 via-violet-800 to-slate-950',
    accentColor: '#a855f7',
  },
  {
    id: 'midnight-synth',
    name: 'Midnight Synthwave',
    bgClass: 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-fuchsia-950/50 via-indigo-950/30 to-[#060609]',
    previewGradient: 'from-fuchsia-600 via-purple-800 to-indigo-950',
    accentColor: '#d946ef',
  },
  {
    id: 'obsidian-matrix',
    name: 'Obsidian Void',
    bgClass: 'bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-indigo-950/55 via-[#08080e] to-[#040407]',
    previewGradient: 'from-indigo-600 via-slate-900 to-black',
    accentColor: '#6366f1',
  },
  {
    id: 'aurora-cyber',
    name: 'Aurora Borealis',
    bgClass: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/45 via-purple-950/35 to-[#06060b]',
    previewGradient: 'from-emerald-500 via-purple-800 to-slate-950',
    accentColor: '#10b981',
  },
  {
    id: 'crimson-eclipse',
    name: 'Crimson Eclipse',
    bgClass: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-950/50 via-purple-950/30 to-[#07070b]',
    previewGradient: 'from-rose-600 via-purple-900 to-slate-950',
    accentColor: '#f43f5e',
  },
];

export const DEFAULT_LABELS: CardLabel[] = [
  { id: 'lbl-1', name: 'Alta Prioridade', color: 'rose' },
  { id: 'lbl-2', name: 'Design System', color: 'purple' },
  { id: 'lbl-3', name: 'Frontend / UI', color: 'fuchsia' },
  { id: 'lbl-4', name: 'Arquitetura', color: 'indigo' },
  { id: 'lbl-5', name: 'Performance', color: 'emerald' },
  { id: 'lbl-6', name: 'Em Revisão', color: 'amber' },
  { id: 'lbl-7', name: 'API / Dados', color: 'cyan' },
];

export const WORKSPACE_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    name: 'Helena Vance',
    role: 'Staff UI/UX Designer',
    initials: 'HV',
    avatarGradient: 'from-purple-500 to-fuchsia-600',
  },
  {
    id: 'mem-2',
    name: 'Lucas Kovács',
    role: 'Senior Frontend Engineer',
    initials: 'LK',
    avatarGradient: 'from-indigo-500 to-cyan-500',
  },
  {
    id: 'mem-3',
    name: 'Sofia Miyazaki',
    role: 'Product Manager',
    initials: 'SM',
    avatarGradient: 'from-rose-500 to-amber-500',
  },
  {
    id: 'mem-4',
    name: 'Rafael Costa',
    role: 'Tech Lead',
    initials: 'RC',
    avatarGradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'mem-5',
    name: 'Nina Sterling',
    role: 'Motion Engineer',
    initials: 'NS',
    avatarGradient: 'from-fuchsia-500 to-purple-700',
  },
];

export const INITIAL_BOARDS: KanbanBoard[] = [
  {
    id: 'board-nebulaflow-v2',
    title: 'NebulaFlow Design System 2.0',
    description: 'Arquitetura de componentes, micro-interações com Framer Motion e tokens em Dark Mode.',
    themeId: 'cyber-nebula',
    starred: true,
    updatedAt: '2026-10-22T07:30:00.000Z',
    columns: [
      {
        id: 'col-backlog',
        title: 'A Fazer',
        cardIds: ['card-1', 'card-2'],
      },
      {
        id: 'col-progress',
        title: 'Em Andamento',
        cardIds: ['card-3', 'card-4'],
      },
      {
        id: 'col-review',
        title: 'Revisão',
        cardIds: ['card-5'],
      },
      {
        id: 'col-done',
        title: 'Concluído',
        cardIds: ['card-6'],
      },
    ],
    cards: {
      'card-1': {
        id: 'card-1',
        title: 'Definir paleta Cyberpunk SaaS & Tokens de Iluminação',
        description:
          'Criar variáveis semânticas de superfície (Obsidian 950/900/850) com bordas translúcidas e sombras neon em violeta (#8b5cf6) e fúcsia (#d946ef).',
        labels: [DEFAULT_LABELS[1], DEFAULT_LABELS[2]],
        dueDate: '2026-10-28',
        checklist: [
          { id: 'chk-1', text: 'Mapear contrastes WCAG AAA no fundo escuro', completed: true },
          { id: 'chk-2', text: 'Criar tokens de glow para estados de foco e drag', completed: true },
          { id: 'chk-3', text: 'Documentar gradientes de superfície no Figma', completed: false },
        ],
        memberIds: ['mem-1', 'mem-5'],
        createdAt: '2026-10-18T10:00:00.000Z',
      },
      'card-2': {
        id: 'card-2',
        title: 'Implementar Atalhos de Teclado e Busca Instantânea',
        description:
          'Permitir filtragem rápida de cartões por título, etiquetas ou membros responsáveis diretamente na barra superior do quadro.',
        labels: [DEFAULT_LABELS[2], DEFAULT_LABELS[4]],
        dueDate: '2026-11-02',
        checklist: [
          { id: 'chk-21', text: 'Filtro reativo por texto na barra do quadro', completed: true },
          { id: 'chk-22', text: 'Filtro rápido por etiquetas coloridas', completed: false },
        ],
        memberIds: ['mem-2'],
        createdAt: '2026-10-19T14:20:00.000Z',
      },
      'card-3': {
        id: 'card-3',
        title: 'Física Elástica no Drag and Drop de Cartões',
        description:
          'Integrar @hello-pangea/dnd com animações suaves de elevação, inclinação sutil (tilt) e sombra dinâmica roxa ao arrastar cartões entre colunas.',
        labels: [DEFAULT_LABELS[0], DEFAULT_LABELS[2]],
        dueDate: '2026-10-25',
        checklist: [
          { id: 'chk-31', text: 'Configurar DragDropContext e Droppable para listas', completed: true },
          { id: 'chk-32', text: 'Adicionar efeito de levitação e rotação no estado isDragging', completed: true },
          { id: 'chk-33', text: 'Testar reordenação fluida entre múltiplas listas', completed: true },
          { id: 'chk-34', text: 'Ajustar feedback visual da zona de drop', completed: false },
        ],
        memberIds: ['mem-2', 'mem-5', 'mem-4'],
        createdAt: '2026-10-20T09:15:00.000Z',
      },
      'card-4': {
        id: 'card-4',
        title: 'Modal Detalhado de Cartão com Barra de Progresso Animada',
        description:
          'Construir visualização completa do cartão com edição inline de título, descrição, gerenciamento de etiquetas, seletor de prazo, membros e checklist dinâmico.',
        labels: [DEFAULT_LABELS[1], DEFAULT_LABELS[3]],
        dueDate: '2026-10-26',
        checklist: [
          { id: 'chk-41', text: 'Criar barra de progresso com spring physics (Framer Motion)', completed: true },
          { id: 'chk-42', text: 'Permitir adicionar, marcar e remover itens do checklist', completed: true },
          { id: 'chk-43', text: 'Seletor interativo de membros com avatares', completed: false },
        ],
        memberIds: ['mem-1', 'mem-3'],
        createdAt: '2026-10-20T16:40:00.000Z',
      },
      'card-5': {
        id: 'card-5',
        title: 'Sincronização Automática com LocalStorage',
        description:
          'Garantir que todas as alterações de quadros, listas, cartões, checklists e temas personalizados sejam salvas instantaneamente no navegador.',
        labels: [DEFAULT_LABELS[6], DEFAULT_LABELS[5]],
        dueDate: '2026-10-24',
        checklist: [
          { id: 'chk-51', text: 'Criar store persistente com serialização segura', completed: true },
          { id: 'chk-52', text: 'Botão para restaurar dados de demonstração se necessário', completed: true },
        ],
        memberIds: ['mem-4'],
        createdAt: '2026-10-21T11:10:00.000Z',
      },
      'card-6': {
        id: 'card-6',
        title: 'Setup da Arquitetura React + Tailwind CSS + Lucide Icons',
        description:
          'Estruturação modular de pastas, tipagem estrita em TypeScript e configuração do tema escuro nativo.',
        labels: [DEFAULT_LABELS[3], DEFAULT_LABELS[4]],
        dueDate: '2026-10-20',
        checklist: [
          { id: 'chk-61', text: 'Definir interfaces TypeScript para Board, Column e Card', completed: true },
          { id: 'chk-62', text: 'Configurar paleta customizada no Tailwind', completed: true },
        ],
        memberIds: ['mem-2', 'mem-4'],
        createdAt: '2026-10-15T08:00:00.000Z',
      },
    },
  },
  {
    id: 'board-ai-launch',
    title: 'Lançamento SaaS — Hyperion AI',
    description: 'Planejamento de campanha, landing page interativa e integração de pagamentos.',
    themeId: 'midnight-synth',
    starred: false,
    updatedAt: '2026-10-21T19:00:00.000Z',
    columns: [
      {
        id: 'col-ai-1',
        title: 'A Fazer',
        cardIds: ['card-ai-1'],
      },
      {
        id: 'col-ai-2',
        title: 'Em Andamento',
        cardIds: ['card-ai-2'],
      },
      {
        id: 'col-ai-3',
        title: 'Concluído',
        cardIds: ['card-ai-3'],
      },
    ],
    cards: {
      'card-ai-1': {
        id: 'card-ai-1',
        title: 'Hero Section 3D com Shaders Interativos',
        description: 'Desenvolver animação de entrada com partículas roxas e call-to-action de alta conversão.',
        labels: [DEFAULT_LABELS[2], DEFAULT_LABELS[0]],
        dueDate: '2026-11-05',
        checklist: [
          { id: 'chk-ai-1', text: 'Protótipo de movimento', completed: true },
          { id: 'chk-ai-2', text: 'Otimização para 60fps mobile', completed: false },
        ],
        memberIds: ['mem-1', 'mem-5'],
        createdAt: '2026-10-20T12:00:00.000Z',
      },
      'card-ai-2': {
        id: 'card-ai-2',
        title: 'Integração de Checkout & Webhooks Stripe',
        description: 'Fluxo de assinatura mensal/anual com upgrade instantâneo de workspace.',
        labels: [DEFAULT_LABELS[6], DEFAULT_LABELS[3]],
        dueDate: '2026-10-29',
        checklist: [
          { id: 'chk-ai-3', text: 'Configurar planos e preços', completed: true },
          { id: 'chk-ai-4', text: 'Testar webhooks em ambiente sandbox', completed: true },
          { id: 'chk-ai-5', text: 'Tela de confirmação animada', completed: false },
        ],
        memberIds: ['mem-4', 'mem-2'],
        createdAt: '2026-10-21T09:00:00.000Z',
      },
      'card-ai-3': {
        id: 'card-ai-3',
        title: 'Identidade Visual & Guia de Copywriting',
        description: 'Tom de voz futurista, direto e focado em produtividade para equipes de alta performance.',
        labels: [DEFAULT_LABELS[1]],
        dueDate: '2026-10-18',
        checklist: [
          { id: 'chk-ai-6', text: 'Aprovar manifesto da marca', completed: true },
        ],
        memberIds: ['mem-3'],
        createdAt: '2026-10-14T15:00:00.000Z',
      },
    },
  },
];
