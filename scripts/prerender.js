const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const dist = path.join(root, 'dist');
const origin = 'https://pratix.io';
const metadata = { title: 'Free JSON-LD Schema Generator | Pratix.io', description: 'Generate JSON-LD structured data for Shopify, WooCommerce, Webflow, Wix and more directly in your browser.', route: '/en/schema-generator' };
function esc(v) { return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;'); }
function decode(v) { const m = v.match(/atob\(\"([A-Za-z0-9+/=]+)\"\)/); if (!m) throw new Error('encoded template not found'); return Buffer.from(m[1], 'base64').toString('utf8'); }
function tag(html, pattern, replacement) { return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', replacement + '\n</head>'); }
let html = decode(source).replaceAll('https://yourdomain.com', origin);
html = tag(html, /<html\s+lang=\"[^\"]*\"[^>]*>/, `<html lang=\"en\">`);
html = tag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(metadata.title)}</title>`);
html = tag(html, /<meta\s+name=\"description\"[\s\S]*?\/>/, `<meta name=\"description\" content=\"${esc(metadata.description)}\" />`);
html = tag(html, /<link\s+rel=\"canonical\"[^>]*>/, `<link rel=\"canonical\" href=\"${origin}${metadata.route}\" />`);
html = tag(html, /<meta\s+property=\"og:title\"[^>]*>/, `<meta property=\"og:title\" content=\"${esc(metadata.title)}\" />`);
html = tag(html, /<meta\s+property=\"og:description\"[^>]*>/, `<meta property=\"og:description\" content=\"${esc(metadata.description)}\" />`);
html = tag(html, /<meta\s+property=\"og:url\"[^>]*>/, `<meta property=\"og:url\" content=\"${origin}${metadata.route}\" />`);
html = html.replace(/\s*<link\s+rel=\"alternate\"\s+hreflang=\"[^\"]*\"[^>]*>/g, '');
html = html.replace('</head>', `  <meta name=\"twitter:card\" content=\"summary\" />\n  <meta name=\"twitter:title\" content=\"${esc(metadata.title)}\" />\n  <meta name=\"twitter:description\" content=\"${esc(metadata.description)}\" />\n  <link rel=\"alternate\" hreflang=\"en\" href=\"${origin}${metadata.route}\" data-prerender-hreflang=\"true\" />\n  <link rel=\"alternate\" hreflang=\"x-default\" href=\"${origin}${metadata.route}\" data-prerender-hreflang=\"true\" />\n</head>`);
html = html.replace('<body>', `<body>\n<section id=\"prerendered-seo-content\"><h1>${esc(metadata.title)}</h1><p>${esc(metadata.description)}</p></section>`);
fs.rmSync(dist, {recursive:true, force:true});
fs.mkdirSync(path.join(dist, 'en', metadata.route.split('/').pop()), {recursive:true});
fs.writeFileSync(path.join(dist, 'index.html'), html);
fs.writeFileSync(path.join(dist, 'en', metadata.route.split('/').pop(), 'index.html'), html);
console.log('Prerendered 2 English pages into dist/');
