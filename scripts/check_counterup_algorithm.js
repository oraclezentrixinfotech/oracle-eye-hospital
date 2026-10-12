const https = require('https');

https.get('https://oracleeyehospital.com/Assets/js/global.min.js', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const idx = data.indexOf('counterUp');
    if (idx !== -1) {
      console.log('counterUp snippet:');
      console.log(data.slice(idx - 100, idx + 600));
    } else {
      console.log('counterUp not in global.min.js');
    }
  });
});
