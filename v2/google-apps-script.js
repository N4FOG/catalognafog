// ══════════════════════════════════════════════════════════════════════════════
//  RAWELL QUÍMICA — SISTEMA DE AUDITORIA & TELEMETRIA COMERCIAL (GOOGLE APPS SCRIPT)
// ══════════════════════════════════════════════════════════════════════════════
//  Instruções de Instalação / Atualização:
//  1. Abra a sua planilha no Google Drive.
//  2. No menu superior, clique em "Extensões" > "Apps Script".
//  3. Substitua o código existente por este arquivo completo e salve (Ctrl + S).
//  4. Clique em "Implantar" > "Gerenciar Implantações" > ícone de lápis ✏️ > Nova Versão > Salvar.
// ══════════════════════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000); // Evita concorrência entre acessos simultâneos

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
    const origemCanal = data.origem_canal || (data.vendedor && data.vendedor !== "Atendimento Geral" ? "🟢 Vendedor (" + data.vendedor + ")" : "🔵 Base / Orgânico");
    const vendedorNome = data.vendedor_nome || data.vendedor || "Atendimento Geral";
    const evento = data.evento || "Ação Registrada";
    const numProposta = data.num_proposta || "-";
    const cliente = data.cliente_nome || "-";
    const documento = data.cliente_doc || "-";
    const totalItens = data.total_itens || 0;
    const resumoItens = data.resumo_itens || "-";
    const linkProposta = data.link_proposta || data.url_acessada || "-";
    const observacoes = data.detalhes_extras || "-";
    const dispositivo = data.user_agent || "-";

    // Cria fórmula de hiperlink clicável para a planilha
    let celulaLinkProposta = linkProposta;
    if (linkProposta && linkProposta.startsWith("http")) {
      celulaLinkProposta = '=HYPERLINK("' + linkProposta + '"; "🔗 Abrir Link")';
    }

    // Insere a nova linha
    sheet.appendRow([
      timestamp,              // Col A: Data / Hora
      origemCanal,            // Col B: Origem / Canal (Vendedor vs Base)
      vendedorNome,           // Col C: Vendedor Vinculado
      evento,                 // Col D: Evento / Ação Realizada
      numProposta,            // Col E: Nº Proposta
      cliente,                // Col F: Cliente / Solicitante
      documento,              // Col G: Documento / Cidade
      totalItens,             // Col H: Qtd Itens
      resumoItens,            // Col I: Resumo dos Produtos
      celulaLinkProposta,     // Col J: Link Direto (Clicável)
      linkProposta,           // Col K: URL Completa
      observacoes,            // Col L: Observações / Detalhes
      dispositivo             // Col M: Dispositivo / Navegador
    ]);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 13).setVerticalAlignment("middle");
    
    // Destaca eventos de cotação e propostas
    if (evento.indexOf("Orçamento") !== -1 || evento.indexOf("Proposta") !== -1 || evento.indexOf("WhatsApp") !== -1) {
      sheet.getRange(lastRow, 4).setFontWeight("bold").setFontColor("#0f4531"); // Evento em destaque verde
      sheet.getRange(lastRow, 5).setFontWeight("bold").setFontColor("#2563eb"); // Nº Proposta em azul
    }

    // Cores de tag na Coluna B (Origem/Canal)
    if (origemCanal.indexOf("Vendedor") !== -1) {
      sheet.getRange(lastRow, 2).setFontColor("#15803d").setFontWeight("bold"); // Verde para vendedor
    } else {
      sheet.getRange(lastRow, 2).setFontColor("#1e40af").setFontWeight("bold"); // Azul para base orgânica
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
    service: "Rawell Química - Webhook de Auditoria & Origem de Vendas",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Cria e formata a aba da planilha caso esteja vazia
function getOrCreateAuditSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Auditoria_Eventos");

  if (!sheet) {
    sheet = ss.insertSheet("Auditoria_Eventos");
  }

  // Se a planilha estiver vazia, cria os cabeçalhos estilizados
  if (sheet.getLastRow() === 0) {
    const headers = [
      "Data / Hora",
      "Origem / Canal",
      "Vendedor Vinculado",
      "Evento / Ação",
      "Nº Proposta",
      "Cliente / Solicitante",
      "Documento / Cidade",
      "Qtd Itens",
      "Resumo Itens",
      "Link Direto",
      "URL Completa",
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
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    headerRange.setWrap(true);

    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 40);

    // Larguras recomendadas para fácil visualização
    sheet.setColumnWidth(1, 150); // Data
    sheet.setColumnWidth(2, 170); // Origem / Canal
    sheet.setColumnWidth(3, 170); // Vendedor
    sheet.setColumnWidth(4, 190); // Evento
    sheet.setColumnWidth(5, 130); // Nº Proposta
    sheet.setColumnWidth(6, 200); // Cliente
    sheet.setColumnWidth(7, 150); // Documento
    sheet.setColumnWidth(8, 90);  // Qtd
    sheet.setColumnWidth(9, 320); // Resumo Itens
    sheet.setColumnWidth(10, 140); // Link Clicável
    sheet.setColumnWidth(11, 230); // URL Completa
    sheet.setColumnWidth(12, 200); // Obs
    sheet.setColumnWidth(13, 180); // Dispositivo
  }

  return sheet;
}
