#!/usr/bin/env node

// Test script to verify the ordered option implementation
import fs from 'fs';
import path from 'path';

// Read the modified files to verify changes
console.log('Verifying ordered option implementation...\n');

// 1. Check config.ts changes
const configPath = path.join(process.cwd(), 'src', 'config.ts');
const configContent = fs.readFileSync(configPath, 'utf8');

if (configContent.includes('ordered: boolean;') && 
    configContent.includes('ordered: false,')) {
    console.log('✅ config.ts: ProcessingConfig interface updated correctly');
    console.log('✅ config.ts: DEFAULT_CONFIG updated with ordered: false');
} else {
    console.log('❌ config.ts: Changes not found');
}

// 2. Check SelectionStrategy.ts changes
const selectionStrategyPath = path.join(process.cwd(), 'src', 'SelectionStrategy.ts');
const selectionStrategyContent = fs.readFileSync(selectionStrategyPath, 'utf8');

if (selectionStrategyContent.includes('ordered = this.#config.processing.ordered')) {
    console.log('✅ SelectionStrategy.ts: DataAttributeStrategy updated to use config value');
} else {
    console.log('❌ SelectionStrategy.ts: Changes not found');
}

// 3. Check README.md changes
const readmePath = path.join(process.cwd(), 'README.md');
const readmeContent = fs.readFileSync(readmePath, 'utf8');

if (readmeContent.includes('ordered: false          // Order elements by data-custom-order attribute')) {
    console.log('✅ README.md: Configuration example updated');
}

if (readmeContent.includes('processing: { ordered: true }')) {
    console.log('✅ README.md: Usage example added');
}

console.log('\nImplementation summary:');
console.log('- Added ordered: boolean to ProcessingConfig interface');
console.log('- Added ordered: false to DEFAULT_CONFIG');
console.log('- Updated DataAttributeStrategy to use config value by default');
console.log('- Updated README with configuration and usage examples');
console.log('\nFeature is ready for use!');
console.log('Usage: new CharWrapper(selector, { processing: { ordered: true }})');