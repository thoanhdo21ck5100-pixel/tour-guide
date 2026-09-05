import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAllTours, upsertTour, deleteTour } from '@/lib/supabase';
import { Tour } from '@/types';

const TourSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'スラグは小文字英数字とハイフンのみで入力してください。'),
  title: z.string().min(2, 'ツアータイトルを入力してください。'),
  subtitle: z.string().min(2, 'サブタイトルを入力してください。'),
  category: z.enum(['classic', 'women', 'men', 'food', 'custom', 'family']),
  categoryLabel: z.string().min(1),
  duration: z.string().min(1),
  priceJpy: z.number().int().nonnegative('料金（JPY）は0以上で入力してください。'),
  priceVnd: z.number().int().nonnegative('料金（VND）は0以上で入力してください。'),
  priceNote: z.string().optional(),
  rating: z.number().min(0).max(5).default(5.0),
  reviewCount: z.number().int().nonnegative().default(0),
  heroImage: z.string().min(1, 'メイン画像のURLを指定してください。'),
  badge: z.string().optional(),
  isFeatured: z.boolean().default(false),
  shortDescription: z.string().min(10, '短い説明（抜粋）を入力してください。'),
  fullDescription: z.string().min(20, '詳細説明を入力してください。'),
  highlights: z.array(z.string()).default([]),
  itinerary: z.array(
    z.object({
      time: z.string(),
      title: z.string(),
      description: z.string(),
      location: z.string().optional(),
    })
  ).default([]),
  included: z.array(z.string()).default([]),
  excluded: z.array(z.string()).default([]),
  meetingPlace: z.string().min(1),
  cancellationPolicy: z.string().min(1),
  recommendFor: z.array(z.string()).default([]),
});

export async function GET() {
  try {
    const tours = await getAllTours();
    return NextResponse.json({ tours });
  } catch (error) {
    console.error('Failed to fetch tours:', error);
    return NextResponse.json({ error: 'ツアー一覧の取得に失敗しました。' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parseResult = TourSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'バリデーションエラーが発生しました。' },
        { status: 400 }
      );
    }

    const savedTour = await upsertTour(parseResult.data as Tour, 'admin_user');
    return NextResponse.json({ success: true, tour: savedTour });
  } catch (error) {
    console.error('Failed to save tour:', error);
    return NextResponse.json({ error: 'ツアーの保存に失敗しました。' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: '削除対象のスラグを指定してください。' }, { status: 400 });
    }

    await deleteTour(slug);
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Failed to delete tour:', error);
    return NextResponse.json({ error: 'ツアーの削除に失敗しました。' }, { status: 500 });
  }
}
