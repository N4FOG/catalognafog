// =============================================================
//  RAWELL QUÍMICA — Motor de Geração de Flyers Ao Vivo (1080x1920)
// =============================================================

let contextoAtual = null;
let imagemProdutoAtual = null;
let categoriaFiltroContexto = 'todos';

document.addEventListener('DOMContentLoaded', () => {
  initContextosUI();
  initUploadHandler();
  initCatalogoShortcuts();
  initFormInputs();

  // Selecionar o Contexto 1 por padrão
  if (typeof CONTEXTOS_CENARIOS !== 'undefined' && CONTEXTOS_CENARIOS.length > 0) {
    selecionarContexto(CONTEXTOS_CENARIOS[0].id);
  }

  // Se houver produto padrão no catálogo, carregar como inicial
  if (typeof PRODUTOS !== 'undefined' && PRODUTOS.length > 0) {
    const params = new URLSearchParams(window.location.search);
    const paramId = parseInt(params.get('id'));
    const prod = (paramId && PRODUTOS.find(p => p.id === paramId)) ? PRODUTOS.find(p => p.id === paramId) : PRODUTOS[0];
    
    carregarProdutoDoCatalogo(prod);
  }
});

// ── 1. Inicialização dos 35 Contextos ────────────────────────
function initContextosUI() {
  renderContextosGrid();

  // Filtros de Categoria dos Contextos
  document.querySelectorAll('.cat-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      categoriaFiltroContexto = btn.dataset.cat;
      renderContextosGrid();
    });
  });

  // Busca rápida de contexto
  const searchInput = document.getElementById('search-contexto');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderContextosGrid(searchInput.value.trim().toLowerCase());
    });
  }
}

function renderContextosGrid(termo = '') {
  const container = document.getElementById('contextos-grid');
  if (!container || typeof CONTEXTOS_CENARIOS === 'undefined') return;

  let lista = CONTEXTOS_CENARIOS;

  if (categoriaFiltroContexto !== 'todos') {
    lista = lista.filter(c => c.categoria === categoriaFiltroContexto);
  }

  if (termo) {
    lista = lista.filter(c => 
      c.titulo.toLowerCase().includes(termo) || 
      c.descricao.toLowerCase().includes(termo) ||
      c.categoria.toLowerCase().includes(termo)
    );
  }

  container.innerHTML = lista.map(c => {
    const isSelected = contextoAtual && contextoAtual.id === c.id;
    return `
      <div class="ctx-item ${isSelected ? 'active' : ''}" onclick="selecionarContexto(${c.id})" data-id="${c.id}">
        <div class="ctx-preview" style="background: linear-gradient(135deg, ${c.bg.top}, ${c.bg.mid});">
          <span class="ctx-icon">${c.icone}</span>
        </div>
        <div class="ctx-info">
          <strong class="ctx-title">${c.titulo}</strong>
          <span class="ctx-cat">${c.categoria}</span>
        </div>
      </div>
    `;
  }).join('');
}

function selecionarContexto(id) {
  const ctx = CONTEXTOS_CENARIOS.find(c => c.id === id);
  if (!ctx) return;

  contextoAtual = ctx;

  // Atualizar seleção visual
  document.querySelectorAll('.ctx-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.id) === id);
  });

  const activeLabel = document.getElementById('contexto-ativo-nome');
  if (activeLabel) {
    activeLabel.textContent = `${ctx.icone} ${ctx.titulo}`;
  }

  desenharFlyerAoVivo();
}

// ── 2. Gerenciamento de Upload de Foto ────────────────────────
function initUploadHandler() {
  const fileInput = document.getElementById('input-foto-produto');
  const dropZone = document.getElementById('upload-dropzone');

  if (!fileInput || !dropZone) return;

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      processarArquivoImagem(e.target.files[0]);
    }
  });

  // Drag & Drop
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processarArquivoImagem(e.dataTransfer.files[0]);
    }
  });
}

function processarArquivoImagem(file) {
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      imagemProdutoAtual = img;
      atualizarThumbUpload(e.target.result, file.name);
      desenharFlyerAoVivo();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function atualizarThumbUpload(src, nome) {
  const preview = document.getElementById('upload-preview-wrap');
  const empty = document.getElementById('upload-empty-wrap');
  const thumb = document.getElementById('upload-thumb-img');
  const nameLabel = document.getElementById('upload-filename');

  if (preview && empty && thumb) {
    thumb.src = src;
    if (nameLabel) nameLabel.textContent = nome || 'Imagem carregada';
    preview.style.display = 'flex';
    empty.style.display = 'none';
  }
}

function removerImagemUpload() {
  imagemProdutoAtual = null;
  const fileInput = document.getElementById('input-foto-produto');
  if (fileInput) fileInput.value = '';

  const preview = document.getElementById('upload-preview-wrap');
  const empty = document.getElementById('upload-empty-wrap');
  if (preview && empty) {
    preview.style.display = 'none';
    empty.style.display = 'flex';
  }
  desenharFlyerAoVivo();
}

// ── 3. Atalhos do Catálogo Rawell ────────────────────────────
function initCatalogoShortcuts() {
  const select = document.getElementById('catalogo-quick-select');
  if (!select || typeof PRODUTOS === 'undefined') return;

  select.innerHTML = '<option value="">-- Ou escolha um produto pronto da Rawell --</option>' + 
    PRODUTOS.map(p => `<option value="${p.id}">${p.nome} (${p.referencia})</option>`).join('');

  select.addEventListener('change', (e) => {
    const id = parseInt(e.target.value);
    if (!id) return;
    const prod = PRODUTOS.find(p => p.id === id);
    if (prod) carregarProdutoDoCatalogo(prod);
  });
}

function carregarProdutoDoCatalogo(prod) {
  document.getElementById('input-nome-produto').value = prod.nome;
  
  // Preencher textos adicionais sugeridos
  document.getElementById('input-texto-1').value = prod.caracteristicas?.[0] || prod.alvos?.[0] || 'Ação Sistêmica Profunda';
  document.getElementById('input-texto-2').value = prod.caracteristicas?.[1] || prod.alvos?.[1] || 'Elimina pela Raiz sem Danificar';
  document.getElementById('input-texto-3').value = prod.caracteristicas?.[2] || `Ref: ${prod.referencia} • ${prod.unidade}`;
  document.getElementById('input-observacao').value = prod.destaque ? '★ PRODUTO EM DESTAQUE NA LINHA 2026' : '🌿 LINHA PROFISSIONAL RAWELL';

  // Carregar imagem
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    imagemProdutoAtual = img;
    atualizarThumbUpload(prod.imagens[0], prod.nome);
    desenharFlyerAoVivo();
  };
  img.src = prod.imagens[0];
}

// ── 4. Listeners dos Campos de Texto ─────────────────────────
function initFormInputs() {
  const campos = [
    'input-nome-produto',
    'input-texto-1',
    'input-texto-2',
    'input-texto-3',
    'input-observacao',
    'input-detalhe'
  ];

  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        desenharFlyerAoVivo();
      });
    }
  });
}

// ── 5. MOTOR DE COMPOSIÇÃO AO VIVO NO CANVAS (1080 x 1920) ───
function desenharFlyerAoVivo() {
  const canvas = document.getElementById('flyerCanvas');
  if (!canvas || !contextoAtual) return;

  const ctx = canvas.getContext('2d');
  const W = 1080;
  const H = 1920;

  canvas.width = W;
  canvas.height = H;

  // Obter valores dos inputs
  const nomeProduto = document.getElementById('input-nome-produto')?.value.trim() || 'NOME DO SEU PRODUTO';
  const texto1 = document.getElementById('input-texto-1')?.value.trim() || '';
  const texto2 = document.getElementById('input-texto-2')?.value.trim() || '';
  const texto3 = document.getElementById('input-texto-3')?.value.trim() || '';
  const observacao = document.getElementById('input-observacao')?.value.trim() || '';
  const detalhe = document.getElementById('input-detalhe')?.value.trim() || 'WhatsApp: (45) 99933-2563';

  const cfg = contextoAtual.bg;

  // ── 1. FUNDO DO CONTEXTO FOTOGRÁFICO ────────────────────────
  // Gradiente atmosférico do cenário
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, cfg.top);
  bgGrad.addColorStop(0.35, cfg.mid);
  bgGrad.addColorStop(0.7, cfg.top);
  bgGrad.addColorStop(1, cfg.bot);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Luz volumétrica / Glow do cenário atrás do produto
  const spotlight = ctx.createRadialGradient(W / 2, 700, 50, W / 2, 700, 540);
  spotlight.addColorStop(0, cfg.glow);
  spotlight.addColorStop(0.6, 'rgba(0, 0, 0, 0.05)');
  spotlight.addColorStop(1, 'transparent');
  ctx.fillStyle = spotlight;
  ctx.fillRect(0, 0, W, H);

  // Efeito de Partículas / Bokeh de Luz no fundo
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = 0; i < 16; i++) {
    const bx = (i * 137) % W;
    const by = (i * 223) % 900 + 100;
    const br = ((i * 31) % 40) + 10;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // ── 2. CABEÇALHO DO FLYER ──────────────────────────────────
  ctx.save();
  ctx.textAlign = 'center';

  // Badge da Categoria / Tag Superior
  const tagText = (observacao || cfg.tag).toUpperCase();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  roundRect(ctx, W / 2 - 280, 85, 560, 54, 27);
  ctx.fill();
  ctx.strokeStyle = cfg.accent;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = cfg.accent;
  ctx.fillText(tagText, W / 2, 120);

  // Logo da Marca
  ctx.font = '900 44px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('RAWELL QUÍMICA 2026', W / 2, 195);

  // Contexto Nome Sutil
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fillText(contextoAtual.icone + ' ' + contextoAtual.titulo.toUpperCase(), W / 2, 230);
  ctx.restore();

  // ── 3. SHOWCASE DA FOTO DO PRODUTO ─────────────────────────
  const prodCardX = 130;
  const prodCardY = 280;
  const prodCardW = 820;
  const prodCardH = 740;

  // Sombra de Superfície e Pedestal
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(W / 2, prodCardY + prodCardH - 40, 320, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Moldura Glassmorphism de Destaque
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  roundRect(ctx, prodCardX, prodCardY, prodCardW, prodCardH, 36);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Renderizar a Imagem do Produto
  if (imagemProdutoAtual && imagemProdutoAtual.complete) {
    const pad = 50;
    const maxW = prodCardW - pad * 2;
    const maxH = prodCardH - pad * 2;

    const hRatio = maxW / imagemProdutoAtual.width;
    const vRatio = maxH / imagemProdutoAtual.height;
    const ratio = Math.min(hRatio, vRatio);

    const drawW = imagemProdutoAtual.width * ratio;
    const drawH = imagemProdutoAtual.height * ratio;
    const drawX = prodCardX + (prodCardW - drawW) / 2;
    const drawY = prodCardY + (prodCardH - drawH) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    ctx.drawImage(imagemProdutoAtual, drawX, drawY, drawW, drawH);
    ctx.restore();
  } else {
    // Placeholder se nenhuma imagem foi anexada
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('📷 Anexe a foto do seu produto', W / 2, prodCardY + prodCardH / 2);
    ctx.restore();
  }

  // ── 4. NOME DO PRODUTO (DESTAQUE MÁXIMO) ────────────────────
  ctx.save();
  ctx.textAlign = 'center';

  // Sombra de texto para contraste total
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 4;

  ctx.font = '900 60px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';

  let titleText = nomeProduto;
  if (titleText.length > 28) {
    ctx.font = '900 50px "Plus Jakarta Sans", sans-serif';
  }
  ctx.fillText(titleText, W / 2, 1090);
  ctx.restore();

  // ── 5. CARDS DOS TEXTOS ADICIONAIS (1, 2 e 3) ──────────────
  const textosAdicionais = [texto1, texto2, texto3].filter(Boolean);
  let startY = 1150;
  const itemH = 88;
  const gap = 18;

  textosAdicionais.forEach((txt, i) => {
    const y = startY + i * (itemH + gap);
    const x = 90;
    const w = 900;

    ctx.save();
    // Card com vidro e sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 15;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    roundRect(ctx, x, y, w, itemH, 20);
    ctx.fill();

    ctx.strokeStyle = cfg.accent;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Checkmark Verde
    const checkX = x + 50;
    const checkY = y + itemH / 2;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(checkX, checkY, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('✓', checkX, checkY + 7);

    // Texto do Benefício
    ctx.font = '700 27px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';

    let formattedTxt = txt;
    if (formattedTxt.length > 46) formattedTxt = formattedTxt.slice(0, 44) + '...';
    ctx.fillText(formattedTxt, x + 95, y + 55);

    ctx.restore();
  });

  // ── 6. RODAPÉ DE CONVERSÃO / DETALHE / WHATSAPP ────────────
  const ctaX = 80;
  const ctaY = 1620;
  const ctaW = 920;
  const ctaH = 210;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 15;

  const ctaGrad = ctx.createLinearGradient(ctaX, ctaY, ctaX + ctaW, ctaY + ctaH);
  ctaGrad.addColorStop(0, '#25d366');
  ctaGrad.addColorStop(1, '#128c7e');
  ctx.fillStyle = ctaGrad;
  roundRect(ctx, ctaX, ctaY, ctaW, ctaH, 28);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Textos dentro da Barra de Ação
  ctx.save();
  ctx.textAlign = 'center';

  ctx.font = '800 25px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fillText('SOLICITE SEU ORÇAMENTO PELO WHATSAPP', W / 2, ctaY + 62);

  ctx.font = '900 50px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('📱 ' + detalhe, W / 2, ctaY + 125);

  ctx.font = '700 21px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText('Rawell Química • Atendimento Comercial Oficial 2026', W / 2, ctaY + 172);

  ctx.restore();
}

// ── 6. FUNÇÕES AUXILIARES E AÇÕES ────────────────────────────
function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === 'undefined') radius = 5;
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
}

// 1. Download do Flyer PNG (1080x1920)
function baixarFlyerHD() {
  const canvas = document.getElementById('flyerCanvas');
  if (!canvas) return;

  const nome = document.getElementById('input-nome-produto')?.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '-') || 'flyer';
  const nomeArquivo = `rawell-flyer-${nome}-${Date.now()}.png`;

  const link = document.createElement('a');
  link.download = nomeArquivo;
  link.href = canvas.toDataURL('image/png', 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  mostrarToast('📥 Flyer HD (1080x1920) baixado com sucesso!');
}

// 2. Compartilhar Direto no Status do WhatsApp / Redes
function compartilharStatus() {
  const canvas = document.getElementById('flyerCanvas');
  if (!canvas) return;

  canvas.toBlob((blob) => {
    if (!blob) {
      baixarFlyerHD();
      return;
    }

    const file = new File([blob], 'rawell-flyer-status.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'Flyer Rawell Química 2026',
        text: 'Confira nossas soluções agrícolas e de controle de pragas.'
      }).then(() => {
        mostrarToast('🎉 Compartilhado com sucesso!');
      }).catch((err) => {
        if (err.name !== 'AbortError') baixarFlyerHD();
      });
    } else {
      baixarFlyerHD();
      mostrarToast('📲 Flyer baixado! Abra o WhatsApp para postar no seu Status.');
    }
  }, 'image/png', 1.0);
}

// 3. Copiar Flyer para Área de Transferência
function copiarFlyer() {
  const canvas = document.getElementById('flyerCanvas');
  if (!canvas) return;

  canvas.toBlob((blob) => {
    if (!blob) return;
    try {
      navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]).then(() => {
        mostrarToast('📋 Imagem copiada para a área de transferência!');
      }).catch(() => {
        baixarFlyerHD();
      });
    } catch {
      baixarFlyerHD();
    }
  }, 'image/png', 1.0);
}

function mostrarToast(msg) {
  let toast = document.getElementById('flyer-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'flyer-toast';
    toast.className = 'flyer-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
