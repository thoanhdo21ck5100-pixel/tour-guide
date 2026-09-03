import { NextRequest, NextResponse } from 'next/server';
import { fetchAvailability } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const today = new Date();
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');

    const year = yearParam ? parseInt(yearParam, 10) : today.getFullYear();
    const month = monthParam ? parseInt(monthParam, 10) : today.getMonth() + 1;

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json(
        { error: '無効な年または月が指定されました。' },
        { status: 400 }
      );
    }

    const availability = await fetchAvailability(year, month);

    return NextResponse.json({
      year,
      month,
      availability,
    });
  } catch (error) {
    console.error('Error in availability API:', error);
    return NextResponse.json(
      { error: '空き状況の取得に失敗しました。' },
      { status: 500 }
    );
  }
}
