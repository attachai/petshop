const fs = require('fs');
const lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
const newLines = [...lines.slice(0, 640), ...lines.slice(1030)];
fs.writeFileSync('src/App.tsx', newLines.join('\n'));
