import { fetchAllBookingsAdmin } from '@/lib/supabase';
import BookingsManagerClient from '@/components/admin/BookingsManagerClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminBookingsPage() {
  const bookings = await fetchAllBookingsAdmin();

  return <BookingsManagerClient initialBookings={bookings} />;
}
