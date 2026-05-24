const http = require('http');
const https = require('https');
const url = require('url');

// Get target URL from command line
const targetUrl = process.argv[2];
if (!targetUrl) {
  console.error("Error: Please provide target URL as first argument.");
  console.error("Usage: node regression-test.js <url>");
  process.exit(1);
}

console.log(`Starting regression test for target: ${targetUrl}`);

// Helper to make a simple GET request
function get(target) {
  return new Promise((resolve, reject) => {
    // Parse URL, handling potential issues
    let parsed;
    try {
      parsed = new url.URL(target);
    } catch (e) {
      return reject(new Error(`Invalid URL: ${target}`));
    }
    
    const client = parsed.protocol === 'https:' ? https : http;
    
    // Set user-agent to avoid potential bot blocks
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': 'EduMoni-Regression-Test-Agent'
      }
    };

    client.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runTests() {
  try {
    // 1. Fetch main HTML page
    console.log(`[Test 1/3] Fetching main page: ${targetUrl}...`);
    const page = await get(targetUrl);
    
    if (page.statusCode !== 200) {
      throw new Error(`Main page failed with status code: ${page.statusCode}`);
    }
    console.log(`✔ Main page loaded successfully (HTTP 200).`);

    // 2. Validate HTML content and extract built assets
    console.log(`[Test 2/3] Validating HTML structure...`);
    const html = page.data;
    
    // Check title
    if (!html.includes('<title>EduMoni') && !html.includes('EduMoni')) {
      throw new Error("HTML content validation failed: Title 'EduMoni' not found.");
    }
    
    // Check for main layout panels
    if (!html.includes('student-view') || !html.includes('pet-avatar-wrapper')) {
      throw new Error("HTML content validation failed: Crucial student-view or avatar-wrapper elements missing.");
    }
    console.log(`✔ HTML structure validated. Required elements are present.`);

    // 3. Extract and verify referenced JS / CSS assets
    console.log(`[Test 3/3] Inspecting and verifying assets...`);
    
    // Regular expressions to find CSS and JS files
    // In Vite build output:
    // JS: <script type="module" crossorigin src="/assets/index-XYZ.js"></script>
    // CSS: <link rel="stylesheet" crossorigin href="/assets/index-XYZ.css">
    const assetRegexes = [
      /src=["']([^"']+\.js)["']/g,
      /href=["']([^"']+\.css)["']/g
    ];

    const assets = [];
    let match;
    for (const regex of assetRegexes) {
      regex.lastIndex = 0; // reset
      while ((match = regex.exec(html)) !== null) {
        let assetPath = match[1];
        
        // Skip external JS files if they are not from our origin or standard CDNs
        // We do want to verify our own scripts and style files
        // Normalize relative paths to absolute URL
        if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
          assets.push(assetPath);
        } else {
          // Normalize leading slash
          if (!assetPath.startsWith('/') && !assetPath.startsWith('.')) {
            assetPath = '/' + assetPath;
          }
          const resolved = new url.URL(assetPath, targetUrl).href;
          assets.push(resolved);
        }
      }
    }

    // Remove duplicates
    const uniqueAssets = [...new Set(assets)];
    console.log(`Found ${uniqueAssets.length} referenced assets:`);
    uniqueAssets.forEach(a => console.log(`  - ${a}`));

    if (uniqueAssets.length === 0) {
      throw new Error("No assets (JS or CSS) were detected in the HTML markup.");
    }

    // Request each asset to verify it loads successfully
    for (const assetUrl of uniqueAssets) {
      console.log(`Verifying asset: ${assetUrl}...`);
      const assetRes = await get(assetUrl);
      if (assetRes.statusCode !== 200) {
        throw new Error(`Asset failed to load: ${assetUrl} (Status: ${assetRes.statusCode})`);
      }
      console.log(`  ✔ Load success (HTTP 200). Size: ${assetRes.data.length} bytes`);
    }

    console.log("\n🎉 Regression tests completed successfully! Everything is green. 🎉");
    process.exit(0);

  } catch (err) {
    console.error(`\n❌ Regression Test Failed: ${err.message}`);
    process.exit(1);
  }
}

runTests();
