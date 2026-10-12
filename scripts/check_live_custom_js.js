const https = require('https');

https.get('https://oracleeyehospital.com/Assets/js/custom.js', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const lines = data.split('\n');
    const counterLines = lines.filter(l => l.toLowerCase().includes('counter'));
    console.log('Counter occurrences in custom.js:');
    counterLines.forEach(l => console.log(l));
  });
});
