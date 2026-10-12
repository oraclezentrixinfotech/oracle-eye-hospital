const fs = require('fs');
const path = require('path');

// Let's test using Next's babel or simple regex or acorn/esprima
const appDir = path.join(__dirname, '..', 'src', 'app');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllFiles(appDir);
let issues = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');

  // Check 1: "use client" must be line 1 if present
  const lines = content.split('\n');
  const useClientIndex = lines.findIndex(l => l.trim() === '"use client";' || l.trim() === "'use client';");
  if (useClientIndex > 0) {
    issues.push({ file, error: `"use client" is on line ${useClientIndex + 1}, but must be on line 1` });
  }

  // Check 2: <img ... alt className
  if (content.includes('alt className')) {
    issues.push({ file, error: 'Contains "alt className" missing quotes/value' });
  }

  // Check 3: unbalanced tags or syntax
  // Let's check common HTML copy-paste errors
  if (content.includes('class=')) {
    issues.push({ file, error: 'Contains class=' });
  }
}

console.log('Syntax issues found:', issues.length);
issues.forEach(i => console.log(`${path.relative(appDir, i.file)}: ${i.error}`));
