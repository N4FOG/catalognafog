// ══════════════════════════════════════════════════════════════════════
//  PAINEL DE CONTROLE DE IMPLEMENTAÇÕES & ROADMAP v2 — JCV QUÍMICA 2026
//  Base de Dados Oficial & Sincronizada (Rawell Química v3.2 Cloud)
//  Repositório Oficial: https://github.com/N4FOG/catalognafog
// ══════════════════════════════════════════════════════════════════════

const ROADMAP2_DATA = {
  // ── 1. Configurações de Conexão Cloud ──────────────────────────────
  config: {
    cloudSyncUrl: "https://script.google.com/macros/s/AKfycbx6ZFn14Z0Ro6M2FIFJkoJd_VcPNlk9kl3jfK51A2SYbh4GxO5FBwu2Xbiie2Fi8ScVSQ/exec",
    autoSyncIntervalMs: 30000,
    storageKeyData: "rawell_roadmap2_cloud_data",
    storageKeyAuth: "rawell_roadmap2_admin_auth",
    storageKeyPin: "rawell_roadmap2_admin_pin",
    storageKeyOrder: "rawell_roadmap2_card_order",
    storageKeyView: "rawell_roadmap2_active_view"
  },

  // ── 2. Informações Gerais do Projeto ────────────────────────────────
  projeto: {
    nome: "Catálogo Oficial & Sistema de Orçamentos JCV Química (Rawell)",
    cliente: "JCV Química / Valdecir",
    repositorio: "https://github.com/N4FOG/catalognafog",
    versaoAtual: "v3.2 (Cloud & Kanban)",
    statusGlobal: "🟢 Em Produção & Sincronização Cloud Ativa",
    dataInicio: "Janeiro / 2026",
    ultimaAtualizacao: "05 de Setembro de 2026",
    contatoDev: {
      nome: "Equipe de Engenharia & Desenvolvimento",
      whatsapp: "554599781407",
      mensagemPadrao: "Olá! Estive visualizando o Painel de Implementações (Roadmap v2) da JCV Química e gostaria de falar sobre as entregas."
    }
  },

  // ── 3. Módulos Estruturais do Sistema (Maturidade %) ────────────────
  modulos: [
    { nome: "Catálogo & Busca", icone: "🌿", maturidade: 100, status: "Operacional" },
    { nome: "Ficha Consultiva", icone: "📋", maturidade: 100, status: "Operacional" },
    { nome: "Carrinho & Orçamento", icone: "🛒", maturidade: 100, status: "Operacional" },
    { nome: "Modo Vendedor & PIN", icone: "💼", maturidade: 100, status: "Operacional" },
    { nome: "Proposta PDF Timbrada", icone: "📄", maturidade: 100, status: "Operacional" },
    { nome: "WhatsApp Inteligente", icone: "💬", maturidade: 100, status: "Operacional" },
    { nome: "PWA & Cache Offline", icone: "📲", maturidade: 100, status: "Operacional" },
    { nome: "Auditoria Google Sheets", icone: "🛡️", maturidade: 95, status: "Em Homologação" },
    { nome: "Sincronização Cloud (Roadmap 2.0)", icone: "☁️", maturidade: 100, status: "Operacional" },
    { nome: "Sincronização de Preços", icone: "⚡", maturidade: 55, status: "Em Desenvolvimento" },
    { nome: "Diagnóstico de Pragas", icone: "🔍", maturidade: 20, status: "Planejado" }
  ],

  // ── 4. Funcionalidades & Roadmap Completo (0% a 100%) ────────────────
  features: [
    {
      id: "feat-001",
      titulo: "Catálogo Oficial com 32 Produtos, 10 Categorias e 5 Formulações",
      categoria: "Catálogo & Dados",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-07-01",
      dataEntrega: "2026-09-01",
      descricao: "Cadastro rigoroso dos 32 produtos oficiais da JCV Química/Rawell, organizados em 10 categorias técnicas (Herbicidas Seletivos, Inseticidas, Fungicidas, Raticidas, etc.) e 5 formulações (SC, WG, EC, Gel, Pó Molhável) com imagens WebP ultra-otimizadas.",
      tags: ["32 Produtos", "WebP", "Categorias", "Formulações"],
      checklist: [
        { item: "Extração técnica e revisão do catálogo físico 2026", feito: true },
        { item: "Conversão e compressão de fotos para WebP de alta fidelidade", feito: true },
        { item: "Classificação por categorias, linhas e formulações químicas", feito: true },
        { item: "Renderização em Grid responsivo (2 col mobile / 3 tablet / 4 desktop)", feito: true },
        { item: "Alternância entre Modo Grade e Modo Lista compacto", feito: true }
      ]
    },
    {
      id: "feat-002",
      titulo: "Motor de Busca em Tempo Real com Realce de Termos & Atalho (/)",
      categoria: "UI & Experiência",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-07-10",
      dataEntrega: "2026-09-01",
      descricao: "Buscador instantâneo com atalho de teclado global (/), realce dinâmico (highlight) dos termos pesquisados e busca simultânea por nome do produto, praga-alvo, referência e princípio ativo.",
      tags: ["Busca", "Highlight", "Atalhos", "Quick Tags"],
      checklist: [
        { item: "Busca instantânea sem recarregamento de página", feito: true },
        { item: "Realce visual (highlight amarelo) dos termos encontrados nos cards", feito: true },
        { item: "Atalho de teclado '/' para foco imediato no campo de busca", feito: true },
        { item: "Barra de Quick Tags com os alvos mais buscados (Tiririca, Roseta, Cupim, Baratas)", feito: true }
      ]
    },
    {
      id: "feat-003",
      titulo: "Ficha Técnica Consultiva com Galeria, Guia Prático e Segurança",
      categoria: "Catálogo & Dados",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-07-15",
      dataEntrega: "2026-09-02",
      descricao: "Modal em bottom-sheet responsivo com galeria de fotos, abas de Guia de Aplicação, Dosagens Técnicas Recomendadas e Painel de Segurança (proteção de pets, tempo de secagem/chuva, EPIs e horários ideais).",
      tags: ["Ficha Técnica", "Segurança", "Dosagens", "Bottom-Sheet"],
      checklist: [
        { item: "Bottom-sheet modal animado no mobile e card modal no desktop", feito: true },
        { item: "Galeria de imagens em alta definição por produto", feito: true },
        { item: "Abas separadas para Guia Prático, Dosagens e Segurança", feito: true },
        { item: "Ícones de segurança ambiental, animais domésticos e chuva", feito: true },
        { item: "Nuvem de pragas combatidas com chips clicáveis para busca", feito: true }
      ]
    },
    {
      id: "feat-004",
      titulo: "Carrinho de Orçamentos com Descontos e Envio para WhatsApp",
      categoria: "Vendas & Orçamentos",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-07-20",
      dataEntrega: "2026-09-02",
      descricao: "Sistema de orçamento flexível com controle de quantidades, persistência no navegador, desconto por item e desconto global no pedido com cálculo da Economia Total do Cliente e envio formatado ao WhatsApp.",
      tags: ["Carrinho", "Descontos", "WhatsApp", "Economia"],
      checklist: [
        { item: "Controle de quantidades com steppers rápidos (+/-)", feito: true },
        { item: "Cálculo preciso de descontos por item (%) e desconto global", feito: true },
        { item: "Cálculo e exibição visual do selo de 'Economia Total do Cliente'", feito: true },
        { item: "Persistência em localStorage para evitar perda de dados", feito: true },
        { item: "Formatação automática de texto limpo para o WhatsApp", feito: true }
      ]
    },
    {
      id: "feat-005",
      titulo: "Área Restrita do Representante Comercial (Modo Vendedor por PIN)",
      categoria: "Vendas & Orçamentos",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-08-01",
      dataEntrega: "2026-09-03",
      descricao: "Painel protegido por senha/PIN para os vendedores da JCV Química ajustarem preços de tabela, gerarem links de comissão personalizados (?v=vendedor), consultarem histórico de cotações e reabrirem pedidos antigos.",
      tags: ["Modo Vendedor", "Login PIN", "Comissão", "Histórico"],
      checklist: [
        { item: "Autenticação por PIN com bloqueio de visualização não autorizada", feito: true },
        { item: "Lista multi-vendedores configurável no arquivo config.js", feito: true },
        { item: "Gerador de links comissionados com tracking de vendedor", feito: true },
        { item: "Histórico local de até 50 orçamentos recentes com status (Aberto, Fechado, Perdido)", feito: true },
        { item: "Botão de reabertura de orçamentos antigos direto no carrinho", feito: true }
      ]
    },
    {
      id: "feat-006",
      titulo: "Emissor de Proposta Comercial Oficial em PDF Timbrado",
      categoria: "Vendas & Orçamentos",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-08-05",
      dataEntrega: "2026-09-03",
      descricao: "Gerador de propostas comerciais no padrão oficial timbrado da JCV Química/Rawell com dados do cliente (Nome, Fazenda/Empresa, Cidade/UF), número da proposta, modo com valores ou orçamento aberto (@media print).",
      tags: ["PDF", "Proposta Timbrada", "Impressão", "Vendas"],
      checklist: [
        { item: "Layout timbrado profissional com logo e dados corporativos", feito: true },
        { item: "Campos de cliente: Nome, Empresa/Fazenda, Documento, Cidade/UF", feito: true },
        { item: "Geração de número único de controle de proposta (ex: RQ-2026-4921)", feito: true },
        { item: "Modo Proposta com Preço Unitário e Modo Orçamento Sem Preço", feito: true },
        { item: "Estilização CSS limpa para impressão e salvamento direto em PDF", feito: true }
      ]
    },
    {
      id: "feat-007",
      titulo: "Arquitetura PWA Offline-First & Fontes Locais Self-Hosted",
      categoria: "Performance & PWA",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-08-15",
      dataEntrega: "2026-09-04",
      descricao: "Transformação do catálogo em Progressive Web App instalável no Android, iOS e Windows sem lojas de apps. Fontes Inter e Plus Jakarta Sans hospedadas localmente em WOFF2 com zero dependência externa e cache de alta velocidade.",
      tags: ["PWA", "Service Worker", "Cache Offline", "Fontes WOFF2"],
      checklist: [
        { item: "Configuração do manifest.json com ícones de 192px e 512px", feito: true },
        { item: "Service Worker inteligente (sw.js) com cache granular de imagens e assets", feito: true },
        { item: "Download e incorporação das fontes Inter e Plus Jakarta Sans em WOFF2", feito: true },
        { item: "Eliminação de qualquer CDN externa para garantir carregamento sub-segundo", feito: true },
        { item: "Botão intuitivo no cabeçalho para instalação do aplicativo", feito: true }
      ]
    },
    {
      id: "feat-008",
      titulo: "Auditoria em Tempo Real & Rastreamento Anti-Fraude (Google Sheets)",
      categoria: "Integração & Segurança",
      progresso: 95,
      status: "Em Testes",
      prioridade: "Alta",
      previsao: "Setembro / 2026",
      dataCriacao: "2026-08-20",
      dataPrevisao: "2026-09-08",
      descricao: "Rastreamento silencioso e assíncrono (sendBeacon/fetch) conectado via Webhook ao Google Apps Script. Grava na planilha do Google: Data/Hora, Vendedor, Proposta, Cliente, Total, Preço Praticado vs Tabela e Link de Garantia com Preço Travado.",
      tags: ["Google Sheets", "Auditoria", "Anti-Fraude", "Apps Script"],
      checklist: [
        { item: "Desenvolvimento do script google-apps-script.js receptor de webhook", feito: true },
        { item: "Disparo assíncrono não-bloqueante na emissão de PDF e cotação WhatsApp", feito: true },
        { item: "Link com Preço Travado como prova irrefutável da cotação", feito: true },
        { item: "Elaboração do Guia de Configuração (GUIA-AUDITORIA-GOOGLE-SHEETS.md)", feito: true },
        { item: "Validação final da planilha de produção do cliente", feito: false }
      ]
    },
    {
      id: "feat-009",
      titulo: "Painel Oculto de Implementações & Roadmap Transparente",
      categoria: "Gestão & Transparência",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-09-01",
      dataEntrega: "2026-09-05",
      descricao: "Dashboard exclusivo e protegido contra indexação (noindex, nofollow) para o cliente acompanhar em tempo real todas as implementações, progresso de 0% a 100%, histórico de versões e contato direto com os desenvolvedores.",
      tags: ["Roadmap", "Dashboard", "Transparência", "Changelog"],
      checklist: [
        { item: "Página roadmap.html desacoplada com design premium e responsivo", feito: true },
        { item: "Cálculo dinâmico de métricas, progresso geral e status dos módulos", feito: true },
        { item: "Filtros por status, busca por texto e linha do tempo de entregas", feito: true },
        { item: "Botão de cópia de link e contato direto pré-formatado no WhatsApp", feito: true },
        { item: "Proteção com meta tags anti-indexação e alias status.html", feito: true }
      ]
    },
    {
      id: "feat-013",
      titulo: "Painel Administrativo Completo com Reordenação Drag & Drop e Gestão em Tempo Real",
      categoria: "Gestão & Transparência",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-09-05",
      dataEntrega: "2026-09-05",
      descricao: "Módulo administrativo protegido por PIN com toolbar de ferramentas, CRUD completo de features, checklist interativo com reordenação por Drag & Drop, gerenciador de lançamentos (Changelog) e exportação com 1 clique.",
      tags: ["Admin", "Drag & Drop", "Checklist", "Exportação", "Gestão"],
      checklist: [
        { item: "Autenticação segura por PIN e toolbar administrativa flutuante", feito: true },
        { item: "CRUD completo de features com modal e controle de status em 1 clique", feito: true },
        { item: "Reordenação dinâmica de etapas do checklist via Drag & Drop e botões rápidos", feito: true },
        { item: "Gerenciador de releases e notas de atualização do Changelog", feito: true },
        { item: "Exportador com download de roadmap-data.js e persistência local", feito: true },
        { item: "Contadores dinâmicos nas pílulas de filtros e revisão ergonômica de UX", feito: true }
      ]
    },
    {
      id: "feat-016",
      titulo: "Sincronização em Nuvem Dinâmica em Tempo Real & Arquitetura Multi-Dispositivo",
      categoria: "Integração & Nuvem",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-09-05",
      dataEntrega: "2026-09-05",
      descricao: "Sincronização bidirecional em tempo real via Google Apps Script (ROADMAP_CLOUD). Permite que qualquer alteração feita no PC ou celular seja refletida imediatamente para qualquer usuário que acessar o link, com zero atraso de carregamento inicial (Local Cache + Async Cloud Fetch).",
      tags: ["Nuvem", "Sincronização", "Google Apps Script", "Tempo Real", "Multi-Device"],
      checklist: [
        { item: "Desenvolvimento dos endpoints getRoadmap e saveRoadmap no Google Apps Script", feito: true },
        { item: "Renderização instantânea (0ms) a partir de cache local com reconciliação em background", feito: true },
        { item: "Disparo automático para nuvem em qualquer ação administrativa (CRUD, Drag & Drop, Status)", feito: true },
        { item: "Badge inteligente de status de sincronização no cabeçalho com indicador online", feito: true },
        { item: "Botão de sincronização manual com feedback visual", feito: true }
      ]
    },
    {
      id: "feat-017",
      titulo: "Visão Kanban Interativa com Drag & Drop de Colunas e Transição de Status",
      categoria: "UI & Experiência",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-09-05",
      dataEntrega: "2026-09-05",
      descricao: "Quadro Kanban interativo dividido em 4 colunas operacionais (Planejadas, Em Desenvolvimento, Em Testes, Concluídas) com capacidade de arrastar cards entre colunas, atualizando automaticamente status, progresso e nuvem.",
      tags: ["Kanban", "Drag & Drop", "Colunas", "Produtividade"],
      checklist: [
        { item: "Criação da visualização Kanban com colunas responsivas e contadores", feito: true },
        { item: "Implementação de Drag & Drop HTML5 nativo entre colunas", feito: true },
        { item: "Transição inteligente de status e recálculo proporcional de progresso", feito: true },
        { item: "Alternador rápido Grade vs Kanban na barra de ferramentas", feito: true },
        { item: "Integração completa com os filtros globais de busca e período", feito: true }
      ]
    },
    {
      id: "feat-018",
      titulo: "Otimização Ergonômica do Quadro Kanban com Expansão Progressiva de Concluídas",
      categoria: "UI & Experiência",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-09-05",
      dataEntrega: "2026-09-05",
      descricao: "Sistema de paginação inteligente na coluna de funcionalidades Concluídas: exibe inicialmente 3 cards compactos e botão dinâmico (•••) para expandir progressivamente mais 5 cards, preservando o alinhamento e espaço visual do Kanban.",
      tags: ["Kanban", "UX Design", "Paginação", "Produtividade"],
      checklist: [
        { item: "Limite visual padrão de 3 cards na coluna Concluídas", feito: true },
        { item: "Efeito visual de corte suave no 3º card indicando continuidade", feito: true },
        { item: "Botão dinâmico com 3 pontinhos para expandir +5 cards por clique", feito: true },
        { item: "Botão de recolher para voltar à visualização compacta", feito: true },
        { item: "Suporte completo a Drag & Drop em qualquer estado de expansão", feito: true }
      ]
    },
    {
      id: "feat-019",
      titulo: "Emissor de Relatório Executivo Oficial em PDF com 1 Clique",
      categoria: "Gestão & Transparência",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-09-05",
      dataEntrega: "2026-09-05",
      descricao: "Geração instantânea de relatório executivo timbrado para diretoria em formato A4/PDF, contendo sumário executivo, tabela de maturidade de módulos, cronograma detalhado de features e campo de assinatura técnica.",
      tags: ["Relatório PDF", "Executivo", "Impressão A4", "One-Click"],
      checklist: [
        { item: "Formatação de página A4 com cabeçalho timbrado oficial JCV Química", feito: true },
        { item: "Sumário executivo de métricas (%) e tabela de maturidade dos módulos", feito: true },
        { item: "Detalhamento de features agrupadas por status com tags e checklists", feito: true },
        { item: "Bloco de assinaturas técnicas de engenharia e aprovação executiva", feito: true },
        { item: "Botão 'Baixar PDF Executivo' com 1 clique direto no cabeçalho", feito: true }
      ]
    },
    {
      id: "feat-010",
      titulo: "Sincronização Dinâmica de Tabela de Preços via Google Sheets",
      categoria: "Integração & Dados",
      progresso: 55,
      status: "Em Desenvolvimento",
      prioridade: "Alta",
      previsao: "Outubro / 2026",
      dataCriacao: "2026-09-01",
      dataPrevisao: "2026-10-15",
      descricao: "Permitirá à diretoria da JCV Química alterar preços de tabela e status de estoque (Disponível/Esgotado) diretamente em uma aba do Google Sheets, refletindo automaticamente no catálogo sem necessidade de novo deploy.",
      tags: ["Sincronização", "Nuvem", "Tabela Preços", "Estoque"],
      checklist: [
        { item: "Modelagem da planilha mestre de preços e estoque", feito: true },
        { item: "Endpoint de exportação JSON estruturado da planilha", feito: true },
        { item: "Lógica de cache no navegador com fallback local caso offline", feito: false },
        { item: "Botão de 'Sincronizar Catálogo' com 1 clique para vendedores", feito: false }
      ]
    },
    {
      id: "feat-011",
      titulo: "Assistente de Diagnóstico Guiado de Pragas & Dosagem Exata",
      categoria: "Catálogo & Inteligência",
      progresso: 20,
      status: "Planejado",
      prioridade: "Média",
      previsao: "Novembro / 2026",
      dataCriacao: "2026-09-01",
      dataPrevisao: "2026-11-20",
      descricao: "Fluxo interativo passo a passo onde o agricultor/jardineiro seleciona o ambiente (Gramado, Jardinagem, Pastagem, Ambiente Urbano), o tipo de praga/doença identificada e recebe a recomendação exata do defensivo e diluição correta.",
      tags: ["Diagnóstico", "Assistente", "Dosagem", "Recomendação"],
      checklist: [
        { item: "Mapeamento da árvore de decisão clínica por praga e cultura", feito: true },
        { item: "Interface de wizard com cards visuais de seleção rápida", feito: false },
        { item: "Calculadora automática de diluição (ml por litro de pulverizador)", feito: false },
        { item: "Botão direto para adicionar o kit recomendado ao carrinho", feito: false }
      ]
    },
    {
      id: "feat-012",
      titulo: "Exportação de Relatórios Comerciais e Faturamento (CSV / Excel)",
      categoria: "Vendas & Gestão",
      progresso: 10,
      status: "Planejado",
      prioridade: "Normal",
      previsao: "Dezembro / 2026",
      dataCriacao: "2026-09-01",
      dataPrevisao: "2026-12-10",
      descricao: "Geração de relatórios consolidados das cotações emitidas por vendedor, produtos mais demandados e volume financeiro orçado para conferência gerencial e faturamento.",
      tags: ["Relatórios", "Exportação", "CSV", "Excel", "Gestão"],
      checklist: [
        { item: "Definição dos campos de exportação contábil", feito: false },
        { item: "Módulo de exportação de dados em CSV compatível com Excel", feito: false },
        { item: "Filtro de relatórios por período e vendedor", feito: false }
      ]
    },
    {
      id: "feat-014",
      titulo: "Gestão Dinâmica de Prioridades com Tematização Visual nos Cards",
      categoria: "UI & Experiência",
      progresso: 100,
      status: "Concluído",
      prioridade: "Alta",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-09-05",
      dataEntrega: "2026-09-05",
      descricao: "Seletor interativo de prioridade (Alta, Média, Normal, Baixa) com 1 clique diretamente na badge do card em modo Admin, acompanhado por faixa superior em degradê, ambientação luminosa e tematização reativa em tempo real.",
      tags: ["Prioridade", "Tematização", "Glow", "Tempo Real"],
      checklist: [
        { item: "Dropdown interativo de prioridade incorporado ao cabeçalho do card", feito: true },
        { item: "Faixa superior em degradê proporcional por prioridade (Vermelho, Âmbar, Verde, Cinza)", feito: true },
        { item: "Ambientação luminosa com gradiente radial e borda adaptativa", feito: true },
        { item: "Sincronização de cores da barra administrativa com a prioridade do card", feito: true },
        { item: "Reatividade e persistência instantânea no localStorage", feito: true }
      ]
    },
    {
      id: "feat-015",
      titulo: "Micro-Tags Compactas no Rodapé com Acumulador Inteligente (+N)",
      categoria: "UI & Experiência",
      progresso: 100,
      status: "Concluído",
      prioridade: "Normal",
      previsao: "Entregue (09/2026)",
      dataCriacao: "2026-09-05",
      dataEntrega: "2026-09-05",
      descricao: "Redesenho ergonômico do rodapé dos cards com micro-chips técnicos (10px com cantos suaves), eliminação de campos redundantes e agrupador inteligente (+N com tooltip) para manter nivelamento perfeito no grid.",
      tags: ["Micro-Tags", "UX Design", "Acumulador +N", "Layout Grid"],
      checklist: [
        { item: "Redução tipográfica das tags para escala técnica de 0.62rem (10px)", feito: true },
        { item: "Substituição do formato pílula volumoso por cantos retos suaves (4px)", feito: true },
        { item: "Limite dinâmico de 3 tags visíveis com chip acumulador (+N) e tooltip", feito: true },
        { item: "Remoção do campo redundante de prioridade da barra inferior de ações", feito: true },
        { item: "Nivelamento e alinhamento do rodapé em todas as resoluções de tela", feito: true }
      ]
    }
  ],

  // ── 5. Linha do Tempo & Changelog Oficial (Histórico de Versões) ────
  changelog: [
    {
      versao: "v3.2.0 (Lançamento Oficial Roadmap v2)",
      data: "05 de Setembro de 2026",
      titulo: "Sincronização em Nuvem em Tempo Real, Quadro Kanban Dinâmico com Paginação e Relatório PDF Executivo",
      resumo: "Grande salto tecnológico do Painel de Transparência da JCV Química. Introdução de persistência em nuvem multi-dispositivo via Google Apps Script, visão Kanban com Drag & Drop de status, paginação inteligente na coluna de concluídas e gerador instantâneo de relatórios executivos em PDF timbrado.",
      itens: [
        { tipo: "novo", texto: "Sincronização em Nuvem (Cloud Sync) 100% dinâmica via Google Apps Script — qualquer dispositivo vê alterações em tempo real sem exportar/importar arquivos." },
        { tipo: "novo", texto: "Quadro Kanban Interativo com 4 colunas e Drag & Drop para alternar status e progresso de funcionalidades." },
        { tipo: "melhoria", texto: "Paginação progressiva na coluna de Concluídas do Kanban (3 cards iniciais + botão ••• de expansão)." },
        { tipo: "novo", texto: "Emissor de Relatório Executivo Oficial em PDF timbrado com 1 clique (A4 profissional)." },
        { tipo: "novo", texto: "Templates rápidos de checklist no Admin (Nova Feature, Aprimoramento, Bugfix, Integração)." },
        { tipo: "melhoria", texto: "Automação total de progresso calculada matematicamente a partir das etapas do checklist." },
        { tipo: "performance", texto: "Carregamento instantâneo (0ms) com cache local e reconciliação assíncrona com a nuvem." }
      ]
    },
    {
      versao: "v3.1.0",
      data: "05 de Setembro de 2026",
      titulo: "Painel de Gestão do Roadmap, Tematização de Prioridades e Filtros Avançados de Datas",
      resumo: "Evolução do ecossistema de transparência com ferramentas completas de administração, controles de prioridade reativos nos cards, reordenação Drag & Drop de etapas, design de micro-tags ergonômicas e novos filtros por período temporal e intervalo de datas.",
      itens: [
        { tipo: "novo", texto: "Painel Administrativo protegido por PIN com CRUD completo de features e lançamentos." },
        { tipo: "novo", texto: "Seletor dinâmico de Prioridades nos cards com ambientação luminosa e faixa superior em degradê." },
        { tipo: "novo", texto: "Filtro avançado por períodos rápidos (24h, 7d, 15d, 30d, 90d, 2026) e seletor De/Até personalizado." },
        { tipo: "melhoria", texto: "Reordenação dinâmica de etapas do checklist via Drag & Drop nativo e botões de ordenação." },
        { tipo: "performance", texto: "Redesenho ergonômico das tags no rodapé com micro-chips técnicos (10px) e agrupador inteligente (+N)." },
        { tipo: "seguranca", texto: "Persistência inteligente em localStorage com rastreamento permanente de exclusões de cards." },
        { tipo: "melhoria", texto: "Filtro inicial padrão do Roadmap configurado para exibir funcionalidades 'Em Andamento'." }
      ]
    },
    {
      versao: "v3.0.0 (Baseline Estável)",
      data: "05 de Setembro de 2026",
      titulo: "Arquitetura Modular Canônica, Auditoria Google Sheets e Painel do Cliente",
      resumo: "Consolidação da base estável e canônica de referência do projeto. Refatoração modular total em camadas isoladas (data, modules, css), implantação da auditoria anti-fraude e criação do painel de transparência do cliente.",
      itens: [
        { tipo: "novo", texto: "Criação do Painel Oculto de Roadmap & Histórico de Implementações (roadmap.html)." },
        { tipo: "novo", texto: "Implementação da Auditoria e Rastreamento Anti-Fraude em tempo real via Google Sheets." },
        { tipo: "seguranca", texto: "Criação do Link de Garantia com Preço Travado gravado na planilha como prova da cotação." },
        { tipo: "performance", texto: "Refatoração modular do JavaScript em 10 módulos limpos e desacoplados na pasta js/modules/." },
        { tipo: "performance", texto: "Separação modular dos estilos CSS por domínios de interface (catalog, sheet-modal, cart, seller)." },
        { tipo: "melhoria", texto: "Padronização do README.md e documentação técnica oficial de zero regressão." }
      ]
    },
    {
      versao: "v2.2.0",
      data: "25 de Agosto de 2026",
      titulo: "Otimização PWA Offline-First & Fontes Locais WOFF2",
      resumo: "Remoção de todas as dependências externas e CDNs para atingir máxima velocidade de carregamento e funcionamento offline garantido.",
      itens: [
        { tipo: "novo", texto: "Self-hosting das famílias tipográficas Plus Jakarta Sans e Inter em formato WOFF2 ultraleve." },
        { tipo: "melhoria", texto: "Aprimoramento do Service Worker (sw.js) com estratégias de cache granular para fotos WebP." },
        { tipo: "performance", texto: "Tempo de carregamento inicial reduzido para menos de 0.8s em conexões 4G." },
        { tipo: "correcao", texto: "Correção de overflow em telas ultra-compactas na busca mobile." }
      ]
    },
    {
      versao: "v2.1.0",
      data: "10 de Agosto de 2026",
      titulo: "Módulo Vendedor Avançado, PIN de Segurança e Proposta Comercial em PDF",
      resumo: "Criação do ambiente exclusivo para os representantes comerciais emitirem orçamentos com margens personalizadas e propostas oficiais timbradas.",
      itens: [
        { tipo: "novo", texto: "Painel do Vendedor com login protegido por PIN comissionado." },
        { tipo: "novo", texto: "Gerador de Propostas Comerciais Oficiais em PDF timbrado com e sem preços." },
        { tipo: "novo", texto: "Histórico local de até 50 cotações recentes com controle de status (Aguardando, Fechado, Perdido)." },
        { tipo: "novo", texto: "Gerador de links de comissão personalizados para vendedores (?v=carlos)." },
        { tipo: "melhoria", texto: "Cálculo e exibição do selo de 'Economia Total do Cliente' no carrinho." }
      ]
    },
    {
      versao: "v2.0.0",
      data: "15 de Julho de 2026",
      titulo: "Lançamento da Plataforma JCV Química v2 (PWA & Dark Mode)",
      resumo: "Reformulação completa da arquitetura do catálogo digital com suporte a PWA instalável, tema Dark/Light nativo e fotos WebP.",
      itens: [
        { tipo: "novo", texto: "Estrutura PWA completa com Web App Manifest e suporte a instalação no celular/desktop." },
        { tipo: "novo", texto: "Tema Claro e Modo Escuro nativo com persistência em localStorage e script anti-FOUC." },
        { tipo: "novo", texto: "Catálogo completo com 32 produtos oficiais, 10 categorias e 5 formulações químicas." },
        { tipo: "novo", texto: "Carrinho de orçamento dinâmico integrado ao WhatsApp com disparo em 1 clique." },
        { tipo: "seguranca", texto: "Inclusão de meta tags de proteção anti-indexação e headers seguros." }
      ]
    },
    {
      versao: "v1.0.0",
      data: "15 de Janeiro de 2026",
      titulo: "Concepção do Projeto & Digitalização do Catálogo Físico",
      resumo: "Fase inicial de extração de dados técnicos, catalogação dos produtos e prototipagem do sistema de vendas online da JCV Química.",
      itens: [
        { tipo: "novo", texto: "Extração dos dados técnicos e dosagens do catálogo impresso oficial 2026." },
        { tipo: "novo", texto: "Tratamento digital e padronização das fotografias dos produtos." },
        { tipo: "novo", texto: "Primeira versão funcional do catálogo online com integração WhatsApp." }
      ]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.ROADMAP2_DATA = ROADMAP2_DATA;
  window.ROADMAP_DATA = ROADMAP2_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROADMAP2_DATA;
}
