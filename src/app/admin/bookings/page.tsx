import { fetchAllBookingsAdmin, getAllCustomTourPlansAdmin } from '@/lib/supabase';
import BookingsManagerClient from '@/components/admin/BookingsManagerClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminBookingsPage() {
  const [bookings, plans] = await Promise.all([
    fetchAllBookingsAdmin(),
    getAllCustomTourPlansAdmin(),
  ]);

  return <BookingsManagerClient initialBookings={bookings} initialPlans={plans} />;
}
