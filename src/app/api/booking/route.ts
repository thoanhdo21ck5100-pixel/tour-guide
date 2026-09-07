import { NextRequest, NextResponse } from 'next/server';
import { saveBooking } from '@/lib/supabase';
import { BookingSubmission } from '@/types';
import { getTourBySlug } from '@/lib/data/tours';
import { sendAdminBookingEmail, sendCustomerConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      kana,
      contactType,
      contactValue,
      email,
      tripType = 'single',
      tourSlug,
      preferredDate,
      endDate,
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
      return NextResponse.json({ error: 'ツアー希望日（開始日）を正しい日付形式で選択してください。' }, { status: 400 });
    }
    if (tripType === 'multi' && (!endDate || !/^\d{4}-\d{2}-\d{2}$/.test(endDate))) {
      return NextResponse.json({ error: '複数日プランの場合は終了日を正しい日付形式で選択してください。' }, { status: 400 });
    }

    const adults = parseInt(adultsCount, 10);
    if (isNaN(adults) || adults < 1) {
      return NextResponse.json({ error: '大人の参加人数は1名以上を指定してください。' }, { status: 400 });
    }

    const matchedTour = getTourBySlug(tourSlug);
    const tourName = matchedTour ? matchedTour.title : tourSlug;

    // Effective customer email (either from direct email contact or backup email field)
    const customerEmail =
      contactType === 'email'
        ? contactValue.trim()
        : email && typeof email === 'string' && email.trim().length > 0
        ? email.trim()
        : undefined;

    const submission: BookingSubmission = {
      name: name.trim(),
      kana: kana.trim(),
      contactType,
      contactValue: contactValue.trim(),
      email: customerEmail,
      tripType: tripType as 'single' | 'multi',
      tourSlug,
      tourName,
      preferredDate,
      endDate: tripType === 'multi' ? endDate : undefined,
      alternativeDate:
        tripType === 'multi' ? endDate : alternativeDate ? alternativeDate.trim() : undefined,
      adultsCount: adults,
      childrenCount: parseInt(childrenCount, 10) || 0,
      hotelName: hotelName ? hotelName.trim() : undefined,
      specialRequests: specialRequests ? specialRequests.trim() : undefined,
    };

    const result = await saveBooking(submission);

    const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vietnam-nihongo-guide.com'}/admin/bookings`;

    const dateDisplayText =
      tripType === 'multi' && endDate
        ? `複数日・連泊（${preferredDate} 〜 ${endDate}）`
        : `1日（希望日: ${preferredDate}${alternativeDate ? ` / 第2希望: ${alternativeDate}` : ''}）`;

    console.log(`[INSTANT NOTIFICATION] New tour booking received:
- ID: ${result.id}
- Customer: ${submission.name} (${submission.kana})
- Contact: [${submission.contactType}] ${submission.contactValue}
- Email: ${submission.email || '未入力'}
- Trip Type: ${submission.tripType || 'single'}
- Date: ${dateDisplayText}
- Tour: ${submission.tourName}
- Pax: 大人 ${submission.adultsCount}名 / お子様 ${submission.childrenCount}名
- Hotel: ${submission.hotelName || '未定'}
- Requests: ${submission.specialRequests || '特になし'}
    `);

    // 1. Telegram Bot Notification (Instant phone push notification with sound)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const text =
          `🔔 <b>【新規ツアー仮予約が入りました！】</b>\n\n` +
          `👤 <b>お客様名:</b> ${submission.name} (${submission.kana})\n` +
          `🗓 <b>日程:</b> ${dateDisplayText}\n` +
          `👥 <b>参加人数:</b> 大人 ${submission.adultsCount}名 / お子様 ${submission.childrenCount}名\n` +
          `🏝 <b>ツアー:</b> ${submission.tourName || submission.tourSlug}\n` +
          `🏨 <b>宿泊先:</b> ${submission.hotelName || '未定・未入力'}\n` +
          `💬 <b>第一連絡先:</b> [${submission.contactType.toUpperCase()}] <code>${submission.contactValue}</code>\n` +
          (submission.email && submission.contactType !== 'email'
            ? `📧 <b>予備メール:</b> <code>${submission.email}</code>\n`
            : '') +
          `\n📝 <b>ご相談・ご要望:</b>\n${submission.specialRequests || '特になし'}\n\n` +
          `👉 <a href="${adminUrl}">管理画面で確認・対応する</a>`;

        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        });
      } catch (tgErr) {
        console.warn('Telegram notification dispatch failed:', tgErr);
      }
    }

    // 2. Discord Webhook Notification
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title: '🔔 新しいツアー仮予約リクエストを受信しました！',
                color: 0xf59e0b,
                fields: [
                  { name: 'お客様名', value: `${submission.name} (${submission.kana})`, inline: true },
                  { name: '日程', value: dateDisplayText, inline: true },
                  { name: '人数', value: `大人${submission.adultsCount}名 / 子${submission.childrenCount}名`, inline: true },
                  { name: 'ツアー', value: submission.tourName || submission.tourSlug },
                  { name: '連絡先', value: `[${submission.contactType.toUpperCase()}] ${submission.contactValue}`, inline: true },
                  { name: '予備メール', value: submission.email || '未入力', inline: true },
                  { name: '宿泊先', value: submission.hotelName || '未定', inline: true },
                  { name: 'ご要望・相談', value: submission.specialRequests || '特になし' },
                ],
                url: adminUrl,
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      } catch (discordErr) {
        console.warn('Discord notification dispatch failed:', discordErr);
      }
    }

    // 3. Email Notifications via Gmail SMTP (nihongoguide01@gmail.com) or Resend
    try {
      // Send to Admin (nihongoguide01@gmail.com)
      await sendAdminBookingEmail(submission, result.bookingCode);

      // Send to Customer if email provided
      if (customerEmail && customerEmail.includes('@')) {
        await sendCustomerConfirmationEmail(submission, result.bookingCode, customerEmail);
      }
    } catch (emailErr) {
      console.warn('Email notification dispatch failed:', emailErr);
    }

    // 4. In production, trigger external webhook (e.g. Zapier, Make, Slack)
    if (process.env.NOTIFICATION_WEBHOOK_URL) {
      try {
        await fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'new_booking',
            bookingId: result.id,
            bookingCode: result.bookingCode,
            submission,
            adminUrl,
          }),
        });
      } catch (webhookErr) {
        console.warn('Notification webhook dispatch failed:', webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: result.id,
      bookingCode: result.bookingCode,
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
