import type { APIRoute } from 'astro';
import { pages, site } from '../data/site';

export const GET: APIRoute = () => new Response(
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', ...pages.map(page => page.path), '/progress/'].map(path => `<url><loc>${site.url}${path}</loc></url>`).join('')}</urlset>`,
  { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
);
