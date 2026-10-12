const https = require('https');

https.get('https://oracleeyehospital.com/Assets/js/custom.js', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const lines = data.split('\n');
    lines.forEach((l, i) => {
      if (l.toLowerCase().includes('wow')) {
        console.log(`Line ${i}: ${l}`);
      }
    });
  });
}).on('error', (e) => {
  console.log('Error:', e.message);
});
