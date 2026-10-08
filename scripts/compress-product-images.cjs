const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'img', 'produtos');
const MAX_W = 800;
const QUALITY = 80;

async function run() {
  const files = fs.readdirSync(dir).filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f));
  let beforeTotal = 0, afterTotal = 0, changed = 0;
  const report = [];

  for (const f of files) {
    const fp = path.join(dir, f);
    const before = fs.statSync(fp).size;
    beforeTotal += before;

    try {
      const meta = await sharp(fp).metadata();
      const needsResize = meta.width > MAX_W;

      // Re-encode sempre (qualidade), redimensiona se largo demais
      // Lê via buffer (evita erro EBUSY/UNKNOWN do libvips ao reler o mesmo path no Windows)
      const buf = fs.readFileSync(fp);
      const pipeline = sharp(buf);
      if (needsResize) pipeline.resize({ width: MAX_W, withoutEnlargement: true });

      const outBuf = await pipeline.webp({ quality: QUALITY, effort: 6 }).toBuffer();
      const after = outBuf.length;

      // Só sobrescreve se realmente ficou menor (garantia contra piora)
      if (after < before) {
        const tmpPath = fp + '.tmp';
        fs.writeFileSync(tmpPath, outBuf);
        // Windows: rename falha com EPERM enquanto o antivírus/OneDrive segura o handle.
        // Tenta algumas vezes com backoff antes de desistir.
        let renamed = false, lastErr = null;
        for (let tent = 0; tent < 5; tent++) {
          try { fs.renameSync(tmpPath, fp); renamed = true; break; }
          catch (e) { lastErr = e; Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200 * (tent + 1)); }
        }
        if (!renamed) {
          // Fallback: copia o conteúdo (write por cima) e remove o tmp
          try { fs.copyFileSync(tmpPath, fp); fs.unlinkSync(tmpPath); renamed = true; }
          catch (e2) { lastErr = e2; }
        }
        if (!renamed) throw lastErr;
        afterTotal += after;
        changed++;
        report.push(`${f}: ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB${needsResize ? ` (${meta.width}px -> ${Math.min(meta.width, MAX_W)}px)` : ' (só re-encode)'}`);
      } else {
        afterTotal += before;
        report.push(`${f}: mantido (${(before/1024).toFixed(0)}KB, re-encode não melhorou)`);
      }
    } catch (e) {
      afterTotal += before;
      report.push(`${f}: ERRO ${e.message}`);
    }
  }

  console.log(report.join('\n'));
  console.log(`\n=== TOTAL: ${(beforeTotal/1048576).toFixed(2)}MB -> ${(afterTotal/1048576).toFixed(2)}MB (${changed}/${files.length} otimizadas) ===`);
}

run();
