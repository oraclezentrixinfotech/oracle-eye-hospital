const fs = require('fs');
const path = require('path');

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
let fixedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix 1: Ensure "use client" is line 1 if present
  if (content.includes('"use client";') || content.includes("'use client';")) {
    const lines = content.split('\n');
    const idx = lines.findIndex(l => l.trim() === '"use client";' || l.trim() === "'use client';");
    if (idx > 0) {
      lines.splice(idx, 1);
      lines.unshift('"use client";');
      content = lines.join('\n');
      changed = true;
    }
  }

  // Fix 2: alt className -> alt="" className
  if (content.includes('alt className=')) {
    content = content.replace(/alt className=/g, 'alt="" className=');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    fixedCount++;
    console.log(`Fixed: ${path.relative(appDir, file)}`);
  }
}

console.log(`Successfully fixed ${fixedCount} files.`);
