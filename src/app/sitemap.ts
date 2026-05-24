import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export default async function generateSitemap() {
  const csvPath = path.join(process.cwd(), 'keywords.csv');
  const content = fs.readFileSync(csvPath, 'utf8');
  
  const keywords = content
    .split('\n')
    .slice(1)
    .filter(line => line.trim() !== '')
    .map(line => ({
      slug: line.trim().toLowerCase().replace(/\s+/g, '-'),
    }));

  const baseUrl = 'https://your-domain.com';

  const staticPages = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/product`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/legal/shipping`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/legal/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/legal/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const dynamicPages = keywords.map(kw => ({
    url: `${baseUrl}/seo/${kw.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...dynamicPages];
}

