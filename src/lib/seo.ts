import { Metadata } from 'next';
import { Tour, BlogPost } from '@/types';

export const SITE_CONFIG = {
  name: 'ダナン プライベートツアー | ベトナム現地公認 日本語ガイド',
  shortName: 'ダナン・プライベートガイド',
  description:
    '【ダナン プライベートツアー公認ガイド】日本人旅行者のための安心・快適なベトナム・ダナン＆ホイアン完全貸切観光ツアー。日本語堪能な専属ローカルガイドが、五行山・バーナーヒルズ・ランタン夜市までおもてなしの心でご案内。LINE事前相談無料。',
  url: 'https://danang-private-guide.com',
  ogImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
  keywords: [
    'ダナン プライベートツアー',
    'ベトナム ローカルガイド',
    'ダナン 観光 日本語ガイド',
    'ダナン チャーター 日本語',
    'ホイアン ランタン ツアー',
    'バーナーヒルズ 専用車 送迎',
    'ダナン グルメ ツアー',
    'ベトナム 中部 個人旅行'
  ],
  author: 'アン トー (Anh Tho)',
  contactPhone: '+84 968 781 121',
  contactEmail: 'thoanhdo21ck5100@gmail.com',
  lineId: 'bii010121',
  lineUrl: 'https://line.me/ti/p/~bii010121',
  instagramHandle: 'tho.anh.do01',
  instagramUrl: 'https://www.instagram.com/tho.anh.do01?igsi=MThteDdsazlhdDdlaQ==',
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
    ? `${title} | ダナン プライベートツアー【現地公認 日本語ガイド】`
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
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristInformationCenter',
    name: 'ダナン プライベートツアー (Anh Tho Guide Service)',
    image: SITE_CONFIG.ogImage,
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
    areaServed: ['Da Nang', 'Hoi An', 'Hue', 'Ba Na Hills', 'My Son'],
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
