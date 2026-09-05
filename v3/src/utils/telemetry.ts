import { CONFIG } from '../data/config';
import type { TelemetryPayload } from '../types/telemetry';

export async function sendTelemetry(payload: TelemetryPayload): Promise<boolean> {
  const url = CONFIG.auditWebhookUrl;
  if (!url) return false;

  const enrichedPayload: TelemetryPayload = {
    timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
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
    console.warn('Telemetry delivery notice:', error);
    return false;
  }
}
