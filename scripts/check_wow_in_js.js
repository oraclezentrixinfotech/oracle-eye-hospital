const https = require('https');

function checkFile(url) {
  https.get(url, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log(`Checking ${url}...`);
      if (data.includes('WOW')) {
        console.log(`Found WOW in ${url}!`);
        const idx = data.indexOf('WOW');
        console.log(data.slice(Math.max(0, idx - 100), idx + 200));
      } else {
        console.log(`WOW not in ${url}`);
      }
      if (data.includes('wowAnimation') || data.includes('handleWow') || data.includes('new WOW')) {
        console.log(`Found wow initialization in ${url}!`);
      }
    });
  });
}

checkFile('https://oracleeyehospital.com/Assets/js/custom.js');
checkFile('https://oracleeyehospital.com/Assets/js/global.min.js');
