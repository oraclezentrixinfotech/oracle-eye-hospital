const fs = require('fs');
let c = fs.readFileSync('src/app/globals.css', 'utf8');

// Find and fix the span block - try different line endings
const oldBlock = `  .w3menu-toggler.navicon span {\r\n    display: block;\r\n    width: 22px;\r\n    height: 2px;\r\n    background-color: #610B38;\r\n    border-radius: 2px;\r\n    transition: all 0.3s ease;\r\n  }`;

const newBlock = `  .w3menu-toggler.navicon span {\r\n    display: block;\r\n    width: 22px !important;\r\n    height: 2px !important;\r\n    background-color: #610B38;\r\n    border-radius: 2px;\r\n    transition: all 0.3s ease;\r\n    position: static !important;\r\n    top: auto !important;\r\n  }\r\n\r\n  /* Force all 3 lines to exact same 22x2 — overrides style.css nth-child rules */\r\n  .w3menu-toggler.navicon span:nth-child(1),\r\n  .w3menu-toggler.navicon span:nth-child(2),\r\n  .w3menu-toggler.navicon span:nth-child(3) {\r\n    width: 22px !important;\r\n    height: 2px !important;\r\n  }`;

if (c.includes(oldBlock)) {
  c = c.replace(oldBlock, newBlock);
  console.log('replaced with CRLF');
} else {
  // Try LF
  const oldLF = oldBlock.replace(/\r\n/g, '\n');
  const newLF = newBlock.replace(/\r\n/g, '\n');
  if (c.includes(oldLF)) {
    c = c.replace(oldLF, newLF);
    console.log('replaced with LF');
  } else {
    console.log('NOT FOUND — checking content:');
    const idx = c.indexOf('.w3menu-toggler.navicon span {');
    console.log('Found at index:', idx);
    console.log('Context:', JSON.stringify(c.substring(idx, idx + 200)));
  }
}

fs.writeFileSync('src/app/globals.css', c, 'utf8');
