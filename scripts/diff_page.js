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
        resolve(m ? m[1] : '');
      });
    }).on('error', err => resolve(''));
  });
}

async function run() {
  const live = await fetchMain('https://oracleeyehospital.com/career');
  const local = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'career', 'page.jsx'), 'utf8');

  console.log('--- LIVE SAMPLE (first 1000 chars) ---');
  console.log(live.substring(0, 1000));
  console.log('--- LOCAL SAMPLE (first 1000 chars) ---');
  console.log(local.substring(0, 1000));
}

run();
