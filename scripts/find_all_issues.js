const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'src', 'app');
const publicDir = path.join(__dirname, '..', 'public');

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

const allFiles = getAllFiles(appDir);
console.log(`Scanning ${allFiles.length} files...`);

const issuesFound = [];
const missingImages = new Set();

for (const file of allFiles) {
  const relPath = path.relative(appDir, file);
  const content = fs.readFileSync(file, 'utf8');

  // Check HTML attributes that violate JSX (strictly case-sensitive where camelCase is required in JSX)
  const invalidAttrs = [
    { regex: /\bclass\s*=/g, name: 'class=' },
    { regex: /\ballowfullscreen\b/g, name: 'allowfullscreen (lowercase)' },
    { regex: /\breferrerpolicy\b/g, name: 'referrerpolicy (lowercase)' },
    { regex: /\bmaxlength\s*=/g, name: 'maxlength= (lowercase)' },
    { regex: /\bminlength\s*=/g, name: 'minlength= (lowercase)' },
    { regex: /<textpath\b/gi, name: '<textpath>' },
    { regex: /\boninput\s*=/gi, name: 'oninput=' },
    { regex: /\burl\(images\//g, name: 'url(images/' },
    { regex: /\bhttps?:\/\/[^'"`]*dexignzone\.com/g, name: 'dexignzone.com CDN' }
  ];

  for (const item of invalidAttrs) {
    if (item.regex.test(content)) {
      issuesFound.push({ file: relPath, issue: item.name });
    }
  }

  // Check image paths
  const imgMatches = content.matchAll(/(?:src|href|url)\s*[:=]\s*["'](\/Assets\/[^"']+)["']/g);
  for (const m of imgMatches) {
    const imgPath = m[1].split('?')[0].split('#')[0];
    const absPath = path.join(publicDir, imgPath.replace(/^\//, ''));
    if (!fs.existsSync(absPath)) {
      missingImages.add(imgPath);
    }
  }
}

console.log('--- ISSUES FOUND ---');
issuesFound.forEach(i => console.log(`${i.file}: ${i.issue}`));

console.log('\n--- MISSING IMAGES IN PUBLIC/ ---');
missingImages.forEach(img => console.log(img));
