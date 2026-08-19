const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const oldContent = content;
      
      // regex to remove dark: classes, including ones like dark:hover:text-blue-400
      content = content.replace(/\s*dark:[a-zA-Z0-9\-/_\[\]#%:]+/g, '');
      
      // remove useTheme or ThemeContext if still imported
      content = content.replace(/import\s*{\s*(?:ThemeContext|ThemeProvider|useTheme)(?:\s*,\s*(?:ThemeContext|ThemeProvider|useTheme))*\s*}\s*from\s*['"].*?ThemeContext(?:.jsx)?['"];?\n?/g, '');
      
      // Remove <ThemeProvider> wrappers
      content = content.replace(/<\/?ThemeProvider>/g, '');
      
      if (oldContent !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log("Done.");
