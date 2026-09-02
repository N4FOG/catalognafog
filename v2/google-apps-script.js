// ══════════════════════════════════════════════════════════════════════════════
//  RAWELL QUÍMICA — SISTEMA DE AUDITORIA E ANTI-FRAUDE (GOOGLE APPS SCRIPT)
// ══════════════════════════════════════════════════════════════════════════════
//  Instruções de Instalação:
//  1. Abra uma planilha nova no seu Google Drive (ex: "Auditoria Vendas Rawell 2026").
//  2. No menu superior, clique em "Extensões" > "Apps Script".
//  3. Apague qualquer código existente no editor e cole todo este arquivo.
//  4. Clique no botão azul "Implantar" (ou "Deploy") > "Nova Implantação".
//  5. No ícone de engrenagem, escolha "App da Web" (Web App).
//  6. Configure:
//     - Descrição: Webhook de Auditoria Rawell
//     - Executar como: "Eu" (sua conta Google)
//     - Quem pode acessar: "Qualquer pessoa" (Anyone) -> ESSENCIAL para receber os dados
//  7. Clique em "Implantar", conceda as permissões da sua conta e COPIE A URL DO APP DA WEB.
//  8. Cole essa URL no arquivo 'index.html' no campo CONFIG.auditWebhookUrl.
// ══════════════════════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000); // Evita concorrência se vários vendedores emitirem ao mesmo tempo

    const sheet = getOrCreateAuditSheet();
    let data;

    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      data = {};
    }

    const timestamp = data.timestamp || Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
    const vendedor = data.vendedor || "Não identificado";
    const evento = data.evento || "Ação Registrada";
    const numProposta = data.num_proposta || "-";
    const cliente = data.cliente_nome || "-";
    const documento = data.cliente_doc || "-";
    const valorTotal = data.valor_total || "-";
    const totalItens = data.total_itens || 0;
    const resumoItens = data.resumo_itens || "-";
    const linkProposta = data.link_proposta || "-";
    const linkComPreco = data.link_com_preco || "-";
    const observacoes = data.detalhes_extras || "-";
    const dispositivo = data.user_agent || "-";

    // Cria fórmulas de hiperlink clicáveis para facilitar a conferência na planilha
    let celulaLinkProposta = linkProposta;
    if (linkProposta && linkProposta.startsWith("http")) {
      celulaLinkProposta = '=HYPERLINK("' + linkProposta + '"; "🔗 Abrir Orçamento")';
    }

    let celulaLinkComPreco = linkComPreco;
    if (linkComPreco && linkComPreco.startsWith("http")) {
      celulaLinkComPreco = '=HYPERLINK("' + linkComPreco + '"; "💰 Abrir COM PREÇOS")';
    }

    // Insere a nova linha com todos os dados de auditoria
    sheet.appendRow([
      timestamp,              // Col A: Data / Hora
      vendedor,               // Col B: Vendedor
      evento,                 // Col C: Evento / Ação
      numProposta,            // Col D: Nº Proposta
      cliente,                // Col E: Cliente / Empresa
      documento,              // Col F: Documento / Cidade
      valorTotal,             // Col G: Valor Total Cobrado (R$)
      totalItens,             // Col H: Qtd Total Itens
      resumoItens,            // Col I: Detalhamento dos Itens (Preço Cobrado vs Tabela)
      celulaLinkProposta,     // Col J: Link do Orçamento (Clicável)
      celulaLinkComPreco,     // Col K: Link COM PREÇO (Garantia/Backup)
      linkProposta,           // Col L: URL Completa da Proposta
      linkComPreco,           // Col M: URL Completa COM PREÇO
      observacoes,            // Col N: Observações
      dispositivo             // Col O: Navegador / Dispositivo
    ]);

    // Aplica formatação condicional ou ajustes visuais na última linha
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 15).setVerticalAlignment("middle");
    
    // Destaca se for emissão de proposta ou link com preço
    if (evento.indexOf("Proposta") !== -1 || evento.indexOf("PREÇO") !== -1) {
      sheet.getRange(lastRow, 7).setFontWeight("bold").setFontColor("#0f4531"); // Valor total em destaque verde
    }

    lock.releaseLock();

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Log de auditoria registrado com sucesso!",
      row: lastRow
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "Rawell Química - Webhook de Auditoria e Anti-Fraude",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Cria e formata a aba da planilha caso esteja vazia
function getOrCreateAuditSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Auditoria_Vendas");

  if (!sheet) {
    sheet = ss.insertSheet("Auditoria_Vendas");
  }

  // Se a planilha estiver vazia, cria os cabeçalhos estilizados
  if (sheet.getLastRow() === 0) {
    const headers = [
      "Data / Hora",
      "Vendedor",
      "Evento / Ação",
      "Nº Proposta",
      "Cliente / Empresa",
      "Documento / Cidade",
      "Valor Total (R$)",
      "Qtd Itens",
      "Resumo Itens (Preço Cobrado vs Tabela)",
      "Link Proposta",
      "Link COM PREÇO (Garantia)",
      "URL Direta Proposta",
      "URL Direta c/ Preço",
      "Observações",
      "Dispositivo / Navegador"
    ];

    sheet.appendRow(headers);

    // Estilização do cabeçalho oficial Rawell (Verde Floresta #0f4531 com texto branco em negrito)
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0f4531");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(11);
    headerRange.setAlignment("center");
    headerRange.setWrap(true);

    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 40);

    // Larguras recomendadas para fácil visualização
    sheet.setColumnWidth(1, 150); // Data
    sheet.setColumnWidth(2, 170); // Vendedor
    sheet.setColumnWidth(3, 180); // Evento
    sheet.setColumnWidth(4, 130); // Nº Proposta
    sheet.setColumnWidth(5, 200); // Cliente
    sheet.setColumnWidth(6, 150); // Documento
    sheet.setColumnWidth(7, 130); // Total R$
    sheet.setColumnWidth(8, 90);  // Qtd
    sheet.setColumnWidth(9, 320); // Resumo Itens
    sheet.setColumnWidth(10, 140); // Link Proposta
    sheet.setColumnWidth(11, 160); // Link c/ Preço
    sheet.setColumnWidth(12, 220); // URL Direta
    sheet.setColumnWidth(13, 220); // URL Direta Preço
    sheet.setColumnWidth(14, 200); // Obs
    sheet.setColumnWidth(15, 180); // Dispositivo
  }

  return sheet;
}
