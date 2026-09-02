// =============================================================
//  RAWELL QUÍMICA — Catálogo Oficial de Produtos 2026
// =============================================================

const CONFIG = {
  whatsapp: '5545999332563',
  empresa: 'Rawell Química — Catálogo 2026',
  mensagem_intro: 'Olá! Gostaria de solicitar um orçamento dos seguintes produtos da Rawell Química:',
  mensagem_fim: 'Aguardo o retorno com os valores e condições. Obrigado!'
};

// =============================================================
//  CATEGORIAS OFICIAIS DO CATÁLOGO
// =============================================================
const CATEGORIAS = [
  { id: 'todos',               nome: 'Todos os Produtos',       icone: '🌿' },
  { id: 'gramados',            nome: 'Gramados & Seletivos',    icone: '🌱' },
  { id: 'nao-seletivos',       nome: 'Não Seletivos (Capina)',  icone: '🌾' },
  { id: 'fungicidas',          nome: 'Fungicidas & Plantas',    icone: '🌸' },
  { id: 'inseticidas',         nome: 'Inseticidas & Pragas',    icone: '🪳' },
  { id: 'mosquicidas',         nome: 'Controle de Moscas',      icone: '🪰' },
  { id: 'formicidas-baratas',  nome: 'Formicidas & Baratas',    icone: '🐜' },
  { id: 'raticidas',           nome: 'Raticidas & Roedores',    icone: '🐀' },
  { id: 'lesmicidas',          nome: 'Lesmicidas & Caramujos',  icone: '🐌' },
  { id: 'carrapatos-pulgas',   nome: 'Carrapatos & Pulgas',     icone: '🐕' },
  { id: 'adjuvantes',          nome: 'Adjuvantes & pH',         icone: '🧪' }
];

// =============================================================
//  FORMULAÇÕES / TIPOS DE APLICAÇÃO
// =============================================================
const FORMULACOES = [
  { id: 'todos',        nome: 'Todas Formulações',           icone: '⚡' },
  { id: 'concentrado',  nome: 'Concentrados (Diluição)',     icone: '💧' },
  { id: 'pronto-uso',   nome: 'Pronto Uso (Spray)',          icone: '🚿' },
  { id: 'gel-isca',     nome: 'Géis & Iscas',                icone: '🎯' },
  { id: 'po',           nome: 'Pós & Hidrossolúveis',        icone: '🧪' },
  { id: 'adjuvante',    nome: 'Adjuvantes & Calda',          icone: '🔬' }
];

// =============================================================
//  BANCO DE DADOS COMPLETO — 32 PRODUTOS REAIS (CATÁLOGO 2026)
// =============================================================
const PRODUTOS = [

  // ── 1. GRAMADOS & SELETIVOS ────────────────────────────────
  {
    id: 1,
    nome: 'Kapina Plus (60ml)',
    categoria: 'gramados',
    tipo_formulacao: 'concentrado',
    segmento: 'jardinagem',
    alvos: ['amendoim bravo', 'avencas', 'quebra pedra rasteiro', 'trapoeraba', 'buva', 'desmodium', 'ciperaceas', 'erva de santa luzia', 'folhas largas', 'grama esmeralda'],
    descricao: 'Desinfestante seletivo sistêmico para controle de ervas de folhas largas em gramados de grama esmeralda.',
    descricao_longa: `
      <p>O <strong>Kapina Plus</strong> é o mais completo do mercado para controle de ervas de folhas largas em gramados de grama esmeralda.</p>
      <p><strong>Ervas controladas:</strong> Amendoim Bravo, Avencas, Quebra Pedra Rasteiro, Trapoeraba, Buva, Desmodium, Ciperáceas e Erva de Santa Luzia.</p>
      <p><strong>Ação:</strong> Sistêmica. Não utilizar em gramados de folhas largas ou plantas do gênero Arachis (amendoim forrageiro).</p>
      <p><strong>Embalagem:</strong> Frasco de 60ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      'Ação sistêmica profunda',
      'Exclusivo para grama esmeralda',
      'Elimina folhas largas e tiriricas',
      'Frasco 60ml (Caixa c/ 60 frascos)',
      'Líder de mercado em gramados'
    ],
    imagens: [
      'img/produtos/p01-kapina-plus-60ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'KP-PLUS-60',
    destaque: true
  },
  {
    id: 2,
    nome: 'Kapina Tradicional (60ml)',
    categoria: 'gramados',
    tipo_formulacao: 'concentrado',
    segmento: 'jardinagem',
    alvos: ['tiririca', 'cyperaceas', 'rizomas', 'batatinhas', 'cebolinhas', 'folhas estreitas', 'grama esmeralda', 'gramados'],
    descricao: 'Desinfestante seletivo para controle de Cyperáceas (tiririca) eliminando rizomas (batatinhas/cebolinhas).',
    descricao_longa: `
      <p>O <strong>Kapina</strong> é o desinfestante seletivo consagrado para controle de Cyperáceas (Tiririca) em gramados de folhas estreitas.</p>
      <p>Elimina os rizomas subterrâneos (batatinhas ou cebolinhas), impedindo a rebrota sem provocar fitotoxicidade no gramado.</p>
      <p><strong>Embalagem:</strong> Frasco de 60ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      'Elimina rizomas e bulbos',
      'Não provoca fito no gramado',
      'Específico para folhas estreitas',
      'Frasco 60ml (Caixa c/ 60 frascos)'
    ],
    imagens: [
      'img/produtos/p02-kapina-tradicional-60ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'KP-TRAD-60',
    destaque: true
  },
  {
    id: 3,
    nome: 'Korsário (60ml)',
    categoria: 'gramados',
    tipo_formulacao: 'concentrado',
    segmento: 'jardinagem',
    alvos: ['roseta', 'espinho de roseta', 'ervas daninhas', 'partes aereas', 'raiz', 'gramados'],
    descricao: 'Controle TOTAL da Roseta em todos os tipos de gramados. Ação 200%: elimina 100% raiz e 100% partes aéreas.',
    descricao_longa: `
      <p>O <strong>Korsário</strong> promove o controle total e definitivo da Roseta em gramados residenciais e urbanos.</p>
      <p><strong>Ação 200%:</strong> Elimina 100% da raiz e 100% das partes aéreas da praga.</p>
      <p>Seletivo para todos os tipos de gramados convencionais.</p>
      <p><strong>Embalagem:</strong> Frasco de 60ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      'Controle TOTAL da Roseta',
      'Seletivo para todos os gramados',
      'Elimina raiz e folhas',
      'Frasco 60ml (Caixa c/ 60 frascos)'
    ],
    imagens: [
      'img/produtos/p03-korsario-60ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'KOR-60',
    destaque: false
  },
  {
    id: 4,
    nome: 'Katana (30ml)',
    categoria: 'gramados',
    tipo_formulacao: 'concentrado',
    segmento: 'jardinagem',
    alvos: ['brachiaria', 'braquiaria', 'capim pe de galinha', 'capim colchao', 'folhas finas', 'grama esmeralda', 'grama bermuda'],
    descricao: 'Único no Brasil para controle de folhas finas em gramados: Brachiaria, Capim pé de galinha e Capim colchão.',
    descricao_longa: `
      <p>O <strong>Katana</strong> é o único desinfestante no Brasil para controle seletivo de folhas finas invasoras no gramado.</p>
      <p><strong>Controla:</strong> Capim Brachiaria, Capim Pé de Galinha e Capim Colchão.</p>
      <p><strong>Indicação:</strong> Seletivo para Grama Esmeralda e Bermuda. Recomenda-se aplicar após as 16h.</p>
      <p><strong>Embalagem:</strong> Frasco de 30ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      'Único para folhas finas',
      'Controla Brachiaria e Pé de Galinha',
      'Grama Esmeralda e Bermuda',
      'Frasco 30ml (Caixa c/ 60 frascos)'
    ],
    imagens: [
      'img/produtos/p04-katana-30ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'KAT-30',
    destaque: true
  },
  {
    id: 5,
    nome: 'Kcura Fungicida (100ml)',
    categoria: 'gramados',
    tipo_formulacao: 'concentrado',
    segmento: 'jardinagem',
    alvos: ['fungos', 'mancha foliar', 'antracnose', 'podridao de raiz', 'doencas fungicas', 'doencas de solo', 'gramado', 'jardim'],
    descricao: 'Fungicida de amplo espectro para controle preventivo e curativo de doenças aéreas e de solo em gramados.',
    descricao_longa: `
      <p>O <strong>Kcura Fungicida</strong> é formulado especialmente para manter jardins e gramados protegidos contra ataques fúngicos.</p>
      <p>Ação eficiente em fungos de parte aérea e do sistema radicular/solo.</p>
      <p><strong>Embalagem:</strong> Frasco de 100ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      'Amplo espectro de ação',
      'Ação aérea e de solo',
      'Curativo e preventivo',
      'Frasco 100ml (Caixa c/ 60 frascos)'
    ],
    imagens: [
      'img/produtos/p05-kcura-fungicida-100ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'KCURA-100',
    destaque: false
  },

  // ── 2. NÃO SELETIVOS (CAPINA TOTAL) ────────────────────────
  {
    id: 6,
    nome: 'Roçada (100ml)',
    categoria: 'nao-seletivos',
    tipo_formulacao: 'concentrado',
    segmento: 'rural',
    alvos: ['capina total', 'limpeza de terreno', 'mato', 'folhas largas', 'folhas estreitas', 'terrenos baldios', 'pos emergente', 'pre emergente'],
    descricao: 'Desinfestante completo pós e pré-emergente com óleo mineral, sulfato de amônia e espalhante. Rende 300m².',
    descricao_longa: `
      <p>O <strong>Roçada</strong> oferece limpeza completa e duradoura de terrenos e áreas não cultivadas.</p>
      <p>Formulação com Óleo Mineral, Sulfato de Amônia e Espalhante Adesivo de alta fixação. Garante até 90 dias de área limpa. Não contém POEA.</p>
      <p><strong>Rendimento:</strong> Médio de 300m². Resultado completo em até 25 dias pós aplicação.</p>
      <p><strong>Embalagem:</strong> Frasco 100ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      'Pós e Pré Emergente',
      'Até 90 dias de área limpa',
      'Rende 300m² por frasco',
      'Sem POEA (mais seguro)',
      'Frasco 100ml (Caixa c/ 60 frascos)'
    ],
    imagens: [
      'img/produtos/p06-rocada-100ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'ROC-100',
    destaque: true
  },
  {
    id: 7,
    nome: 'ArranKa EW (100ml)',
    categoria: 'nao-seletivos',
    tipo_formulacao: 'concentrado',
    segmento: 'saude-publica',
    alvos: ['desinfestacao urbana', 'mato', 'folhas estreitas', 'folhas largas', 'calcadas', 'canteiros', 'muralhas', 'capina'],
    descricao: 'Desinfestante não seletivo com Sulfato de Potássio e espalhante adesivo para desinfestação urbana.',
    descricao_longa: `
      <p>O <strong>ArranKa EW</strong> é ideal para desinfestação urbana completa contra folhas estreitas e largas.</p>
      <p>Contém Sulfato de Potássio e espalhante adesivo integrado. Rende até 300m² de área. Não contém POEA.</p>
      <p><strong>Embalagem:</strong> Frasco 100ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      'Com espalhante adesivo',
      'Sulfato de Potássio',
      'Rendimento de 300m²',
      'Frasco 100ml (Caixa c/ 60 frascos)'
    ],
    imagens: [
      'img/produtos/p07-arranka-ew-100ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'ARR-EW-100',
    destaque: false
  },
  {
    id: 8,
    nome: 'ArranKa Pronto Uso (1 Litro)',
    categoria: 'nao-seletivos',
    tipo_formulacao: 'pronto-uso',
    segmento: 'jardinagem',
    alvos: ['mato', 'ervas invasoras', 'capina', 'folhas largas', 'folhas estreitas', 'calcadas', 'jardins', 'pronto uso'],
    descricao: 'Desinfestante sistêmico pronto para uso. Elimina plantas de folhas largas e estreitas sem precisar diluir.',
    descricao_longa: `
      <p>O <strong>ArranKa 1 Litro Pronto Uso</strong> é o desinfestante mais prático do mercado. Basta aplicar diretamente com o pulverizador.</p>
      <p>Atua de modo sistêmico eliminando plantas de folhas largas e estreitas em pós-emergência.</p>
      <p><strong>Rendimento:</strong> 300m² de área.</p>
      <p><strong>Embalagem:</strong> Frasco de 1 Litro (Caixa com 12 frascos).</p>
    `,
    caracteristicas: [
      'Pronto para uso (sem diluição)',
      'Frasco econômico de 1 Litro',
      'Rendimento de 300m²',
      'Caixa com 12 frascos'
    ],
    imagens: [
      'img/produtos/p08-arranka-pronto-uso-1l.webp'
    ],
    unidade: 'frasco',
    referencia: 'ARR-PU-1L',
    destaque: true
  },

  // ── 3. FUNGICIDAS & PLANTAS ────────────────────────────────
  {
    id: 9,
    nome: 'Bravick Fungicida Concentrado (10ml)',
    categoria: 'fungicidas',
    tipo_formulacao: 'concentrado',
    segmento: 'jardinagem',
    alvos: ['fungos', 'orquideas', 'manchas foliares', 'oidio', 'ferrugem', 'podridao negra', 'plantas ornamentais', 'flores', 'rosas'],
    descricao: 'N° 1 do mercado no combate e controle completo de fungos e doenças em plantas ornamentais e orquídeas.',
    descricao_longa: `
      <p>O <strong>Bravick Fungicida</strong> é a solução de alta tecnologia para manter suas plantas ornamentais livres de fungos.</p>
      <p>Fungicida sistêmico de amplo espectro para controle preventivo e curativo de manchas foliares, oídios e podridões.</p>
      <p><strong>Embalagem:</strong> Frasco 10ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      'Fungicida sistêmico de amplo espectro',
      'Ideal para plantas ornamentais e flores',
      'Preventivo e curativo',
      'Frasco 10ml (Caixa c/ 60 frascos)'
    ],
    imagens: [
      'img/produtos/p09-bravick-fungicida-10ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'BRAV-10',
    destaque: true
  },
  {
    id: 10,
    nome: 'Bravick Pronto Uso (240ml Spray)',
    categoria: 'fungicidas',
    tipo_formulacao: 'pronto-uso',
    segmento: 'jardinagem',
    alvos: ['fungos', 'manchas foliares', 'oidio', 'plantas ornamentais', 'folhagens', 'flores', 'orquideas', 'rosas', 'samambaias'],
    descricao: 'Fungicida sistêmico pronto para uso com aplicador spray para plantas ornamentais.',
    descricao_longa: `
      <p>Versão <strong>Pronto Uso do Bravick</strong> com gatilho spray ergonômico. Basta borrifar sobre as folhas infectadas ou preventivamente.</p>
      <p><strong>Embalagem:</strong> Frasco 240ml com gatilho spray (Caixa com 24 frascos).</p>
    `,
    caracteristicas: [
      'Gatilho spray pronto uso',
      'Não precisa diluir',
      'Frasco 240ml (Caixa c/ 24 frascos)'
    ],
    imagens: [
      'img/produtos/p10-bravick-pronto-uso-240ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'BRAV-PU-240',
    destaque: false
  },
  {
    id: 11,
    nome: 'Ka-Bio Fitoterápico Natural (60ml)',
    categoria: 'fungicidas',
    tipo_formulacao: 'concentrado',
    segmento: 'jardinagem',
    alvos: ['pulgoes', 'cochonilhas', 'tripes', 'lagartas', 'insetos sugadores', 'mastigadores', 'horta', 'organico', 'natural', 'fitoterapico', 'mosca branca'],
    descricao: 'Produto tradicional fitoterápico 100% natural para prevenção e controle de insetos mastigadores, raspadores e sugadores.',
    descricao_longa: `
      <p>O <strong>Ka-Bio</strong> é um produto tradicional fitoterápico natural, seguro e eficiente.</p>
      <p>Eficaz para prevenção e controle de pragas como pulgões, cochonilhas, tripes e lagartas mastigadoras em hortas e jardins. Venda livre.</p>
      <p><strong>Embalagem:</strong> Frasco de 60ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      '100% Natural Fitoterápico',
      'Controle de mastigadores e sugadores',
      'Venda livre e ecológico',
      'Frasco 60ml (Caixa c/ 60 frascos)'
    ],
    imagens: [
      'img/produtos/p11-ka-bio-fitoterapico-60ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'KABIO-60',
    destaque: false
  },
  {
    id: 12,
    nome: 'Ka-Bio Pronto Uso (240ml Spray)',
    categoria: 'fungicidas',
    tipo_formulacao: 'pronto-uso',
    segmento: 'jardinagem',
    alvos: ['pulgoes', 'cochonilhas', 'tripes', 'lagartas', 'hortas caseiras', 'pomar', 'plantas em vasos', 'organico', 'natural'],
    descricao: 'Solução fitoterápica natural pronta para aplicação em spray para hortas, jardins e frutíferas.',
    descricao_longa: `
      <p>O <strong>Ka-Bio Pronto Uso 240ml</strong> combina a eficácia natural com a máxima praticidade de um frasco pulverizador.</p>
      <p><strong>Embalagem:</strong> Frasco 240ml (Caixa com 24 frascos).</p>
    `,
    caracteristicas: [
      'Pronto uso com gatilho spray',
      'Fitoterápico natural',
      'Frasco 240ml (Caixa c/ 24 frascos)'
    ],
    imagens: [
      'img/produtos/p12-ka-bio-pronto-uso-240ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'KABIO-PU-240',
    destaque: false
  },

  // ── 4. INSETICIDAS & PRAGAS URBANAS ────────────────────────
  {
    id: 13,
    nome: 'Impakto Inseticida (250ml e 500ml)',
    categoria: 'inseticidas',
    tipo_formulacao: 'pronto-uso',
    segmento: 'saude-publica',
    alvos: ['aranhas', 'baratas', 'cupins', 'formigas', 'cascudinho', 'pragas urbanas', 'sem cheiro', 'nao mancha'],
    descricao: 'Inseticida de ação deletéria pronto uso para ambientes domésticos. Elimina aranhas, baratas, cupins e formigas.',
    descricao_longa: `
      <p>O <strong>Impakto</strong> é o inseticida definitivo para ambientes residenciais e comerciais.</p>
      <p><strong>Pragas controladas:</strong> Aranhas, Baratas, Cupins e Formigas.</p>
      <p>Não mancha pisos ou paredes, não tem cheiro e possui efeito residual prolongado.</p>
      <p><strong>Embalagens:</strong> Frasco 250ml (Caixa c/ 24) e Frasco 500ml (Caixa c/ 16).</p>
    `,
    caracteristicas: [
      'Ação deletéria rápida',
      'Não mancha e não tem cheiro',
      'Residual prolongado',
      'Frascos 250ml e 500ml'
    ],
    imagens: [
      'img/produtos/p13-impakto-inseticida.webp'
    ],
    unidade: 'frasco',
    referencia: 'IMP-250-500',
    destaque: true
  },
  {
    id: 14,
    nome: 'Fimo Combina Spray (40ml e 120ml)',
    categoria: 'inseticidas',
    tipo_formulacao: 'pronto-uso',
    segmento: 'saude-publica',
    alvos: ['baratas', 'formigas', 'mosquitos', 'moscas', 'aranhas', 'escorpioes', 'pragas domesticas', 'com atrativo'],
    descricao: 'Spray pronto uso de fácil aplicação com atrativo. Residual de até 6 meses contra pragas urbanas.',
    descricao_longa: `
      <p>O <strong>Fimo Combina</strong> proporciona ambientes livres de insetos e pragas urbanas sem necessidade de atingir o inseto diretamente.</p>
      <p>Contém atrativo especial, não mancha, sem cheiro e com efeito residual de até 6 meses.</p>
      <p><strong>Embalagens:</strong> Frasco 40ml (Caixa c/ 60) e Frasco 120ml (Caixa c/ 30).</p>
    `,
    caracteristicas: [
      'Residual de até 6 meses',
      'Com atrativo especial',
      'Não precisa atingir o inseto',
      'Frascos de 40ml e 120ml'
    ],
    imagens: [
      'img/produtos/p14-fimo-combina-spray.webp'
    ],
    unidade: 'frasco',
    referencia: 'FIMO-40-120',
    destaque: false
  },
  {
    id: 15,
    nome: 'Pankada Multi-Insetos (30ml, 60ml, 250ml)',
    categoria: 'inseticidas',
    tipo_formulacao: 'concentrado',
    segmento: 'saude-publica',
    alvos: ['acaros', 'barata germanica', 'baratinha', 'bicudo', 'cascudinho', 'mosca branca', 'larva mineradora', 'pulgoes', 'trips', 'desalojante'],
    descricao: 'Inseticida desalojante de alta performance e baixa dosagem. Residual de até 180 dias contra múltiplos insetos.',
    descricao_longa: `
      <p>O <strong>Pankada</strong> é um potente agente desalojante para controle abrangente de pragas.</p>
      <p><strong>Controla:</strong> Ácaros, Barata Germânica, Bicudo, Cascudinho, Mosca Branca, Larva Mineradora, Pulgões, Tribola e Trips.</p>
      <p>Residual de até 180 dias. Não mancha e não tem cheiro.</p>
      <p><strong>Embalagens:</strong> 30ml (Caixa c/ 120), 60ml (Caixa c/ 60) e 250ml (Caixa c/ 20).</p>
    `,
    caracteristicas: [
      'Poderoso agente desalojante',
      'Residual de até 180 dias',
      'Baixa dosagem e alta eficiência',
      'Frascos 30ml, 60ml e 250ml'
    ],
    imagens: [
      'img/produtos/p15-pankada-multi-insetos.webp'
    ],
    unidade: 'frasco',
    referencia: 'PANK-30-60-250',
    destaque: true
  },
  {
    id: 16,
    nome: 'UNIX Repik (30ml)',
    categoria: 'inseticidas',
    tipo_formulacao: 'concentrado',
    segmento: 'saude-publica',
    alvos: ['cupins de madeira', 'cupins subterraneos', 'baratas', 'formigas', 'fipronil', 'lambda cialotrina'],
    descricao: 'Associação de Fipronil + Lambda-Cialotrina para controle eficiente de baratas, cupins e formigas.',
    descricao_longa: `
      <p>O <strong>UNIX Repik</strong> reúne dois princípios ativos de ponta (Fipronil e Lambda Cialotrina) para controle definitivo de pragas urbanas e domésticas.</p>
      <p><strong>Embalagem:</strong> Frasco 30ml (Display com 30 frascos).</p>
    `,
    caracteristicas: [
      'Fipronil + Lambda Cialotrina',
      'Eficaz contra Cupins e Baratas',
      'Frasco 30ml (Display c/ 30 frascos)'
    ],
    imagens: [
      'img/produtos/p16-unix-repik-30ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'UNIX-REP-30',
    destaque: false
  },
  {
    id: 17,
    nome: 'ArranKa SPM Saúde (Sachês 10g)',
    categoria: 'inseticidas',
    tipo_formulacao: 'po',
    segmento: 'saude-publica',
    alvos: ['aranhas', 'baratas', 'formiga lava-pes', 'tracas', 'escorpioes', 'sache hidrossoluvel', 'desalojante'],
    descricao: 'Sachê hidrossolúvel com umectante e desalojante para aranhas, baratas, formigas lava-pés e traças.',
    descricao_longa: `
      <p>O <strong>ArranKa SPM Saúde</strong> é prático e limpo: sachê que se dissolve 100% em água na calda de pulverização.</p>
      <p>Possui agente desalojante e umectante. Elimina aranhas, baratas, formigas lava-pés e traças.</p>
      <p><strong>Embalagens:</strong> Envelope com 3 sachês de 10g (Display c/ 34) e Caixa de 1kg (100 sachês de 10g).</p>
    `,
    caracteristicas: [
      '100% Hidrossolúvel',
      'Com umectante e desalojante',
      'Envelopes 3x10g e Caixa 1kg'
    ],
    imagens: [
      'img/produtos/p17-arranka-spm-saude.webp'
    ],
    unidade: 'envelope',
    referencia: 'ARR-SPM-10',
    destaque: false
  },
  {
    id: 18,
    nome: 'ArranKa PM (Lambda-Cialotrina 10%)',
    categoria: 'inseticidas',
    tipo_formulacao: 'po',
    segmento: 'saude-publica',
    alvos: ['formiga lava-pes', 'pulgoes', 'aranhas', 'lagartas', 'lambda-cialotrina', 'po soluvel', 'desalojante'],
    descricao: 'Pó solúvel hidrossolúvel de alto rendimento para controle de formiga lava-pés, pulgões e aranhas.',
    descricao_longa: `
      <p>O <strong>ArranKa PM</strong> contém Lambda-Cialotrina a 10% com agente desalojante integrado.</p>
      <p><strong>Embalagem:</strong> Envelope com 2 sachês de 10g (Display com 34 envelopes / Caixa com 4 displays).</p>
    `,
    caracteristicas: [
      'Lambda-Cialotrina 10%',
      'Sachê hidrossolúvel prático',
      'Envelope 2x10g'
    ],
    imagens: [
      'img/produtos/p18-arranka-pm-lambda.webp'
    ],
    unidade: 'envelope',
    referencia: 'ARR-PM-10',
    destaque: false
  },

  // ── 5. CONTROLE DE MOSCAS ──────────────────────────────────
  {
    id: 19,
    nome: 'NaMosca GB (Sachê 20g)',
    categoria: 'mosquicidas',
    tipo_formulacao: 'gel-isca',
    segmento: 'rural',
    alvos: ['mosca domestica', 'moscas de estabulo', 'mosca de esterqueira', 'larvas de mosca', 'atrativo sexual', 'composteira'],
    descricao: 'Mosquicida completo granulado com Thiametoxam 1% e atrativo sexual. Elimina adultos, pupas e larvas.',
    descricao_longa: `
      <p>O <strong>NaMosca GB</strong> é a isca mosquicida granulada com potente atrativo sexual e Thiametoxam 1%.</p>
      <p>Longa vida residual e fácil reativação com água. Pode ser utilizado em esterqueiras, composteiras, depósitos e áreas residenciais. Venda livre.</p>
      <p><strong>Embalagem:</strong> Sachê 20g (Display com 30 sachês / Caixa com 8 displays).</p>
    `,
    caracteristicas: [
      'Com atrativo sexual',
      'Elimina adultos, pupas e larvas',
      'Uso em esterqueiras e composteiras',
      'Sachê 20g (Display c/ 30)'
    ],
    imagens: [
      'img/produtos/p19-namosca-gb-20g.webp'
    ],
    unidade: 'sachê',
    referencia: 'NAMOSCA-20',
    destaque: true
  },
  {
    id: 20,
    nome: 'BleKalt 25 (Thiamethoxam 25 - 90g e 1kg)',
    categoria: 'mosquicidas',
    tipo_formulacao: 'po',
    segmento: 'rural',
    alvos: ['moscas', 'granjas', 'laticinios', 'frigorificos', 'ovos de mosca', 'larvas', 'pupas', 'mosca de chifre'],
    descricao: 'Inseticida mosquicida profissional para granjas, laticínios e frigoríficos. Quebra o ciclo de desenvolvimento.',
    descricao_longa: `
      <p>O <strong>BleKalt 25</strong> age em todas as fases das moscas (ovo, larva, pupa e adulto), quebrando o ciclo reprodutivo.</p>
      <p><strong>Modos de aplicação:</strong> Pulverização, pincelamento e/ou embebição em barbante.</p>
      <p><strong>Embalagens:</strong> Frasco 90g (Display com 12) e Sachê de 1kg (Caixa com 10 sachês).</p>
    `,
    caracteristicas: [
      'Uso profissional em granjas e laticínios',
      'Pulverização, pincel ou barbante',
      'Elimina ovo, larva, pupa e adulto',
      'Frasco 90g e Sachê 1kg'
    ],
    imagens: [
      'img/produtos/p20-blekalt-25.webp'
    ],
    unidade: 'un',
    referencia: 'BLEK-90-1KG',
    destaque: true
  },
  {
    id: 21,
    nome: 'Koral Moscas (60ml)',
    categoria: 'mosquicidas',
    tipo_formulacao: 'concentrado',
    segmento: 'saude-publica',
    alvos: ['mosca domestica', 'moscas em padarias', 'restaurantes', 'cozinhas', 'acougues', 'sem cheiro', 'nao mancha'],
    descricao: 'Inseticida para combate a moscas em residências, restaurantes e padarias. Sem cheiro e sem manchas.',
    descricao_longa: `
      <p>O <strong>Koral Moscas</strong> é desenvolvido para ambientes urbanos sensíveis (padarias, restaurantes, açougues e residências).</p>
      <p>Ação deletéria, sem cheiro e sem deixar resíduos ou manchas. Ideal para controle no início de infestações.</p>
      <p><strong>Embalagem:</strong> Frasco 60ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      'Ideal para restaurantes e padarias',
      'Não mancha e não tem cheiro',
      'Longo período residual',
      'Frasco 60ml (Caixa c/ 60 frascos)'
    ],
    imagens: [
      'img/produtos/p21-koral-moscas-60ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'KORAL-MOSC-60',
    destaque: false
  },

  // ── 6. FORMICIDAS & BARATAS GEL/ISCA ────────────────────────
  {
    id: 22,
    nome: 'Mata-Formiga Gel Indoxacarbe (Seringa 10g)',
    categoria: 'formicidas-baratas',
    tipo_formulacao: 'gel-isca',
    segmento: 'saude-publica',
    alvos: ['formigas doceiras', 'formiga fantasma', 'formiga louca', 'ninho de formiga', 'rainha', 'efeito domino', 'formiga em cozinha'],
    descricao: 'Gel formicida de alta atratividade com efeito dominó: elimina toda a colônia e formigueiro em até 72h.',
    descricao_longa: `
      <p>O <strong>Mata-Formiga Gel</strong> com Indoxacarbe atrai as formigas operárias que carregam o gel para dentro do ninho.</p>
      <p><strong>Efeito Dominó:</strong> Elimina o formigueiro completo (inclusive a rainha) em até 72 horas. Fácil aplicação sem cheiro ou sujeira.</p>
      <p><strong>Embalagem:</strong> Seringa aplicadora de 10g (Caixa com 80 seringas).</p>
    `,
    caracteristicas: [
      'Efeito dominó (elimina rainha)',
      'Ação em até 72h',
      'Fácil aplicação em frestas',
      'Seringa 10g (Caixa c/ 80 seringas)'
    ],
    imagens: [
      'img/produtos/p22-mata-formiga-gel-10g.webp'
    ],
    unidade: 'seringa',
    referencia: 'GEL-FORM-10G',
    destaque: true
  },
  {
    id: 23,
    nome: 'Mata-Barata Gel Imidacloprid (Seringa 10g)',
    categoria: 'formicidas-baratas',
    tipo_formulacao: 'gel-isca',
    segmento: 'saude-publica',
    alvos: ['baratas de esgoto', 'periplaneta', 'baratinhas de cozinha', 'blattella germanica', 'ninho de baratas', 'efeito cascata'],
    descricao: 'Gel baraticida com Imidacloprid de alta atratividade e efeito dominó para eliminação completa de ninhos.',
    descricao_longa: `
      <p>O <strong>Mata-Barata Gel</strong> é a solução profissional definitiva contra baratas de esgoto e baratinhas germânicas.</p>
      <p>As baratas ingerem o gel, retornam ao esconderijo e contaminam toda a população pelo efeito cascata.</p>
      <p><strong>Embalagem:</strong> Seringa aplicadora de 10g (Caixa com 80 seringas).</p>
    `,
    caracteristicas: [
      'Eficaz contra todas as baratas',
      'Efeito dominó comprovado',
      'Não mancha e não tem cheiro',
      'Seringa 10g (Caixa c/ 80 seringas)'
    ],
    imagens: [
      'img/produtos/p23-mata-barata-gel-10g.webp'
    ],
    unidade: 'seringa',
    referencia: 'GEL-BAR-10G',
    destaque: true
  },
  {
    id: 24,
    nome: 'Mata-Formiga Isca Granulada Etiprole (50g)',
    categoria: 'formicidas-baratas',
    tipo_formulacao: 'gel-isca',
    segmento: 'rural',
    alvos: ['formigas cortadeiras', 'sauvas', 'quen-quem', 'cortadeiras de folhas', 'pastagens', 'jardins', 'pomares', 'etiprole'],
    descricao: '1ª isca formicida do mercado com Etiprole. Alta eficiência e baixa dosagem contra formigas Quen-Quém e Saúvas.',
    descricao_longa: `
      <p>A <strong>Isca Mata-Formiga Granulada</strong> é pioneira no mercado nacional com o princípio ativo Etiprole.</p>
      <p>Desenvolvida especialmente para corte e eliminação de formigas cortadeiras Saúvas e Quen-Quéns em jardins, pomares e pastagens.</p>
      <p><strong>Embalagem:</strong> Sachê 50g (Pacote com 10 sachês).</p>
    `,
    caracteristicas: [
      '1ª Isca com Etiprole do Brasil',
      'Eficaz para Saúvas e Quen-Quéns',
      'Maior rendimento e atratividade',
      'Sachê 50g (Pacote c/ 10 sachês)'
    ],
    imagens: [
      'img/produtos/p24-mata-formiga-isca-50g.webp'
    ],
    unidade: 'sachê',
    referencia: 'ISCA-ETIP-50',
    destaque: true
  },

  // ── 7. RATICIDAS & ROEDORES ────────────────────────────────
  {
    id: 25,
    nome: 'K-Rato Soft-Bait Isca Macia (150g e 2kg)',
    categoria: 'raticidas',
    tipo_formulacao: 'gel-isca',
    segmento: 'saude-publica',
    alvos: ['ratos', 'camundongos', 'ratazanas', 'roedores', 'gordura de queijo', 'isca macia', 'galpoes', 'fazendas', 'depositos'],
    descricao: 'Isca raticida macia com gordura de queijo de alta atratividade. Elimina ratos, camundongos e ratazanas.',
    descricao_longa: `
      <p>O <strong>K-Rato Soft-Bait</strong> é único no mercado por conter aroma e gordura de queijo de altíssima palatabilidade.</p>
      <p>Ação rápida e segura para controle definitivo de roedores em residências, galpões, fazendas e depósitos. Venda livre.</p>
      <p><strong>Embalagens:</strong> Sachê 150g (Display c/ 16) e Balde de 2kg (10 pacotes de 200g / Caixa c/ 4 baldes).</p>
    `,
    caracteristicas: [
      'Único com gordura de queijo',
      'Elimina ratos e ratazanas',
      'Isca macia de alta palatabilidade',
      'Sachê 150g e Balde 2kg'
    ],
    imagens: [
      'img/produtos/p25-k-rato-soft-bait.webp'
    ],
    unidade: 'un',
    referencia: 'KRATO-SOFT-150-2K',
    destaque: true
  },
  {
    id: 26,
    nome: 'K-Rato Raticida Pó de Contato (100g, 250g, 1kg)',
    categoria: 'raticidas',
    tipo_formulacao: 'po',
    segmento: 'saude-publica',
    alvos: ['ratos', 'ratazanas', 'camundongos', 'colonia de roedores', 'po de contato', 'ninhos', 'roedor seca'],
    descricao: 'Pó fino aderente de contato para controle de colônias de roedores. Roedor seca totalmente após a morte.',
    descricao_longa: `
      <p>O <strong>K-Rato Pó</strong> é apresentado na forma de pó ultrafino dispersante que adere aos pelos e patas dos roedores.</p>
      <p>Ao se lamberem nos ninhos, os animais ingerem o produto. O efeito ocorre a partir de 48h permitindo a contaminação da colônia inteira. O roedor seca após a morte sem exalar odores fortes.</p>
      <p><strong>Embalagens:</strong> Frascos de 100g (Caixa c/ 40), 250g (Caixa c/ 40) e 1kg (Caixa c/ 10).</p>
    `,
    caracteristicas: [
      'Aderente aos pelos dos roedores',
      'Contamina toda a colônia',
      'Roedor seca após a morte',
      'Frascos 100g, 250g e 1kg'
    ],
    imagens: [
      'img/produtos/p26-k-rato-po-contato.webp'
    ],
    unidade: 'frasco',
    referencia: 'KRATO-PO-100-250-1K',
    destaque: false
  },

  // ── 8. LESMICIDAS & CARAMUJOS ──────────────────────────────
  {
    id: 27,
    nome: 'Karamujo Garden (Sachê 30g)',
    categoria: 'lesmicidas',
    tipo_formulacao: 'gel-isca',
    segmento: 'jardinagem',
    alvos: ['caramujos', 'lesmas', 'caramujo de jardim', 'hortas', 'jardinagem amadora', 'borax', 'resistente a chuva'],
    descricao: 'Isca lesmicida registrada para uso em jardinagem amadora. Resistente à umidade e único com Borax.',
    descricao_longa: `
      <p>O <strong>Karamujo Garden</strong> é a 1ª isca lesmicida registrada para uso em jardinagem amadora e hortas caseiras.</p>
      <p>Pronto uso, alta atratividade, resistente à chuva/umidade e único enriquecido com Borax. Venda livre.</p>
      <p><strong>Embalagem:</strong> Display com 30 sachês de 30g (Caixa com 8 displays).</p>
    `,
    caracteristicas: [
      'Registrado p/ Jardinagem Amadora',
      'Resistente à umidade e chuva',
      'Único com Borax',
      'Display c/ 30 sachês de 30g'
    ],
    imagens: [
      'img/produtos/p27-karamujo-garden-30g.webp'
    ],
    unidade: 'sachê',
    referencia: 'KARM-GARD-30',
    destaque: true
  },
  {
    id: 28,
    nome: 'Karamujo Metaldeído Pellets (200g e 1kg)',
    categoria: 'lesmicidas',
    tipo_formulacao: 'gel-isca',
    segmento: 'rural',
    alvos: ['caramujo africano', 'lesmas gigantes', 'grandes infestacoes', 'chacaras', 'fazendas', 'metaldeido pellets'],
    descricao: 'Pellets de alta tecnologia para controle de Caramujo Africano e lesmas em grandes ambientes.',
    descricao_longa: `
      <p>O <strong>Karamujo Metaldeído Pellets</strong> foi desenvolvido para controle severo de infestações de Caramujo Africano e lesmas em chácaras, fazendas e grandes áreas verdes.</p>
      <p>Alta durabilidade no solo com máxima atratividade e Borax integrado.</p>
      <p><strong>Embalagens:</strong> Sachê 200g (Caixa c/ 30) e Sachê 1kg (Caixa c/ 10).</p>
    `,
    caracteristicas: [
      'Específico para Caramujo Africano',
      'Pellets de alta durabilidade',
      'Resistente a intempéries',
      'Sachês 200g e 1kg'
    ],
    imagens: [
      'img/produtos/p28-karamujo-metaldeido-pellets.webp'
    ],
    unidade: 'sachê',
    referencia: 'KARM-MET-200-1K',
    destaque: false
  },

  // ── 9. CARRAPATOS & PULGAS ─────────────────────────────────
  {
    id: 29,
    nome: 'Koral Carrapatos e Pulgas (60ml)',
    categoria: 'carrapatos-pulgas',
    tipo_formulacao: 'concentrado',
    segmento: 'saude-publica',
    alvos: ['carrapatos', 'pulgas', 'canis', 'patios', 'larvas de pulga', 'ovos de carrapato', 'ovicida', 'larvicida'],
    descricao: 'Inseticida ovicida e larvicida de alta eficiência e baixa dosagem para controle em pátios e residências.',
    descricao_longa: `
      <p>O <strong>Koral Carrapatos e Pulgas</strong> quebra o ciclo reprodutivo dos parasitas atuando como ovicida e larvicida.</p>
      <p><strong>Dosagem:</strong> Diluir apenas 3ml por litro de água limpa. Indicado para ambientes internos e externos (canis, quintais e pisos).</p>
      <p><strong>Embalagem:</strong> Frasco 60ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      'Ovicida e Larvicida',
      'Diluição de apenas 3ml/Litro',
      'Quebra o ciclo de reprodução',
      'Frasco 60ml (Caixa c/ 60 frascos)'
    ],
    imagens: [
      'img/produtos/p29-koral-carrapatos-pulgas-60ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'KOR-CARR-60',
    destaque: true
  },
  {
    id: 30,
    nome: 'Koral Pronto Uso Spray (240ml)',
    categoria: 'carrapatos-pulgas',
    tipo_formulacao: 'pronto-uso',
    segmento: 'saude-publica',
    alvos: ['carrapatos', 'pulgas', 'camas de pet', 'canis', 'pisos', 'pronto uso spray', 'casinhas de cachorro'],
    descricao: 'Spray pronto para aplicação direta em pisos, canis e locais frequentados por animais.',
    descricao_longa: `
      <p>Versão <strong>Pronto Uso do Koral</strong> com pulverizador spray para aplicação direta nos locais de descanso e trânsito dos animais.</p>
      <p><strong>Embalagem:</strong> Frasco 240ml com gatilho spray (Caixa com 24 frascos).</p>
    `,
    caracteristicas: [
      'Gatilho spray pronto para aplicar',
      'Ovicida e Larvicida',
      'Frasco 240ml (Caixa c/ 24 frascos)'
    ],
    imagens: [
      'img/produtos/p30-koral-pronto-uso-240ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'KOR-PU-240',
    destaque: false
  },

  // ── 10. ADJUVANTES & pH ────────────────────────────────────
  {
    id: 31,
    nome: 'Redutor de pH para Águas Duras (100ml)',
    categoria: 'adjuvantes',
    tipo_formulacao: 'adjuvante',
    segmento: 'rural',
    alvos: ['correcao de agua dura', 'regulador de ph', 'calda de pulverizacao', 'potencializador', 'carbonatos', 'cations livres'],
    descricao: 'Nivelador e corretor de pH para águas duras. Neutraliza carbonatos e cátions livres na calda de aplicação.',
    descricao_longa: `
      <p>O <strong>Redutor de pH Rawell</strong> é fundamental para garantir a máxima eficácia dos defensivos e desinfestantes.</p>
      <p>Neutraliza a dureza da água, cátions livres e carbonatos, ajustando o pH para a faixa ideal de absorção. Dosagem média de 2ml por litro de água.</p>
      <p><strong>Embalagem:</strong> Frasco 100ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      'Corrige dureza da água',
      'Neutraliza cátions e carbonatos',
      'Potencializa defensivos',
      'Frasco 100ml (Caixa c/ 60 frascos)'
    ],
    imagens: [
      'img/produtos/p31-redutor-de-ph-100ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'RED-PH-100',
    destaque: false
  },
  {
    id: 32,
    nome: 'Óleo Mineral Parafinado (100ml)',
    categoria: 'adjuvantes',
    tipo_formulacao: 'adjuvante',
    segmento: 'rural',
    alvos: ['aderencia', 'fixador de calda', 'anti-evaporante', 'adjuvante', 'emulsificante', 'gotas de pulverizacao'],
    descricao: 'Adjuvante, emulsificante, fixador e potencializador de caldas de pulverização para múltiplas funções.',
    descricao_longa: `
      <p>O <strong>Óleo Mineral Parafinado Rawell</strong> atua como adjuvante de alta pureza.</p>
      <p>Aumenta a aderência das gotas, reduz a evaporação, funciona como emulsificante e potencializa o efeito dos produtos aplicados. Dosagem recomendada: 1ml por litro de água.</p>
      <p><strong>Embalagem:</strong> Frasco 100ml (Caixa com 60 frascos).</p>
    `,
    caracteristicas: [
      'Adjuvante e Fixador',
      'Reduz evaporação da gota',
      'Dosagem econômica: 1ml/Litro',
      'Frasco 100ml (Caixa c/ 60 frascos)'
    ],
    imagens: [
      'img/produtos/p32-oleo-mineral-parafinado-100ml.webp'
    ],
    unidade: 'frasco',
    referencia: 'OLEO-MIN-100',
    destaque: true
  }

];
