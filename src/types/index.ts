export type TourCategory = 'all' | 'classic' | 'women' | 'men' | 'food' | 'custom' | 'family';

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  iconName?: string;
  location?: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'classic' | 'women' | 'men' | 'food' | 'custom' | 'family';
  categoryLabel: string;
  duration: string;
  priceJpy: number;
  priceVnd: number;
  priceNote?: string;
  rating: number;
  reviewCount: number;
  heroImage: string;
  badge?: string;
  isFeatured?: boolean;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  itinerary: ItineraryItem[];
  included: string[];
  excluded: string[];
  meetingPlace: string;
  cancellationPolicy: string;
  recommendFor: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  featured?: boolean;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
      image?: string;
      tips?: string[];
    }[];
    conclusion: string;
  };
  relatedTourSlug?: string;
}

export type ContactMethod = 'line' | 'instagram' | 'email' | 'whatsapp';

export interface BookingSubmission {
  id?: string;
  name: string;
  kana: string;
  contactType: ContactMethod;
  contactValue: string;
  tourSlug: string;
  tourName?: string;
  preferredDate: string;
  alternativeDate?: string;
  adultsCount: number;
  childrenCount: number;
  hotelName?: string;
  specialRequests?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: string;
}

export type DayAvailabilityStatus = 'available' | 'limited' | 'booked';

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  status: DayAvailabilityStatus;
  remainingSlots?: number;
  note?: string;
}
