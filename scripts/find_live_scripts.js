const https = require('https');

https.get('https://oracleeyehospital.com/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const scripts = data.match(/src=[\"']([^\"']*\.js[^\"']*)[\"']/gi);
    console.log('Scripts loaded on live site:', scripts);
  });
});
