const https = require('https');

https.get('https://oracleeyehospital.com/Assets/js/custom.js', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const idx = data.indexOf('w3menu');
    if (idx !== -1) {
      console.log('w3menu in custom.js:');
      console.log(data.slice(idx - 100, idx + 500));
    } else {
      console.log('w3menu not found in custom.js');
      const naviconIdx = data.indexOf('navicon');
      if (naviconIdx !== -1) {
        console.log('navicon in custom.js:');
        console.log(data.slice(naviconIdx - 100, naviconIdx + 500));
      }
    }
  });
}).on('error', e => console.log(e.message));
