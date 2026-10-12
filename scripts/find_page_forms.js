const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'src', 'app');
const entries = fs.readdirSync(appDir);

for (const entry of entries) {
  const p = path.join(appDir, entry, 'page.jsx');
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    const hasForm = content.includes('<form');
    const hasDexign = content.includes('dexignzone.com');
    const hasRelativeBg = content.includes('url(images/') || content.includes('url(/images/');
    if (hasForm || hasDexign || hasRelativeBg) {
      console.log(`[${entry}] Form: ${hasForm} | DexignZone URL: ${hasDexign} | Broken BG path: ${hasRelativeBg}`);
    }
  }
}
