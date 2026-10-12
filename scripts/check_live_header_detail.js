const https = require('https');

https.get('https://oracleeyehospital.com/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const idx = data.indexOf('<header');
    const idxEnd = data.indexOf('</header>');
    if (idx !== -1 && idxEnd !== -1) {
      const headerHtml = data.slice(idx, idxEnd + 9);
      console.log('Header length:', headerHtml.length);
      const navBlock = headerHtml.match(/<div[^>]*class=\"[^\"]*menu[^\"]*\"[^>]*>/gi);
      console.log('Menu divs:', navBlock);
      const w3menu = headerHtml.match(/id=\"W3Menu\"[^>]*>/i) || headerHtml.match(/<div[^>]*W3Menu[^>]*>/i);
      console.log('W3Menu element:', w3menu ? w3menu[0] : 'None');
    }
  });
}).on('error', e => console.log(e.message));
