# 🛡️ Guia de Configuração: Auditoria e Rastreamento Anti-Fraude (Google Sheets)

Este sistema monitora e grava em tempo real na sua **Planilha do Google Sheets** todas as ações executadas pelos vendedores no catálogo da **Rawell Química**.

---

## 📊 O que é registrado na sua Planilha:

Cada vez que um vendedor:
1. **Faz Login com PIN** no modo vendedor;
2. **Copia o Link do Orçamento** (padrão ou com preços);
3. **Envia uma cotação pelo WhatsApp**;
4. **Gera ou Imprime a Proposta Comercial em PDF**;

Uma nova linha é inserida na sua planilha com:
* **Data e Hora exata** (Horário de Brasília);
* **Nome do Vendedor**;
* **Evento Realizado** (Ex: *Emissão de Proposta Comercial PDF*);
* **Número da Proposta** (Ex: RQ-2026-4921);
* **Nome do Cliente e Documento/Cidade**;
* **Valor Total Cobrado (R$)**;
* **Detalhamento dos Itens** (compara o preço cobrado pelo vendedor vs. o preço de tabela);
* 🔗 **Link da Proposta**: Abre o catálogo com os itens selecionados;
* 💰 **Link COM PREÇO (Backup de Garantia)**: Abre o catálogo travando exatamente os valores unitários que o vendedor digitou, servindo como **prova irrefutável** de que aquele preço foi o cotado.

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
