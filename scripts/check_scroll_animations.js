const https = require('https');

https.get('https://oracleeyehospital.com/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    // Check for aos or wow in scripts or stylesheets
    const links = data.match(/<link[^>]*>/gi) || [];
    console.log('CSS links with anim/aos/wow:');
    links.forEach(l => {
      if (/animate|aos|wow/i.test(l)) console.log(l);
    });

    const scripts = data.match(/<script[^>]*src=[\"']([^\"']+)[\"'][^>]*>/gi) || [];
    console.log('Scripts with anim/aos/wow:');
    scripts.forEach(s => {
      if (/animate|aos|wow/i.test(s)) console.log(s);
    });

    // Check custom.js or inline scripts for WOW / AOS
    const inlineScripts = data.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    console.log('Inline script snippets mentioning wow or aos:');
    inlineScripts.forEach(s => {
      if (/wow|aos/i.test(s)) console.log(s.slice(0, 300));
    });
  });
});
