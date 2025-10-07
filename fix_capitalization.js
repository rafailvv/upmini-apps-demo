#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функция для исправления регистра в строке
function fixCapitalization(text) {
  // Исправляем строки в кавычках, которые начинаются с маленькой буквы
  return text.replace(/"([а-яё][^"]*)"/g, (match, content) => {
    if (content.length > 0) {
      const firstChar = content.charAt(0).toUpperCase();
      const rest = content.slice(1);
      return `"${firstChar}${rest}"`;
    }
    return match;
  });
}

// Функция для обработки файла
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixCapitalization(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Функция для рекурсивного обхода директорий
function processDirectory(dirPath) {
  let fixedCount = 0;
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Пропускаем node_modules и другие служебные папки
        if (item === 'node_modules' || item === '.git' || item === 'dist') {
          continue;
        }
        fixedCount += processDirectory(fullPath);
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.js'))) {
        if (processFile(fullPath)) {
          fixedCount++;
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message);
  }
  
  return fixedCount;
}

// Основная функция
function main() {
  const srcDir = path.join(__dirname, 'src');
  console.log('Starting capitalization fix...');
  
  const fixedCount = processDirectory(srcDir);
  
  console.log(`\nFixed ${fixedCount} files`);
  console.log('Capitalization fix completed!');
}

if (require.main === module) {
  main();
}

module.exports = { fixCapitalization, processFile, processDirectory };
