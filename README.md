# 🌿 JCV Distribuidora — Catálogo Digital & Sistema de Orçamentos 2026

> **PWA Profissional de E-commerce B2B para Defensivos Agrícolas**  
> React 19 • TypeScript • Tailwind v4 • Zustand • Vite 6

[![Deploy](https://img.shields.io/badge/deploy-render-success?style=flat-square)](https://jcvdistribuidora.onrender.com)
[![Version](https://img.shields.io/badge/version-6.1.0-blue?style=flat-square)]()
[![PWA](https://img.shields.io/badge/PWA-ready-purple?style=flat-square)]()

---

## 🎯 Sobre o Projeto

Sistema completo de catálogo digital e geração de propostas comerciais para distribuidora de defensivos agrícolas. Desenvolvido para ser uma **ferramenta profissional de vendas** com foco em experiência mobile-first, gestão de comissões e rastreabilidade de negócios.

**Deploy:** [jcvdistribuidora.onrender.com](https://jcvdistribuidora.onrender.com)

---

## ⚡ Stack Tecnológica

- **Frontend:** React 19 + TypeScript + Vite 6
- **Estilização:** Tailwind CSS v4 + Design System custom
- **Estado:** Zustand (gerenciamento reativo)
- **Ícones:** Lucide React + Lucide Motion (animações)
- **PWA:** Service Worker com cache offline inteligente
- **Telemetria:** Google Apps Script + Google Sheets (auditoria)
- **Deploy:** Render (CI/CD automático via GitHub)

---

## 🚀 Funcionalidades Principais

### 📦 **Catálogo de Produtos**
- ✅ 36+ produtos com fichas técnicas completas
- ✅ Imagens otimizadas em WebP
- ✅ Busca em tempo real com scroll automático
- ✅ Filtros por categoria (10 categorias) e formulação (5 tipos)
- ✅ Visualização em grade/lista responsiva
- ✅ Informações detalhadas: alvos, modo de uso, EPIs, dosagem

### 🛒 **Sistema de Orçamento Inteligente**
- ✅ Motor financeiro com descontos individuais e globais
- ✅ Cálculo automático de economia do cliente (R$ + %)
- ✅ Stepper otimizado para mobile (auto-select em inputs)
- ✅ Edição direta no carrinho (botões +/- inline)
- ✅ Compartilhamento via link (com ou sem preços)
- ✅ Geração de proposta em PDF timbrada

### 👔 **Área do Representante Comercial**
- ✅ Login seguro com PIN individual
- ✅ Histórico de até 50 propostas com status (aguardando/negociando/fechado/perdido)
- ✅ Reabertura rápida de cotações no carrinho
- ✅ Link de comissão com rastreamento automático (`?vendedor=nome`)
- ✅ Dashboard com métricas de conversão

### 📱 **PWA Mobile-First**
- ✅ Instalável em iOS/Android (add to home screen)
- ✅ Cache offline inteligente (funciona sem internet)
- ✅ Service Worker com invalidação automática de versão
- ✅ Haptic feedback em ações críticas
- ✅ Otimizado para telas touch (sem lag de 300ms)
- ✅ Navegação bottom bar mobile

### 🎨 **UX Premium**
- ✅ Dark mode profissional (paleta OLED-friendly)
- ✅ Theme toggle animado (Sun/Moon com Lucide Motion)
- ✅ Ícones animados no login e ações principais
- ✅ Toasts com feedback visual
- ✅ Transições suaves e micro-interações
- ✅ Design system consistente em todo projeto

### 📊 **Telemetria & Auditoria**
- ✅ Integração com Google Sheets (webhook assíncrono)
- ✅ Rastreamento de eventos: buscas, adições ao carrinho, conversões
- ✅ Identificação automática de vendedor por link ou sessão
- ✅ Logs estruturados para análise de funil de vendas

### 💬 **WhatsApp Business Integration**
- ✅ Geração de mensagem formatada com produtos
- ✅ Link direto para WhatsApp oficial da empresa
- ✅ Compartilhamento de proposta via texto estruturado
- ✅ Preview de produtos com link para páginas individuais

---

## 📅 Roadmap de Desenvolvimento

### **v1.0 - v3.0** • *Fundação (Início do projeto)*
- 🔨 Setup inicial React + TypeScript + Vite
- 🎨 Design system base com Tailwind v4
- 📦 Catálogo de 32 produtos (depois expandido para 36+)
- 🛒 Sistema básico de carrinho
- 💰 Motor financeiro com descontos

### **v4.0 - v4.2** • *Melhorias Core*
- 📱 PWA implementation + Service Worker
- 👔 Área do representante comercial
- 📊 Integração com Google Sheets
- 🔍 Sistema de busca melhorado
- 📄 Geração de PDF timbrado

### **v5.0 - v5.5** • *UX E-commerce*
- 🎯 Stepper otimizado mobile (fix concatenação de valores)
- ✏️ Edição inline do carrinho (UX profissional)
- 📱 Auto-select em inputs (baseado em análise Google Aistidium)
- 🔎 Busca intuitiva com scroll automático
- 🎨 Badges e indicadores visuais melhorados

### **v6.0** • *Cache & Deploy*
- 🔄 Service Worker com invalidação automática (fix blank screen)
- 🚀 Deploy production no Render
- 🐛 Hotfix v6.0.1: HTML nunca em cache (fix bundle hash mismatch)

### **v6.0.2 - v6.0.4** • *UX Minimalista*
- 🛒 Botão carrinho compacto (`🛒5` em vez de texto longo)
- 🎯 Remoção de alvos na vitrine (menos poluição visual)
- 🔒 Login modal minimalista (sem exposição de usuários)
- 👤 Novo vendedor Leandro adicionado
- ❌ Botões de estoque compactos

### **v6.1.0** • *Animações Premium* ⭐ **ATUAL**
- ✨ Instalação Lucide Motion + Motion
- 🌙 Theme toggle animado (Sun/Moon)
- 🔐 Login modal com ícones animados
- 🎨 Dark mode reformulado (paleta profissional OLED-friendly)
- ⚡ Micro-interações em ações principais

---

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Desenvolvimento local
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview
```

---

## 📂 Estrutura Simplificada

```
src/
├── components/      # Componentes React modulares
│   ├── catalog/     # Cards, grid, modais de produto
│   ├── cart/        # Drawer, itens, resumo
│   ├── seller/      # Login, dashboard, comissões
│   ├── proposal/    # PDF, WhatsApp, impressão
│   ├── layout/      # Header, footer, navegação
│   └── ui/          # Modal, stepper, toasts, theme toggle
├── store/           # Zustand stores (carrinho, vendedor, tema, catálogo)
├── utils/           # Formatadores, cálculos, telemetria, haptics
├── data/            # Produtos, categorias, config
└── types/           # TypeScript interfaces
```

---

## 🎯 Próximos Passos (Backlog)

- [ ] Animações no botão de adicionar ao carrinho
- [ ] Animações nos toasts (ícones animados por tipo)
- [ ] Dashboard admin com gráficos de conversão
- [ ] Filtros avançados (faixa de preço, embalagem)
- [ ] Modo comparação de produtos
- [ ] Histórico de buscas recentes
- [ ] Sugestões de produtos relacionados
- [ ] Sistema de favoritos persistente

---

## 📝 Notas Técnicas

### **Service Worker**
- Cache invalidado automaticamente via query string `?v=X.X.X`
- HTML **nunca** é cacheado (evita blank screen com bundle hash desatualizado)
- Assets estáticos (fonts, ícones) cacheados permanentemente

### **Mobile Optimization**
- Input `type="text"` + `inputMode="numeric"` (iOS compatibility)
- Auto-select com `setTimeout(50ms)` + `setSelectionRange()`
- Haptic feedback em ações críticas (iOS/Android)
- Font-size mínimo 16px em inputs (evita zoom iOS)

### **Performance**
- Bundle splitting automático (Vite)
- Lazy loading de modais
- Imagens WebP otimizadas
- CSS purge em produção (Tailwind v4)

---

## 📄 Licença

Projeto proprietário - JCV Distribuidora & Rawell Química © 2026

---

## 👨‍💻 Desenvolvimento

Desenvolvido com foco em **experiência profissional B2B**, **mobile-first** e **performance**.

**Versão atual:** v6.1.0  
**Última atualização:** Janeiro 2025
