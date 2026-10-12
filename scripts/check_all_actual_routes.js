const fs = require('fs');
const path = require('path');
const http = require('http');

const appDir = path.join(__dirname, '..', 'src', 'app');

function getAppRoutes(dir, baseRoute = '') {
  let routes = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file === 'api' || file === 'admin') continue;
      routes = routes.concat(getAppRoutes(full, `${baseRoute}/${file}`));
    } else if (file === 'page.jsx' || file === 'page.js') {
      if (!baseRoute.includes('[')) { // Skip dynamic catch-all for direct test
        routes.push(baseRoute === '' ? '/' : baseRoute);
      }
    }
  }
  return routes;
}

const allRoutes = getAppRoutes(appDir);
console.log(`Found ${allRoutes.length} static routes in src/app:`);
console.log(allRoutes);

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3001${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ route, status: res.statusCode });
      });
    }).on('error', (err) => {
      resolve({ route, status: 'ERR' });
    });
  });
}

async function testAll() {
  console.log('\n--- TESTING ALL INTERNAL ROUTES ---');
  let passed = 0;
  for (const r of allRoutes) {
    const res = await checkRoute(r);
    if (res.status === 200) {
      console.log(`[PASS] ${r} -> 200 OK`);
      passed++;
    } else {
      console.log(`[FAIL] ${r} -> ${res.status}`);
    }
  }
  console.log(`\nFinal Score: ${passed}/${allRoutes.length} pages passed (200 OK)`);
}

testAll();
