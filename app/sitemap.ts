import type { MetadataRoute } from 'next';
import { adminSupabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const staticRoutes = ['', '/work', '/classes', '/start-project', '/contact', '/privacy', '/terms'].map(path => ({ url: `${base}${path}`, changeFrequency: 'monthly' as const, priority: path === '' ? 1 : 0.7 }));
  try {
    const { data } = await adminSupabase().from('projects').select('slug,updated_at').eq('status', 'published').order('updated_at', { ascending: false });
    const projects = (data || []).map(p => ({ url: `${base}/work/${p.slug}`, lastModified: p.updated_at, changeFrequency: 'monthly' as const, priority: 0.6 }));
    return [...staticRoutes, ...projects];
  } catch { return staticRoutes; }
}
