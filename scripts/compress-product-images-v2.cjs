// v2: gera os webp comprimidos numa pasta de SAÍDA separada (sem tocar nos originais),
// evitando o conflito de handles do Windows. A troca é feita depois via bash cp.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inDir = path.join(__dirname, '..', 'img', 'produtos');
const outDir = path.join(__dirname, '..', '..', 'rawell-v3-compressed', 'produtos');
fs.mkdirSync(outDir, { recursive: true });

const MAX_W = 800;
const QUALITY = 80;

async function run() {
  const files = fs.readdirSync(inDir).filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f));
  let beforeTotal = 0, afterTotal = 0, improved = 0;

  for (const f of files) {
    const fp = path.join(inDir, f);
    const before = fs.statSync(fp).size;
    beforeTotal += before;
    try {
      const meta = await sharp(fp).metadata();
      const pipeline = sharp(fp);
      if (meta.width > MAX_W) pipeline.resize({ width: MAX_W, withoutEnlargement: true });
      const outBuf = await pipeline.webp({ quality: QUALITY, effort: 6 }).toBuffer();
      if (outBuf.length < before) {
        fs.writeFileSync(path.join(outDir, f), outBuf);
        afterTotal += outBuf.length;
        improved++;
      } else {
        // não melhorou: mantém original
        fs.copyFileSync(fp, path.join(outDir, f));
        afterTotal += before;
      }
    } catch (e) {
      fs.copyFileSync(fp, path.join(outDir, f));
      afterTotal += before;
      console.log(`${f}: ERRO ${e.message} (original copiado)`);
    }
  }
  console.log(`Geradas ${improved}/${files.length} comprimidas em rawell-v3-compressed/produtos`);
  console.log(`Total: ${(beforeTotal/1048576).toFixed(2)}MB -> ${(afterTotal/1048576).toFixed(2)}MB`);
}
run();
