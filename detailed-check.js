const puppeteer = require('puppeteer');

async function checkErrors() {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        const errors = [];
        const warnings = [];
        const failedRequests = [];
        
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
        
        // Capture failed requests with details
        page.on('requestfailed', request => {
            failedRequests.push({
                url: request.url(),
                error: request.failure().errorText,
                method: request.method()
            });
        });
        
        // Capture response errors
        page.on('response', response => {
            if (response.status() >= 400) {
                failedRequests.push({
                    url: response.url(),
                    status: response.status(),
                    statusText: response.statusText()
                });
            }
        });
        
        console.log('Loading page...');
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle0', timeout: 10000 });
        
        // Wait for JavaScript execution
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('\n=== FAILED REQUESTS ===');
        if (failedRequests.length === 0) {
            console.log('✅ No failed requests!');
        } else {
            failedRequests.forEach(req => {
                console.log(`❌ ${req.url}`);
                if (req.error) console.log(`   Error: ${req.error}`);
                if (req.status) console.log(`   Status: ${req.status} ${req.statusText}`);
            });
        }
        
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
        
        // Test functionality
        console.log('\n=== FUNCTIONALITY TEST ===');
        try {
            // Test if mermaid renders
            const hasContent = await page.evaluate(() => {
                const output = document.getElementById('mermaidOutput');
                return output && output.innerHTML.length > 50;
            });
            console.log(`${hasContent ? '✅' : '❌'} Mermaid rendering: ${hasContent ? 'Working' : 'Not working'}`);
            
            // Test if CodeMirror loads
            const hasCodeMirror = await page.evaluate(() => {
                return typeof window.CodeMirror !== 'undefined';
            });
            console.log(`${hasCodeMirror ? '✅' : '❌'} CodeMirror: ${hasCodeMirror ? 'Loaded' : 'Not loaded'}`);
            
        } catch (testError) {
            console.log(`❌ Functionality test failed: ${testError.message}`);
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
