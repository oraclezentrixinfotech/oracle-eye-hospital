const https = require('https');

https.get('https://oracleeyehospital.com/Assets/js/custom.js', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const lines = data.split('\n');
    console.log(lines.slice(285, 315).join('\n'));
  });
});
