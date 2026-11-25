import fs from 'fs';
import path from 'path';

const siteUrl = 'https://royal-higher-life-ag25.vercel.app';

const pages = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/leadership', changefreq: 'monthly', priority: 0.7 },
  { url: '/sermons', changefreq: 'weekly', priority: 0.9 },
  { url: '/events', changefreq: 'weekly', priority: 0.8 },
  { url: '/gallery', changefreq: 'monthly', priority: 0.7 },
  { url: '/mission', changefreq: 'monthly', priority: 0.7 },
  { url: '/media', changefreq: 'weekly', priority: 0.7 },
  { url: '/reviews', changefreq: 'monthly', priority: 0.5 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
  { url: '/donate', changefreq: 'monthly', priority: 0.7 },
];

function generateSitemap() {
  const today = new Date().toISOString();
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  try {
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('✅ sitemap.xml generated in public/');
  } catch (err) {
    console.warn('⚠️  Could not write sitemap.xml (file may be locked by OneDrive):', err.message);
  }
}

function generateRobotsTxt() {
  const robots = `# Royal HigherLife Christian Ministries - Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Disallow admin and private routes
Disallow: /admin
Disallow: /dashboard
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password

# Crawl-delay for respectful crawling
Crawl-delay: 10
`;

  const publicDir = path.join(process.cwd(), 'public');
  try {
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
    console.log('✅ robots.txt generated in public/');
  } catch (err) {
    console.warn('⚠️  Could not write robots.txt (file may be locked by OneDrive):', err.message);
  }
}

generateSitemap();
generateRobotsTxt();
