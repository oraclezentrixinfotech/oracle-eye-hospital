const http = require('http');

const routes = [
  '/',
  '/overview',
  '/chairman-message',
  '/doctor-team',
  '/girjesh-kain',
  '/rachana',
  '/ramesh-kumar',
  '/sujata-tomar',
  '/cataract-service',
  '/cornea-refractive-service',
  '/vitreoretinal-service',
  '/pediatric-eye-service',
  '/glaucoma-service',
  '/contact-lens-service',
  '/orthoptics-service',
  '/myopia-clinic',
  '/computer-vision-syndrome',
  '/our-facilities',
  '/our-events',
  '/video-gallery',
  '/news-paper',
  '/patient-reviews',
  '/contact-us',
  '/career',
  '/privacy-policy',
  '/terms-and-condition',
  '/blog',
  '/blog/cataract-surgery-cost-in-moradabad'
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3001${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const isOk = res.statusCode === 200;
        const hasError = data.includes('Internal Server Error') || data.includes('Unhandled Runtime Error');
        resolve({ route, status: res.statusCode, ok: isOk && !hasError });
      });
    }).on('error', (err) => {
      resolve({ route, status: 'CONN_ERR', ok: false, error: err.message });
    });
  });
}

async function run() {
  console.log(`Testing ${routes.length} routes against http://localhost:3001...`);
  let passed = 0;
  for (const r of routes) {
    const res = await checkRoute(r);
    if (res.ok) {
      console.log(`[PASS] ${res.route} (200 OK)`);
      passed++;
    } else {
      console.error(`[FAIL] ${res.route} -> Status: ${res.status}`);
    }
  }
  console.log(`\nResults: ${passed}/${routes.length} passed.`);
}

run();
