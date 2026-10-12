const fs = require('fs');
let c = fs.readFileSync('src/app/globals.css', 'utf8');
// Fix the literal backtick-r-n that got inserted
c = c.replace('width: 22px;`r`n    height: 2px;', 'width: 22px;\r\n    height: 2px;');
fs.writeFileSync('src/app/globals.css', c, 'utf8');
console.log('done:', c.includes('width: 22px;\r\n    height: 2px;') ? 'OK' : 'NOT FOUND');
