#!/usr/bin/env node

// Script simple d'optimisation CSS pour GRID Extension
const fs = require('fs');
const path = require('path');

function optimizeCSS(cssContent) {
  return cssContent
    // Supprimer les commentaires multi-lignes
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Supprimer les commentaires de fin de ligne
    .replace(/\/\/.*$/gm, '')
    // Supprimer les espaces multiples
    .replace(/\s+/g, ' ')
    // Supprimer les espaces autour des accolades
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    // Supprimer les espaces autour des deux-points et point-virgules
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    // Supprimer les point-virgules avant les accolades fermantes
    .replace(/;}/g, '}')
    // Supprimer les espaces en début et fin
    .trim();
}

function main() {
  const cssPath = path.join(__dirname, '../src/popup/index.css');
  const cssMinPath = path.join(__dirname, '../src/popup/index.min.css');
  
  try {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const originalSize = Buffer.byteLength(cssContent, 'utf8');
    
    const optimizedCSS = optimizeCSS(cssContent);
    const optimizedSize = Buffer.byteLength(optimizedCSS, 'utf8');
    
    fs.writeFileSync(cssMinPath, optimizedCSS);
    
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log('✅ CSS optimized successfully!');
    console.log(`📊 Original size: ${originalSize} bytes`);
    console.log(`📊 Optimized size: ${optimizedSize} bytes`);
    console.log(`💾 Savings: ${savings}%`);
    console.log(`📁 Minified file: ${cssMinPath}`);
  } catch (error) {
    console.error('❌ Error optimizing CSS:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { optimizeCSS };