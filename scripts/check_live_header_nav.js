const https = require('https');

https.get('https://oracleeyehospital.com/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const nav = data.match(/<button[^>]*navicon[^>]*>[\s\S]*?<\/button>/i);
    console.log('Navicon button on live site:', nav ? nav[0] : 'None');
    const headerNav = data.match(/<div class=\"[^\"]*header-nav[^\"]*\"[^>]*>/i);
    console.log('Header-nav on live site:', headerNav ? headerNav[0] : 'None');
    const header = data.match(/<header[^>]*>/i);
    console.log('Header tag:', header ? header[0] : 'None');
  });
}).on('error', e => console.log('Error:', e.message));
