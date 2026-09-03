import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateDateAvailability } from '@/lib/supabase';

const AvailabilityUpdateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付はYYYY-MM-DD形式で指定してください。'),
  status: z.enum(['available', 'limited', 'booked']),
  note: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parseResult = AvailabilityUpdateSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || '無効なパラメータです。' },
        { status: 400 }
      );
    }

    const { date, status, note } = parseResult.data;
    const result = await updateDateAvailability(date, status, note, 'admin_user');

    return NextResponse.json({
      success: true,
      date,
      status,
      updatedAt: new Date().toISOString(),
      message: `${date} の空き状況を更新しました。`,
    });
  } catch (error) {
    console.error('Failed to update availability:', error);
    return NextResponse.json(
      { error: '空き状況の更新中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}
