/**
 * Download bird images from wingsearch GitHub repo.
 * Images are at: https://raw.githubusercontent.com/navarog/wingsearch/master/src/assets/images/birds/{id}.webp
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const idsFile = path.resolve(__dirname, 'bird-ids.txt');
const outDir = path.resolve(__dirname, '..', 'src/client/assets/birds');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const lines = fs.readFileSync(idsFile, 'utf8').trim().split('\n');
const birds = lines.map(line => {
  const [id, enumName] = line.split(':');
  return { id, enumName };
});

function download(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

async function main() {
  let success = 0;
  let fail = 0;
  const BATCH_SIZE = 10;

  for (let i = 0; i < birds.length; i += BATCH_SIZE) {
    const batch = birds.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map(async (bird) => {
      const outPath = path.join(outDir, `${bird.enumName}.webp`);
      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 100) {
        return; // already downloaded
      }
      const url = `https://raw.githubusercontent.com/navarog/wingsearch/master/src/assets/cards/birds/${bird.id}.webp`;
      const data = await download(url);
      fs.writeFileSync(outPath, data);
    }));

    for (const r of results) {
      if (r.status === 'fulfilled') success++;
      else {
        fail++;
        console.error(r.reason.message);
      }
    }
    process.stdout.write(`\r${i + batch.length}/${birds.length} processed`);
  }
  console.log(`\nDone: ${success} success, ${fail} failed`);
}

main().catch(console.error);
