// ══════════════════════════════════════════════════════════════════════════════
//  RAWELL QUÍMICA — SISTEMA DE AUDITORIA, TELEMETRIA & SINCRONIZAÇÃO CLOUD
// ══════════════════════════════════════════════════════════════════════════════
//  Instruções de Instalação / Atualização:
//  1. Abra a sua planilha no Google Drive.
//  2. No menu superior, clique em "Extensões" > "Apps Script".
//  3. Substitua TODO o código existente por este arquivo completo e salve (Ctrl + S).
//  4. Clique em "Implantar" > "Gerenciar Implantações" > ícone de lápis ✏️ > Nova Versão > Salvar.
// ══════════════════════════════════════════════════════════════════════════════

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Evita concorrência entre acessos simultâneos

    let data;
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    } else {
      data = {};
    }

    const action = data.action || "";
    console.log("[APPS SCRIPT doPost] 🚀 Ação recebida: '" + action + "' | Autor: " + (data.user || "anônimo"));

    // ── 1. UPLOAD DE IMAGEM PARA O GOOGLE DRIVE ───────────────────────
    if (action === "uploadImage") {
      if (!data.base64) {
        return createJsonResponse({
          status: "error",
          message: "Nenhum conteúdo de imagem (base64) fornecido."
        });
      }

      const folder = getOrCreateImagesFolder();
      const mimeType = data.mimeType || "image/jpeg";
      const fileName = (data.fileName || ("produto_" + new Date().getTime() + ".jpg")).replace(/[^a-zA-Z0-9_.-]/g, "_");
      
      let cleanBase64 = data.base64;
      if (cleanBase64.indexOf("base64,") > -1) {
        cleanBase64 = cleanBase64.split("base64,")[1];
      }

      const decodedBytes = Utilities.base64Decode(cleanBase64);
      const blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      const fileId = file.getId();
      const directImageUrl = "https://lh3.googleusercontent.com/d/" + fileId;
      const fallbackUrl = "https://drive.google.com/uc?export=view&id=" + fileId;

      return createJsonResponse({
        status: "success",
        action: "uploadImage",
        fileId: fileId,
        imageUrl: directImageUrl,
        fallbackUrl: fallbackUrl,
        message: "Imagem enviada para o Google Drive com sucesso!"
      });
    }

    // ── 2. EXPORTAÇÃO DO CATÁLOGO (TABELA LINHA A LINHA) ───────────────
    if (action === "exportProducts") {
      console.log("[APPS SCRIPT exportProducts] 📤 Iniciando exportação para Produtos_Catalogo...");
      const headers = Array.isArray(data.headers) ? data.headers : [];
      const rows = Array.isArray(data.rows) ? data.rows : [];
      const lists = data.lists || {};
      const nowStr = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
      const userStr = data.user || "jcvadmin";

      if (!headers.length || !rows.length) {
        return createJsonResponse({
          status: "error",
          action: "exportProducts",
          message: "Cabeçalhos ou linhas ausentes no payload."
        });
      }

      const badRow = rows.findIndex(function (r) { return !Array.isArray(r) || r.length !== headers.length; });
      if (badRow !== -1) {
        return createJsonResponse({
          status: "error",
          action: "exportProducts",
          message: "Linha " + (badRow + 1) + " não bate com o cabeçalho (" + headers.length + " colunas)."
        });
      }

      const sheet = getOrCreateProductsSheet();
      sheet.clear();

      // Linha 1: Metadados
      sheet.getRange(1, 1).setValue("ÚLTIMA EXPORTAÇÃO:");
      sheet.getRange(1, 2).setValue(nowStr);
      sheet.getRange(1, 3).setValue("AUTOR:");
      sheet.getRange(1, 4).setValue(userStr);
      sheet.getRange(1, 5).setValue("PRODUTOS:");
      sheet.getRange(1, 6).setValue(rows.length);

      const metaHeader = sheet.getRange(1, 1, 1, 6);
      metaHeader.setBackground("#0f4531").setFontColor("#ffffff").setFontWeight("bold");
      sheet.setRowHeight(1, 30);

      // Linha 2: Cabeçalhos da tabela
      sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
      const headerRange = sheet.getRange(2, 1, 1, headers.length);
      headerRange.setBackground("#10b981").setFontColor("#ffffff").setFontWeight("bold")
        .setWrap(true).setHorizontalAlignment("center").setVerticalAlignment("middle");
      sheet.setRowHeight(2, 42);

      // Linha 3 em diante: Dados
      sheet.getRange(3, 1, rows.length, headers.length).setValues(rows);
      const dataRange = sheet.getRange(3, 1, rows.length, headers.length);
      dataRange.setVerticalAlignment("top").setWrap(true);

      // Zebra striping
      for (let i = 0; i < rows.length; i++) {
        if (i % 2 === 1) {
          sheet.getRange(3 + i, 1, 1, headers.length).setBackground("#f0fdf9");
        }
      }

      sheet.setFrozenRows(2);
      sheet.setFrozenColumns(2);

      // Larguras das colunas
      sheet.setColumnWidth(1, 55);   // ID
      sheet.setColumnWidth(2, 230);  // Nome
      sheet.setColumnWidth(3, 110);  // Ref
      for (let c = 4; c <= headers.length; c++) {
        sheet.setColumnWidth(c, c <= 13 ? 150 : 300);
      }

      // Preço Base formatado em Moeda
      sheet.getRange(3, 6, rows.length, 1).setNumberFormat("R$ #,##0.00");

      // Validação de dados (Dropdowns)
      function addListValidation(col, values, allowInvalid) {
        if (!values || !values.length) return;
        const rule = SpreadsheetApp.newDataValidation()
          .requireValueInList(values, true)
          .setAllowInvalid(allowInvalid)
          .setHelpText("Selecione uma opção válida")
          .build();
        sheet.getRange(3, col, rows.length, 1).setDataValidation(rule);
      }
      addListValidation(4, lists.categorias, false);
      addListValidation(5, lists.formulacoes, false);
      addListValidation(9, ["TRUE", "FALSE"], false);
      addListValidation(10, ["TRUE", "FALSE"], false);
      addListValidation(12, lists.badgeTipos, true);

      console.log("[APPS SCRIPT exportProducts] ✅ " + rows.length + " produtos gravados com sucesso na aba Produtos_Catalogo.");

      return createJsonResponse({
        status: "success",
        action: "exportProducts",
        rows: rows.length,
        cols: headers.length,
        timestamp: nowStr,
        message: rows.length + " produtos exportados (" + headers.length + " colunas) para Produtos_Catalogo."
      });
    }

    // ── 3. SALVA BACKUP DE EMERGÊNCIA (SNAPSHOT COMPLETO DA ABA) ───────
    if (action === "saveEmergencyBackup") {
      console.log("[APPS SCRIPT saveEmergencyBackup] 💾 Criando snapshot de emergência...");
      const sheet = getOrCreateProductsSheet();
      const backupSheet = getOrCreateEmergencyBackupSheet();
      const nowStr = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
      const userStr = data.user || "jcvadmin";

      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();

      const metaRange = sheet.getRange(1, 1, 1, Math.max(lastCol, 6));
      const metaValues = metaRange.getValues()[0].map(v => v ?? '');

      let headers = [];
      let dataRows = [];

      if (lastRow >= 2 && lastCol >= 1) {
        headers = sheet.getRange(2, 1, 1, lastCol).getValues()[0].map(h => String(h || ''));
      }
      if (lastRow >= 3 && lastCol >= 1) {
        dataRows = sheet.getRange(3, 1, lastRow - 2, lastCol).getValues();
      }

      const backupId = "EMERG-" + nowStr.replace(/[\/:]/g, "-");

      backupSheet.appendRow([
        backupId,
        nowStr,
        userStr,
        JSON.stringify({ meta: metaValues, headers: headers, rows: dataRows })
      ]);

      const newRow = backupSheet.getLastRow();
      backupSheet.getRange(newRow, 1).setFontWeight("bold").setFontColor("#0f4531");
      backupSheet.getRange(newRow, 2).setHorizontalAlignment("center");
      backupSheet.getRange(newRow, 4).setHorizontalAlignment("left").setWrap(true);
      backupSheet.setRowHeight(newRow, 45);

      console.log("[APPS SCRIPT saveEmergencyBackup] ✅ Snapshot salvo com sucesso: " + backupId + " (" + dataRows.length + " produtos).");

      return createJsonResponse({
        status: "success",
        action: "saveEmergencyBackup",
        backupId: backupId,
        timestamp: nowStr,
        message: "Backup de emergência salvo com " + dataRows.length + " linhas."
      });
    }

    // ── 4. LEITURA LINHA A LINHA DO CATÁLOGO (CAPTURAR DA PLANILHA) ───
    if (action === "getCatalogRows") {
      console.log("[APPS SCRIPT getCatalogRows] 📥 Lendo linhas da aba Produtos_Catalogo...");
      const result = fetchCatalogRowsFromSheet();
      console.log("[APPS SCRIPT getCatalogRows] ✅ Lidos: " + result.rows.length + " linhas, " + result.productCount + " produtos válidos.");

      return createJsonResponse({
        status: "success",
        action: "getCatalogRows",
        headers: result.headers,
        rows: result.rows,
        productCount: result.productCount
      });
    }

    // ── 5. RESTAURA BACKUP DE EMERGÊNCIA ──────────────────────────────
    if (action === "restoreEmergencyBackup") {
      const backupId = data.backupId || "";
      console.log("[APPS SCRIPT restoreEmergencyBackup] 🔄 Restaurando backup: " + (backupId || "(último disponível)"));
      const sheet = getOrCreateProductsSheet();
      const backupSheet = getOrCreateEmergencyBackupSheet();

      const lastRow = backupSheet.getLastRow();
      let backupData = null;
      let foundBackupId = "";

      if (lastRow > 1) {
        const allData = backupSheet.getRange(2, 1, lastRow - 1, 4).getValues();
        for (let i = allData.length - 1; i >= 0; i--) {
          const rowId = String(allData[i][0] || "");
          if (!backupId || rowId === backupId || rowId.indexOf(backupId) === 0) {
            foundBackupId = rowId;
            try {
              backupData = JSON.parse(allData[i][3]);
            } catch (e) {
              backupData = null;
            }
            break;
          }
        }
      }

      if (!backupData) {
        return createJsonResponse({
          status: "error",
          action: "restoreEmergencyBackup",
          message: "Nenhum backup encontrado para restauração."
        });
      }

      const meta = backupData.meta || [];
      const headers = backupData.headers || [];
      const rows = backupData.rows || [];

      sheet.clear();

      // Restaura Linha 1 (Metadados)
      if (meta && meta.length > 0) {
        sheet.getRange(1, 1, 1, Math.min(meta.length, 6)).setValues([meta.slice(0, 6)]);
        const metaHeader = sheet.getRange(1, 1, 1, Math.min(meta.length, 6));
        metaHeader.setBackground("#0f4531").setFontColor("#ffffff").setFontWeight("bold");
        sheet.setRowHeight(1, 30);
      }

      // Restaura Linha 2 (Cabeçalhos)
      if (headers && headers.length > 0) {
        sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
        const headerRange = sheet.getRange(2, 1, 1, headers.length);
        headerRange.setBackground("#10b981").setFontColor("#ffffff").setFontWeight("bold")
          .setWrap(true).setHorizontalAlignment("center").setVerticalAlignment("middle");
        sheet.setRowHeight(2, 42);
      }

      // Restaura Linha 3 em diante (Dados)
      if (rows && rows.length > 0) {
        const totalCols = Math.max(headers.length, rows[0].length);
        sheet.getRange(3, 1, rows.length, totalCols).setValues(rows);
        const dataRange = sheet.getRange(3, 1, rows.length, totalCols);
        dataRange.setVerticalAlignment("top").setWrap(true);

        for (let i = 0; i < rows.length; i++) {
          if (i % 2 === 1) {
            sheet.getRange(3 + i, 1, 1, totalCols).setBackground("#f0fdf9");
          }
        }
      }

      sheet.setFrozenRows(2);
      sheet.setFrozenColumns(2);

      if (headers && headers.length > 0) {
        sheet.setColumnWidth(1, 55);
        sheet.setColumnWidth(2, 230);
        sheet.setColumnWidth(3, 110);
        for (let c = 4; c <= headers.length; c++) {
          sheet.setColumnWidth(c, c <= 13 ? 150 : 300);
        }
        if (headers.length >= 6 && rows.length > 0) {
          sheet.getRange(3, 6, rows.length, 1).setNumberFormat("R$ #,##0.00");
        }
      }

      return createJsonResponse({
        status: "success",
        action: "restoreEmergencyBackup",
        backupId: foundBackupId || backupId,
        rows: rows.length,
        cols: headers.length,
        message: "Backup restaurado com sucesso! " + rows.length + " produtos recuperados na aba Produtos_Catalogo."
      });
    }

    // ── 6. SALVAR PRODUTOS (LEGADO / JSON MONOBLOCO) ───────────────────
    if (action === "saveProducts") {
      const sheet = getOrCreateProductsSheet();
      const backupSheet = getOrCreateProductBackupsSheet();
      const nowStr = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
      const userStr = data.user || "jcvadmin";
      const productsPayload = typeof data.products === "string" ? data.products : JSON.stringify(data.products || []);
      const backupItem = data.backup;

      sheet.getRange(1, 1).setValue("ÚLTIMA ATUALIZAÇÃO:");
      sheet.getRange(1, 2).setValue(nowStr);
      sheet.getRange(1, 3).setValue("AUTOR:");
      sheet.getRange(1, 4).setValue(userStr);
      sheet.getRange(2, 1).setValue(productsPayload);

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

      return createJsonResponse({
        status: "success",
        action: "saveProducts",
        timestamp: nowStr,
        message: "Produtos salvos na nuvem com sucesso!"
      });
    }

    // ── 7. ROADMAP CLOUD ──────────────────────────────────────────────
    if (action === "saveRoadmap") {
      const sheet = getOrCreateRoadmapSheet();
      const roadmapPayload = typeof data.roadmap === "string" ? data.roadmap : JSON.stringify(data.roadmap || {});
      const nowStr = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
      const userStr = data.user || "Admin / Painel";

      sheet.getRange(1, 1).setValue("ÚLTIMA ATUALIZAÇÃO:");
      sheet.getRange(1, 2).setValue(nowStr);
      sheet.getRange(1, 3).setValue("AUTOR:");
      sheet.getRange(1, 4).setValue(userStr);
      sheet.getRange(2, 1).setValue(roadmapPayload);

      return createJsonResponse({
        status: "success",
        action: "saveRoadmap",
        timestamp: nowStr,
        message: "Roadmap salvo na nuvem com sucesso!"
      });
    }

    // ── 8. TERMOS DE PESQUISA (SEARCH ANALYTICS) ──────────────────────
    if (action === "logSearch") {
      const sheet = getOrCreateSearchTermsSheet();
      const termRaw = (data.termo || "").toString().trim();

      if (!termRaw) {
        return createJsonResponse({ status: "ignored", message: "Termo de busca vazio." });
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
        const currentCount = parseInt(sheet.getRange(foundRow, 2).getValue(), 10) || 0;
        sheet.getRange(foundRow, 2).setValue(currentCount + 1);
        sheet.getRange(foundRow, 3).setValue(qtdResultados);
        sheet.getRange(foundRow, 4).setValue(nowStr);
        sheet.getRange(foundRow, 6).setValue(canal);
        sheet.getRange(foundRow, 7).setValue(dispositivo);
      } else {
        sheet.appendRow([
          termRaw, 1, qtdResultados, nowStr, nowStr, canal, dispositivo
        ]);
        const newRow = sheet.getLastRow();
        sheet.getRange(newRow, 1, 1, 7).setVerticalAlignment("middle");
        sheet.getRange(newRow, 2).setHorizontalAlignment("center").setFontWeight("bold").setFontColor("#0f4531");
        sheet.getRange(newRow, 3).setHorizontalAlignment("center");
      }

      if (sheet.getLastRow() > 2) {
        sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).sort({ column: 2, ascending: false });
      }

      return createJsonResponse({
        status: "success",
        action: "logSearch",
        termo: termRaw,
        resultados: qtdResultados,
        timestamp: nowStr
      });
    }

    // ── 9. LOG DE AUDITORIA & TELEMETRIA PADRÃO (FALLBACK) ────────────
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

    let celulaLinkProposta = linkProposta;
    if (linkProposta && linkProposta.startsWith("http")) {
      celulaLinkProposta = '=HYPERLINK("' + linkProposta + '"; "🔗 Abrir Link")';
    }

    sheet.appendRow([
      timestamp,
      origemCanal,
      vendedorNome,
      evento,
      numProposta,
      cliente,
      documento,
      totalItens,
      resumoItens,
      celulaLinkProposta,
      linkProposta,
      observacoes,
      dispositivo
    ]);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 13).setVerticalAlignment("middle");

    if (evento.indexOf("Orçamento") !== -1 || evento.indexOf("Proposta") !== -1 || evento.indexOf("WhatsApp") !== -1) {
      sheet.getRange(lastRow, 4).setFontWeight("bold").setFontColor("#0f4531");
      sheet.getRange(lastRow, 5).setFontWeight("bold").setFontColor("#2563eb");
    }

    if (origemCanal.indexOf("Vendedor") !== -1) {
      sheet.getRange(lastRow, 2).setFontColor("#15803d").setFontWeight("bold");
    } else {
      sheet.getRange(lastRow, 2).setFontColor("#1e40af").setFontWeight("bold");
    }

    return createJsonResponse({
      status: "success",
      message: "Log de auditoria registrado com sucesso!",
      row: lastRow
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "";

    // Leitura das linhas do catálogo (pode ser testado diretamente colando a URL no navegador)
    if (action === "getCatalogRows") {
      const result = fetchCatalogRowsFromSheet();
      return createJsonResponse({
        status: "success",
        action: "getCatalogRows",
        headers: result.headers,
        rows: result.rows,
        productCount: result.productCount
      });
    }

    // Leitura dos produtos salvos em JSON legado
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

      let backups = [];
      const lastBackupRow = backupSheet.getLastRow();
      if (lastBackupRow > 1) {
        const startRow = Math.max(2, lastBackupRow - 49);
        const numRows = lastBackupRow - startRow + 1;
        const backupData = backupSheet.getRange(startRow, 1, numRows, 7).getValues();

        backups = backupData.map(r => {
          let snap = null;
          try { snap = JSON.parse(r[6]); } catch (e) { snap = null; }
          return {
            id: r[0],
            timestamp: r[1],
            author: r[2],
            productId: r[3],
            productName: r[4],
            summary: r[5],
            snapshot: snap
          };
        }).reverse();
      }

      return createJsonResponse({
        status: "success",
        action: "getProducts",
        lastUpdate: lastUpdate,
        updatedBy: updatedBy,
        hasData: !!(products && products.length > 0),
        products: products,
        backups: backups
      });
    }

    // Leitura do roadmap
    if (action === "getRoadmap") {
      const sheet = getOrCreateRoadmapSheet();
      const lastUpdate = sheet.getRange(1, 2).getValue() || "";
      const rawJson = sheet.getRange(2, 1).getValue() || "";

      let parsed = null;
      if (rawJson && typeof rawJson === "string" && rawJson.trim().startsWith("{")) {
        try { parsed = JSON.parse(rawJson); } catch (err) { parsed = null; }
      }

      return createJsonResponse({
        status: "success",
        action: "getRoadmap",
        lastUpdate: lastUpdate,
        hasData: !!parsed,
        data: parsed
      });
    }

    // Leitura dos termos mais buscados
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
      return createJsonResponse({
        status: "success",
        action: "getTopSearches",
        total: terms.length,
        data: terms
      });
    }

    // Status padrão
    return createJsonResponse({
      status: "online",
      service: "Rawell Química — Webhook de Auditoria & Sincronização Cloud",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

// ── FUNÇÃO CENTRAL PARA LER LINHAS DO CATÁLOGO ────────────────────────
function fetchCatalogRowsFromSheet() {
  const sheet = getOrCreateProductsSheet();
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow < 3 || lastCol < 2) {
    return { headers: [], rows: [], productCount: 0 };
  }

  // Linha 2: cabeçalhos
  const headers = sheet.getRange(2, 1, 1, lastCol).getValues()[0].map(h => String(h || ''));

  // Linha 3 em diante: dados
  const data = sheet.getRange(3, 1, lastRow - 2, lastCol).getValues();
  const rows = data.map(row => row.map(cell => cell ?? ''));

  // Conta produtos válidos (com ID não vazio na coluna 0)
  const productCount = rows.filter(r => r[0] !== '' && r[0] !== null).length;

  return { headers: headers, rows: rows, productCount: productCount };
}

// ── AUXILIAR: CRIA SAÍDA JSON FORMATADA COM CABEÇALHO CORRETO ─────────
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── FUNÇÕES DE SUPORTE ÀS ABAS ─────────────────────────────────────────
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

function getOrCreateEmergencyBackupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Emergency_Backup");

  if (!sheet) {
    sheet = ss.insertSheet("Emergency_Backup");
    sheet.setTabColor("#dc2626");

    const headers = [
      "ID Backup",
      "Data / Hora",
      "Autor",
      "Dados do Catálogo (JSON)"
    ];

    sheet.appendRow(headers);

    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#7f1d1d");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");

    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 35);

    sheet.setColumnWidth(1, 200);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(3, 130);
    sheet.setColumnWidth(4, 800);
  }

  return sheet;
}

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

    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(3, 130);
    sheet.setColumnWidth(4, 100);
    sheet.setColumnWidth(5, 220);
    sheet.setColumnWidth(6, 280);
    sheet.setColumnWidth(7, 300);
  }

  return sheet;
}

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

function getOrCreateImagesFolder() {
  const folderName = "Catalogo_Rawell_Imagens";
  const folders = DriveApp.getFoldersByName(folderName);
  let folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(folderName);
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }
  return folder;
}
