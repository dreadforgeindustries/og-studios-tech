'use client';
import { useEffect, useState } from 'react';

const KEY = 'og-cookie-consent';
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(localStorage.getItem(KEY) !== 'accepted'); }, []);
  if (!visible || !process.env.NEXT_PUBLIC_ANALYTICS_ID) return null;
  return <div className="cookie-banner" role="dialog" aria-label="Cookie preferences">
    <div><strong>Privacy-friendly analytics</strong><p>We use analytics only to understand how the site is used. You can choose whether to allow it.</p></div>
    <div className="cookie-actions"><button className="btn" onClick={() => { localStorage.setItem(KEY, 'declined'); setVisible(false); }}>Decline</button><button className="btn btn-primary" onClick={() => { localStorage.setItem(KEY, 'accepted'); window.dispatchEvent(new Event('og:analytics-consent')); setVisible(false); }}>Allow analytics</button></div>
  </div>;
}
