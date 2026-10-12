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

function fetchPage(route) {
  return new Promise((resolve) => {
    https.get(`https://oracleeyehospital.com/${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ route, status: res.statusCode, html: data });
      });
    }).on('error', err => {
      resolve({ route, error: err.message });
    });
  });
}

async function run() {
  console.log(`Checking ${routes.length} pages...`);
  for (const route of routes) {
    const res = await fetchPage(route);
    const localDir = path.join(__dirname, '..', 'src', 'app', route.toLowerCase());
    const localFile = path.join(localDir, 'page.jsx');
    const exists = fs.existsSync(localFile);
    console.log(`[${route}] Live Status: ${res.status || res.error} | Local File: ${exists ? 'EXISTS' : 'MISSING'}`);
  }
}

run();
