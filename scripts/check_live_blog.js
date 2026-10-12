const https = require('https');

https.get('https://oracleeyehospital.com/blog', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const title = data.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    console.log('Title:', title ? title[1].trim() : 'No title');
    const bnr = data.match(/<div class=\"dz-bnr-inr[^\"]*\"[^>]*>[\s\S]*?<\/div>\s*<\/div>/i);
    console.log('Banner:', bnr ? bnr[0] : 'No banner');
    const articles = data.match(/<article[\s\S]*?<\/article>/gi) || data.match(/<div class=\"dz-card style-1[\s\S]*?<\/div>\s*<\/div>/gi);
    console.log('Cards count:', articles ? articles.length : 0);
  });
});
