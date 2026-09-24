import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toPng } from 'html-to-image';
import type { CartItem, CartTotals, ClientInfo } from '../types/cart';
import { formatCurrency } from './formatters';

interface GeneratePdfOptions {
  proposalNumber: string;
  dateTime: string;
  clientInfo: ClientInfo;
  sellerName: string;
  sellerPhone: string;
  items: CartItem[];
  totals: CartTotals;
  showPrices: boolean;
  paymentTerms?: string;
  validityDays?: string;
}

export function generateProposalPdf(options: GeneratePdfOptions): jsPDF {
  const {
    proposalNumber,
    dateTime,
    clientInfo,
    sellerName,
    sellerPhone,
    items,
    totals,
    showPrices,
    paymentTerms = 'A Combinar / Faturamento Boleto Bancário',
    validityDays = '10 dias a contar da emissão'
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Top Green Header Bar
  doc.setFillColor(15, 69, 49); // #0f4531 Brand green
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Header Title & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('JCV JARDINAGEM & AGRO', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Rawell Química • Catálogo Oficial & Cotações 2026', 14, 17);
  doc.text('Defensivos, Herbicidas Seletivos e Adjuvantes de Alta Performance', 14, 21);

  // Proposal Number Badge in Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Proposta: ${proposalNumber}`, pageWidth - 14, 12, { align: 'right' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Emissão: ${dateTime}`, pageWidth - 14, 18, { align: 'right' });

  // 2. Info Cards (Client & Seller)
  doc.setFillColor(248, 250, 249);
  doc.roundedRect(14, 32, pageWidth - 28, 26, 3, 3, 'F');
  doc.setDrawColor(220, 230, 224);
  doc.roundedRect(14, 32, pageWidth - 28, 26, 3, 3, 'S');

  // Client Info (Left)
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CLIENTE / DESTINATÁRIO:', 18, 38);

  doc.setTextColor(15, 31, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(clientInfo.nome || 'Cliente Não Informado', 18, 44);

  doc.setTextColor(51, 78, 64);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Doc / Cidade: ${clientInfo.doc || 'Não informado'}`, 18, 49);
  if (clientInfo.telefone) {
    doc.text(`Contato: ${clientInfo.telefone}`, 18, 54);
  }

  // Seller Info (Right)
  const rightColX = pageWidth / 2 + 10;
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('REPRESENTANTE RESPONSÁVEL:', rightColX, 38);

  doc.setTextColor(15, 31, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(sellerName, rightColX, 44);

  doc.setTextColor(51, 78, 64);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`WhatsApp / Atendimento: ${sellerPhone}`, rightColX, 49);
  doc.text('Canal Comercial Oficial 2026', rightColX, 54);

  // 3. Products Table
  const tableHeaders = showPrices
    ? [['#', 'Ref', 'Produto / Especificação', 'Qtd', 'Tabela', 'Desc.', 'Total Líquido']]
    : [['#', 'Ref', 'Produto / Especificação', 'Qtd / Embalagem']];

  const tableBody = items.map((item, idx) => {
    const unitPrice = item.preco_unitario || item.preco_base || 0;
    const disc = item.desconto_percent || 0;
    const lineTotal = item.quantidade * unitPrice * (1 - disc / 100);

    if (showPrices) {
      return [
        (idx + 1).toString(),
        item.referencia,
        item.nome,
        `${item.quantidade} ${item.unidade || 'un'}`,
        formatCurrency(unitPrice),
        disc > 0 ? `${disc}%` : '-',
        formatCurrency(lineTotal)
      ];
    } else {
      return [
        (idx + 1).toString(),
        item.referencia,
        item.nome,
        `${item.quantidade} ${item.unidade || 'un'}`
      ];
    }
  });

  autoTable(doc, {
    startY: 63,
    head: tableHeaders,
    body: tableBody,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 69, 49],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 249]
    },
    columnStyles: showPrices
      ? {
          0: { cellWidth: 8, halign: 'center' },
          1: { cellWidth: 18, fontStyle: 'bold' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
          4: { cellWidth: 24, halign: 'right' },
          5: { cellWidth: 16, halign: 'center', textColor: [225, 29, 72] },
          6: { cellWidth: 26, halign: 'right', fontStyle: 'bold' }
        }
      : {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 24, fontStyle: 'bold' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 32, halign: 'center', fontStyle: 'bold' }
        },
    margin: { left: 14, right: 14 }
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 150;

  // 4. Financial & Commercial Conditions Summary (if prices shown)
  if (showPrices && finalY < 230) {
    // Commercial Terms (Left Box)
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(14, finalY + 6, 85, 34, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, finalY + 6, 85, 34, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 69, 49);
    doc.text('CONDIÇÕES COMERCIAIS:', 18, finalY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Pagamento: ${paymentTerms}`, 18, finalY + 18);
    doc.text(`• Validade: ${validityDays}`, 18, finalY + 24);
    doc.text('• Despacho / Frete: A combinar com o vendedor', 18, finalY + 30);
    doc.text('• Garantia: 100% Original JCV Jardinagem', 18, finalY + 36);

    // Totals Box (Right Box)
    const totalsX = pageWidth - 90;
    doc.setFillColor(244, 247, 245);
    doc.roundedRect(totalsX, finalY + 6, 76, 34, 2, 2, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.roundedRect(totalsX, finalY + 6, 76, 34, 2, 2, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('Subtotal Tabela:', totalsX + 4, finalY + 13);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(totals.subtotalItensSemDesconto), pageWidth - 18, finalY + 13, { align: 'right' });

    if (totals.descontoTotalItens > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(225, 29, 72);
      doc.text('Desconto em Itens:', totalsX + 4, finalY + 18);
      doc.setFont('helvetica', 'bold');
      doc.text(`- ${formatCurrency(totals.descontoTotalItens)}`, pageWidth - 18, finalY + 18, { align: 'right' });
    }

    if (totals.valorDescontoGlobal > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(225, 29, 72);
      doc.text(`Desc. Pedido (${totals.discGlobalPercent}%):`, totalsX + 4, finalY + 23);
      doc.setFont('helvetica', 'bold');
      doc.text(`- ${formatCurrency(totals.valorDescontoGlobal)}`, pageWidth - 18, finalY + 23, { align: 'right' });
    }

    // Net Total Highlight
    doc.setFillColor(15, 69, 49);
    doc.rect(totalsX, finalY + 27, 76, 13, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('TOTAL LÍQUIDO:', totalsX + 4, finalY + 35);
    doc.setFontSize(11);
    doc.text(formatCurrency(totals.totalFinalLiquido), pageWidth - 18, finalY + 35, { align: 'right' });
  }

  // 5. Signature Area at the bottom
  const sigY = Math.min(270, Math.max(finalY + 46, 260));
  doc.setDrawColor(180, 190, 185);
  doc.line(20, sigY, 90, sigY);
  doc.line(pageWidth - 90, sigY, pageWidth - 20, sigY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(sellerName, 55, sigY + 4, { align: 'center' });
  doc.text(clientInfo.nome || 'Assinatura do Cliente', pageWidth - 55, sigY + 4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('JCV Jardinagem / Rawell Química Oficial', 55, sigY + 8, { align: 'center' });
  doc.text('De Acordo com a Proposta Comercial', pageWidth - 55, sigY + 8, { align: 'center' });

  return doc;
}

export function downloadProposalPdf(options: GeneratePdfOptions) {
  const doc = generateProposalPdf(options);
  const fileName = `Proposta-JCV-Jardinagem-${options.proposalNumber}.pdf`;
  doc.save(fileName);
}

/**
 * Gera e faz download do PDF renderizando diretamente o elemento HTML timbrado da tela.
 * Suporta 100% de Tailwind CSS v4 (incluindo cores oklch) com paridade visual com o botao de Imprimir.
 */
export async function downloadElementAsPdf(element: HTMLElement, proposalNumber: string): Promise<boolean> {
  try {
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true
    });

    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve, reject) => {
      img.onload = () => resolve(true);
      img.onerror = reject;
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const margin = 8; // 8mm margem
    const contentWidth = pdfWidth - (margin * 2); // 194mm
    const contentHeight = (img.height * contentWidth) / img.width;

    // Se couber em 1 pagina
    if (contentHeight <= (pdfHeight - (margin * 2))) {
      pdf.addImage(dataUrl, 'PNG', margin, margin, contentWidth, contentHeight);
    } else {
      // Paginacao caso a tabela seja muito longa
      let heightLeft = contentHeight;
      let position = margin;

      pdf.addImage(dataUrl, 'PNG', margin, position, contentWidth, contentHeight);
      heightLeft -= (pdfHeight - margin);

      while (heightLeft > 0) {
        position = heightLeft - contentHeight + margin;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', margin, position, contentWidth, contentHeight);
        heightLeft -= (pdfHeight - (margin * 2));
      }
    }

    const fileName = `Proposta-JCV-Jardinagem-${proposalNumber}.pdf`;
    pdf.save(fileName);
    return true;
  } catch (err) {
    console.error('Erro ao gerar PDF via html-to-image:', err);
    return false;
  }
}
