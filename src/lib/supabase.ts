import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BookingSubmission, DayAvailability, DayAvailabilityStatus, Tour, BlogPost, CustomTourPlan } from '@/types';
import fs from 'fs';
import path from 'path';

import { TOURS_DATA } from './data/tours';
import { BLOG_POSTS_DATA } from './data/blog';

const DATA_DIR = path.join(process.cwd(), 'src', 'lib', 'data');
const PLANS_FILE = path.join(DATA_DIR, 'custom_plans_store.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings_store.json');

export function loadBookingsFromFile(): BookingSubmission[] {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const raw = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load bookings from file:', e);
  }
  return [];
}

export function saveBookingsToFile(bookings: BookingSubmission[]) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Failed to save bookings to file:', e);
  }
}

export function loadPlansFromFile(): CustomTourPlan[] {
  try {
    if (fs.existsSync(PLANS_FILE)) {
      const raw = fs.readFileSync(PLANS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load custom plans from file:', e);
  }
  return [];
}

export function savePlansToFile(plans: CustomTourPlan[]) {
  try {
    fs.writeFileSync(PLANS_FILE, JSON.stringify(plans, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Failed to save custom plans to file:', e);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && (supabaseAnonKey || supabaseServiceKey)
    ? createClient(supabaseUrl, (supabaseAnonKey || supabaseServiceKey)!)
    : null;

export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && (supabaseServiceKey || supabaseAnonKey)
    ? createClient(supabaseUrl, (supabaseServiceKey || supabaseAnonKey)!, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : supabase;

const getClient = (): SupabaseClient | null => supabaseAdmin || supabase;

// ==========================================
// In-Memory Synchronized Stores for Fallback & Immediate Local Testing
// ==========================================
let inMemoryBookings: BookingSubmission[] = loadBookingsFromFile();
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
let inMemoryCustomTourPlans: CustomTourPlan[] = loadPlansFromFile();


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

  const client = getClient();
  if (client) {
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const { data, error } = await client
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

  const client = getClient();
  if (client) {
    try {
      const { error } = await client
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
        return { success: false, error: error.message };
      }
    } catch (err) {
      console.warn('Failed to upsert to Supabase availability:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Database error' };
    }
  }

  return { success: true };
}

/**
 * Generate a simple, memorable Tour Code / Booking Code (format: JPVN-XXXX)
 */
export function generateTourCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `JPVN-${num}`;
}

export function generateBookingCode(): string {
  return generateTourCode();
}


/**
 * Save booking submission to Supabase or fallback store
 */
export async function saveBooking(
  submission: BookingSubmission
): Promise<{ success: boolean; id: string; bookingCode: string; error?: string }> {
  const bookingCode = submission.bookingCode || generateBookingCode();
  const bookingId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Embed bookingCode tag into specialRequests for persistent cross-table retrieval
  const codeTag = `【予約管理番号: ${bookingCode}】`;
  const enrichedRequests = submission.specialRequests?.includes('予約管理番号')
    ? submission.specialRequests
    : `${codeTag}\n${submission.specialRequests || ''}`.trim();

  const record: BookingSubmission = {
    ...submission,
    id: bookingId,
    bookingCode,
    specialRequests: enrichedRequests,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client
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
            special_requests: enrichedRequests,
            status: 'pending',
          },
        ])
        .select('id')
        .single();

      if (error) {
        console.error('Supabase booking insert error:', error);
        inMemoryBookings.unshift(record);
        saveBookingsToFile(inMemoryBookings);
        return { success: true, id: bookingId, bookingCode };
      }

      inMemoryBookings.unshift(record);
      saveBookingsToFile(inMemoryBookings);
      return { success: true, id: data?.id || bookingId, bookingCode };
    } catch (err) {
      console.warn('Supabase request failed, saved to fallback:', err);
      inMemoryBookings.unshift(record);
      saveBookingsToFile(inMemoryBookings);
      return { success: true, id: bookingId, bookingCode };
    }
  }

  inMemoryBookings.unshift(record);
  saveBookingsToFile(inMemoryBookings);
  return { success: true, id: bookingId, bookingCode };
}

/**
 * Fetch all bookings (Admin)
 */
export async function fetchAllBookingsAdmin(): Promise<BookingSubmission[]> {
  const diskBookings = loadBookingsFromFile();
  inMemoryBookings = diskBookings;

  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const supabaseBookings: BookingSubmission[] = data.map((b) => {
          let extractedEmail = b.email;
          if (!extractedEmail && b.special_requests) {
            const match = b.special_requests.match(/【予備メールアドレス:\s*([^】\n]+)】/);
            if (match && match[1]) {
              extractedEmail = match[1].trim();
            }
          }

          let extractedCode = b.booking_code;
          if (!extractedCode && b.special_requests) {
            const matchCode = b.special_requests.match(/【予約管理番号:\s*([^】\n]+)】/);
            if (matchCode && matchCode[1]) {
              extractedCode = matchCode[1].trim();
            }
          }
          if (!extractedCode) {
            extractedCode = b.id ? `VNJP-${b.id.slice(0, 4).toUpperCase()}` : 'VNJP-0000';
          }

          const isMulti = b.special_requests?.includes('複数日') || b.trip_type === 'multi';

          return {
            id: b.id,
            bookingCode: extractedCode,
            name: b.name,
            kana: b.kana,
            contactType: b.contact_type,
            contactValue: b.contact_value,
            email: extractedEmail || (b.contact_type === 'email' ? b.contact_value : undefined),
            tripType: isMulti ? 'multi' : 'single',
            tourSlug: b.tour_slug,
            tourName: b.tour_name,
            preferredDate: b.preferred_date,
            endDate: isMulti ? b.alternative_date : undefined,
            alternativeDate: b.alternative_date,
            adultsCount: b.adults_count,
            childrenCount: b.children_count,
            hotelName: b.hotel_name,
            specialRequests: b.special_requests,
            status: b.status,
            createdAt: b.created_at,
          };
        });

        // Merge disk bookings with Supabase bookings
        const map = new Map<string, BookingSubmission>();
        for (const b of diskBookings) {
          map.set(b.id || (b.bookingCode || ''), b);
        }
        for (const b of supabaseBookings) {
          map.set(b.id || (b.bookingCode || ''), b);
        }
        return Array.from(map.values()).sort((a, b) =>
          (b.createdAt || '').localeCompare(a.createdAt || '')
        );
      }
    } catch (err) {
      console.warn('Failed to query Supabase bookings, falling back to local store:', err);
    }
  }

  return inMemoryBookings;
}

/**
 * Update booking status (Admin)
 */
export async function updateBookingStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
  // Always update in local memory and file
  const found = inMemoryBookings.find((b) => b.id === id);
  if (found) {
    found.status = status;
    saveBookingsToFile(inMemoryBookings);

    // CRITICAL: Synchronize status to the corresponding CustomTourPlan so customer sees it immediately!
    const targetCode = found.bookingCode;
    const planMatch = inMemoryCustomTourPlans.find(
      (p) => (targetCode && p.tourCode === targetCode) || p.bookingId === id
    );
    if (planMatch) {
      planMatch.status = status === 'confirmed' ? 'confirmed' : status === 'cancelled' ? 'cancelled' : 'draft';
      // If confirmed, update first milestone to show guide confirmed
      if (status === 'confirmed' && planMatch.schedule && planMatch.schedule.length > 0) {
        if (planMatch.schedule[0].time === '受付完了') {
          planMatch.schedule[0] = {
            time: '予約確定・日程FIX',
            title: '専属ガイド（アン トー）とお打ち合わせ完了・日程確定',
            description: 'ご予約および旅程内容が確定いたしました。当日は以下のタイムラインにてお迎えにあがります。',
            location: planMatch.pickupLocation || '宿泊先ホテル',
          };
        }
      }
      savePlansToFile(inMemoryCustomTourPlans);

      const client = getClient();
      if (client && planMatch.id) {
        try {
          await client.from('custom_tour_plans').update({
            status: planMatch.status,
            schedule: planMatch.schedule,
            updated_at: new Date().toISOString(),
          }).eq('id', planMatch.id);
        } catch (planUpdateErr) {
          console.warn('Supabase custom_tour_plans status sync warning:', planUpdateErr);
        }
      }
    }
  }

  const client = getClient();
  if (client) {
    try {
      const { error } = await client
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.warn('Supabase updateBookingStatus warning:', error);
      }
    } catch (err) {
      console.warn('Supabase updateBookingStatus exception:', err);
    }
  }

  return { success: true };
}

/**
 * Tour CMS Operations
 */
export async function getAllTours(): Promise<Tour[]> {
  const tourMap = new Map<string, Tour>();
  TOURS_DATA.forEach((tour) => tourMap.set(tour.slug, tour));

  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client.from('tours').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        data.forEach((t) => {
          tourMap.set(t.slug, {
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
          });
        });
      }
    } catch (err) {
      console.warn('Failed to fetch tours from Supabase, using local:', err);
    }
  }
  return Array.from(tourMap.values());
}

export async function upsertTour(tour: Tour, modifiedBy: string = 'admin'): Promise<Tour> {
  const index = inMemoryTours.findIndex((t) => t.slug === tour.slug);
  if (index >= 0) {
    inMemoryTours[index] = tour;
  } else {
    inMemoryTours.push(tour);
  }

  const client = getClient();
  if (client) {
    try {
      await client.from('tours').upsert(
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
  const client = getClient();
  if (client) {
    try {
      await client.from('tours').delete().eq('slug', slug);
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
  const blogMap = new Map<string, BlogPost>();
  BLOG_POSTS_DATA.forEach((b) => blogMap.set(b.slug, b));

  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        data.forEach((b) => {
          blogMap.set(b.slug, {
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
          });
        });
      }
    } catch (err) {
      console.warn('Failed to fetch blogs from Supabase, using local:', err);
    }
  }
  return Array.from(blogMap.values());
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

// ==========================================
// Custom Tour Plans (Customer Itinerary & 7-Day Photo Lookup)
// ==========================================

async function withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number = 2000): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database query timed out')), timeoutMs);
  });
  return Promise.race([Promise.resolve(promise), timeoutPromise]).finally(() => clearTimeout(timer));
}

export function normalizeTourCode(input: string): string {
  if (!input) return '';
  let cleaned = input.trim().toUpperCase().replace(/[#＃]/g, '').replace(/[\s　]+/g, '-');
  if (/^\d{4}$/.test(cleaned)) {
    return `JPVN-${cleaned}`;
  }
  if (/^JPVN\d{4}$/.test(cleaned)) {
    return `JPVN-${cleaned.slice(4)}`;
  }
  cleaned = cleaned.replace(/--+/g, '-');
  return cleaned;
}

/**
 * Public Secure Lookup: Look up personal tour plan by Tour Code and Email / Contact Identifier
 */
export async function getCustomTourPlanByCodeAndEmail(
  tourCode: string,
  customerIdentifier: string
): Promise<CustomTourPlan | null> {
  const cleanCode = normalizeTourCode(tourCode);
  const cleanIdentifier = (customerIdentifier || '').trim().toLowerCase().replace(/^@/, '');

  if (!cleanCode || !cleanIdentifier) return null;

  // Ensure disk plans are loaded
  inMemoryCustomTourPlans = loadPlansFromFile();

  // Fast-path: Check in-memory / disk store first (flexible matching email or contact identifier)
  const memoryMatch = inMemoryCustomTourPlans.find((p) => {
    const codeMatches = normalizeTourCode(p.tourCode) === cleanCode;
    if (!codeMatches) return false;

    const emailMatches = p.customerEmail && p.customerEmail.trim().toLowerCase() === cleanIdentifier;
    const phoneMatches =
      p.customerPhone &&
      p.customerPhone
        .toLowerCase()
        .replace(/[@\s-]/g, '')
        .includes(cleanIdentifier.replace(/[\s-]/g, ''));
    return emailMatches || phoneMatches;
  });

  if (memoryMatch) {
    return { ...memoryMatch };
  }

  // Check Supabase if configured
  const client = getClient();
  if (client) {
    try {
      const query = client
        .from('custom_tour_plans')
        .select('*')
        .or(`tour_code.ilike.${cleanCode},tour_code.ilike.%${cleanCode.replace('JPVN-', '')}%`)
        .maybeSingle();

      const { data, error } = await withTimeout(query, 2000);

      if (!error && data) {
        const matchesEmail = data.customer_email && data.customer_email.toLowerCase() === cleanIdentifier;
        const matchesPhone = data.customer_phone && data.customer_phone.toLowerCase().includes(cleanIdentifier);
        if (matchesEmail || matchesPhone) {
          return {
            id: data.id,
            tourCode: data.tour_code,
            bookingId: data.booking_id,
            customerName: data.customer_name,
            customerKana: data.customer_kana,
            customerEmail: data.customer_email,
            customerPhone: data.customer_phone,
            tourTitle: data.tour_title,
            tourDate: data.tour_date,
            endDate: data.end_date,
            pickupTime: data.pickup_time,
            pickupLocation: data.pickup_location,
            adultsCount: data.adults_count ?? 1,
            childrenCount: data.children_count ?? 0,
            participantsNotes: data.participants_notes,
            schedule: data.schedule || [],
            guideNotes: data.guide_notes,
            driveUrl: data.drive_url,
            photoStatus: data.photo_status || 'pending',
            photosUploadedAt: data.photos_uploaded_at,
            photosExpireAt: data.photos_expire_at,
            status: data.status || 'confirmed',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      }
    } catch (err) {
      console.warn('Failed to query Supabase custom_tour_plans, falling back to local:', err);
    }
  }

  // Fallback: Check if matching booking exists in inMemoryBookings or bookings_store.json
  inMemoryBookings = loadBookingsFromFile();
  const allBookings = inMemoryBookings;
  const matchingBooking = allBookings.find((b) => {
    const codeMatch =
      normalizeTourCode(b.bookingCode || '') === cleanCode ||
      b.id?.trim().toUpperCase() === cleanCode ||
      (b.specialRequests && b.specialRequests.toUpperCase().includes(cleanCode));
    if (!codeMatch) return false;

    const emailMatch =
      (b.email && b.email.trim().toLowerCase() === cleanIdentifier) ||
      (b.contactValue && b.contactValue.trim().toLowerCase().replace(/^@/, '') === cleanIdentifier) ||
      (b.specialRequests && b.specialRequests.toLowerCase().includes(cleanIdentifier));
    return emailMatch;
  });

  if (matchingBooking) {
    const autoPlan: CustomTourPlan = {
      id: `plan_${matchingBooking.id}`,
      tourCode: cleanCode,
      bookingId: matchingBooking.id,
      customerName: matchingBooking.name,
      customerKana: matchingBooking.kana,
      customerEmail: matchingBooking.email || (matchingBooking.contactType === 'email' ? matchingBooking.contactValue : cleanIdentifier),
      customerPhone:
        matchingBooking.contactType === 'email'
          ? undefined
          : `[${matchingBooking.contactType.toUpperCase()}] ${matchingBooking.contactValue}`,
      tourTitle: matchingBooking.tourName || matchingBooking.tourSlug,
      tourDate: matchingBooking.preferredDate,
      endDate: matchingBooking.endDate || (matchingBooking.tripType === 'multi' ? matchingBooking.alternativeDate : undefined),
      pickupTime: '08:30（専属ガイド調整中）',
      pickupLocation: matchingBooking.hotelName || 'ホテルロビー',
      adultsCount: matchingBooking.adultsCount,
      childrenCount: matchingBooking.childrenCount,
      participantsNotes: matchingBooking.specialRequests || '',
      schedule: [
        {
          time: '受付完了',
          title: '専属ガイド（アン トー）が旅程を確認・作成中',
          description: matchingBooking.specialRequests
            ? `仮予約リクエストを正常に受け付けました。ご要望に合わせて、専属ガイドより24時間以内に最適なタイムラインと詳細見積もりをご案内いたします。`
            : '仮予約リクエストを正常に受け付けました。専属ガイドより24時間以内に最適なタイムラインと詳細見積もりをご案内いたします。',
          location: matchingBooking.hotelName || 'ダナン・ホイアン',
        },
        {
          time: matchingBooking.preferredDate,
          title: 'ツアー初日・お迎え予定',
          description: '専用車と専属日本語ガイドがホテルロビーへお迎えにあがります。',
          location: matchingBooking.hotelName || '宿泊先ホテル',
        },
      ],
      guideNotes:
        '事前決済は不要です。ツアー料金はベトナム到着後に全額お支払いいただけます（日本円・ベトナムドン両替対応）。日程の変更やご質問がございましたら、公式LINEより予約管理番号をお知らせください。',
      driveUrl: '',
      photoStatus: 'pending',
      status: matchingBooking.status === 'confirmed' ? 'confirmed' : matchingBooking.status === 'cancelled' ? 'cancelled' : 'draft',
      createdAt: matchingBooking.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryCustomTourPlans.unshift(autoPlan);
    savePlansToFile(inMemoryCustomTourPlans);
    return autoPlan;
  }

  return null;
}


/**
 * Admin: Fetch all custom tour plans
 */
export async function getAllCustomTourPlansAdmin(): Promise<CustomTourPlan[]> {
  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('custom_tour_plans')
        .select('*')
        .order('tour_date', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          tourCode: d.tour_code,
          bookingId: d.booking_id,
          customerName: d.customer_name,
          customerKana: d.customer_kana,
          customerEmail: d.customer_email,
          customerPhone: d.customer_phone,
          tourTitle: d.tour_title,
          tourDate: d.tour_date,
          endDate: d.end_date,
          pickupTime: d.pickup_time,
          pickupLocation: d.pickup_location,
          adultsCount: d.adults_count ?? 1,
          childrenCount: d.children_count ?? 0,
          participantsNotes: d.participants_notes,
          schedule: d.schedule || [],
          guideNotes: d.guide_notes,
          driveUrl: d.drive_url,
          photoStatus: d.photo_status || 'pending',
          photosUploadedAt: d.photos_uploaded_at,
          photosExpireAt: d.photos_expire_at,
          status: d.status || 'confirmed',
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch custom_tour_plans from Supabase, using local:', err);
    }
  }

  const diskPlans = loadPlansFromFile();
  inMemoryCustomTourPlans = diskPlans;
  return [...inMemoryCustomTourPlans].sort((a, b) => b.tourDate.localeCompare(a.tourDate));
}

/**
 * Admin: Upsert (Create or Update) custom tour plan
 */
export async function upsertCustomTourPlan(
  plan: Partial<CustomTourPlan> & { customerName: string; customerEmail: string; tourTitle: string; tourDate: string }
): Promise<{ success: boolean; data?: CustomTourPlan; error?: string }> {
  const nowIso = new Date().toISOString();
  const id = plan.id || `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const tourCode = plan.tourCode?.trim() ? plan.tourCode.trim().toUpperCase() : generateTourCode();

  // If photos are ready and photosExpireAt not set, default to 7 days from now
  let photosExpireAt = plan.photosExpireAt;
  if (!photosExpireAt && plan.driveUrl) {
    const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    photosExpireAt = expireDate.toISOString();
  }

  const record: CustomTourPlan = {
    id,
    tourCode,
    bookingId: plan.bookingId,
    customerName: plan.customerName.trim(),
    customerKana: plan.customerKana?.trim(),
    customerEmail: plan.customerEmail.trim().toLowerCase(),
    customerPhone: plan.customerPhone?.trim(),
    tourTitle: plan.tourTitle.trim(),
    tourDate: plan.tourDate,
    endDate: plan.endDate,
    pickupTime: plan.pickupTime?.trim(),
    pickupLocation: plan.pickupLocation?.trim(),
    adultsCount: plan.adultsCount ?? 1,
    childrenCount: plan.childrenCount ?? 0,
    participantsNotes: plan.participantsNotes?.trim(),
    schedule: Array.isArray(plan.schedule) ? plan.schedule : [],
    guideNotes: plan.guideNotes?.trim(),
    driveUrl: plan.driveUrl?.trim(),
    photoStatus: plan.photoStatus || (plan.driveUrl ? 'ready' : 'pending'),
    photosUploadedAt: plan.driveUrl ? (plan.photosUploadedAt || nowIso) : undefined,
    photosExpireAt,
    status: plan.status || 'confirmed',
    createdAt: plan.createdAt || nowIso,
    updatedAt: nowIso,
  };

  // Update in-memory cache & persist to file
  const existingIdx = inMemoryCustomTourPlans.findIndex((p) => p.id === id || p.tourCode === tourCode);
  if (existingIdx >= 0) {
    inMemoryCustomTourPlans[existingIdx] = record;
  } else {
    inMemoryCustomTourPlans.unshift(record);
  }
  savePlansToFile(inMemoryCustomTourPlans);

  // Synchronize changes back to bookings store
  const matchingBooking = inMemoryBookings.find(
    (b) => (record.tourCode && b.bookingCode === record.tourCode) || b.id === record.bookingId
  );
  if (matchingBooking) {
    matchingBooking.name = record.customerName;
    matchingBooking.kana = record.customerKana || matchingBooking.kana;
    matchingBooking.email = record.customerEmail;
    matchingBooking.tourName = record.tourTitle;
    matchingBooking.preferredDate = record.tourDate;
    matchingBooking.endDate = record.endDate;
    matchingBooking.alternativeDate = record.endDate || matchingBooking.alternativeDate;
    matchingBooking.adultsCount = record.adultsCount;
    matchingBooking.childrenCount = record.childrenCount;
    matchingBooking.hotelName = record.pickupLocation || matchingBooking.hotelName;
    matchingBooking.status =
      record.status === 'confirmed' ? 'confirmed' : record.status === 'cancelled' ? 'cancelled' : 'pending';
    saveBookingsToFile(inMemoryBookings);
  }

  const client = getClient();
  if (client) {
    try {
      const { error } = await client.from('custom_tour_plans').upsert(
        {
          id: record.id,
          tour_code: record.tourCode,
          booking_id: record.bookingId || null,
          customer_name: record.customerName,
          customer_kana: record.customerKana || null,
          customer_email: record.customerEmail,
          customer_phone: record.customerPhone || null,
          tour_title: record.tourTitle,
          tour_date: record.tourDate,
          end_date: record.endDate || null,
          pickup_time: record.pickupTime || null,
          pickup_location: record.pickupLocation || null,
          adults_count: record.adultsCount,
          children_count: record.childrenCount,
          participants_notes: record.participantsNotes || null,
          schedule: record.schedule,
          guide_notes: record.guideNotes || null,
          drive_url: record.driveUrl || null,
          photo_status: record.photoStatus,
          photos_uploaded_at: record.photosUploadedAt || null,
          photos_expire_at: record.photosExpireAt || null,
          status: record.status,
          updated_at: nowIso,
        },
        { onConflict: 'tour_code' }
      );

      if (error) {
        console.warn('Supabase custom_tour_plans upsert warning:', error);
      }

      if (matchingBooking && matchingBooking.id) {
        await client.from('bookings').update({
          name: record.customerName,
          kana: record.customerKana || matchingBooking.kana,
          email: record.customerEmail,
          tour_name: record.tourTitle,
          preferred_date: record.tourDate,
          alternative_date: record.endDate || matchingBooking.alternativeDate,
          adults_count: record.adultsCount,
          children_count: record.childrenCount,
          hotel_name: record.pickupLocation || matchingBooking.hotelName,
          status: record.status === 'confirmed' ? 'confirmed' : record.status === 'cancelled' ? 'cancelled' : 'pending',
          updated_at: nowIso,
        }).eq('id', matchingBooking.id);
      }
    } catch (err) {
      console.warn('Supabase custom_tour_plans error, saved to in-memory store:', err);
    }
  }

  return { success: true, data: record };
}

/**
 * Admin: Delete custom tour plan
 */
export async function deleteCustomTourPlan(id: string): Promise<boolean> {
  inMemoryCustomTourPlans = inMemoryCustomTourPlans.filter((p) => p.id !== id);
  savePlansToFile(inMemoryCustomTourPlans);
  const client = getClient();
  if (client) {
    try {
      await client.from('custom_tour_plans').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase custom_tour_plans delete error:', err);
    }
  }
  return true;
}

/**
 * Admin: Delete booking
 */
export async function deleteBooking(id: string): Promise<boolean> {
  inMemoryBookings = inMemoryBookings.filter((b) => b.id !== id);
  saveBookingsToFile(inMemoryBookings);
  const client = getClient();
  if (client) {
    try {
      await client.from('bookings').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase bookings delete error:', err);
    }
  }
  return true;
}

