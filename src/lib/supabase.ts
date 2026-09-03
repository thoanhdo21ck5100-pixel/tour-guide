import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BookingSubmission, DayAvailability, DayAvailabilityStatus, Tour, BlogPost } from '@/types';
import { TOURS_DATA } from './data/tours';
import { BLOG_POSTS_DATA } from './data/blog';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ==========================================
// In-Memory Synchronized Stores for Fallback & Immediate Local Testing
// ==========================================
const inMemoryBookings: BookingSubmission[] = [];
const inMemoryAvailabilityOverrides = new Map<
  string,
  {
    status: DayAvailabilityStatus;
    remainingSlots: number;
    note: string;
    updatedAt: string;
    modifiedBy: string;
  }
>();
let inMemoryTours: Tour[] = [...TOURS_DATA];
let inMemoryBlogs: BlogPost[] = [...BLOG_POSTS_DATA];

// Generate clean default availability for given month (all days available by default, 0 fake bookings)
function generateDefaultAvailability(year: number, month: number): DayAvailability[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const list: DayAvailability[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    // Check if an override exists first (from admin toggle)
    const override = inMemoryAvailabilityOverrides.get(dateStr);
    if (override) {
      list.push({
        date: dateStr,
        status: override.status,
        remainingSlots: override.remainingSlots,
        note: override.note,
      });
      continue;
    }

    // Completely clean default: All days available, 0 fake bookings
    list.push({
      date: dateStr,
      status: 'available',
      remainingSlots: 1,
      note: 'ご予約可能',
    });
  }

  return list;
}

/**
 * Fetch availability for a specific year and month
 */
export async function fetchAvailability(year: number, month: number): Promise<DayAvailability[]> {
  const days = generateDefaultAvailability(year, month);
  const availabilityMap = new Map<string, DayAvailability>();
  days.forEach((d) => availabilityMap.set(d.date, d));

  if (supabase) {
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('availability')
        .select('date, status, remaining_slots, note')
        .gte('date', startDate)
        .lte('date', endDate);

      if (!error && data && data.length > 0) {
        data.forEach((item) => {
          availabilityMap.set(item.date, {
            date: item.date,
            status: item.status as DayAvailabilityStatus,
            remainingSlots: item.remaining_slots ?? 0,
            note: item.note,
          });
        });
      }
    } catch (err) {
      console.warn('Failed to query Supabase availability, falling back to local store:', err);
    }
  }

  return Array.from(availabilityMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Update single date availability (Admin) with audit tracking
 */
export async function updateDateAvailability(
  date: string,
  status: DayAvailabilityStatus,
  note?: string,
  modifiedBy: string = 'admin'
): Promise<{ success: boolean; error?: string }> {
  const nowIso = new Date().toISOString();
  const remainingSlots = status === 'booked' ? 0 : status === 'limited' ? 1 : 2;
  const defaultNote = status === 'booked' ? '満席' : status === 'limited' ? '残り1組様' : 'ご予約可能';

  // Always update in-memory cache so client calendar updates immediately
  inMemoryAvailabilityOverrides.set(date, {
    status,
    remainingSlots,
    note: note || defaultNote,
    updatedAt: nowIso,
    modifiedBy,
  });

  if (supabase) {
    try {
      const { error } = await supabase
        .from('availability')
        .upsert(
          {
            date,
            status,
            remaining_slots: remainingSlots,
            note: note || defaultNote,
            modified_by: modifiedBy,
            updated_at: nowIso,
          },
          { onConflict: 'date' }
        );

      if (error) {
        console.error('Supabase availability upsert error:', error);
      }
    } catch (err) {
      console.warn('Failed to upsert to Supabase availability:', err);
    }
  }

  return { success: true };
}

/**
 * Save booking submission to Supabase or fallback store
 */
export async function saveBooking(
  submission: BookingSubmission
): Promise<{ success: boolean; id: string; error?: string }> {
  const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record: BookingSubmission = {
    ...submission,
    id: bookingId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            name: submission.name,
            kana: submission.kana,
            contact_type: submission.contactType,
            contact_value: submission.contactValue,
            tour_slug: submission.tourSlug,
            tour_name: submission.tourName || submission.tourSlug,
            preferred_date: submission.preferredDate,
            alternative_date: submission.alternativeDate || null,
            adults_count: submission.adultsCount,
            children_count: submission.childrenCount,
            hotel_name: submission.hotelName || null,
            special_requests: submission.specialRequests || null,
            status: 'pending',
          },
        ])
        .select('id')
        .single();

      if (error) {
        console.error('Supabase booking insert error:', error);
        inMemoryBookings.push(record);
        return { success: true, id: bookingId };
      }

      return { success: true, id: data?.id || bookingId };
    } catch (err) {
      console.warn('Supabase request failed, saved to fallback:', err);
      inMemoryBookings.push(record);
      return { success: true, id: bookingId };
    }
  }

  inMemoryBookings.push(record);
  return { success: true, id: bookingId };
}

/**
 * Fetch all bookings (Admin)
 */
export async function fetchAllBookingsAdmin(): Promise<BookingSubmission[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((b) => ({
          id: b.id,
          name: b.name,
          kana: b.kana,
          contactType: b.contact_type,
          contactValue: b.contact_value,
          tourSlug: b.tour_slug,
          tourName: b.tour_name,
          preferredDate: b.preferred_date,
          alternativeDate: b.alternative_date,
          adultsCount: b.adults_count,
          childrenCount: b.children_count,
          hotelName: b.hotel_name,
          specialRequests: b.special_requests,
          status: b.status,
          createdAt: b.created_at,
        }));
      }
    } catch (err) {
      console.warn('Failed to query Supabase bookings, falling back to local store:', err);
    }
  }

  return inMemoryBookings;
}

/**
 * Tour CMS Operations
 */
export async function getAllTours(): Promise<Tour[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('tours').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((t) => ({
          id: t.id,
          slug: t.slug,
          title: t.title,
          subtitle: t.subtitle,
          category: t.category,
          categoryLabel: t.category_label,
          duration: t.duration,
          priceJpy: t.price_jpy,
          priceVnd: t.price_vnd,
          priceNote: t.price_note,
          rating: Number(t.rating) || 5.0,
          reviewCount: t.review_count || 0,
          heroImage: t.hero_image,
          badge: t.badge,
          isFeatured: t.is_featured,
          shortDescription: t.short_description,
          fullDescription: t.full_description,
          highlights: t.highlights || [],
          itinerary: t.itinerary || [],
          included: t.included || [],
          excluded: t.excluded || [],
          meetingPlace: t.meeting_place,
          cancellationPolicy: t.cancellation_policy,
          recommendFor: t.recommend_for || [],
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch tours from Supabase, using local:', err);
    }
  }
  return inMemoryTours;
}

export async function upsertTour(tour: Tour, modifiedBy: string = 'admin'): Promise<Tour> {
  const index = inMemoryTours.findIndex((t) => t.slug === tour.slug);
  if (index >= 0) {
    inMemoryTours[index] = tour;
  } else {
    inMemoryTours.push(tour);
  }

  if (supabase) {
    try {
      await supabase.from('tours').upsert(
        {
          slug: tour.slug,
          title: tour.title,
          subtitle: tour.subtitle,
          category: tour.category,
          category_label: tour.categoryLabel,
          duration: tour.duration,
          price_jpy: tour.priceJpy,
          price_vnd: tour.priceVnd,
          price_note: tour.priceNote,
          rating: tour.rating,
          review_count: tour.reviewCount,
          hero_image: tour.heroImage,
          badge: tour.badge,
          is_featured: tour.isFeatured,
          short_description: tour.shortDescription,
          full_description: tour.fullDescription,
          highlights: tour.highlights,
          itinerary: tour.itinerary,
          included: tour.included,
          excluded: tour.excluded,
          meeting_place: tour.meetingPlace,
          cancellation_policy: tour.cancellationPolicy,
          recommend_for: tour.recommendFor,
          modified_by: modifiedBy,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      );
    } catch (err) {
      console.warn('Supabase tour upsert failed:', err);
    }
  }

  return tour;
}

export async function deleteTour(slug: string): Promise<boolean> {
  inMemoryTours = inMemoryTours.filter((t) => t.slug !== slug);
  if (supabase) {
    try {
      await supabase.from('tours').delete().eq('slug', slug);
    } catch (err) {
      console.warn('Supabase tour delete failed:', err);
    }
  }
  return true;
}

/**
 * Blog CMS Operations
 */
export async function getAllBlogs(): Promise<BlogPost[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((b) => ({
          id: b.id,
          slug: b.slug,
          title: b.title,
          excerpt: b.excerpt,
          category: b.category,
          tags: b.tags || [],
          coverImage: b.cover_image,
          publishedAt: b.published_at,
          readingTime: b.reading_time,
          featured: b.featured,
          author: b.author,
          content: b.content,
          relatedTourSlug: b.related_tour_slug,
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch blogs from Supabase, using local:', err);
    }
  }
  return inMemoryBlogs;
}

export async function upsertBlog(post: BlogPost, modifiedBy: string = 'admin'): Promise<BlogPost> {
  const index = inMemoryBlogs.findIndex((b) => b.slug === post.slug);
  if (index >= 0) {
    inMemoryBlogs[index] = post;
  } else {
    inMemoryBlogs.push(post);
  }

  if (supabase) {
    try {
      await supabase.from('blog_posts').upsert(
        {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          tags: post.tags,
          cover_image: post.coverImage,
          published_at: post.publishedAt,
          reading_time: post.readingTime,
          featured: post.featured,
          author: post.author,
          content: post.content,
          related_tour_slug: post.relatedTourSlug,
          modified_by: modifiedBy,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      );
    } catch (err) {
      console.warn('Supabase blog upsert failed:', err);
    }
  }

  return post;
}

export async function deleteBlog(slug: string): Promise<boolean> {
  inMemoryBlogs = inMemoryBlogs.filter((b) => b.slug !== slug);
  if (supabase) {
    try {
      await supabase.from('blog_posts').delete().eq('slug', slug);
    } catch (err) {
      console.warn('Supabase blog delete failed:', err);
    }
  }
  return true;
}
