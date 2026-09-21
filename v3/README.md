# 🌿 JCV Química — Catálogo Oficial & Sistema de Orçamentos 2026 (Rawell v3.0)

> **Versão Moderna — Vite 6 + React 19 + TypeScript + Tailwind CSS v4 + Zustand**  
> Diretório: `C:\Users\n4fog\Pictures\VALDECIR\rawell-v3`

---

## 🚀 1. Tecnologias Utilizadas

- ⚡ **Vite 6** + **React 19** + **TypeScript**: Ambiente ultraveloz com tipagem estrita e segurança nas regras financeiras.
- 🎨 **Tailwind CSS v4**: Design system responsivo, consistente, tema Dark/Light nativo e estilos otimizados para impressão (@media print).
- 🧩 **Lucide React**: Ícones SVG modernos, consistentes e ultraleves.
- 🐻 **Zustand**: Gerenciamento de estado global reativo (Carrinho, Vendedor, Tema, Filtros).
- 📱 **PWA (Progressive Web App)**: Cache offline inteligente (`sw.js`) e instalabilidade mobile.
- 📊 **Auditoria & Telemetria**: Integração assíncrona com Google Sheets via Google Apps Script.

---

## 🏗️ 2. Estrutura do Projeto

```
rawell-v3/
├── index.html                  # HTML semântico com tags PWA
├── package.json                # Dependências e scripts
├── tsconfig.json               # Configurações TypeScript
├── vite.config.ts              # Configuração Vite com Tailwind v4 plugin
├── public/
│   ├── manifest.json           # Manifesto PWA
│   ├── sw.js                   # Service Worker com cache offline
│   └── img/                    # Imagens WebP oficiais dos 32 produtos
│
└── src/
    ├── main.tsx                # Ponto de entrada React
    ├── App.tsx                 # Aplicação raiz, bootstrapping e rotas de comissão (?v=)
    ├── index.css               # Diretivas Tailwind v4 e estilos de impressão timbrada
    │
    ├── types/                  # Tipos TypeScript estritos
    │   ├── product.ts          # Produto, categoria, formulação, segurança e EPIs
    │   ├── cart.ts             # Item do carrinho, dados do cliente e totalizadores
    │   ├── seller.ts           # Sessão, histórico de propostas e status
    │   └── telemetry.ts        # Payloads de telemetria
    │
    ├── data/                   # Camada de Dados
    │   ├── config.ts           # Contatos, webhook e vendedores oficiais
    │   ├── categories.ts       # 10 categorias e 5 formulações
    │   └── products.ts         # 32 produtos oficiais e fichas técnicas completas
    │
    ├── store/                  # Estado Global Reativo (Zustand)
    │   ├── useCartStore.ts     # Carrinho, regras de desconto e cálculo de economia
    │   ├── useSellerStore.ts   # Sessão do vendedor, PIN e histórico de cotações
    │   ├── useCatalogStore.ts  # Busca, filtros de categoria e controle de modais
    │   ├── useThemeStore.ts    # Tema Dark / Light com persistência
    │   └── useToastStore.ts    # Notificações flutuantes animadas
    │
    ├── utils/                  # Funções Utilitárias
    │   ├── formatters.ts       # Moeda R$, datas e máscaras
    │   ├── calculations.ts     # Motor financeiro (desconto item + desconto global)
    │   ├── haptics.ts          # Feedback tátil mobile
    │   └── telemetry.ts        # Disparo para o webhook do Google Apps Script
    │
    └── components/             # Componentes Modulares
        ├── ui/
        │   ├── Modal.tsx
        │   ├── Stepper.tsx
        │   └── ToastContainer.tsx
        ├── layout/
        │   ├── Header.tsx
        │   ├── StoriesBar.tsx
        │   ├── FilterBar.tsx
        │   └── Footer.tsx
        ├── catalog/
        │   ├── ProductCard.tsx
        │   ├── ProductListItem.tsx
        │   ├── ProductGrid.tsx
        │   └── ProductDetailModal.tsx
        ├── cart/
        │   ├── CartDrawer.tsx
        │   ├── CartItemRow.tsx
        │   └── CartSummary.tsx
        ├── seller/
        │   ├── SellerLoginModal.tsx
        │   ├── SellerDashboardModal.tsx
        │   └── CommissionModal.tsx
        └── proposal/
            ├── ProposalModal.tsx
            ├── PrintableProposal.tsx
            └── WhatsAppModal.tsx
```

---

## 🛠️ 3. Como Executar

### 1. Iniciar Ambiente de Desenvolvimento Local:
```bash
cd C:\Users\n4fog\Pictures\VALDECIR\rawell-v3
npm run dev
```

### 2. Gerar Versão de Produção Otimizada:
```bash
npm run build
```

### 3. Testar a Versão de Produção Localmente:
```bash
npm run preview
```

---

## 🛡️ 4. Funcionalidades Mantidas e Aprimoradas

1. **Catálogo Consultivo com Ficha Técnica Completa**:
   - 32 produtos oficiais, imagens em WebP, pragas-alvo, dosagem e EPIs.
   - Busca em tempo real com filtros por categoria e formulação.
   - Alternância entre visualização em Grade responsiva e Lista.
2. **Motor Financeiro Inteligente**:
   - Ajuste de preço de tabela e desconto individual por produto.
   - Desconto global do pedido (incidindo apenas sobre itens sem desconto individual).
   - Cálculo automático da **Economia Total do Cliente** em R$ e %.
3. **Área do Representante Comercial**:
   - Autenticação por PIN comercial.
   - Histórico de até 50 propostas salvas no navegador com controle de status (*Aguardando, Negociando, Fechado, Perdido*).
   - Botão de **reabrir/recarregar cotação no carrinho** para rápida negociação.
   - Gerador de link de comissão com rastreamento (`?vendedor=carlos`).
4. **Proposta Timbrada em PDF**:
   - Geração de proposta comercial oficial timbrada pronta para impressão ou salvar em PDF (com e sem preços).
5. **WhatsApp & Telemetria em Nuvem**:
   - Disparo formatado para o WhatsApp do cliente ou central de atendimento.
   - Auditoria em tempo real na planilha Google Sheets via Google Apps Script.
