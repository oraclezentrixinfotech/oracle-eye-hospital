const https = require('https');

https.get('https://oracleeyehospital.com/Assets/js/global.min.js', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const idx = data.lastIndexOf('COUNTERUP.MIN.JS');
    if (idx !== -1) {
      console.log(data.slice(idx, idx + 2000));
    }
  });
});
