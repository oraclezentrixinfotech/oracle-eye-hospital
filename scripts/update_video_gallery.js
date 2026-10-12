const fs = require('fs');

const file = 'src/app/video-gallery/page.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/frameborder="0" allowfullscreen/g, 'style={{ border: 0 }} allowFullScreen');
fs.writeFileSync(file, content, 'utf8');
console.log('Video gallery updated successfully');
