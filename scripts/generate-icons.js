/**
 * Script para gerar ícones PWA a partir da logo principal
 * Redimensiona img/logo.png para os tamanhos necessários do PWA
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_LOGO = path.join(__dirname, '../img/logo.png');
const OUTPUT_DIR = path.join(__dirname, '../img');
const PUBLIC_OUTPUT_DIR = path.join(__dirname, '../public/img');

const SIZES = [
  { name: 'icon-192.png', size: 192, description: 'PWA small icon' },
  { name: 'icon-512.png', size: 512, description: 'PWA large icon' },
  { name: 'icon-maskable-512.png', size: 512, description: 'PWA maskable icon (with safe area)', maskable: true },
  { name: 'apple-touch-icon.png', size: 180, description: 'iOS home screen icon' }
];

async function generateIcons() {
  console.log('🎨 Gerando ícones PWA a partir da logo...\n');

  // Verifica se a logo existe
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error(`❌ Erro: Logo não encontrada em ${SOURCE_LOGO}`);
    process.exit(1);
  }

  // Cria diretórios se não existirem
  [OUTPUT_DIR, PUBLIC_OUTPUT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  for (const icon of SIZES) {
    console.log(`📐 Gerando ${icon.name} (${icon.size}x${icon.size}px) — ${icon.description}`);

    try {
      let pipeline = sharp(SOURCE_LOGO);

      // Para ícones maskable, adiciona padding (safe area de ~20%)
      if (icon.maskable) {
        const finalSize = icon.size;
        const logoSize = Math.floor(finalSize * 0.75); // Logo ocupa 75% (safe area de 25%)
        const padding = Math.floor((finalSize - logoSize) / 2);

        pipeline = pipeline
          .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 15, g: 69, b: 49, alpha: 1 } // #0f4531 brand green
          });
      } else {
        pipeline = pipeline.resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        });
      }

      // Salva em ambas as pastas
      const outputPathImg = path.join(OUTPUT_DIR, icon.name);
      const outputPathPublic = path.join(PUBLIC_OUTPUT_DIR, icon.name);

      await pipeline.clone().png().toFile(outputPathImg);
      await pipeline.clone().png().toFile(outputPathPublic);

      console.log(`   ✅ Salvo em img/ e public/img/\n`);
    } catch (err) {
      console.error(`   ❌ Erro ao gerar ${icon.name}:`, err.message, '\n');
    }
  }

  console.log('🎉 Todos os ícones foram gerados com sucesso!');
  console.log('\n📍 Arquivos criados:');
  SIZES.forEach(icon => {
    console.log(`   • img/${icon.name}`);
    console.log(`   • public/img/${icon.name}`);
  });
}

generateIcons().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
