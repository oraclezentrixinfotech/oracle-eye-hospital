const fs = require('fs');
const path = require('path');

function convertFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            convertFiles(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Replace wow classes with data-aos attributes
            // Replace className="wow fadeInUp" with data-aos="fade-up"
            content = content.replace(/className=(["'][^"']*)wow fadeInUp([^"']*["'])/g, 'className=$1$2 data-aos="fade-up"');
            content = content.replace(/className=(["'][^"']*)wow fadeInDown([^"']*["'])/g, 'className=$1$2 data-aos="fade-down"');
            content = content.replace(/className=(["'][^"']*)wow fadeInLeft([^"']*["'])/g, 'className=$1$2 data-aos="fade-left"');
            content = content.replace(/className=(["'][^"']*)wow fadeInRight([^"']*["'])/g, 'className=$1$2 data-aos="fade-right"');
            content = content.replace(/className=(["'][^"']*)wow zoomIn([^"']*["'])/g, 'className=$1$2 data-aos="zoom-in"');

            // Clean up empty classNames
            content = content.replace(/className=["']\s+["']/g, '');

            // Convert data-wow-delay="0.2s" to data-aos-delay="200"
            content = content.replace(/data-wow-delay=["']([\d\.]+)s["']/g, (match, p1) => {
                return `data-aos-delay="${parseInt(parseFloat(p1) * 1000)}"`;
            });

            // Convert data-wow-duration="0.8s" to data-aos-duration="800"
            content = content.replace(/data-wow-duration=["']([\d\.]+)s["']/g, (match, p1) => {
                return `data-aos-duration="${parseInt(parseFloat(p1) * 1000)}"`;
            });

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log(`Converted: ${fullPath}`);
            }
        }
    }
}

convertFiles(path.join(__dirname, 'src/app'));
