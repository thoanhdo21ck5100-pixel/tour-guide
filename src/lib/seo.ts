import { Metadata } from 'next';
import { Tour, BlogPost } from '@/types';

const getSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'https://tour-guide-jet-one.vercel.app';
};

export const SITE_CONFIG = {
  name: 'ベトナム日本語ガイド | ベトナム全土プライベートツアー【現地公認】',
  shortName: 'ベトナム日本語ガイド',
  description:
    '【ベトナム日本語ガイド公認】日本人旅行者のための安心・快適なベトナム全土プライベート観光ツアー。ダナン・ホイアンをはじめ、ハノイ・ホーチミン・フエなどベトナム各地を日本語堪能な専属ガイドが完全貸切でおもてなし。空港送迎・ホテル宿泊・買い物サポート完備。LINE事前相談無料。',
  url: getSiteUrl(),
  ogImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
  keywords: [
    'ベトナム 日本語ガイド',
    'ベトナム プライベートツアー',
    'ダナン 日本語ガイド',
    'ダナン プライベートツアー',
    'ベトナム 全土 個人旅行',
    'ベトナム チャーター 日本語',
    'ホイアン ランタン ツアー',
    'バーナーヒルズ 専用車 送迎',
    'ハノイ ホーチミン 日本語ガイド',
    'ベトナム 空港送迎 日本語'
  ],
  author: 'アン トー (Anh Tho)',
  contactPhone: '+84 968 781 121',
  contactEmail: 'nihongoguide01@gmail.com',
  lineId: '@564pshie',
  lineUrl: 'https://lin.ee/vssKBHS',
  instagramHandle: 'tho.anh.do01',
  instagramUrl: 'https://www.instagram.com/tho.anh.do01?igsi=MThteDdsazlhdDdlaQ==',
  xHandle: 'NihongoGuide',
  xUrl: 'https://x.com/NihongoGuide',
};

export function constructMetadata({
  title,
  description,
  image,
  canonical,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const fullTitle = title
    ? `${title} | ベトナム日本語ガイド【現地公認プライベートツアー】`
    : `${SITE_CONFIG.name} - 安心の完全貸切・明朗会計`;

  const metaDesc = description || SITE_CONFIG.description;
  const ogImg = image || SITE_CONFIG.ogImage;
  const canonicalUrl = canonical ? `${SITE_CONFIG.url}${canonical}` : SITE_CONFIG.url;

  return {
    title: fullTitle,
    description: metaDesc,
    keywords: SITE_CONFIG.keywords,
    authors: [{ name: SITE_CONFIG.author }],
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: 'ja_JP',
      type: 'website',
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDesc,
      images: [ogImg],
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icon.png', sizes: '32x32', type: 'image/png' },
        { url: '/images/logo-emblem.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      shortcut: ['/favicon.ico'],
    },
    verification: {
      google: 'Eo_PA54cjRmdJ2STOUuKVrKixpZX_UVcyTfUnSn7B3Q',
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristInformationCenter',
    name: 'ベトナム日本語ガイド (Anh Tho Guide Service)',
    image: `${SITE_CONFIG.url}/images/logo.png`,
    logo: `${SITE_CONFIG.url}/images/logo.png`,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.contactPhone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tran Phu Street, Hai Chau',
      addressLocality: 'Da Nang',
      addressRegion: 'Da Nang',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 16.0678,
      longitude: 108.2208,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '07:00',
      closes: '22:00',
    },
    priceRange: '¥¥',
    currenciesAccepted: 'JPY, VND, USD',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    areaServed: ['Vietnam', 'Da Nang', 'Hoi An', 'Hue', 'Hanoi', 'Ho Chi Minh City', 'Ba Na Hills', 'My Son'],
    knowsLanguage: ['ja', 'vi', 'en'],
  };
}

export function generateTouristTripSchema(tour: Tour) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.shortDescription,
    touristType: ['Japanese Tourists', 'Couples', 'Families'],
    offers: {
      '@type': 'Offer',
      price: tour.priceJpy,
      priceCurrency: 'JPY',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-01-01',
    },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: tour.itinerary.length,
      itemListElement: tour.itinerary.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'TouristAttraction',
          name: item.title,
          description: item.description,
        },
      })),
    },
  };
}

export function generateBlogPostSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}
