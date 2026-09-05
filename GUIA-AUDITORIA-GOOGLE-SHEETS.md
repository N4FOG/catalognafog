# 🛡️ Guia de Configuração: Auditoria, Telemetria & Termos de Pesquisa (Google Sheets)

Este sistema monitora e grava em tempo real na sua **Planilha do Google Sheets** todas as ações comerciais e termos pesquisados no catálogo da **JCV Química / Rawell Química**.

---

## 📊 Abas criadas automaticamente na sua Planilha:

### 1️⃣ Aba `Auditoria_Eventos` (Rastreamento Comercial)
Registra em tempo real quando:
- Vendedores fazem login com PIN;
- Propostas em PDF são geradas;
- Orçamentos são enviados pelo WhatsApp;
- Links de backup com preço travado são copiados;
- Sessões são iniciadas.

### 2️⃣ Aba `Termos_Pesquisa` (Inteligência e Analytics de Busca)
Contabiliza automaticamente todas as pesquisas feitas pelos usuários e vendedores:
- **Termo Pesquisado**: A palavra ou expressão buscada (ex: `Baratas`, `Tiririca`, `Fungos`);
- **Total de Buscas**: Contador acumulado automático (incrementa a cada nova pesquisa);
- **Produtos Encontrados**: Quantidade de produtos que atenderam a busca (ajuda a identificar termos com 0 resultados para adicionar novos produtos);
- **Última e Primeira Pesquisa**: Data e hora da ocorrência;
- **Canal / Vendedor**: Identifica se partiu de um vendedor logado ou da base orgânica;
- **Dispositivo**: Mobile / Desktop.
- ⚡ **Auto-Ranking**: A planilha é mantida automaticamente ordenada pelos termos mais buscados no topo!

---

## 🚀 Passo a Passo para Ativar (Leva menos de 3 minutos):

### 1️⃣ Criar a Planilha no Google Drive
1. Acesse [Google Sheets (Planilhas Google)](https://sheets.new) e crie uma planilha em branco.
2. Dê um nome para ela (ex: Auditoria Vendas Rawell 2026).

### 2️⃣ Adicionar o Script de Integração
1. No menu superior da planilha, clique em **Extensões** > **Apps Script**.
2. Apague qualquer código que estiver no editor.
3. Abra o arquivo **google-apps-script.js** (já criado na pasta do projeto), copie todo o conteúdo e cole no editor do Apps Script.
4. Clique no ícone de salvar 💾 (ou Ctrl + S).

### 3️⃣ Publicar como Web App (Gerar a URL do Webhook)
1. No canto superior direito da tela do Apps Script, clique no botão azul **Implantar** (ou **Deploy**) > **Nova Implantação** (*New deployment*).
2. Clique no ícone de **engrenagem ⚙️** ao lado de "Selecionar tipo" e escolha **App da Web** (*Web App*).
3. Preencha os campos exatamente assim:
   - **Descrição**: Webhook de Auditoria Rawell
   - **Executar como**: Eu (seu-email@gmail.com)
   - **Quem pode acessar**: **Qualquer pessoa** (*Anyone*) *(⚠️ Importante: precisa ser "Qualquer pessoa" para que o catálogo consiga enviar os dados sem pedir login do Google aos vendedores)*.
4. Clique em **Implantar**.
5. O Google pedirá para **Autorizar o acesso**:
   - Clique em *Autorizar Acesso* e selecione sua conta.
   - Se aparecer *"O Google não verificou este app"*, clique em **Avançado** > **Acessar Webhook de Auditoria Rawell (não seguro)** e confirme.
6. Copie a **URL do App da Web** que será exibida (ela começa com https://script.google.com/macros/s/.../exec).

### 4️⃣ Colar a URL no Catálogo (index.html)
Abra o arquivo index.html e, por volta da linha 3370, cole a sua URL no campo uditWebhookUrl:

`javascript
const CONFIG = {
  whatsapp: '554599781407',
  empresa: 'Rawell Química — Catálogo 2026',
  mensagem_intro: 'Olá! Gostaria de solicitar uma cotação dos seguintes produtos da Rawell Química:',
  mensagem_fim: '✅ Aguardo retorno sobre disponibilidade e condições de fornecimento. Obrigado!',
  // Cole a sua URL do Apps Script abaixo entre as aspas:
  auditWebhookUrl: 'https://script.google.com/macros/s/SEU_CODIGO_AQUI/exec'
};
`

---

## ✅ Como Testar
1. Abra o catálogo index.html no navegador.
2. Clique em **🔒 Vendedor**, digite o PIN 1234 e entre.
3. Adicione produtos ao carrinho, altere um preço unitário (ex: de R$ 89,90 para R$ 50,00).
4. Clique em **Gerar Proposta Comercial (PDF)**.
5. Abra a sua planilha do Google: **a linha com todos os dados, valor de R$ 50,00 e o link de backup com preço já estará registrada!**
