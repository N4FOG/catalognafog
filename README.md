# 🌿 NAFOG — Catálogo Oficial & Sistema de Orçamentos 2026 (Rawell Química)

> **Versão Padrão Estável (Baseline v3.0)**  
> Repositório Oficial: [https://github.com/N4FOG/catalognafog](https://github.com/N4FOG/catalognafog)

---

## 📌 1. Diretriz e Contrato da Base Estável

Esta é a **versão estável e canônica de referência do projeto**. Qualquer evolução, nova funcionalidade ou refatoração deve **obrigatoriamente respeitar a estrutura modular** e garantir que **nenhuma das funcionalidades estabelecidas sofra regressão**.

---

## 🏗️ 2. Arquitetura Modular Oficial

```
rawell-v2/
├── index.html                  # Interface semântica ultraleve (~25 KB)
├── manifest.json               # Manifesto PWA
├── sw.js                       # Service Worker com cache offline granular
├── .gitignore                  # Regras de exclusão do repositório
│
├── css/                        # Estilização por Domínios de Interface
│   ├── base.css                # Variáveis :root, temas dark/light, reset, toasts
│   ├── layout.css              # Header responsivo, hero, busca, stories, footer
│   ├── catalog.css             # Grid (2 col mobile / 3 col tablet / 4 col desktop), cards, steppers
│   ├── sheet-modal.css         # Bottom-sheet/modal do produto, galeria, guia e segurança
│   ├── cart.css                # Drawer do carrinho, descontos, resumo e botões WhatsApp
│   └── seller.css              # Painel do vendedor, login PIN, histórico e proposta PDF
│
├── js/
│   ├── data/                   # Camada de Dados Isolada
│   │   ├── config.js           # Constantes CONFIG e VENDEDORES
│   │   ├── categories.js       # Lista de CATEGORIAS e FORMULACOES
│   │   └── products.js         # Base dos 32 PRODUTOS oficiais
│   │
│   ├── modules/                # Módulos de Lógica e UI
│   │   ├── utils.js            # Estado global (appState), busca, scroll suave, toasts
│   │   ├── theme.js            # Controle de tema Dark/Light
│   │   ├── catalog.js          # Renderização de cards, stories, filtros e modal
│   │   ├── cart.js             # Gestão de carrinho, persistência, cálculo de valores e descontos
│   │   ├── seller.js           # Login PIN, histórico de cotações, status e link de comissão
│   │   ├── pdf-proposal.js     # Gerador de proposta comercial oficial timbrada (@media print)
│   │   ├── whatsapp.js         # Formatador e disparador de cotações WhatsApp
│   │   ├── telemetry.js        # Auditoria assíncrona Google Sheets via Apps Script
│   │   └── pwa.js              # Prompt e ciclo de vida do PWA
│   │
│   └── app.js                  # Ponto de entrada, bootstrapping no DOMContentLoaded
│
└── img/
    ├── icon-*.png              # Ícones PWA
    └── produtos/               # Imagens WebP otimizadas
```

---

## 🛡️ 3. Funcionalidades Essenciais Protegidas (Zero Regressão)

1. **Catálogo & Motor de Busca**:
   - 32 produtos oficiais, 10 categorias e 5 formulações.
   - Busca em tempo real com realce (*highlight*) por nome, praga-alvo, referência e princípio ativo.
   - Visualização em Grade responsiva (2 colunas mobile, 3 colunas tablet, 4 colunas desktop) e Modo Lista.
2. **Ficha Técnica Consultiva**:
   - Modal responsivo com galeria de imagens, abas de Guia Prático, Segurança de Aplicação (pets, chuva, horários, EPIs) e nuvem de pragas.
3. **Carrinho & Regras de Precificação**:
   - Persistência em `localStorage`.
   - Ajuste de preços de tabela pelo vendedor, desconto por item e desconto global no pedido (incidindo apenas sobre itens sem desconto individual).
   - Cálculo e exibição da **Economia Total do Cliente**.
4. **Área Restrita do Representante Comercial**:
   - Acesso por PIN comissionado.
   - Dashboard com histórico de até 50 orçamentos recentes, controle de status (*Aguardando, Negociando, Fechado, Perdido*) e reabertura direta no carrinho.
   - Gerador de links personalizados de comissão (`?v=carlos`).
   - Emissão de **Proposta Comercial Oficial em PDF timbrada** com e sem preços.
5. **Integrações Externas**:
   - Envio automático de mensagens estruturadas para WhatsApp (central ou vendedor).
   - Telemetria e auditoria assíncrona para Google Sheets via `sendBeacon` / `fetch`.
   - Cache offline inteligente e instalabilidade via PWA (`sw.js`).
