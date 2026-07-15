const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend/src/pages');

function fixFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.endsWith('.jsx')) {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf-8');
            
            // Remove imports
            content = content.replace(/import Header from ['"]\.\.\/components\/Header['"];?\n?/g, '');
            content = content.replace(/import Footer from ['"]\.\.\/components\/Footer['"];?\n?/g, '');
            
            // Remove components
            content = content.replace(/<Header \/>\n?/g, '');
            content = content.replace(/<Footer \/>\n?/g, '');
            
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Cleaned ${file}`);
        }
    }
}

fixFiles(pagesDir);
