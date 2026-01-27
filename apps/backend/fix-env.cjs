
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
    let content = fs.readFileSync(envPath, 'utf8');
    const buf = fs.readFileSync(envPath);

    if (buf[0] === 0xFF && buf[1] === 0xFE) {
        console.log('Detected UTF-16LE BOM. Fixing...');
        content = buf.toString('utf16le');
    } else {
        content = buf.toString('utf8');
    }

    content = content.replace(/^\uFEFF/, '');
    content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    fs.writeFileSync(envPath, content, 'utf8');
    console.log('Fixed .env encoding to UTF-8');
} catch (e) {
    console.error('Error fixing .env:', e);
}
