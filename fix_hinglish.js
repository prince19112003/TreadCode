const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'lessons', 'python');

// Simple regex replacements for more professional/technical Hinglish
const replacements = [
  // Storage/Declaration
  { regex: /\b(ek dabba banaya|ek box banaya)\b/gi, replacement: "ek variable declare kiya" },
  { regex: /\bdabba banaya\b/gi, replacement: "variable declare kiya" },
  { regex: /\bdabba\b/gi, replacement: "variable" },
  { regex: /\busme (.*?) daal diya\b/gi, replacement: "usme $1 store kar diya" },
  { regex: /\bdaal diya\b/gi, replacement: "store kiya" },
  { regex: /\brakh(a|te|te hain)\b/gi, replacement: "store $1" },
  { regex: /\bnikla\b/gi, replacement: "fetch kiya" },
  
  // Printing/Display
  { regex: /\bscreen pe aa gaya\b/gi, replacement: "screen par print ho gaya" },
  { regex: /\bscreen pe dikhay(a|ega)\b/gi, replacement: "screen par display kiy$1" },
  { regex: /\bscreen par dekha\b/gi, replacement: "screen par display kiya" },
  
  // Execution
  { regex: /\bchal(ega|ata|a)\b/gi, replacement: "execute ho$1" },
  { regex: /\bkhatam\b/gi, replacement: "complete" },
  { regex: /\bshuru\b/gi, replacement: "start" },
  
  // Checking/Finding
  { regex: /\bmila\b/gi, replacement: "found hua" },
  { regex: /\bcheck kar(ega|ta|te) hai\b/gi, replacement: "evaluate kar$1 hai" },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const { regex, replacement } of replacements) {
    content = content.replace(regex, replacement);
  }

  // Also replace 'Computer ne "variable" naam ka ek variable banaya' which might result from 'dabba' replacement
  content = content.replace(/naam ka ek variable banaya/gi, "naam ka variable declare kiya");
  
  content = content.replace(/variable khula/gi, "variable read kiya");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

console.log('Starting Hinglish fix...');
processDirectory(targetDir);
console.log('Done!');
