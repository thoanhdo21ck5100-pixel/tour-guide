import { NextRequest, NextResponse } from 'next/server';
import { fetchAllBookingsAdmin, updateBookingStatus, deleteBooking } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const bookings = await fetchAllBookingsAdmin();
    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid booking ID or status' }, { status: 400 });
    }

    const result = await updateBookingStatus(id, status);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id, status });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    const success = await deleteBooking(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

