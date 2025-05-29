/**
 * Update Menu Script
 * This script updates all admin HTML files to use the new menu design
 *
 * Usage:
 * 1. Open the admin directory in a terminal
 * 2. Run: node update-menu.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const adminDir = '.';
const menuTemplateFile = path.join(adminDir, 'templates', 'menu-template-new.html');
const oldCssFiles = [
    'css/admin-menu-redesign.css',
    'css/admin-menu.css'
];
const newCssFile = 'css/admin-menu-new.css';
const oldJsFiles = [
    'js/admin-menu-redesign.js',
    'js/admin-menu.js'
];
const newJsFile = 'js/admin-menu-new.js';

// Read the new menu template
let menuTemplate;
try {
    menuTemplate = fs.readFileSync(menuTemplateFile, 'utf8');
    console.log('✓ Menu template loaded successfully');
} catch (err) {
    console.error('Error reading menu template:', err);
    process.exit(1);
}

// Get all HTML files in the admin directory
const htmlFiles = fs.readdirSync(adminDir)
    .filter(file => file.endsWith('.html') && file !== 'index.html');

console.log(`Found ${htmlFiles.length} HTML files to update`);

// Process each HTML file
let updatedCount = 0;
let skippedCount = 0;
let errorCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(adminDir, file);

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let wasUpdated = false;

        // Replace CSS references
        let cssUpdated = false;
        for (const oldCssFile of oldCssFiles) {
            if (content.includes(oldCssFile)) {
                content = content.replace(
                    new RegExp(`<link rel="stylesheet" href="${oldCssFile}">`),
                    `<link rel="stylesheet" href="${newCssFile}">`
                );
                cssUpdated = true;
                break;
            }
        }

        // If no old CSS file was found, check if we need to add the new CSS file
        if (!cssUpdated && !content.includes(newCssFile)) {
            // Add the new CSS file after the last CSS file
            const lastCssRegex = /<link rel="stylesheet" href="css\/[^"]+\.css">/g;
            let lastCssMatch;
            let lastMatch;

            while ((lastCssMatch = lastCssRegex.exec(content)) !== null) {
                lastMatch = lastCssMatch;
            }

            if (lastMatch) {
                const insertPos = lastMatch.index + lastMatch[0].length;
                content = content.slice(0, insertPos) +
                          `\n    <link rel="stylesheet" href="${newCssFile}">` +
                          content.slice(insertPos);
                cssUpdated = true;
            }
        }

        // Replace JS references
        let jsUpdated = false;
        for (const oldJsFile of oldJsFiles) {
            if (content.includes(oldJsFile)) {
                content = content.replace(
                    new RegExp(`<script src="${oldJsFile}"></script>`),
                    `<script src="${newJsFile}"></script>`
                );
                jsUpdated = true;
                break;
            }
        }

        // If no old JS file was found, check if we need to add the new JS file
        if (!jsUpdated && !content.includes(newJsFile)) {
            // Add the new JS file before the closing body tag
            const bodyClosePos = content.lastIndexOf('</body>');
            if (bodyClosePos !== -1) {
                content = content.slice(0, bodyClosePos) +
                          `    <script src="${newJsFile}"></script>\n` +
                          content.slice(bodyClosePos);
                jsUpdated = true;
            }
        }

        // Replace menu HTML - try different patterns
        const menuPatterns = [
            /<div class="admin-horizontal-menu">[\s\S]*?<\/div>\s*?<!-- Main Content Area -->/,
            /<div class="admin-horizontal-menu">[\s\S]*?<\/div>\s*?<main/,
            /<!-- Admin Horizontal Menu[\s\S]*?<\/div>\s*?<!-- Main Content/,
            /<!-- Admin Menu[\s\S]*?<\/div>\s*?<!-- Main Content/
        ];

        let menuUpdated = false;
        for (const pattern of menuPatterns) {
            const menuMatch = content.match(pattern);
            if (menuMatch) {
                // Replace the menu with the new template
                content = content.replace(
                    pattern,
                    menuTemplate + '\n\n            <!-- Main Content'
                );
                menuUpdated = true;
                break;
            }
        }

        if (cssUpdated || jsUpdated || menuUpdated) {
            // Save the updated file
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Updated ${file} (CSS: ${cssUpdated}, JS: ${jsUpdated}, Menu: ${menuUpdated})`);
            updatedCount++;
            wasUpdated = true;
        }

        if (!wasUpdated) {
            console.warn(`⚠ No updates made to ${file}`);
            skippedCount++;
        }
    } catch (err) {
        console.error(`Error updating ${file}:`, err);
        errorCount++;
    }
});

// Print summary
console.log('\n=== Update Summary ===');
console.log(`Total files: ${htmlFiles.length}`);
console.log(`Updated: ${updatedCount}`);
console.log(`Skipped: ${skippedCount}`);
console.log(`Errors: ${errorCount}`);
console.log('=====================');
console.log('\nMenu update complete!');
