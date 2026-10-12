const https = require('https');

https.get('https://oracleeyehospital.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /href="\/([a-zA-Z0-9\-_]+)"/g;
    const routes = new Set();
    let match;
    while ((match = regex.exec(data)) !== null) {
      routes.add(match[1]);
    }
    console.log(Array.from(routes).sort().join('\n'));
  });
}).on('error', err => console.error(err));
