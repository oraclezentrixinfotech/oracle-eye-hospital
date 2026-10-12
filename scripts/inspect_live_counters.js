const https = require('https');

https.get('https://oracleeyehospital.com/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    // Look for counterup or counter scripts or markup
    const counterMatches = data.match(/<[^>]*counter[^>]*>[\s\S]*?<\/[^>]*>/gi);
    console.log('Counter elements:', counterMatches);
    
    // Look for counter HTML
    const section = data.match(/<section[^>]*about-wrapper[\s\S]*?<\/section>/i) || data.match(/25,?000[\s\S]{0,500}/i);
    console.log('Section around 25000:');
    if (section) console.log(section[0].slice(0, 1000));

    // Look for script tags
    const scriptMatches = data.match(/<script[^>]*>[\s\S]*?<\/script>/gi);
    if (scriptMatches) {
      for (const s of scriptMatches) {
        if (s.toLowerCase().includes('counter') || s.toLowerCase().includes('waypoints')) {
          console.log('Counter script found:', s);
        }
      }
    }
  });
});
