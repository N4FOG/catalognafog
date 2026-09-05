# 🏆 JCV Química — Plataforma Comercial Digital

<div align="center">

![Version](https://img.shields.io/badge/versão-V4.0--Business--Stable-gold?style=for-the-badge&logo=star&logoColor=white)
![Status](https://img.shields.io/badge/status-ESTÁVEL%20•%20PRODUÇÃO-brightgreen?style=for-the-badge)
![V2](https://img.shields.io/badge/V2-Vanilla%20JS%20•%20PWA-blue?style=for-the-badge&logo=javascript)
![V3](https://img.shields.io/badge/V3-React%2019%20%2B%20TypeScript-cyan?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/licença-Comercial%20Proprietária-red?style=for-the-badge)

**Catálogo comercial digital de alta performance para revenda de defensivos agrícolas e produtos químicos domissanitários. Produto comercial vendido e em produção ativa para JCV Química — revenda oficial Rawell Química.**

[🌐 Acessar Catálogo](https://n4fog.github.io/catalognafog/v2/) • [📊 Painel Roadmap](https://n4fog.github.io/catalognafog/v2/roadmap.html) • [🔬 Versão V3 React](https://n4fog.github.io/catalognafog/v3/)

</div>

---

## 📋 Índice

- [Visão Geral do Produto](#-visão-geral-do-produto)
- [Arquitetura Dual-Version](#-arquitetura-dual-version)
- [V2 — Plataforma em Produção](#-v2--plataforma-em-produção-vanilla-js--pwa)
- [V3 — Arquitetura React + TypeScript](#-v3--arquitetura-react--typescript-vite--tailwind-v4)
- [Estrutura de Arquivos](#-estrutura-de-arquivos)
- [Instalação & Deploy](#-instalação--deploy)
- [Configuração da Empresa](#-configuração-da-empresa)
- [Changelog de Versões](#-changelog-de-versões)

---

## 🎯 Visão Geral do Produto

O **JCV Química Catálogo Comercial Digital** é uma plataforma web de vendas B2C/B2B completa, desenvolvida sob medida para revendas de defensivos agrícolas e produtos domissanitários. Funciona como um **Progressive Web App (PWA)** instalável — sem dependência de lojas de aplicativos — diretamente no celular do vendedor e do cliente.

### Propósito Principal

| Dimensão | Descrição |
|---|---|
| **Para o Vendedor** | Ferramenta de campo para montar orçamentos, negociar descontos e disparar propostas via WhatsApp em segundos |
| **Para o Cliente** | Catálogo consultivo completo com fichas técnicas, imagens HD e dados agronômicos precisos |
| **Para a Gestão** | Auditoria antifraude automática, histórico de cotações e rastreabilidade de negociações |
| **Para o Marketing** | Estúdio de criação de flyers e stories com artes prontas para disparo nas redes sociais |

### Diferenciais Competitivos

- ✅ **Zero dependência de CDN** — todas as fontes, ícones e assets são self-hosted (funciona 100% offline)
- ✅ **Proposta PDF profissional** gerada no dispositivo, sem servidor, sem custos de API
- ✅ **Link Mágico** que preserva todo o carrinho (itens, preços, descontos) em uma URL compartilhável
- ✅ **Motor de auditoria** que registra cada venda/orçamento em planilha Google (prova irrefutável)
- ✅ **App vendedor com histórico**, filtros de status e link direto para cliente
- ✅ **PWA instalável** com ícones de tela inicial, sem App Store, sem Google Play

---

## 🏗️ Arquitetura Dual-Version

```
catalognafog/
├── v2/          ← PRODUÇÃO ATIVA — Vanilla JS + CSS Modular + PWA V5
└── v3/          ← NEXT-GEN — React 19 + TypeScript + Vite + Tailwind v4 + Zustand
```

- **V2** é o produto comercial entregue, vendido e em uso ativo. Recebe atualizações contínuas de features e refinamentos.
- **V3** é a reescrita total em React 19 com TypeScript, servindo como base tecnológica para futuras versões enterprise.

---

## 📱 V2 — Plataforma em Produção (Vanilla JS + PWA)

### 🛍️ Catálogo de Produtos

**32 produtos** com fichas técnicas completas abrangendo todas as linhas:

| Linha | Exemplos |
|---|---|
| 🌿 **Gramados & Turfas** | Kapina Plus, Kapina Tradicional, Korsario, Katana |
| 🌺 **Jardinagem** | KCura Fungicida, KaBio, Bravick, Oleo Mineral Parafinado |
| 🏠 **Saúde Pública Domissanitária** | Impakto, Fimo Combina, Pankada, Unix Repik |
| 🔬 **Linha Pro Agro** | Rocada, Arranka EW, Arranka SPM, Arranka PM Lambda |
| 🐀 **Raticidas** | K-Rato Soft Bait, K-Rato Pó de Contato |
| 🐌 **Molusquicidas** | Karamujo Garden, Karamujo Metaldeído Pellets |
| 🦟 **Vetores & Pragas Urbanas** | Namosca GB, Blekalt 25, Koral Moscas, Mata Formiga Gel, Mata Barata Gel |
| 🐾 **Saúde Animal** | Koral Carrapatos/Pulgas, Koral Pronto Uso 240ml |

**Dados técnicos por produto:** nome comercial, princípio ativo, grupo químico, formulação (SC/WG/CE/EW/Pellets/Gel), pragas-alvo, cultura/ambiente, dosagem, EPI obrigatório, registro MAPA, intervalo de segurança, classificação toxicológica e ambiental, galeria multi-ângulo WebP HD.

#### Sistema de Busca e Filtragem

- **Busca preditiva** simultânea em: nome, princípio ativo, praga-alvo, cultura, registro MAPA
- **Chips de busca rápida:** `Tiririca` · `Roseta` · `Baratas` · `Moscas` · `Cupins` · `Fungos` · `Formigas`
- **Filtros por categoria** com navegação lateral persistente (6 linhas)
- **4 modos de visualização:** Grade 2col, 3col, 4col e Lista horizontal — preferência persistida no localStorage

---

### 🔬 Ficha Consultiva — 3 Pilares do Especialista

Split Modal desktop (galeria HD esquerda + ficha direita) / Bottom Sheet mobile.

**Pilar 1 — Recomendação Agronômica:** dosagem, espectro de ação, culturas, momento de aplicação

**Pilar 2 — Modo de Ação e Formulação:** mecanismo de ação, tipo de formulação, compatibilidade em calda, persistência

**Pilar 3 — Segurança e Manejo:** EPI com ícones visuais, intervalo de segurança, toxicologia, descarte

**Galeria multi-ângulo:** transição suave com `transform: translateX`, dots navegáveis, suporte a swipe touch.

---

### 🛒 Carrinho Comercial Avançado

Drawer lateral (desktop) / Bottom Sheet (mobile) com:

| Feature | Descrição |
|---|---|
| **Controle de quantidade** | Botões −/+ com input direto |
| **Edição de preço unitário** | Campo editável inline (modo vendedor) |
| **Desconto por item** | Slider + chips rápidos 5%, 10%, 15%, 20% |
| **Remoção individual** | Remove item sem fechar o carrinho |

**Resumo contábil em tempo real:**
```
Subtotal Bruto     R$ 1.250,00
(-) Desc. Itens    - R$   87,50   (descontos individuais)
(-) Desc. Global   - R$   57,63   (desconto % sobre saldo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Líquido      R$ 1.104,87
```

**Cart Footer Bar — 4 ações de saída:**
```
| PDF c/ Preço  | PDF s/ Preço  |
| WPP c/ Preço  | WPP s/ Preço  |
```

---

### 💰 Motor de Descontos

```
precoUnitario   = precoBase × (1 - descontoItem/100)
subtotalBruto   = Σ (precoUnitario × quantidade)
subtotalLiquido = subtotalBruto × (1 - descontoGlobal/100)
```

Recalcula em tempo real a cada interação. Desconto por item exclusivo do modo vendedor. Persistência completa no localStorage.

---

### 💬 Disparo WhatsApp

**3 modalidades:**
1. **Empresa padrão:** mensagem formatada para 554599781407 (JCV Química)
2. **Direto para cliente:** modal com campo de telefone, validação DDD + 9 dígitos, disparo para número digitado
3. **Roteamento por vendedor:** WhatsApp do representante responsável como canal de resposta

Mensagem formatada com emojis, lista de itens, quantidades, preços (se vendedor), total e link mágico de reabertura.

---

### 📄 Proposta Comercial PDF Timbrada (A4)

Geração de proposta profissional **100% no dispositivo**, sem servidor:

- Numeração única: `RQ-2026-` + hash de 4 dígitos
- Cabeçalho timbrado JCV Química (CNPJ, canais de contato)
- Dados do cliente e representante
- Tabela: Ref | Produto | Dosagem | Qtd | Valor Unit | Subtotal
- Resumo financeiro: Subtotal Bruto → Desconto → Total Líquido
- Condições de pagamento, validade 10 dias
- QR Code inline apontando para o link mágico (reabertura instantânea)
- Versão **com preços** (vendedor) e **sem preços** (catálogo puro)

---

### 🔗 Link Mágico de Recompra

Serialização de **todo o estado do carrinho** em URL compartilhável:

```
https://n4fog.github.io/catalognafog/v2/?cart=eyJpdGVtcyI6...
```

**O que é serializado:** itens (IDs), quantidades, preços unitários, descontos individuais, desconto global, dados do vendedor, dados do cliente.

**Casos de uso:** recompra rápida, continuação de negociação, proposta multi-canal (WhatsApp + QR no PDF).

---

### 👔 App do Vendedor Master

**Autenticação:** PIN de 4 dígitos com sessão persistida no localStorage e auto-logout por inatividade.

**Painel pós-login:**

**Aba Meus Orçamentos:**
- Lista de orçamentos do vendedor com filtros: `Todos` · `Aguardando` · `Em Negociação` · `Fechado` · `Perdido`
- Card por orçamento: número, cliente, data, total, status
- Botões: `Reabrir Carrinho` (restaura todo o estado) + `WhatsApp` (contato direto)

**Aba Ferramentas & Links:**
- Gerador de link pessoal do vendedor
- Link com carrinho ativo serializado
- Botão copiar para área de transferência

**Navigation Bar adaptativa:**
- Aba Catálogo (sempre visível)
- Aba Orçamento (aparece ao adicionar itens)
- Aba Área do Vendedor (aparece somente após login)

---

### 📊 Histórico de Orçamentos

Persistência local completa de negociações:

```json
{
  "id": "RQ-2026-4821",
  "timestamp": "2026-09-03T14:32:00.000Z",
  "vendedor": { "nome": "Carlos Silva", "whatsapp": "45999998888" },
  "cliente": { "nome": "João Fazendeiro", "fone": "45888887777" },
  "itens": [{ "id": "p01", "qtd": 5, "precoUnit": 45.00, "descItem": 10 }],
  "descontoGlobal": 5,
  "total": 191.25,
  "link": "https://.../?cart=eyJ..."
}
```

Reabertura com 1 clique restaura todo o estado do carrinho. Histórico ilimitado (limitado pelo localStorage ~5MB).

---

### 🔐 Auditoria Antifraude Google Sheets

```
App (navegador) → fetch POST → Google Apps Script (doPost) → Google Sheets
```

**Eventos auditados:** `ORCAMENTO_GERADO`, `LINK_MAGICO_CRIADO`, `ORCAMENTO_REABERTO`, `VENDEDOR_LOGIN`

**Campos por evento:** timestamp, vendedor, evento, número proposta, cliente, itens JSON, totais, desconto global, link de garantia.

**Para que serve:** prova irrefutável de orçamento gerado, análise de desempenho por vendedor, rastreamento de conversão, discriminação canal orgânico vs. vendedor, backup de preços cotados.

---

### 📲 PWA — App Instalável Offline

**Service Worker V5 — Estratégias de cache:**
- `Cache-First` → 32 imagens WebP dos produtos
- `Stale-While-Revalidate` → CSS, JS, fontes WOFF2
- `Network-First` → index.html (garante versão atualizada)

**Pré-cache no install:** index.html, roadmap.html, todos os módulos CSS e JS, 32 imagens WebP, fontes WOFF2, ícones do app.

**Instalação por plataforma:**

| Plataforma | Resultado |
|---|---|
| Android (Chrome) | WebAPK nativo |
| iOS (Safari) | Web Clip com ícone |
| Desktop Chrome/Edge | App standalone |

**Monitor de conectividade:** toast animado online/offline com vibração háptica.

---

### 👆 Gestos Touch & UX Mobile

**Swipe-to-Close:** deslizar Bottom Sheet para baixo fecha o modal com resistência elástica mecânica.

**Botão Flutuante de Orçamento:**
- Aparece ao adicionar o primeiro item
- Badge com contagem de itens (atualização animada)
- Posicionado com `safe-area-inset-bottom` (respeita notch iOS)

**Feedback háptico via `navigator.vibrate`:**
```javascript
navigator.vibrate(50);               // Adicionar item
navigator.vibrate([50, 30, 100]);    // Confirmar envio
navigator.vibrate([100, 50, 100, 50, 200]); // Erro
```

**Safe Area Insets:** compatível com iPhone X+ (notch + home indicator) e Android com gestos de navegação.

---

### 🎨 Design System & Dark Mode

**CSS Custom Properties:** tokens para cores, tipografia, espaçamento e radius.

**Dark Mode:** detecção automática `prefers-color-scheme` + alternador manual com persistência. Transição suave 300ms em todos os tokens.

**Fontes WOFF2 self-hosted (zero CDN):**
- **Inter** — UI (pesos 400, 500, 600, 700)
- **Plus Jakarta Sans** — display/títulos (pesos 600, 700, 800)

**Módulos CSS isolados:**
```
css/base.css · layout.css · catalog.css · sheet-modal.css
    cart.css · seller.css · mobile-app.css · roadmap.css
```

---

### 📸 Estúdio de Marketing

Artes prontas `9:16 (1080×1920px)` para WhatsApp Status e redes sociais:

| Arte | Uso |
|---|---|
| `story_gramado_perfeito_*.jpg` | Campanha gramados |
| `story_protecao_pet_casa_*.jpg` | Linha Saúde Animal |
| `story_ad_kapina_*.jpg` | Campanha Kapina |
| `story_ad_pragas_*.jpg` | Controle de Pragas |

---

### 📊 Painel de Roadmap Interativo

Dashboard corporativo (`roadmap.html`) de transparência e progresso:

- **Métricas:** gráficos circulares SVG animados com % de entrega por status
- **Contadores:** total entregue / em desenvolvimento / backlog
- **Filtros + Busca:** por status e texto livre
- **Timeline cronológica:** implementações agrupadas por mês
- **Área administrativa (PIN):** editar status, cadastrar novas entregas, atualizar datas
- **Redirecionador:** `status.html` → `roadmap.html`

---

## ⚛️ V3 — Arquitetura React + TypeScript (Vite + Tailwind v4)

| Tecnologia | Papel |
|---|---|
| **React 19** | UI declarativa com transitions e Suspense |
| **TypeScript 5.x** | Type safety em toda a base |
| **Vite 5.x** | Build ultra-rápido com HMR e tree-shaking |
| **Tailwind CSS v4** | Design system CSS-first |
| **Zustand 4.x** | State management sem boilerplate |

```
v3/src/
├── components/   ← ProductCard, Cart, SellerPanel, Modal
├── stores/       ← cartStore, sellerStore, themeStore
├── types/        ← Product, CartItem, Vendor, Order
├── utils/        ← whatsapp.ts, pdf.ts, magicLink.ts
└── data/         ← products.ts, categories.ts, config.ts
```

---

## 📁 Estrutura de Arquivos

```
nfog-catalogo/
├── README.md
├── google-apps-script.js          ← Backend webhook auditoria
│
├── v2/                            ← PRODUCAO ATIVA
│   ├── index.html                 ← App principal
│   ├── roadmap.html               ← Painel de implementações
│   ├── status.html                ← Redirecionador
│   ├── sw.js                      ← Service Worker V5
│   ├── css/                       ← 8 módulos CSS
│   ├── fonts/                     ← inter.woff2, plus-jakarta-sans.woff2
│   ├── js/
│   │   ├── data/                  ← config.js, categories.js, products.js
│   │   └── modules/               ← 13 módulos JS isolados
│   └── img/
│       ├── produtos/              ← 32 imagens WebP (p01-p32)
│       └── marketing/             ← Stories e banners 9:16
│
└── v3/                            ← NEXT-GEN REACT
    ├── src/                       ← Código TypeScript
    └── dist/                      ← Build compilado (deploy-ready)
```

---

## 🚀 Instalação & Deploy

### Deploy Estático (GitHub Pages — produção atual)

```bash
git clone https://github.com/N4FOG/catalognafog.git
# GitHub Settings → Pages → branch main / root
```

- **V2:** `https://n4fog.github.io/catalognafog/v2/`
- **Roadmap:** `https://n4fog.github.io/catalognafog/v2/roadmap.html`
- **V3:** `https://n4fog.github.io/catalognafog/v3/`

### Build V3 (local)

```bash
cd v3
npm install
npm run dev      # Servidor de dev com HMR
npm run build    # Build em dist/
```

---

## ⚙️ Configuração da Empresa

Centralizada em `v2/js/data/config.js`:

```javascript
export const CONFIG = {
  empresa: {
    nome: 'JCV Química',
    whatsapp: '554599781407',
    email: 'contato@jcvquimica.com.br'
  },
  vendedores: [
    { id: 'valdecir', nome: 'Valdecir', pin: '1234', whatsapp: '554599781407' }
  ],
  catalogo: {
    descontoMaxItem: 30,       // % max por item
    descontoMaxGlobal: 20      // % max global
  },
  telemetria: {
    endpoint: 'https://script.google.com/macros/s/.../exec',
    ativo: true
  }
};
```

---

## 📜 Changelog de Versões

```
╔══════════════════════════════════════════════════════════════╗
║  V4.0.0-BUSINESS-STABLE — 2026-09-05                        ║
╠══════════════════════════════════════════════════════════════╣
║  Marco de estabilizacao comercial do produto                 ║
║  + Painel de Roadmap Interativo com area administrativa      ║
║  + Fontes WOFF2 self-hosted (Inter + Plus Jakarta Sans)      ║
║  + Sincronizacao V3 React: build dist/ atualizado            ║
║  + README unificado com documentacao dual-architecture       ║
╚══════════════════════════════════════════════════════════════╝

[v3.0.0-stable] — 2026-08
  + Gestos touch nativos (swipe-to-close, resistencia elastica)
  + Botao flutuante de orcamento com badge animado
  + Monitor de conectividade online/offline com toast
  + Feedback haptico via navigator.vibrate
  + Identidade visual JCV Quimica (substituicao da Rawell)
  + Service Worker V5 com estrategias de cache otimizadas
  + Auditoria de desempenho: lazy loading, WebP, cache headers
  + Modulo PDF desacoplado do modulo WhatsApp

[v2.1.0] — 2026-07
  + App do Vendedor Master com abas e historico de orcamentos
  + Disparo direto para WhatsApp do cliente (com validacao)
  + Roteamento automatico por vendedor
  + Filtros de status de orcamento (5 estados)

[v2.0.0] — 2026-07
  + Motor de descontos com calculo contabil em cascata
  + Proposta PDF A4 timbrada com numeracao unica
  + Link Magico de Recompra (serializacao completa em URL)
  + Ficha Consultiva 3 Pilares do Especialista
  + Redesign premium do carrinho (Drawer + Bottom Sheet)
  + Estudio de Marketing com artes 9:16 prontas

[v1.2.0] — 2026-06
  + Ficha Consultiva estruturada (3 pilares)
  + Modo Vendedor com PIN
  + Auditoria Google Sheets via Apps Script

[v1.0.0] — 2026-05
  + Catalogo basico (32 produtos WebP)
  + Busca preditiva + filtros por categoria
  + Chips de busca rapida
  + Alternancia Grid/Lista com localStorage
  + Integracao WhatsApp basica
  + PWA instalavel (Service Worker V1)
```

---

<div align="center">

**Desenvolvido com para JCV Química**

*Sistema comercial proprietário — todos os direitos reservados*

`V4.0.0-BUSINESS-STABLE` · `2026-09-05` · `N4FOG`

</div>
