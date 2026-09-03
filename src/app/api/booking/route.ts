import { NextRequest, NextResponse } from 'next/server';
import { saveBooking } from '@/lib/supabase';
import { BookingSubmission } from '@/types';
import { getTourBySlug } from '@/lib/data/tours';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      kana,
      contactType,
      contactValue,
      tourSlug,
      preferredDate,
      alternativeDate,
      adultsCount,
      childrenCount = 0,
      hotelName,
      specialRequests,
    } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'お名前を入力してください。' }, { status: 400 });
    }
    if (!kana || typeof kana !== 'string' || kana.trim().length === 0) {
      return NextResponse.json({ error: 'フリガナを入力してください。' }, { status: 400 });
    }
    if (!contactType || !['line', 'instagram', 'email', 'whatsapp'].includes(contactType)) {
      return NextResponse.json({ error: '連絡方法を選択してください。' }, { status: 400 });
    }
    if (!contactValue || typeof contactValue !== 'string' || contactValue.trim().length === 0) {
      return NextResponse.json({ error: 'ご連絡先（IDまたはメールアドレス）を入力してください。' }, { status: 400 });
    }
    if (!tourSlug || typeof tourSlug !== 'string') {
      return NextResponse.json({ error: 'ツアーを選択してください。' }, { status: 400 });
    }
    if (!preferredDate || !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
      return NextResponse.json({ error: '第一希望日を正しい日付形式で選択してください。' }, { status: 400 });
    }

    const adults = parseInt(adultsCount, 10);
    if (isNaN(adults) || adults < 1) {
      return NextResponse.json({ error: '大人の参加人数は1名以上を指定してください。' }, { status: 400 });
    }

    const matchedTour = getTourBySlug(tourSlug);
    const tourName = matchedTour ? matchedTour.title : tourSlug;

    const submission: BookingSubmission = {
      name: name.trim(),
      kana: kana.trim(),
      contactType,
      contactValue: contactValue.trim(),
      tourSlug,
      tourName,
      preferredDate,
      alternativeDate: alternativeDate ? alternativeDate.trim() : undefined,
      adultsCount: adults,
      childrenCount: parseInt(childrenCount, 10) || 0,
      hotelName: hotelName ? hotelName.trim() : undefined,
      specialRequests: specialRequests ? specialRequests.trim() : undefined,
    };

    const result = await saveBooking(submission);

    // Simulated Instant Notification Dispatch to Guide (via Webhook / Email / LINE Notify)
    console.log(`[INSTANT NOTIFICATION] New tour booking received:
- ID: ${result.id}
- Customer: ${submission.name} (${submission.kana})
- Contact: [${submission.contactType}] ${submission.contactValue}
- Tour: ${submission.tourName}
- Date: ${submission.preferredDate}
- Pax: 大人 ${submission.adultsCount}名 / お子様 ${submission.childrenCount}名
- Hotel: ${submission.hotelName || '未定'}
- Requests: ${submission.specialRequests || '特になし'}
    `);

    // In production, trigger external webhook (e.g. Discord, Telegram, or Resend Email)
    if (process.env.NOTIFICATION_WEBHOOK_URL) {
      try {
        await fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🔔 **新しいツアー仮予約が入りました！**\nお名前: ${submission.name}\nツアー: ${submission.tourName}\n希望日: ${submission.preferredDate}\n連絡先: ${submission.contactType} (${submission.contactValue})`,
          }),
        });
      } catch (webhookErr) {
        console.warn('Notification webhook dispatch failed:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: result.id,
      message: 'ご予約リクエストを正常に受け付けました。ガイドより24時間以内にご指定の連絡先へご連絡いたします。',
    });
  } catch (error) {
    console.error('Error processing booking submission:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました。時間をおいて再度お試しください。' },
      { status: 500 }
    );
  }
}
