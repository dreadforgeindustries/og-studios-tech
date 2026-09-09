'use client';
import { useEffect } from 'react';

export default function Analytics() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_ANALYTICS_ID;
    if (!id || localStorage.getItem('og-cookie-consent') !== 'accepted') return;
    const load = () => {
      if (document.querySelector(`script[data-og-analytics="${id}"]`)) return;
      const s = document.createElement('script'); s.async = true; s.dataset.ogAnalytics = id; s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`; document.head.appendChild(s);
      const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
      w.dataLayer = w.dataLayer || []; w.gtag = (...args) => w.dataLayer!.push(args); w.gtag('js', new Date()); w.gtag('config', id, { anonymize_ip: true });
    };
    load(); window.addEventListener('og:analytics-consent', load); return () => window.removeEventListener('og:analytics-consent', load);
  }, []);
  return null;
}
