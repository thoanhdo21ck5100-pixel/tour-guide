import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileStickyBar from '@/components/MobileStickyBar';
import ConditionalRouteWrapper from '@/components/ConditionalRouteWrapper';
import { constructMetadata, generateLocalBusinessSchema } from '@/lib/seo';

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateLocalBusinessSchema();

  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <meta
          name="google-site-verification"
          content="Eo_PA54cjRmdJ2STOUuKVrKixpZX_UVcyTfUnSn7B3Q"
        />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-[#FDFBF7] text-[#1E293B] antialiased selection:bg-amber-100 selection:text-amber-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <ConditionalRouteWrapper hideOnPrefix="/admin">
          <Footer />
          <MobileStickyBar />
        </ConditionalRouteWrapper>
      </body>
    </html>
  );
}
