const fs = require('fs');
const lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
const newLines = [...lines.slice(0, 18), ...lines.slice(168)];
fs.writeFileSync('src/App.tsx', newLines.join('\n'));
