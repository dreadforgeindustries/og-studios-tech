import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import CookieConsent from '@/components/CookieConsent';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'OG Studios.Tech — Build. Learn. Create.', template: '%s — OG Studios.Tech' },
  description: 'OG Studios.Tech builds software, digital products, AI and IoT experiences, while making practical technology education accessible.',
  applicationName: 'OG Studios.Tech',
  openGraph: { title: 'OG Studios.Tech — Build. Learn. Create.', description: 'Software, digital products, AI, IoT and practical technology education.', type: 'website', siteName: 'OG Studios.Tech', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'OG Studios.Tech — Build. Learn. Create.' }] },
  twitter: { card: 'summary_large_image', title: 'OG Studios.Tech', description: 'Build. Learn. Create.', images: ['/opengraph-image'] },
  icons: { icon: '/icon.svg' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><Navbar/><main>{children}</main><Footer/><Analytics/><CookieConsent/></body></html>;
}
