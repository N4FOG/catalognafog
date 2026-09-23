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

    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      data = {};
    }

    // ── GESTÃO DE PRODUTOS & CATÁLOGO CLOUD (ADMIN) ────────────────────
    if (data.action === "saveProducts") {
      const sheet = getOrCreateProductsSheet();
      const backupSheet = getOrCreateProductBackupsSheet();
      const nowStr = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
      const userStr = data.user || "jcvadmin";
      const productsPayload = typeof data.products === "string" ? data.products : JSON.stringify(data.products || []);
      const backupItem = data.backup;

      // 1. Atualiza a aba oficial de produtos (A1: Timestamp, B1: Autor, A2: JSON)
      sheet.getRange(1, 1).setValue("ÚLTIMA ATUALIZAÇÃO:");
      sheet.getRange(1, 2).setValue(nowStr);
      sheet.getRange(1, 3).setValue("AUTOR:");
      sheet.getRange(1, 4).setValue(userStr);
      sheet.getRange(2, 1).setValue(productsPayload);

      // 2. Se houver backup associado a esta alteração, anexa na aba de histórico
      if (backupItem) {
        const snapStr = typeof backupItem.snapshot === "string" ? backupItem.snapshot : JSON.stringify(backupItem.snapshot || {});
        backupSheet.appendRow([
          backupItem.id || ("BKP-" + new Date().getTime()),
          backupItem.timestamp || nowStr,
          backupItem.author || userStr,
          backupItem.productId || "-",
          backupItem.productName || "-",
          backupItem.summary || "Alteração de Produto",
          snapStr
        ]);
      }

      lock.releaseLock();

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "saveProducts",
        timestamp: nowStr,
        message: "Produtos e backup salvos na nuvem com sucesso!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── GESTÃO DO ROADMAP CLOUD ─────────────────────────────────────────
    if (data.action === "saveRoadmap") {
      const sheet = getOrCreateRoadmapSheet();
      const roadmapPayload = typeof data.roadmap === "string" ? data.roadmap : JSON.stringify(data.roadmap || {});
      const nowStr = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
      const userStr = data.user || "Admin / Painel";

      // Salva em A1 a data da última atualização e em A2 o payload JSON
      sheet.getRange(1, 1).setValue("ÚLTIMA ATUALIZAÇÃO:");
      sheet.getRange(1, 2).setValue(nowStr);
      sheet.getRange(1, 3).setValue("AUTOR:");
      sheet.getRange(1, 4).setValue(userStr);

      // Armazena o JSON na célula A2 (ou divide se necessário)
      sheet.getRange(2, 1).setValue(roadmapPayload);

      lock.releaseLock();

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "saveRoadmap",
        timestamp: nowStr,
        message: "Roadmap salvo na nuvem com sucesso!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── GESTÃO DE TERMOS DE PESQUISA (SEARCH ANALYTICS) ─────────────────
    if (data.action === "logSearch") {
      const sheet = getOrCreateSearchTermsSheet();
      const termRaw = (data.termo || "").toString().trim();

      if (!termRaw) {
        lock.releaseLock();
        return ContentService.createTextOutput(JSON.stringify({
          status: "ignored",
          message: "Termo de busca vazio."
        })).setMimeType(ContentService.MimeType.JSON);
      }

      const termClean = termRaw.toLowerCase();
      const qtdResultados = typeof data.resultados_qtd === "number" ? data.resultados_qtd : (parseInt(data.resultados_qtd, 10) || 0);
      const nowStr = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
      const canal = data.origem_canal || (data.vendedor && data.vendedor !== "Atendimento Geral" ? "🟢 Vendedor (" + data.vendedor + ")" : "🔵 Base / Orgânico");
      const dispositivo = data.user_agent || "-";

      const lastRow = sheet.getLastRow();
      let foundRow = -1;

      if (lastRow > 1) {
        const termsValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        for (let i = 0; i < termsValues.length; i++) {
          if (termsValues[i][0] && termsValues[i][0].toString().trim().toLowerCase() === termClean) {
            foundRow = i + 2;
            break;
          }
        }
      }

      if (foundRow > -1) {
        // Atualiza e incrementa o termo existente
        const currentCount = parseInt(sheet.getRange(foundRow, 2).getValue(), 10) || 0;
        sheet.getRange(foundRow, 2).setValue(currentCount + 1);
        sheet.getRange(foundRow, 3).setValue(qtdResultados);
        sheet.getRange(foundRow, 4).setValue(nowStr);
        sheet.getRange(foundRow, 6).setValue(canal);
        sheet.getRange(foundRow, 7).setValue(dispositivo);
      } else {
        // Insere novo termo
        sheet.appendRow([
          termRaw,        // Col A: Termo Pesquisado
          1,              // Col B: Total de Buscas
          qtdResultados,  // Col C: Produtos Encontrados
          nowStr,         // Col D: Última Pesquisa
          nowStr,         // Col E: Primeira Pesquisa
          canal,          // Col F: Último Canal
          dispositivo     // Col G: Dispositivo
        ]);
        const newRow = sheet.getLastRow();
        sheet.getRange(newRow, 1, 1, 7).setVerticalAlignment("middle");
        sheet.getRange(newRow, 2).setHorizontalAlignment("center").setFontWeight("bold").setFontColor("#0f4531");
        sheet.getRange(newRow, 3).setHorizontalAlignment("center");
      }

      // Reordena a tabela pelo Total de Buscas (Coluna B) decrescente
      if (sheet.getLastRow() > 2) {
        sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).sort({ column: 2, ascending: false });
      }

      lock.releaseLock();

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "logSearch",
        termo: termRaw,
        resultados: qtdResultados,
        timestamp: nowStr
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── LOG DE AUDITORIA & TELEMETRIA ───────────────────────────────────
    const sheet = getOrCreateAuditSheet();

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
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "";

    // ── LEITURA DOS PRODUTOS ATUALIZADOS CLOUD ──────────────────────────
    if (action === "getProducts") {
      const sheet = getOrCreateProductsSheet();
      const backupSheet = getOrCreateProductBackupsSheet();
      const lastUpdate = sheet.getRange(1, 2).getValue() || "";
      const updatedBy = sheet.getRange(1, 4).getValue() || "";
      const rawJson = sheet.getRange(2, 1).getValue() || "";

      let products = null;
      if (rawJson && typeof rawJson === "string" && (rawJson.trim().startsWith("[") || rawJson.trim().startsWith("{"))) {
        try {
          products = JSON.parse(rawJson);
        } catch (err) {
          products = null;
        }
      }

      // Lê os backups recentes
      let backups = [];
      const lastBackupRow = backupSheet.getLastRow();
      if (lastBackupRow > 1) {
        // Pega os últimos 50 backups
        const startRow = Math.max(2, lastBackupRow - 49);
        const numRows = lastBackupRow - startRow + 1;
        const backupData = backupSheet.getRange(startRow, 1, numRows, 7).getValues();

        backups = backupData.map(r => {
          let snap = null;
          try {
            snap = JSON.parse(r[6]);
          } catch (e) {
            snap = null;
          }
          return {
            id: r[0],
            timestamp: r[1],
            author: r[2],
            productId: r[3],
            productName: r[4],
            summary: r[5],
            snapshot: snap
          };
        }).reverse(); // Mais recentes primeiro
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "getProducts",
        lastUpdate: lastUpdate,
        updatedBy: updatedBy,
        hasData: !!(products && products.length > 0),
        products: products,
        backups: backups
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── LEITURA DO ROADMAP NA NUVEM ─────────────────────────────────────
    if (action === "getRoadmap") {
      const sheet = getOrCreateRoadmapSheet();
      const lastUpdate = sheet.getRange(1, 2).getValue() || "";
      const rawJson = sheet.getRange(2, 1).getValue() || "";
      
      let parsed = null;
      if (rawJson && typeof rawJson === "string" && rawJson.trim().startsWith("{")) {
        try {
          parsed = JSON.parse(rawJson);
        } catch (err) {
          parsed = null;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "getRoadmap",
        lastUpdate: lastUpdate,
        hasData: !!parsed,
        data: parsed
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ── LEITURA DOS TERMOS DE PESQUISA ──────────────────────────────────
    if (action === "getTopSearches") {
      const sheet = getOrCreateSearchTermsSheet();
      const lastRow = sheet.getLastRow();
      let terms = [];
      if (lastRow > 1) {
        const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
        terms = data.map(r => ({
          termo: r[0],
          totalBuscas: r[1],
          produtosEncontrados: r[2],
          ultimaBusca: r[3],
          primeiraBusca: r[4],
          canal: r[5]
        }));
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        action: "getTopSearches",
        total: terms.length,
        data: terms
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Status padrão
    return ContentService.createTextOutput(JSON.stringify({
      status: "online",
      service: "Rawell Química - Webhook de Auditoria & Sincronização Cloud",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ── FUNÇÃO DE SUPORTE: CRIA OU OBTÉM A ABA PRODUTOS_CATALOGO ──────────
function getOrCreateProductsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Produtos_Catalogo");

  if (!sheet) {
    sheet = ss.insertSheet("Produtos_Catalogo");
    sheet.setTabColor("#10b981");

    sheet.getRange(1, 1).setValue("ÚLTIMA ATUALIZAÇÃO:");
    sheet.getRange(1, 2).setValue("-");
    sheet.getRange(1, 3).setValue("AUTOR:");
    sheet.getRange(1, 4).setValue("-");

    const header = sheet.getRange(1, 1, 1, 4);
    header.setBackground("#0f4531");
    header.setFontColor("#ffffff");
    header.setFontWeight("bold");
    sheet.setRowHeight(1, 35);
  }

  return sheet;
}

// ── FUNÇÃO DE SUPORTE: CRIA OU OBTÉM A ABA BACKUP_PRODUTOS ────────────
function getOrCreateProductBackupsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Backup_Produtos");

  if (!sheet) {
    sheet = ss.insertSheet("Backup_Produtos");
    sheet.setTabColor("#f59e0b");

    const headers = [
      "ID Backup",
      "Data / Hora",
      "Autor",
      "ID Produto",
      "Nome do Produto",
      "Resumo da Alteração",
      "Snapshot JSON"
    ];

    sheet.appendRow(headers);

    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#78350f");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");

    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 35);

    sheet.setColumnWidth(1, 160); // ID Backup
    sheet.setColumnWidth(2, 160); // Data
    sheet.setColumnWidth(3, 130); // Autor
    sheet.setColumnWidth(4, 100); // ID Produto
    sheet.setColumnWidth(5, 220); // Nome Produto
    sheet.setColumnWidth(6, 280); // Resumo
    sheet.setColumnWidth(7, 300); // Snapshot
  }

  return sheet;
}

// ── FUNÇÕES DE SUPORTE EXISTENTES ─────────────────────────────────────
function getOrCreateAuditSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Auditoria_Rawell");

  if (!sheet) {
    sheet = ss.insertSheet("Auditoria_Rawell");
    sheet.setTabColor("#0f4531");
  }

  if (sheet.getLastRow() === 0) {
    const headers = [
      "Data / Hora",
      "Origem / Canal",
      "Vendedor Vinculado",
      "Evento / Ação",
      "Nº Proposta",
      "Cliente / Solicitante",
      "Documento / Cidade",
      "Total Itens",
      "Resumo dos Produtos",
      "Link da Proposta",
      "URL Completa",
      "Observações / Detalhes",
      "Dispositivo / Navegador"
    ];

    sheet.appendRow(headers);

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

    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 170);
    sheet.setColumnWidth(3, 170);
    sheet.setColumnWidth(4, 200);
    sheet.setColumnWidth(5, 140);
    sheet.setColumnWidth(6, 220);
    sheet.setColumnWidth(7, 180);
    sheet.setColumnWidth(8, 100);
    sheet.setColumnWidth(9, 320);
    sheet.setColumnWidth(10, 160);
    sheet.setColumnWidth(11, 260);
    sheet.setColumnWidth(12, 280);
    sheet.setColumnWidth(13, 240);
  }

  return sheet;
}

function getOrCreateRoadmapSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Roadmap_Rawell");

  if (!sheet) {
    sheet = ss.insertSheet("Roadmap_Rawell");
    sheet.setTabColor("#2563eb");

    sheet.getRange(1, 1).setValue("ÚLTIMA ATUALIZAÇÃO:");
    sheet.getRange(1, 2).setValue("-");
    sheet.getRange(1, 3).setValue("AUTOR:");
    sheet.getRange(1, 4).setValue("-");

    const header = sheet.getRange(1, 1, 1, 4);
    header.setBackground("#1e3a8a");
    header.setFontColor("#ffffff");
    header.setFontWeight("bold");
    sheet.setRowHeight(1, 35);
  }

  return sheet;
}

function getOrCreateSearchTermsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Termos_Pesquisa");

  if (!sheet) {
    sheet = ss.insertSheet("Termos_Pesquisa");
    sheet.setTabColor("#059669");
  }

  if (sheet.getLastRow() === 0) {
    const headers = [
      "Termo Pesquisado",
      "Total de Buscas",
      "Produtos Encontrados",
      "Última Pesquisa",
      "Primeira Pesquisa",
      "Último Canal / Vendedor",
      "Dispositivo / Navegador"
    ];

    sheet.appendRow(headers);

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

    sheet.setColumnWidth(1, 240);
    sheet.setColumnWidth(2, 140);
    sheet.setColumnWidth(3, 170);
    sheet.setColumnWidth(4, 160);
    sheet.setColumnWidth(5, 160);
    sheet.setColumnWidth(6, 190);
    sheet.setColumnWidth(7, 240);
  }

  return sheet;
}
