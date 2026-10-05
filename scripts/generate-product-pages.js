import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const indexPath = path.join(distDir, 'index.html');
const productsFilePath = path.join(rootDir, 'src', 'data', 'products.ts');

function slugify(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function run() {
  if (!fs.existsSync(indexPath)) {
    console.error('❌ dist/index.html não encontrado. Execute o vite build primeiro.');
    process.exit(1);
  }

  if (!fs.existsSync(productsFilePath)) {
    console.error('❌ src/data/products.ts não encontrado.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf-8');
  const productsContent = fs.readFileSync(productsFilePath, 'utf-8');

  const eqIndex = productsContent.indexOf('=', productsContent.indexOf('PRODUTOS'));
  const startIndex = productsContent.indexOf('[', eqIndex);
  const endIndex = productsContent.lastIndexOf(']');
  const jsonText = productsContent.substring(startIndex, endIndex + 1);

  let produtos;
  try {
    produtos = JSON.parse(jsonText);
  } catch (err) {
    console.error('❌ Erro ao parsear produtos de src/data/products.ts:', err.message);
    process.exit(1);
  }

  let count = 0;

  for (const prod of produtos) {
    const slug = slugify(prod.nome);
    if (!slug) continue;

    const title = escapeHtml(`${prod.nome} — JCV Jardinagem`);
    const description = escapeHtml(prod.o_que_faz || prod.descricao || 'Consulte detalhes e bula no catálogo oficial JCV Jardinagem.');
    const imgRel = prod.imagens && prod.imagens[0] ? prod.imagens[0].replace(/^\/+/, '') : 'img/logo.png';
    const imgUrl = `https://catalognafog.onrender.com/${imgRel}`;
    const canonicalUrl = `https://catalognafog.onrender.com/p/${slug}`;

    const metaTags = `
    <base href="/" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <!-- Open Graph Especial para WhatsApp e Redes Sociais -->
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="JCV Jardinagem — Catálogo Oficial &amp; Orçamentos 2026" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imgUrl}" />
    <meta property="og:image:secure_url" content="${imgUrl}" />
    <meta property="og:image:type" content="image/webp" />
    <meta property="og:url" content="${canonicalUrl}" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imgUrl}" />
    <link rel="canonical" href="${canonicalUrl}" />`;

    // Remove tags globais de OpenGraph antigas para não duplicar
    let prodHtml = baseHtml
      .replace(/<title>.*?<\/title>/gi, '')
      .replace(/<meta\s+name=["']description["'].*?>/gi, '')
      .replace(/<meta\s+property=["']og:.*?["'].*?>/gi, '')
      .replace(/<meta\s+name=["']twitter:.*?["'].*?>/gi, '');

    prodHtml = prodHtml.replace('</head>', `${metaTags}\n  </head>`);

    // 1. /p/[slug]/index.html
    const pDir = path.join(distDir, 'p', slug);
    fs.mkdirSync(pDir, { recursive: true });
    fs.writeFileSync(path.join(pDir, 'index.html'), prodHtml, 'utf-8');

    // 2. /p/[slug].html
    fs.writeFileSync(path.join(distDir, 'p', `${slug}.html`), prodHtml, 'utf-8');

    // 3. /produto/[slug]/index.html
    const prodDir = path.join(distDir, 'produto', slug);
    fs.mkdirSync(prodDir, { recursive: true });
    fs.writeFileSync(path.join(prodDir, 'index.html'), prodHtml, 'utf-8');

    count++;
  }

  console.log(`\n📸 [WhatsApp Preview] ${count} páginas de produtos geradas com sucesso em /dist/p/ e /dist/produto/!\n`);
}

run();
