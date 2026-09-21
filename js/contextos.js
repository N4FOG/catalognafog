// =============================================================
//  RAWELL QUÍMICA — 35 Contextos Fotográficos Cinematográficos
// =============================================================

const CONTEXTOS_CENARIOS = [
  // ── CATEGORIA A: GRAMADOS & JARDINS DE LUXO (1 a 7) ───────
  {
    id: 1,
    categoria: 'Gramados & Jardins',
    icone: '🌱',
    titulo: 'Campo de Golfe ao Amanhecer',
    descricao: 'Gramado esmeralda impecável com orvalho matinal e luz dourada suave',
    bg: { top: '#064e3b', mid: '#047857', bot: '#022c22', glow: 'rgba(16, 185, 129, 0.45)', accent: '#f59e0b', text: '#ffffff', tag: '🌱 GRAMADOS & SELETIVOS' }
  },
  {
    id: 2,
    categoria: 'Gramados & Jardins',
    icone: '🏡',
    titulo: 'Jardim Residencial de Alto Padrão',
    descricao: 'Deck de piscina e gramado esmeralda denso sem ervas daninhas',
    bg: { top: '#0f3a2b', mid: '#056143', bot: '#06281c', glow: 'rgba(52, 211, 153, 0.4)', accent: '#fbbf24', text: '#ffffff', tag: '🏡 JARDINAGEM PROFISSIONAL' }
  },
  {
    id: 3,
    categoria: 'Gramados & Jardins',
    icone: '🏢',
    titulo: 'Condomínio Fechado & Calçada Limpa',
    descricao: 'Canteiro de flores e guia de calçada 100% livre de tiriricas',
    bg: { top: '#134e4a', mid: '#0f766e', bot: '#042f2e', glow: 'rgba(20, 184, 166, 0.45)', accent: '#facc15', text: '#ffffff', tag: '🏢 CONDOMÍNIOS & ÁREAS VERDES' }
  },
  {
    id: 4,
    categoria: 'Gramados & Jardins',
    icone: '⚽',
    titulo: 'Campo Esportivo & Estádio',
    descricao: 'Grama bicolor com corte padrão de campo de futebol e refletores',
    bg: { top: '#022c22', mid: '#065f46', bot: '#011c14', glow: 'rgba(16, 185, 129, 0.5)', accent: '#38bdf8', text: '#ffffff', tag: '⚽ CAMPOS ESPORTIVOS' }
  },
  {
    id: 5,
    categoria: 'Gramados & Jardins',
    icone: '🌺',
    titulo: 'Jardim Tropical com Flores & Orquídeas',
    descricao: 'Folhagens nobres e flores exuberantes sob luz filtrada do sol',
    bg: { top: '#14532d', mid: '#15803d', bot: '#052e16', glow: 'rgba(34, 197, 94, 0.45)', accent: '#f43f5e', text: '#ffffff', tag: '🌺 FLORES & PAISAGISMO' }
  },
  {
    id: 6,
    categoria: 'Gramados & Jardins',
    icone: '🪵',
    titulo: 'Pergolado & Gramado São Carlos',
    descricao: 'Espaço gourmet externo com grama densa e hidratada',
    bg: { top: '#1c3d2e', mid: '#0f533a', bot: '#0b271b', glow: 'rgba(16, 185, 129, 0.4)', accent: '#f59e0b', text: '#ffffff', tag: '🪵 ÁREAS DE LAZER' }
  },
  {
    id: 7,
    categoria: 'Gramados & Jardins',
    icone: '🪨',
    titulo: 'Jardim Zen com Pedras & Arbustos',
    descricao: 'Seixos brancos, bonsai e harmonia visual sem invasoras',
    bg: { top: '#1f2937', mid: '#064e3b', bot: '#111827', glow: 'rgba(52, 211, 153, 0.35)', accent: '#e2e8f0', text: '#ffffff', tag: '🪨 PAISAGISMO JAPONÊS' }
  },

  // ── CATEGORIA B: AGRICULTURA & CAPINA TOTAL (8 a 14) ──────
  {
    id: 8,
    categoria: 'Agricultura & Capina',
    icone: '🌾',
    titulo: 'Cerca Rústica de Fazenda ao Nascer do Sol',
    descricao: 'Solo 100% limpo com solo fértil e lavoura ao fundo',
    bg: { top: '#3b2506', mid: '#78350f', bot: '#1c1003', glow: 'rgba(245, 158, 11, 0.45)', accent: '#fde047', text: '#ffffff', tag: '🌾 CAPINA TOTAL & SOLO LIMPO' }
  },
  {
    id: 9,
    categoria: 'Agricultura & Capina',
    icone: '🐂',
    titulo: 'Curral e Piquete de Pastagem Limpo',
    descricao: 'Capim verde sem plantas daninhas espinhosas com gado ao longe',
    bg: { top: '#1e3a1f', mid: '#2d5a27', bot: '#0e1f0e', glow: 'rgba(74, 222, 128, 0.4)', accent: '#f59e0b', text: '#ffffff', tag: '🐂 PASTAGENS & PECUÁRIA' }
  },
  {
    id: 10,
    categoria: 'Agricultura & Capina',
    icone: '🚜',
    titulo: 'Trator Moderno em Campo de Plantio',
    descricao: 'Terra fértil preparada para plantio sob céu aberto azul',
    bg: { top: '#1e293b', mid: '#1e3a5f', bot: '#0f172a', glow: 'rgba(56, 189, 248, 0.4)', accent: '#fbbf24', text: '#ffffff', tag: '🚜 MANEJO DE PRÉ-PLANTIO' }
  },
  {
    id: 11,
    categoria: 'Agricultura & Capina',
    icone: '🛣️',
    titulo: 'Margem de Estrada Rural & Aceiros',
    descricao: 'Estrada de chão com bordas limpas para prevenção de queimadas',
    bg: { top: '#451a03', mid: '#5c2b0c', bot: '#240c02', glow: 'rgba(217, 119, 6, 0.45)', accent: '#fef08a', text: '#ffffff', tag: '🛣️ ACEIROS & ESTRADAS' }
  },
  {
    id: 12,
    categoria: 'Agricultura & Capina',
    icone: '🍊',
    titulo: 'Pomar de Citros & Frutíferas',
    descricao: 'Ruas entre as laranjeiras limpas e sem mato competidor',
    bg: { top: '#14532d', mid: '#854d0e', bot: '#052e16', glow: 'rgba(245, 158, 11, 0.45)', accent: '#ea580c', text: '#ffffff', tag: '🍊 CITRICULTURA & POMAR' }
  },
  {
    id: 13,
    categoria: 'Agricultura & Capina',
    icone: '☕',
    titulo: 'Plantação de Café em Encosta',
    descricao: 'Solo vermelho bem manejado e pés de café carregados',
    bg: { top: '#311c11', mid: '#4a2818', bot: '#170c06', glow: 'rgba(217, 119, 6, 0.35)', accent: '#fbbf24', text: '#ffffff', tag: '☕ CAFEICULTURA' }
  },
  {
    id: 14,
    categoria: 'Agricultura & Capina',
    icone: '🏭',
    titulo: 'Silo de Grãos & Galpão Agroindustrial',
    descricao: 'Pátio industrial limpo e organizado ao entardecer',
    bg: { top: '#1e293b', mid: '#334155', bot: '#0f172a', glow: 'rgba(148, 163, 184, 0.4)', accent: '#38bdf8', text: '#ffffff', tag: '🏭 ÁREAS INDUSTRIAIS' }
  },

  // ── CATEGORIA C: HORTAS, ESTUFAS & CULTIVO (15 a 21) ──────
  {
    id: 15,
    categoria: 'Hortas & Estufas',
    icone: '🥬',
    titulo: 'Horta Hidropônica & Folhosas',
    descricao: 'Estufa de alta tecnologia com alfaces verdes vibrantes',
    bg: { top: '#064e3b', mid: '#059669', bot: '#022c22', glow: 'rgba(52, 211, 153, 0.5)', accent: '#a7f3d0', text: '#ffffff', tag: '🥬 HORTAS HIDROPÔNICAS' }
  },
  {
    id: 16,
    categoria: 'Hortas & Estufas',
    icone: '🍅',
    titulo: 'Canteiro Orgânico de Tomates',
    descricao: 'Tomates vermelhos brilhantes livres de fungos e lagartas',
    bg: { top: '#4c0519', mid: '#14532d', bot: '#1f0208', glow: 'rgba(244, 63, 94, 0.45)', accent: '#4ade80', text: '#ffffff', tag: '🍅 HORTIFRÚTI' }
  },
  {
    id: 17,
    categoria: 'Hortas & Estufas',
    icone: '🪴',
    titulo: 'Estufa de Flores & Suculentas',
    descricao: 'Bancadas de madeira iluminadas com plantas em pleno vigor',
    bg: { top: '#064e3b', mid: '#0d9488', bot: '#042f2e', glow: 'rgba(45, 212, 191, 0.4)', accent: '#f59e0b', text: '#ffffff', tag: '🪴 VIVEIROS & ESTUFAS' }
  },
  {
    id: 18,
    categoria: 'Hortas & Estufas',
    icone: '🌿',
    titulo: 'Canteiro de Ervas Aromáticas',
    descricao: 'Manjericão, alecrim e hortelã saudáveis com luz filtrada',
    bg: { top: '#14532d', mid: '#16a34a', bot: '#052e16', glow: 'rgba(74, 222, 128, 0.45)', accent: '#fef08a', text: '#ffffff', tag: '🌿 ERVAS & AROMÁTICAS' }
  },
  {
    id: 19,
    categoria: 'Hortas & Estufas',
    icone: '🌱',
    titulo: 'Berçário de Mudas & Tubetes',
    descricao: 'Brotos jovens saudáveis em bandejas de cultivo florestal',
    bg: { top: '#022c22', mid: '#065f46', bot: '#011710', glow: 'rgba(16, 185, 129, 0.45)', accent: '#34d399', text: '#ffffff', tag: '🌱 PRODUÇÃO DE MUDAS' }
  },
  {
    id: 20,
    categoria: 'Hortas & Estufas',
    icone: '🍇',
    titulo: 'Parreiral de Uvas ao Pôr do Sol',
    descricao: 'Cachos de uva perfeitos sem antracnose ou manchas foliares',
    bg: { top: '#3b0764', mid: '#14532d', bot: '#1e0338', glow: 'rgba(192, 132, 252, 0.4)', accent: '#fbbf24', text: '#ffffff', tag: '🍇 VITICULTURA & UVAS' }
  },
  {
    id: 21,
    categoria: 'Hortas & Estufas',
    icone: '🍓',
    titulo: 'Canteiro de Morangos em Mulching',
    descricao: 'Morangos vermelhos protegidos contra caramujos e pragas de solo',
    bg: { top: '#500724', mid: '#14532d', bot: '#20020e', glow: 'rgba(251, 113, 133, 0.45)', accent: '#34d399', text: '#ffffff', tag: '🍓 CULTIVO DE MORANGO' }
  },

  // ── CATEGORIA D: RESIDENCIAL & CONTROLE DE PRAGAS (22 a 28) ──
  {
    id: 22,
    categoria: 'Residencial & Pragas',
    icone: '🍳',
    titulo: 'Cozinha Gourmet & Bancada de Mármore',
    descricao: 'Ambiente moderno ultra-limpo com reflexos de luz suave',
    bg: { top: '#0f172a', mid: '#1e293b', bot: '#020617', glow: 'rgba(56, 189, 248, 0.35)', accent: '#fbbf24', text: '#ffffff', tag: '🍳 CONTROLE RESIDENCIAL' }
  },
  {
    id: 23,
    categoria: 'Residencial & Pragas',
    icone: '🥫',
    titulo: 'Despensa Residencial Organizada',
    descricao: 'Prateleiras de madeira nobre protegidas contra baratas e formigas',
    bg: { top: '#291b10', mid: '#3d2918', bot: '#140c06', glow: 'rgba(217, 119, 6, 0.35)', accent: '#fde047', text: '#ffffff', tag: '🥫 DESPENSAS & ALIMENTOS' }
  },
  {
    id: 24,
    categoria: 'Residencial & Pragas',
    icone: '🍖',
    titulo: 'Área de Churrasqueira & Espaço Gourmet',
    descricao: 'Balcão de granito e tijolo à vista sem insetos rastejantes',
    bg: { top: '#3b1812', mid: '#54231b', bot: '#1c0a07', glow: 'rgba(239, 68, 68, 0.35)', accent: '#f59e0b', text: '#ffffff', tag: '🍖 ESPAÇO GOURMET' }
  },
  {
    id: 25,
    categoria: 'Residencial & Pragas',
    icone: '🚿',
    titulo: 'Banheiro Moderno & Metais Dourados',
    descricao: 'Porcelanato brilhante e ralos livres de baratas e mosquitos',
    bg: { top: '#0f172a', mid: '#064e3b', bot: '#020617', glow: 'rgba(16, 185, 129, 0.35)', accent: '#f59e0b', text: '#ffffff', tag: '🚿 HIGIENE & SANEANTES' }
  },
  {
    id: 26,
    categoria: 'Residencial & Pragas',
    icone: '🍽️',
    titulo: 'Cozinha Industrial & Restaurante',
    descricao: 'Bancadas de aço inoxidável com rigoroso padrão sanitário',
    bg: { top: '#1e293b', mid: '#334155', bot: '#090d16', glow: 'rgba(148, 163, 184, 0.45)', accent: '#10b981', text: '#ffffff', tag: '🍽️ COZINHAS INDUSTRIAIS' }
  },
  {
    id: 27,
    categoria: 'Residencial & Pragas',
    icone: '🍷',
    titulo: 'Adega & Salão Rústico Subterrâneo',
    descricao: 'Ambiente de pedra nobre com controle total de roedores',
    bg: { top: '#261310', mid: '#3b1c18', bot: '#120806', glow: 'rgba(185, 28, 28, 0.35)', accent: '#fbbf24', text: '#ffffff', tag: '🍷 ADEGAS & DEPÓSITOS' }
  },
  {
    id: 28,
    categoria: 'Residencial & Pragas',
    icone: '🚗',
    titulo: 'Garagem & Oficina com Piso Epóxi',
    descricao: 'Piso cinza brilhante sem acúmulo de insetos ou sujeira',
    bg: { top: '#090d16', mid: '#1f2937', bot: '#030712', glow: 'rgba(99, 102, 241, 0.35)', accent: '#38bdf8', text: '#ffffff', tag: '🚗 GARAGENS & OFICINAS' }
  },

  // ── CATEGORIA E: COMERCIAL & AGROPECUÁRIAS (29 a 35) ──────
  {
    id: 29,
    categoria: 'Comercial & Agropecuária',
    icone: '🏪',
    titulo: 'Balcão de Agropecuária & Casa de Ração',
    descricao: 'Prateleiras bem abastecidas com atendimento de balcão acolhedor',
    bg: { top: '#064e3b', mid: '#065f46', bot: '#022c22', glow: 'rgba(16, 185, 129, 0.45)', accent: '#f59e0b', text: '#ffffff', tag: '🏪 REVENDAS & AGROPECUÁRIAS' }
  },
  {
    id: 30,
    categoria: 'Comercial & Agropecuária',
    icone: '📦',
    titulo: 'Centro de Distribuição & Porta-Paletes',
    descricao: 'Corredores logísticos limpos com caixas em atacado prontas',
    bg: { top: '#1e293b', mid: '#0f3a2b', bot: '#0f172a', glow: 'rgba(52, 211, 153, 0.4)', accent: '#38bdf8', text: '#ffffff', tag: '📦 DISTRIBUIÇÃO & ATACADO' }
  },
  {
    id: 31,
    categoria: 'Comercial & Agropecuária',
    icone: '🎪',
    titulo: 'Estande de Feira Agrícola & Showroom',
    descricao: 'Iluminação de feira de agronegócio com display profissional',
    bg: { top: '#064e3b', mid: '#1e3a8a', bot: '#020617', glow: 'rgba(96, 165, 250, 0.4)', accent: '#fbbf24', text: '#ffffff', tag: '🎪 FEIRAS AGRÍCOLAS' }
  },
  {
    id: 32,
    categoria: 'Comercial & Agropecuária',
    icone: '🔬',
    titulo: 'Laboratório Químico & Controle de Qualidade',
    descricao: 'Vidrarias e ambiente estéril com precisão científica',
    bg: { top: '#082f49', mid: '#0369a1', bot: '#021e30', glow: 'rgba(56, 189, 248, 0.45)', accent: '#34d399', text: '#ffffff', tag: '🔬 QUALIDADE & TECNOLOGIA' }
  },
  {
    id: 33,
    categoria: 'Comercial & Agropecuária',
    icone: '🚚',
    titulo: 'Pátio de Expedição & Caminhão de Carga',
    descricao: 'Expedição de mercadorias com agilidade para entrega no campo',
    bg: { top: '#1f2937', mid: '#374151', bot: '#111827', glow: 'rgba(156, 163, 175, 0.4)', accent: '#f59e0b', text: '#ffffff', tag: '🚚 EXPEDIÇÃO & LOGÍSTICA' }
  },
  {
    id: 34,
    categoria: 'Comercial & Agropecuária',
    icone: '🪴',
    titulo: 'Floricultura & Garden Center Moderno',
    descricao: 'Espaço com luz natural, vasos decorativos e plantas premium',
    bg: { top: '#064e3b', mid: '#047857', bot: '#022c22', glow: 'rgba(52, 211, 153, 0.4)', accent: '#f43f5e', text: '#ffffff', tag: '🪴 GARDEN CENTERS' }
  },
  {
    id: 35,
    categoria: 'Comercial & Agropecuária',
    icone: '🏔️',
    titulo: 'Platô de Pedra ao Pôr do Sol na Montanha',
    descricao: 'Pedestal natural épico com céu dourado e violeta dramático',
    bg: { top: '#4a044e', mid: '#831843', bot: '#1e021a', glow: 'rgba(244, 114, 182, 0.45)', accent: '#fbbf24', text: '#ffffff', tag: '🏔️ EDIÇÃO ESPECIAL GOLD' }
  }
];
