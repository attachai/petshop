const fs = require('fs');
const lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
const newLines = [...lines.slice(0, 16), ...lines.slice(172)];
fs.writeFileSync('src/App.tsx', newLines.join('\n'));
