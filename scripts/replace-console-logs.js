/**
 * Script pour remplacer automatiquement les console.log par le système de logging sécurisé
 * Usage: node scripts/replace-console-logs.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, '..', 'src');
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Patterns de remplacement
const REPLACEMENTS = [
  {
    pattern: /console\.log\(/g,
    replacement: 'log.debug(',
    comment: '// Remplacement: console.log → log.debug'
  },
  {
    pattern: /console\.error\(/g,
    replacement: 'log.error(',
    comment: '// Remplacement: console.error → log.error'
  },
  {
    pattern: /console\.warn\(/g,
    replacement: 'log.warn(',
    comment: '// Remplacement: console.warn → log.warn'
  },
  {
    pattern: /console\.info\(/g,
    replacement: 'log.info(',
    comment: '// Remplacement: console.info → log.info'
  }
];

/**
 * Récupère tous les fichiers à traiter
 */
function getFilesToProcess(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Traite un fichier et remplace les console statements
 */
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  let needsImport = false;
  
  // Vérifier si le fichier contient des console statements
  const hasConsoleStatements = REPLACEMENTS.some(({ pattern }) => pattern.test(content));
  
  if (!hasConsoleStatements) {
    return { hasChanges: false, needsImport: false };
  }
  
  // Appliquer les remplacements
  for (const { pattern, replacement, comment } of REPLACEMENTS) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      hasChanges = true;
      needsImport = true;
      
      // Ajouter un commentaire au début du fichier si nécessaire
      if (!content.includes(comment)) {
        content = `// ${comment}\n${content}`;
      }
    }
  }
  
  // Ajouter l'import du logger si nécessaire
  if (needsImport && !content.includes("import { log }")) {
    // Trouver la première ligne d'import
    const lines = content.split('\n');
    let insertIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        insertIndex = i + 1;
      }
    }
    
    // Insérer l'import du logger
    lines.splice(insertIndex, 0, "import { log } from '../utils/logger';");
    content = lines.join('\n');
  }
  
  return { content, hasChanges, needsImport };
}

/**
 * Fonction principale
 */
function main() {
  console.log('🔍 Recherche des fichiers à traiter...');
  
  const files = getFilesToProcess(SRC_DIR);
  console.log(`📁 ${files.length} fichiers trouvés`);
  
  let processedFiles = 0;
  let modifiedFiles = 0;
  
  for (const filePath of files) {
    const relativePath = path.relative(process.cwd(), filePath);
    
    try {
      const result = processFile(filePath);
      
      if (result.hasChanges) {
        fs.writeFileSync(filePath, result.content, 'utf8');
        modifiedFiles++;
        console.log(`✅ Modifié: ${relativePath}`);
      }
      
      processedFiles++;
    } catch (error) {
      console.error(`❌ Erreur lors du traitement de ${relativePath}:`, error.message);
    }
  }
  
  console.log('\n📊 Résumé:');
  console.log(`   Fichiers traités: ${processedFiles}`);
  console.log(`   Fichiers modifiés: ${modifiedFiles}`);
  
  if (modifiedFiles > 0) {
    console.log('\n✨ Remplacement terminé!');
    console.log('💡 N\'oubliez pas de tester votre application après ces modifications.');
  } else {
    console.log('\n✨ Aucune modification nécessaire.');
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { processFile, getFilesToProcess };
