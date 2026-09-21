import type { CartItem, CartTotals } from '../types/cart';

export function calculateCartTotals(items: CartItem[], globalDiscountPercent: number = 0): CartTotals {
  let subtotalItensSemDesconto = 0;
  let subtotalItensComDesconto = 0;
  let baseItensSemDesconto = 0;
  let qtdTiposSemDesconto = 0;
  let totalQtd = 0;

  items.forEach(item => {
    const qty = Number(item.quantidade) || 0;
    const unitPrice = item.preco_unitario !== undefined ? Number(item.preco_unitario) : (Number(item.preco_base) || 0);
    const itemDiscount = Number(item.desconto_percent) || 0;

    const itemTotalBruto = qty * unitPrice;
    const itemTotalLiquido = itemTotalBruto * (1 - itemDiscount / 100);

    subtotalItensSemDesconto += itemTotalBruto;
    subtotalItensComDesconto += itemTotalLiquido;
    totalQtd += qty;

    if (itemDiscount === 0) {
      baseItensSemDesconto += itemTotalBruto;
      qtdTiposSemDesconto++;
    }
  });

  const descontoTotalItens = subtotalItensSemDesconto - subtotalItensComDesconto;
  const discGlobalPercent = Math.max(0, Math.min(100, Number(globalDiscountPercent) || 0));
  const valorDescontoGlobal = baseItensSemDesconto * (discGlobalPercent / 100);
  const totalFinalLiquido = Math.max(0, subtotalItensComDesconto - valorDescontoGlobal);
  const economiaTotalReal = Math.max(0, descontoTotalItens + valorDescontoGlobal);
  const percentualEconomiaTotal = subtotalItensSemDesconto > 0 
    ? (economiaTotalReal / subtotalItensSemDesconto) * 100 
    : 0;

  return {
    subtotalItensSemDesconto,
    subtotalItensComDesconto,
    descontoTotalItens,
    baseItensSemDesconto,
    qtdTiposSemDesconto,
    discGlobalPercent,
    valorDescontoGlobal,
    totalFinalLiquido,
    economiaTotalReal,
    percentualEconomiaTotal,
    totalQtd
  };
}
