const fs = require('fs');
const path = require('path');
function fixFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixFiles(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Fix invalid self-closing tags with data-aos injected after the slash
            content = content.replace(/\/ data-aos="fade-up">/g, '/>');
            
            // Fix tags starting with p that aren't paragraph (like path)
            content = content.replace(/<(path|param|pre|picture)([^>]*?) data-aos="fade-up"([^>]*?)>/g, '<$1$2$3>');

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed:', fullPath);
            }
        }
    }
}
fixFiles(path.join(__dirname, 'src/app'));
