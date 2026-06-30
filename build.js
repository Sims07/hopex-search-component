#!/usr/bin/env node
/**
 * Build script for Sniper Map
 * Updates README with working drag-and-drop code
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');

function build() {
    const srcPath = path.join(__dirname, 'sniper-map-v30.js');
    const readmePath = path.join(__dirname, 'README.md');
    
    // Read the source code
    const sourceCode = fs.readFileSync(srcPath, 'utf8');
    
    // Create a minified version for the drag-and-drop installer
    // We'll use a simple approach: remove comments and extra whitespace
    const minifiedCode = sourceCode
        .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove multi-line comments
        .replace(/\/\/[^\n]*/g, '')         // Remove single-line comments
        .replace(/\s+/g, ' ')               // Collapse whitespace
        .replace(/\s*([{};,:=+\-*/%<>!&|^~()\[\]])\s*/g, '$1')  // Remove spaces around operators
        .replace(/\s*\n\s*/g, '\n')        // Clean up newlines
        .trim();
    
    // Create the drag-and-drop installer code
    // This creates a button that, when clicked, executes the actual Sniper Map code
    const dragDropCode = `(function() {
    // Create a temporary button
    const btn = document.createElement('a');
    btn.href = "javascript:" + (function() {
        ${minifiedCode.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()}
    }).toString() + "()";
    btn.innerText = "🔭 INSTALLER SNIPER MAP V30";
    btn.style.cssText = "position:fixed;top:20px;right:20px;padding:20px;background:#0C419A;color:white;z-index:9999999;border-radius:8px;cursor:pointer;font-family:sans-serif;font-weight:bold;text-decoration:none;box-shadow:0 4px 6px rgba(0,0,0,0.2);";
    document.body.appendChild(btn);
    setTimeout(() => btn.remove(), 10000);
})();`;
    
    // Read README
    let readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // Replace Méthode 1 section - look for the section start
    const sectionStart = '### Méthode 1 : Glisser-déposer (recommandé)';
    const startIndex = readmeContent.indexOf(sectionStart);
    
    if (startIndex !== -1) {
        // Find the end of the current Méthode 1 section (either the old note or the new note)
        let endIndex = readmeContent.indexOf('### Méthode 2 : Installation manuelle du bookmarklet', startIndex);
        
        if (endIndex === -1) {
            console.error('❌ Could not find Méthode 2 section in README.md');
            process.exit(1);
        }
        
        const newSection = `${sectionStart}
1. Ouvrez **Mega Hopex** dans votre navigateur.
2. Ouvrez la console du navigateur (**F12** ou **Ctrl+Shift+I**).
3. Copiez-collez le code suivant dans la console et exécutez-le :

   \`\`\`javascript
   ${dragDropCode}
   \`\`\`

   > ⚠️ **Note** : Ce code affiche un bouton temporaire. Cliquez dessus pour installer Sniper Map.`;
        
        const updatedReadme = readmeContent.substring(0, startIndex) + 
                        newSection + 
                        readmeContent.substring(endIndex);
        
        fs.writeFileSync(readmePath, updatedReadme, 'utf8');
        console.log('✅ README.md updated successfully with working drag-and-drop code!');
        
        // Also save the minified version for reference
        fs.writeFileSync(path.join(__dirname, 'sniper-map-v30.min.js'), minifiedCode, 'utf8');
        console.log('✅ Minified version saved to sniper-map-v30.min.js');
        
        console.log(`\n📊 Statistics:`);
        const originalSize = fs.readFileSync(srcPath).length;
        const minifiedSize = minifiedCode.length;
        console.log(`   Original size: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`   Minified size: ${(minifiedSize / 1024).toFixed(2)} KB`);
        console.log(`   Compression: ${(minifiedSize / originalSize * 100).toFixed(1)}%`);
        
    } else {
        console.error('❌ Could not find Méthode 1 section in README.md');
        process.exit(1);
    }
}

build();
