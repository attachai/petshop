const fs = require('fs');
const lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
const newLines = [...lines.slice(0, 17), ...lines.slice(102)];
fs.writeFileSync('src/App.tsx', newLines.join('\n'));
