const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchMain(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const m = data.match(/<main[^>]*class="[^"]*page-content[^"]*"[^>]*>([\s\S]*?)<\/main>/i);
        if (m) {
          resolve(m[1]);
        } else {
          resolve('');
        }
      });
    }).on('error', err => resolve(''));
  });
}

async function test() {
  const routesToTest = ['awards', 'career', 'photo-gallery', 'doctor-team', 'cataract-service'];
  for (const r of routesToTest) {
    const liveContent = await fetchMain(`https://oracleeyehospital.com/${r}`);
    const localFile = path.join(__dirname, '..', 'src', 'app', r, 'page.jsx');
    const localContent = fs.existsSync(localFile) ? fs.readFileSync(localFile, 'utf8') : '';
    console.log(`=== Route: ${r} ===`);
    console.log(`Live length: ${liveContent.length} | Local length: ${localContent.length}`);
  }
}

test();
