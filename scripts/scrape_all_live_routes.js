const https = require('https');

https.get('https://oracleeyehospital.com/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const matches = data.matchAll(/href=[\"'](\/[a-zA-Z0-9_\-]+)[\"']/g);
    const set = new Set();
    for (const m of matches) {
      if (!m[1].startsWith('/Assets') && !m[1].startsWith('/css') && !m[1].startsWith('/js')) {
        set.add(m[1]);
      }
    }
    console.log('Unique internal routes from reference homepage:', Array.from(set).sort());
  });
});
