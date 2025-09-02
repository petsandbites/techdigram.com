const puppeteer = require('puppeteer');

async function checkErrors() {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        const errors = [];
        const warnings = [];
        
        // Capture console messages
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(`CONSOLE ERROR: ${msg.text()}`);
            } else if (msg.type() === 'warning') {
                warnings.push(`CONSOLE WARNING: ${msg.text()}`);
            }
        });
        
        // Capture page errors
        page.on('pageerror', error => {
            errors.push(`PAGE ERROR: ${error.message}`);
        });
        
        // Capture failed requests
        page.on('requestfailed', request => {
            errors.push(`FAILED REQUEST: ${request.url()} - ${request.failure().errorText}`);
        });
        
        console.log('Loading page...');
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle0', timeout: 10000 });
        
        // Wait using setTimeout instead
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('\n=== JAVASCRIPT ERRORS ===');
        if (errors.length === 0) {
            console.log('✅ No JavaScript errors found!');
        } else {
            errors.forEach(error => console.log(`❌ ${error}`));
        }
        
        console.log('\n=== WARNINGS ===');
        if (warnings.length === 0) {
            console.log('✅ No warnings found!');
        } else {
            warnings.forEach(warning => console.log(`⚠️  ${warning}`));
        }
        
        // Check if key elements exist
        console.log('\n=== DOM ELEMENTS CHECK ===');
        const elementChecks = [
            'mermaidInput',
            'mermaidOutput', 
            'codeEditor',
            'generateBtn',
            'themeToggle'
        ];
        
        for (const elementId of elementChecks) {
            const exists = await page.evaluate((id) => {
                return document.getElementById(id) !== null;
            }, elementId);
            console.log(`${exists ? '✅' : '❌'} Element #${elementId}: ${exists ? 'Found' : 'Missing'}`);
        }
        
    } catch (error) {
        console.error('Script error:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

checkErrors();
