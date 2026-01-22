//not relevant anymore

// scripts/downloadItemIconsTwemoji.mjs
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const OUT_DIR = path.resolve('src/assets/content/items');

// Map: itemId -> a *single* emoji for Twemoji download
const ITEM_EMOJI = {
  hello: '👋',
  bye: '👋',
  yes: '✅',
  no: '❌',
  please: '🙏',
  thank_you: '💛',

  happy: '😀',
  sad: '😢',
  angry: '😠',
  scared: '😨',
  tired: '🥱',
  calm: '😌',

  clap: '👏',
  jump: '🦘',
  run: '🏃',
  stop: '🛑',
  listen: '👂',
  look: '👀',
  sit: '🪑',
  stand: '🧍',
};

function emojiToCodepoints(emoji) {
  // for..of iterates codepoints (handles surrogate pairs)
  const cps = [];
  for (const ch of emoji) {
    cps.push(ch.codePointAt(0).toString(16));
  }
  return cps.join('-');
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          res.resume();
          return;
        }
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const entries = Object.entries(ITEM_EMOJI);
  const failures = [];

  for (const [itemId, emoji] of entries) {
    const code = emojiToCodepoints(emoji).toLowerCase();
    const url = `https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/${code}.png`;
    const dest = path.join(OUT_DIR, `${itemId}.png`);

    try {
      await download(url, dest);
      console.log(`✅ ${itemId} <= ${emoji} (${code})`);
    } catch (e) {
      console.warn(`❌ ${itemId} failed: ${e.message}`);
      failures.push({ itemId, emoji, code, url });
    }
  }

  // Write credits + any failures
  const credits = [
    '# Credits',
    '',
    'Item icons downloaded from Twemoji (Twitter emoji assets).',
    'License: CC BY 4.0 (attribution required).',
    '',
    'Source repo: https://github.com/twitter/twemoji',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(OUT_DIR, 'CREDITS.md'), credits, 'utf-8');

  if (failures.length) {
    fs.writeFileSync(
      path.join(OUT_DIR, '_download_failures.json'),
      JSON.stringify(failures, null, 2),
      'utf-8'
    );
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
