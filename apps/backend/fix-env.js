
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
    let content = fs.readFileSync(envPath, 'utf8');
    // If it was UTF-16, 'utf8' read might look like garbage or be partial. 
    // But usually Node reads it ok-ish or we can detect BOM.
    // Converting to string and trimming.
    // If previously written with PowerShell echo, it might be UTF-16LE.

    // Let's try to read as buffer to be sure.
    const buf = fs.readFileSync(envPath);

    // Check for UTF-16LE BOM
    if (buf[0] === 0xFF && buf[1] === 0xFE) {
        console.log('Detected UTF-16LE BOM. Fixing...');
        content = buf.toString('utf16le');
    } else {
        content = buf.toString('utf8');
    }

    // Remove BOM if present in utf8 string from other tools
    content = content.replace(/^\uFEFF/, '');

    // Normalize line endings
    content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    fs.writeFileSync(envPath, content, 'utf8');
    console.log('Fixed .env encoding to UTF-8');
} catch (e) {
    console.error('Error fixing .env:', e);
}
