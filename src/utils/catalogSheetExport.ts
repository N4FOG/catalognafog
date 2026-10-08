import type { Product, ProductApplicationManual, ProductVariation } from '../types/product';
import { CONFIG } from '../data/config';
import { CATEGORIAS, FORMULACOES } from '../data/categories';

/**
 * Exportação do catálogo completo para a aba "Produtos_Catalogo" do Google Sheets.
 *
 * Fase 1: EXPORTAÇÃO — leva os dados do bundle para a planilha,
 * linha a linha, coluna por coluna. Sem leitura/escrita bidirecional.
 */

/** Cabeçalhos da planilha (ordem = ordem das células em cada linha) */
export const CATALOG_HEADERS: string[] = [
  // 1-8: Identificação
  'ID', 'Nome', 'Referência', 'Categoria', 'Formulação', 'Preço Base (R$)', 'Unidade', 'Rendimento',
  // 9-13: Comerciais
  'Destaque', 'Em Estoque', 'Badge Texto', 'Badge Tipo', 'Ícones Emoji',
  // 14-19: Textos da ficha
  'O que faz', 'Para que serve', 'Como age', 'Como usar', 'Onde NÃO usar', 'Descrição',
  // 20-23: Segurança
  'Seg. Pets', 'Seg. Chuva', 'Seg. Horário', 'Seg. EPI',
  // 24-26: Listas (uma linha por item dentro da célula)
  'Alvos / Pragas', 'Características', 'Imagens',
  // 27: Variações
  'Variações (JSON)',
  // 28-37: Manual de aplicação
  'Manual: Resumo', 'Manual: Checklist', 'Manual: Equipamentos',
  'Dosagem Peq. Título', 'Dosagem Peq. Dose', 'Dosagem Peq. Cobertura',
  'Dosagem Total Título', 'Dosagem Total Dose', 'Dosagem Total Cobertura',
  'Instrução de Diluição',
  // 38-39: Passos e linha do tempo (texto formatado)
  'Manual: Passo a Passo', 'Manual: Linha do Tempo'
];

/** Formatação pt-BR de número simples (sem símbolo R$, que fica na coluna de preço) */
const num = (v: number | undefined | null): number =>
  typeof v === 'number' && !isNaN(v) ? v : 0;

/** Lista separada por quebras de linha (cada item em sua linha na célula) */
const nl = (arr: string[] | undefined): string =>
  Array.isArray(arr) ? arr.filter(Boolean).join('\n') : '';

/** JSON compacto seguro (nunca lança erro) */
const j = (v: unknown): string => {
  try {
    return v ? JSON.stringify(v) : '';
  } catch {
    return '';
  }
};

const bool = (v: boolean | undefined): string => (v ? 'TRUE' : 'FALSE');

/** Passos do manual em texto legível: "1. Título\nDescrição..." */
function formatPassos(manual: ProductApplicationManual | undefined): string {
  if (!manual || !Array.isArray(manual.passos)) return '';
  return manual.passos
    .map((s) => {
      const linhas = [`${s.passo}. ${s.titulo}`, s.descricao];
      if (s.dica_do_aplicador) linhas.push(`💡 Dica: ${s.dica_do_aplicador}`);
      if (s.alerta) linhas.push(`⚠️ Atenção: ${s.alerta}`);
      return linhas.join('\n');
    })
    .join('\n\n');
}

/** Linha do tempo em texto legível */
function formatLinhaDoTempo(manual: ProductApplicationManual | undefined): string {
  if (!manual || !Array.isArray(manual.linha_do_tempo)) return '';
  return manual.linha_do_tempo
    .map((t) => `${t.icone || '⏱️'} ${t.periodo} — ${t.titulo}: ${t.descricao}`)
    .join('\n');
}

/** Variações em JSON (estrutura complexa: id/nome/ref/preço/unidade) */
function formatVariacoes(vars: ProductVariation[] | undefined): string {
  if (!Array.isArray(vars) || vars.length === 0) return '';
  return j(
    vars.map((v) => ({
      nome: v.nome,
      ref: v.referencia,
      preco: num(v.preco_base),
      unidade: v.unidade
    }))
  );
}

/**
 * Converte um produto em uma linha (array de células) alinhada ao CATALOG_HEADERS.
 * Total: 39 colunas.
 */
export function productToRow(p: Product): (string | number)[] {
  const m = p.manual_aplicacao;
  return [
    // Identificação
    p.id,
    p.nome || '',
    p.referencia || '',
    p.categoria || '',
    p.tipo_formulacao || '',
    num(p.preco_base),
    p.unidade || '',
    p.rendimento || '',
    // Comerciais
    bool(p.destaque),
    bool(p.emEstoque),
    p.badge_texto || '',
    p.badge_tipo || '',
    nl(p.icones_representativos),
    // Ficha
    p.o_que_faz || '',
    p.para_que_serve || '',
    p.como_age || '',
    p.como_usar || '',
    p.onde_nao_usar || '',
    p.descricao || '',
    // Segurança
    p.seguranca?.pets || '',
    p.seguranca?.chuva || '',
    p.seguranca?.horario || '',
    p.seguranca?.epi || '',
    // Listas
    nl(p.alvos),
    nl(p.caracteristicas),
    nl(p.imagens),
    // Variações
    formatVariacoes(p.variacoes),
    // Manual
    m?.resumo_aplicador || '',
    nl(m?.checklist_previo),
    nl(m?.equipamentos),
    m?.dosagem?.pequena_area?.titulo || '',
    m?.dosagem?.pequena_area?.dose || '',
    m?.dosagem?.pequena_area?.cobertura || '',
    m?.dosagem?.area_total?.titulo || '',
    m?.dosagem?.area_total?.dose || '',
    m?.dosagem?.area_total?.cobertura || '',
    m?.dosagem?.instrucao_diluicao || '',
    formatPassos(m),
    formatLinhaDoTempo(m)
  ];
}

/** Monta as linhas completas do catálogo */
export function buildCatalogRows(products: Product[]): (string | number)[][] {
  return products.map(productToRow);
}

/** Listas para os dropdowns da planilha */
export function buildValidationLists() {
  return {
    categorias: CATEGORIAS.filter((c) => c.id !== 'todos').map((c) => c.id),
    formulacoes: FORMULACOES.filter((f) => f.id !== 'todos').map((f) => f.id),
    badgeTipos: [
      'top_vendas', 'lancamento', 'mais_vendido', 'natural',
      'rapido', 'premium', 'profissional', 'oferta', 'custom'
    ]
  };
}

export interface ExportResult {
  ok: boolean;
  rows?: number;
  cols?: number;
  message: string;
}

/**
 * Envia o catálogo completo para a aba Produtos_Catalogo via Apps Script.
 * Usa Content-Type text/plain (mesmo padrão da telemetria) para evitar preflight CORS.
 */
export async function exportCatalogToSheet(
  products: Product[],
  user: string = 'jcvadmin'
): Promise<ExportResult> {
  const url = CONFIG.auditWebhookUrl;
  if (!url || !url.startsWith('http')) {
    return { ok: false, message: 'Webhook do Google não configurado em config.ts' };
  }
  if (!products.length) {
    return { ok: false, message: 'Nenhum produto para exportar.' };
  }

  const payload = {
    action: 'exportProducts',
    headers: CATALOG_HEADERS,
    rows: buildCatalogRows(products),
    lists: buildValidationLists(),
    user
  };

  // Validação local: linha deve bater com o cabeçalho
  const badIdx = payload.rows.findIndex((r) => r.length !== CATALOG_HEADERS.length);
  if (badIdx !== -1) {
    return {
      ok: false,
      message: `Erro interno: linha ${badIdx + 1} tem ${payload.rows[badIdx].length} células (esperado ${CATALOG_HEADERS.length})`
    };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return { ok: false, message: `Falha na requisição (${response.status})` };
    }

    const data = await response.json();
    if (data && data.status === 'success') {
      return {
        ok: true,
        rows: data.rows ?? products.length,
        cols: data.cols ?? CATALOG_HEADERS.length,
        message: data.message || 'Catálogo exportado com sucesso!'
      };
    }
    return { ok: false, message: (data && data.message) || 'Resposta inesperada do servidor.' };
  } catch (err) {
    return {
      ok: false,
      message: `Sem conexão com o Google Sheets (${err instanceof Error ? err.message : 'erro de rede'})`
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  FASE 2: IMPORTAÇÃO DO CATÁLOGO DO GOOGLE SHEETS PARA O APP
// ═══════════════════════════════════════════════════════════════════════════

/** Resultado da captura do catálogo do Google Sheets */
export interface CaptureResult {
  ok: boolean;
  products?: Product[];
  backupId?: string;
  message: string;
}

/** Converte valor da célula para número, ou undefined */
function toNum(v: string | number | null | undefined): number | undefined {
  if (v === null || v === undefined || v === '') return undefined;
  if (typeof v === 'number') return isNaN(v) ? undefined : v;
  const n = parseFloat(String(v).replace(/[^\d,-]/g, '').replace(',', '.'));
  return isNaN(n) ? undefined : n;
}

/** Converte "TRUE"/"FALSE" string para boolean */
function toBool(v: string | number | null | undefined): boolean | undefined {
  if (v === null || v === undefined || v === '') return undefined;
  if (typeof v === 'boolean') return v;
  const s = String(v).toUpperCase().trim();
  if (s === 'TRUE' || s === '1' || s === 'VERDADEIRO') return true;
  if (s === 'FALSE' || s === '0' || s === 'FALSO') return false;
  return undefined;
}

/** Converte lista separada por \n em array */
function fromNl(v: string | number | null | undefined): string[] {
  if (v === null || v === undefined || v === '') return [];
  const parts = String(v).split('\n').map(s => s.trim()).filter(Boolean);
  return parts;
}

/** Tenta parsear JSON, retorna undefined se falhar */
function tryParseJson(v: string | number | null | undefined): any {
  if (v === null || v === undefined || v === '') return undefined;
  try {
    return JSON.parse(String(v));
  } catch {
    return undefined;
  }
}

/**
 * Converte uma linha da planilha de volta para objeto Product.
 * Índices baseados no CATALOG_HEADERS (0-based).
 */
// Tipos permitidos para badge_tipo
const BADGE_TIPOS = [
  'top_vendas', 'lancamento', 'mais_vendido', 'natural',
  'rapido', 'premium', 'profissional', 'oferta', 'custom'
] as const;

function rowToProduct(row: (string | number)[]): Product | null {
  if (!row || row.length < 8 || !row[0] || row[0] === '') return null;

  const id = typeof row[0] === 'number' ? row[0] : parseInt(String(row[0]), 10);
  if (isNaN(id)) return null;

  const nome = String(row[1] || '').trim() || `Produto ${id}`;
  const referencia = String(row[2] || '').trim();
  const categoria = String(row[3] || '').trim();
  const tipo_formulacao = String(row[4] || '').trim();
  const preco_base = toNum(row[5]) ?? 0;
  const unidade = String(row[6] || '').trim() || 'UN';
  const rendimento = String(row[7] || '').trim();

  const destaque = toBool(row[8]);
  const emEstoque = toBool(row[9]) !== false; // FALSE explícito = false, resto = true
  const badge_texto = String(row[10] || '').trim();
  const badge_tipo_raw = String(row[11] || '').trim();
  const badge_tipo = BADGE_TIPOS.includes(badge_tipo_raw as any) ? (badge_tipo_raw as Product['badge_tipo']) : undefined;
  const icones_representativos = fromNl(row[12]);

  const o_que_faz = String(row[13] || '').trim();
  const para_que_serve = String(row[14] || '').trim();
  const como_age = String(row[15] || '').trim();
  const como_usar = String(row[16] || '').trim();
  const onde_nao_usar = String(row[17] || '').trim();
  const descricao = String(row[18] || '').trim();

  // Segurança
  const seguranca: Product['seguranca'] = {
    pets: String(row[19] || '').trim() || 'Afastar pets até a secagem completa',
    chuva: String(row[20] || '').trim() || 'Não aplicar com previsão de chuva em 4h',
    horario: String(row[21] || '').trim() || 'Horários amenos do dia',
    epi: String(row[22] || '').trim() || 'Luvas, máscara e óculos'
  };

  const alvos = fromNl(row[23]);
  const caracteristicas = fromNl(row[24]);
  const imagens = fromNl(row[25]);

  // Variações
  const variacoesRaw = tryParseJson(row[26]);      const variacoesValidas: ProductVariation[] | undefined = Array.isArray(variacoesRaw)
    ? variacoesRaw.map((v: any, idx: number) => ({
        id: typeof v.id === 'number' ? v.id : idx + 1,
        nome: String(v.nome || ''),
        referencia: String(v.ref || ''),
        imagem: String(v.imagem || ''),
        preco_base: toNum(v.preco) ?? 0,
        unidade: String(v.unidade || 'UN')
      }) as ProductVariation).filter(v => v.nome)
    : undefined;

  // Manual de aplicação - colunas 27-38
  const resumo_aplicador = String(row[27] || '').trim();
  const checklist_previo = fromNl(row[28]);
  const equipamentos = fromNl(row[29]);

  const dosagem: Product['manual_aplicacao']extends { dosagem?: any } ? any : any = {
    pequena_area: {
      titulo: String(row[30] || '').trim(),
      dose: String(row[31] || '').trim(),
      cobertura: String(row[32] || '').trim()
    },
    area_total: {
      titulo: String(row[33] || '').trim(),
      dose: String(row[34] || '').trim(),
      cobertura: String(row[35] || '').trim()
    },
    instrucao_diluicao: String(row[36] || '').trim()
  };

  // Passo a passo e linha do tempo precisam de parse mais avançado
  const passo_a_passo_texto = String(row[37] || '').trim();
  const linha_tempo_texto = String(row[38] || '').trim();

  // Parse do passo a passo: "1. Título\nDescrição...\n\n2. ..."
  const passos = parsePassos(passo_a_passo_texto);
  const linha_do_tempo = parseLinhaDoTempo(linha_tempo_texto);

  const manual_aplicacao: Product['manual_aplicacao'] = {
    resumo_aplicador,
    checklist_previo,
    equipamentos,
    dosagem,
    passos,
    linha_do_tempo
  };

  return {
    id,
    nome,
    referencia,
    categoria,
    tipo_formulacao,
    preco_base,
    unidade,
    rendimento,
    destaque: destaque ?? false,
    emEstoque: emEstoque ?? true,
    badge_texto,
    badge_tipo,
    icones_representativos: icones_representativos.length > 0 ? icones_representativos : ['🌿'],
    o_que_faz,
    para_que_serve,
    como_age,
    como_usar,
    onde_nao_usar,
    descricao,
    seguranca,
    alvos,
    caracteristicas,
    imagens: imagens.length > 0 ? imagens : ['img/logo.png'],
    variacoes: variacoesValidas,
    manual_aplicacao
  };
}

/** Parseia texto de passos para array de passo objects */
function parsePassos(texto: string): ProductApplicationManual['passos'] {
  if (!texto) return [];

  const passos: ProductApplicationManual['passos'] = [];
  const blocos = texto.split(/\n\s*\n/).filter(b => b.trim());

  for (const bloco of blocos) {
    const linhas = bloco.split('\n').map(l => l.trim()).filter(l => l);
    if (linhas.length === 0) continue;

    // Primeira linha: "1. Título" ou "1.Título"
    const primeiro = linhas[0];
    const match = primeiro.match(/^(\d+)\.\s*(.+)$/);
    if (!match) continue;

    const passo = parseInt(match[1], 10);
    const titulo = match[2];
    const descricao = linhas.slice(1).join('\n');

    const passoObj: ProductApplicationManual['passos'][number] = {
      passo,
      titulo,
      descricao
    };

    // Extrai dica
    const dicaMatch = descricao.match(/💡 Dica:\s*(.+)/);
    if (dicaMatch) {
      passoObj.dica_do_aplicador = dicaMatch[1].trim();
      passoObj.descricao = descricao.replace(/💡 Dica:\s*.+/, '').trim();
    }

    // Extrai alerta
    const alertaMatch = descricao.match(/⚠️ Atenção:\s*(.+)/);
    if (alertaMatch) {
      passoObj.alerta = alertaMatch[1].trim();
      passoObj.descricao = descricao.replace(/⚠️ Atenção:\s*.+/, '').trim();
    }

    passos.push(passoObj);
  }

  return passos;
}

/** Parseia texto de linha do tempo para array */
function parseLinhaDoTempo(texto: string): ProductApplicationManual['linha_do_tempo'] {
  if (!texto) return [];

  const itens: ProductApplicationManual['linha_do_tempo'] = [];
  const linhas = texto.split('\n').filter(l => l.trim());

  for (const linha of linhas) {
    // Tenta formato: "⏱️ Período — Título: Descrição" ou "Período — Descrição"
    // Separa pelo em-dash (—)
    const partes = linha.split('—');
    if (partes.length >= 2) {
      const antes = partes[0].trim();
      const depois = partes.slice(1).join('—').trim();

      // Verifica se tem ícone emojí no início
      const emojiMatch = antes.match(/^(\p{Emoji}\p{ExtPict}?)\s*/u);
      
      if (emojiMatch) {
        itens.push({
          icone: emojiMatch[1],
          periodo: antes.slice(emojiMatch[0].length).trim(),
          titulo: '',
          descricao: depois
        });
      } else {
        itens.push({
          icone: '⏱️',
          periodo: antes,
          titulo: '',
          descricao: depois
        });
      }
    }
  }

  return itens;
}

/**
 * Captura o catálogo do Google Sheets e retorna os produtos parseados.
 * Faz backup automático antes de qualquer operação.
 */
export async function captureCatalogFromSheet(
  user: string = 'jcvadmin'
): Promise<CaptureResult> {
  const url = CONFIG.auditWebhookUrl;
  if (!url || !url.startsWith('http')) {
    return { ok: false, message: 'Webhook do Google não configurado em config.ts' };
  }

  try {
    // 1. Primeiro: solicita backup de emergência no Google Sheets
    const backupPayload = {
      action: 'saveEmergencyBackup',
      user
    };

    const backupResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(backupPayload)
    });

    let backupId: string | undefined;
    if (backupResponse.ok) {
      const backupData = await backupResponse.json();
      if (backupData && backupData.status === 'success') {
        backupId = backupData.backupId;
      }
    }

    // 2. Segunda: captura os dados da planilha
    const capturePayload = {
      action: 'getCatalogRows'
    };

    const captureResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(capturePayload)
    });

    if (!captureResponse.ok) {
      return { ok: false, message: `Falha na requisição (${captureResponse.status})` };
    }

    const data = await captureResponse.json();
    if (data && data.status === 'success') {
      const { headers, rows } = data;
      if (!headers || !rows || !rows.length) {
        return { ok: false, message: 'Nenhum dado encontrado na planilha.' };
      }

      // 3. Converte cada linha em produto
      const products: Product[] = [];
      for (let i = 0; i < rows.length; i++) {
        const prod = rowToProduct(rows[i]);
        if (prod) products.push(prod);
      }

      if (products.length === 0) {
        return { ok: false, message: 'Nenhum produto válido encontrado nas linhas.' };
      }

      return {
        ok: true,
        products,
        backupId,
        message: `Capturados ${products.length} produtos da planilha${backupId ? '. Backup: ' + backupId : ''}!`
      };
    }

    return { ok: false, message: (data && data.message) || 'Resposta inesperada do servidor.' };
  } catch (err) {
    return {
      ok: false,
      message: `Sem conexão com o Google Sheets (${err instanceof Error ? err.message : 'erro de rede'})`
    };
  }
}

/**
 * Salva um backup de emergência manual no Google Sheets.
 */
export async function saveEmergencyBackup(
  user: string = 'jcvadmin'
): Promise<{ ok: boolean; backupId?: string; message: string }> {
  const url = CONFIG.auditWebhookUrl;
  if (!url || !url.startsWith('http')) {
    return { ok: false, message: 'Webhook do Google não configurado em config.ts' };
  }

  try {
    const payload = {
      action: 'saveEmergencyBackup',
      user
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return { ok: false, message: `Falha na requisição (${response.status})` };
    }

    const data = await response.json();
    if (data && data.status === 'success') {
      return {
        ok: true,
        backupId: data.backupId,
        message: data.message || 'Backup salvo com sucesso!'
      };
    }

    return { ok: false, message: (data && data.message) || 'Resposta inesperada.' };
  } catch (err) {
    return {
      ok: false,
      message: `Sem conexão com o Google Sheets (${err instanceof Error ? err.message : 'erro de rede'})`
    };
  }
}

/**
 * Restaura o backup de emergência para a aba Produtos_Catalogo.
 * Usado como botão de emergência no painel admin.
 */
export async function restoreFromEmergencyBackup(
  backupId?: string,
  user: string = 'jcvadmin'
): Promise<{ ok: boolean; message: string }> {
  const url = CONFIG.auditWebhookUrl;
  if (!url || !url.startsWith('http')) {
    return { ok: false, message: 'Webhook do Google não configurado em config.ts' };
  }

  try {
    const payload = {
      action: 'restoreEmergencyBackup',
      backupId,
      user
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return { ok: false, message: `Falha na requisição (${response.status})` };
    }

    const data = await response.json();
    if (data && data.status === 'success') {
      return {
        ok: true,
        message: data.message || 'Backup restaurado com sucesso!'
      };
    }

    return { ok: false, message: (data && data.message) || 'Resposta inesperada.' };
  } catch (err) {
    return {
      ok: false,
      message: `Sem conexão com o Google Sheets (${err instanceof Error ? err.message : 'erro de rede'})`
    };
  }
}
