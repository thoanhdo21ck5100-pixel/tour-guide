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

    const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vietnam-nihongo-guide.com'}/admin/bookings`;

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

    // 1. Telegram Bot Notification (Instant phone push notification with sound)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const text =
          `🔔 <b>【新規ツアー仮予約が入りました！】</b>\n\n` +
          `👤 <b>お客様名:</b> ${submission.name} (${submission.kana})\n` +
          `📅 <b>第一希望日:</b> ${submission.preferredDate}` +
          (submission.alternativeDate ? `\n📆 <b>第二希望日:</b> ${submission.alternativeDate}` : '') +
          `\n👥 <b>参加人数:</b> 大人 ${submission.adultsCount}名 / お子様 ${submission.childrenCount}名\n` +
          `🏝 <b>ツアー:</b> ${submission.tourName || submission.tourSlug}\n` +
          `🏨 <b>宿泊先:</b> ${submission.hotelName || '未定・未入力'}\n` +
          `💬 <b>連絡方法:</b> [${submission.contactType.toUpperCase()}] <code>${submission.contactValue}</code>\n\n` +
          `📝 <b>ご相談・ご要望:</b>\n${submission.specialRequests || '特になし'}\n\n` +
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
                  { name: '希望日', value: submission.preferredDate, inline: true },
                  { name: '人数', value: `大人${submission.adultsCount}名 / 子${submission.childrenCount}名`, inline: true },
                  { name: 'ツアー', value: submission.tourName || submission.tourSlug },
                  { name: '連絡先', value: `[${submission.contactType.toUpperCase()}] ${submission.contactValue}`, inline: true },
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

    // 3. Email Notification via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'nihongoguide01@gmail.com';
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: recipient,
            subject: `【新規予約】${submission.name}様よりツアー仮予約 (${submission.preferredDate})`,
            html: `
              <h2>🔔 新しいツアー仮予約・相談リクエストを受信しました</h2>
              <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-family:sans-serif; font-size:14px;">
                <tr><th style="background:#f1f5f9; text-align:left;">お客様名</th><td>${submission.name} (${submission.kana})</td></tr>
                <tr><th style="background:#f1f5f9; text-align:left;">ツアー</th><td>${submission.tourName || submission.tourSlug}</td></tr>
                <tr><th style="background:#f1f5f9; text-align:left;">第一希望日</th><td>${submission.preferredDate}</td></tr>
                <tr><th style="background:#f1f5f9; text-align:left;">第二希望日</th><td>${submission.alternativeDate || 'なし'}</td></tr>
                <tr><th style="background:#f1f5f9; text-align:left;">参加人数</th><td>大人: ${submission.adultsCount}名 / お子様: ${submission.childrenCount}名</td></tr>
                <tr><th style="background:#f1f5f9; text-align:left;">宿泊先ホテル</th><td>${submission.hotelName || '未定'}</td></tr>
                <tr><th style="background:#f1f5f9; text-align:left;">ご連絡先</th><td>[${submission.contactType.toUpperCase()}] ${submission.contactValue}</td></tr>
                <tr><th style="background:#f1f5f9; text-align:left;">ご相談内容・ご要望</th><td><pre style="margin:0; font-family:inherit;">${submission.specialRequests || '特になし'}</pre></td></tr>
              </table>
              <p style="margin-top:16px;"><a href="${adminUrl}" style="background:#0B2545; color:#fff; padding:10px 18px; text-decoration:none; border-radius:8px; font-weight:bold;">管理画面で詳細を見る</a></p>
            `,
          }),
        });
      } catch (emailErr) {
        console.warn('Resend email dispatch failed:', emailErr);
      }
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
