export function formatCurrency(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Converte string digitada pelo usuário em número (formato pt-BR).
 * Aceita "12,50", "12.50", "1.234,56" e "12".
 * Importante: o teclado numérico do celular em pt-BR gera vírgula,
 * e parseFloat("12,50") retornaria 12 — por isso o tratamento.
 */
export function parseCurrencyInput(raw: string): number {
  if (!raw) return 0;
  let s = String(raw).replace(/[^\d.,]/g, '');
  if (!s) return 0;

  if (s.includes(',') && s.includes('.')) {
    // pt-BR: ponto = milhar, vírgula = decimal -> "1.234,56" => 1234.56
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',')) {
    // só vírgula -> decimal
    s = s.replace(',', '.');
  }
  // só ponto -> trata como decimal ("12.50" => 12.50)

  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatDateTime(date: Date = new Date()): { data: string; hora: string; full: string } {
  const data = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hora = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return {
    data,
    hora,
    full: `${data} às ${hora}`
  };
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  } else if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  return phone;
}

export function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
