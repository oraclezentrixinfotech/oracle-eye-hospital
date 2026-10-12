const fs = require('fs');
const path = require('path');
const https = require('https');

const routes = [
  'overview',
  'chairman-message',
  'board-of-directors',
  'awards',
  'publications',
  'doctor-team',
  'optometrist-team',
  'girjesh-kain',
  'rachana',
  'ramesh-kumar',
  'sujata-tomar',
  'cataract-service',
  'cornea-refractive-service',
  'computer-vision-syndrome',
  'dry-eyes-clinic',
  'contact-lens-service',
  'myopia-clinic',
  'pediatric-eye-service',
  'orthoptics-service',
  'vitreoretinal-service',
  'glaucoma-service',
  'CashlessFacility',
  'charitable-wings',
  'community-outreach',
  'comprehensive-internship-in-optometry',
  'career',
  'photo-gallery',
  'video-gallery',
  'testimonials',
  'news',
  'contact-us'
];

function fetchLive(route) {
  return new Promise((resolve) => {
    https.get(`https://oracleeyehospital.com/${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function analyze() {
  for (const r of routes) {
    const live = await fetchLive(r);
    const hasForm = live.includes('<form');
    const hasDexign = live.includes('dexignzone.com');
    const hasIframe = live.includes('<iframe');
    const hasGallery = live.includes('lightgallery') || live.includes('lg-item') || live.includes('popup-youtube');
    
    const localPath = path.join(__dirname, '..', 'src', 'app', r.toLowerCase(), 'page.jsx');
    const localContent = fs.existsSync(localPath) ? fs.readFileSync(localPath, 'utf8') : '';
    const localHasDexign = localContent.includes('dexignzone.com');

    console.log(`[${r}] Form: ${hasForm} | Iframe: ${hasIframe} | Gallery/Video: ${hasGallery} | DexignZone URL in local: ${localHasDexign}`);
  }
}

analyze();
