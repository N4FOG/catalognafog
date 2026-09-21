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

// Cria e formata a aba da planilha de Roadmap caso não exista
function getOrCreateRoadmapSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("ROADMAP_CLOUD");

  if (!sheet) {
    sheet = ss.insertSheet("ROADMAP_CLOUD");
    sheet.getRange(1, 1).setValue("ÚLTIMA ATUALIZAÇÃO:").setFontWeight("bold");
    sheet.getRange(1, 2).setValue(Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss"));
    sheet.getRange(1, 3).setValue("AUTOR:").setFontWeight("bold");
    sheet.getRange(1, 4).setValue("Sistema Rawell");
    sheet.setTabColor("#0f4531");
  }

  return sheet;
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

// Cria e formata a aba de Termos de Pesquisa (Search Analytics) caso não exista
function getOrCreateSearchTermsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Termos_Pesquisa");

  if (!sheet) {
    sheet = ss.insertSheet("Termos_Pesquisa");
    sheet.setTabColor("#059669");
  }

  // Se a planilha estiver vazia, cria os cabeçalhos estilizados
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

    // Estilização do cabeçalho oficial Rawell
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

    // Larguras recomendadas
    sheet.setColumnWidth(1, 240); // Termo
    sheet.setColumnWidth(2, 140); // Total Buscas
    sheet.setColumnWidth(3, 170); // Qtd Produtos Encontrados
    sheet.setColumnWidth(4, 160); // Última Pesquisa
    sheet.setColumnWidth(5, 160); // Primeira Pesquisa
    sheet.setColumnWidth(6, 190); // Canal / Vendedor
    sheet.setColumnWidth(7, 240); // Dispositivo
  }

  return sheet;
}
