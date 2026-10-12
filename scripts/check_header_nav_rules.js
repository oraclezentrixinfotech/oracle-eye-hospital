const fs = require('fs');

const text = fs.readFileSync('public/Assets/css/style.css', 'utf8');
const lines = text.split('\n');
lines.forEach((l, i) => {
  if (l.includes('.header-nav') && (l.includes('show') || l.includes('fixed') || l.includes('open'))) {
    console.log(`Line ${i}: ${l}`);
  }
});
