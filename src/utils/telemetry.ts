import { CONFIG } from '../data/config';
import type { TelemetryPayload } from '../types/telemetry';

let _telemetryDebounceTimer: any = null;
let _searchTelemetryDebounceTimer: any = null;
let _lastLoggedSearchTerm = '';

export async function sendTelemetry(payload: TelemetryPayload, isHighFrequency: boolean = false): Promise<boolean> {
  if (isHighFrequency) {
    clearTimeout(_telemetryDebounceTimer);
    return new Promise((resolve) => {
      _telemetryDebounceTimer = setTimeout(async () => {
        const res = await dispatchPayload(payload);
        resolve(res);
      }, 1200);
    });
  }
  return dispatchPayload(payload);
}

export function logSearchTelemetry(
  termo: string,
  resultadosQtd: number = 0,
  sellerName: string = 'Atendimento Geral',
  origemCanal: string = '🔵 Base Orgânica',
  instant: boolean = false
): void {
  const cleanTerm = (termo || '').trim();
  if (!cleanTerm || cleanTerm.length < 2) return;

  clearTimeout(_searchTelemetryDebounceTimer);

  const dispatch = () => {
    if (_lastLoggedSearchTerm.toLowerCase() !== cleanTerm.toLowerCase()) {
      _lastLoggedSearchTerm = cleanTerm;
      sendTelemetry({
        action: 'logSearch',
        termo: cleanTerm,
        resultados_qtd: resultadosQtd,
        origem_canal: origemCanal,
        vendedor: sellerName,
        vendedor_nome: sellerName
      });
    }
  };

  if (instant) {
    dispatch();
  } else {
    _searchTelemetryDebounceTimer = setTimeout(dispatch, 1200);
  }
}

async function dispatchPayload(payload: TelemetryPayload): Promise<boolean> {
  const url = CONFIG.auditWebhookUrl;
  if (!url || !url.startsWith('http')) return false;

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const enrichedPayload: TelemetryPayload = {
    timestamp: `${dateStr} ${timeStr}`,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    url_acessada: typeof window !== 'undefined' ? window.location.href : '',
    ...payload
  };

  try {
    const jsonStr = JSON.stringify(enrichedPayload);

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([jsonStr], { type: 'text/plain;charset=UTF-8' });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return true;
    }

    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      },
      body: jsonStr
    });

    return true;
  } catch (error) {
    console.debug('Telemetry notice:', error);
    return false;
  }
}
