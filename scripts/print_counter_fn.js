const https = require('https');

https.get('https://oracleeyehospital.com/Assets/js/custom.js', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const idx = data.indexOf('const counter = () => {');
    if (idx !== -1) {
      console.log(data.slice(idx, idx + 400));
    }
  });
});
