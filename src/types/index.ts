export type TourCategory = 'all' | 'classic' | 'women' | 'men' | 'food' | 'custom' | 'family';

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  iconName?: string;
  location?: string;
}

export interface TourVisitedSpot {
  name: string;
  description?: string;
  imageUrl?: string;
  relatedBlogSlug?: string;
}

export interface TourFaqItem {
  question: string;
  answer: string;
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
  visitedSpots?: TourVisitedSpot[];
  faqs?: TourFaqItem[];
  relatedBlogSlugs?: string[];
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
  keyTakeaway?: string;
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
  relatedTourSlugs?: string[];
  relatedBlogSlugs?: string[];
}

export type ContactMethod = 'line' | 'instagram' | 'email' | 'whatsapp';

export interface BookingSubmission {
  id?: string;
  bookingCode?: string;
  name: string;
  kana: string;
  contactType: ContactMethod;
  contactValue: string;
  email?: string;
  consultationType?: string;
  tripType?: 'single' | 'multi';
  tourSlug: string;
  tourName?: string;
  preferredDate: string;
  endDate?: string;
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

export interface TourPlanScheduleItem {
  time: string; // e.g., '08:30', '12:00'
  title: string; // e.g., 'ホテルお迎え・出発'
  description?: string;
  location?: string;
}

export type PhotoStatus = 'pending' | 'ready' | 'expired';

export interface CustomTourPlan {
  id: string;
  tourCode: string; // e.g., 'JPVN-8392' (unique, uppercase)
  bookingId?: string; // Optional link to original booking
  customerName: string;
  customerKana?: string;
  customerEmail: string; // Used for secure 2-factor lookup
  customerPhone?: string;
  tourTitle: string; // e.g., 'ダナン・ホイアン 1日オーダーメイドプライベートツアー'
  tourDate: string; // Start date YYYY-MM-DD
  endDate?: string; // If multi-day
  pickupTime?: string; // e.g., '08:30'
  pickupLocation?: string; // Hotel name or meetup point
  adultsCount: number;
  childrenCount: number;
  participantsNotes?: string; // Names / notes about participants
  schedule: TourPlanScheduleItem[]; // Chronological confirmed schedule with hours
  guideNotes?: string; // Tips for clothing, weather, money, etc.
  driveUrl?: string; // Google Drive / Photos / OneDrive album link
  photoStatus: PhotoStatus;
  photosUploadedAt?: string; // ISO date
  photosExpireAt?: string; // ISO date (typically tourDate or photosUploadedAt + 7 days)
  status: 'draft' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

