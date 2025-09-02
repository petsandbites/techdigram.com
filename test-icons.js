const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Navigate to the local server
    await page.goto('http://localhost:8000');
    
    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test AWS icon placeholder replacement
    const testCode = `flowchart TD
    {{User}} --> {{ALB}}
    {{ALB}} --> {{EC2}}
    {{EC2}} --> {{RDS}}
    {{EC2}} --> {{S3}}
    {{Lambda}} --> {{DynamoDB}}
    {{CloudFront}} --> {{S3}}`;
    
    // Set the test code in the editor
    await page.evaluate((code) => {
        if (window.codeEditor && window.codeEditor.getDoc) {
            window.codeEditor.getDoc().setValue(code);
        } else {
            const textarea = document.getElementById('mermaid-code');
            if (textarea) {
                textarea.value = code;
            }
        }
        // Trigger the render function
        if (window.renderDiagram) {
            window.renderDiagram();
        }
    }, testCode);
    
    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if SVG images are present in the diagram
    const svgImages = await page.evaluate(() => {
        const diagramContainer = document.getElementById('diagram');
        const images = diagramContainer.querySelectorAll('img[src*="aws-icons"]');
        return Array.from(images).map(img => ({
            src: img.src,
            loaded: img.complete && img.naturalHeight !== 0
        }));
    });
    
    console.log('=== AWS ICON RENDERING TEST ===');
    console.log(`Found ${svgImages.length} AWS icon images in diagram`);
    
    svgImages.forEach((img, index) => {
        const iconName = img.src.split('/').pop().replace('_32.svg', '');
        console.log(`${img.loaded ? '✅' : '❌'} ${iconName}: ${img.loaded ? 'Loaded' : 'Failed to load'}`);
    });
    
    // Check if placeholders were replaced
    const diagramHTML = await page.evaluate(() => {
        return document.getElementById('diagram').innerHTML;
    });
    
    const hasPlaceholders = diagramHTML.includes('{{');
    console.log(`\n=== PLACEHOLDER REPLACEMENT ===`);
    console.log(`${hasPlaceholders ? '❌' : '✅'} Placeholders ${hasPlaceholders ? 'still present' : 'successfully replaced'}`);
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'aws-icons-test.png', fullPage: true });
    console.log('\n📸 Screenshot saved as aws-icons-test.png');
    
    await browser.close();
})();
