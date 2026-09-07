import nodemailer from 'nodemailer';
import { BookingSubmission } from '@/types';

const GMAIL_USER = process.env.GMAIL_USER || 'nihongoguide01@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || GMAIL_USER;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vietnam-nihongo-guide.com';

/**
 * Create Gmail SMTP Transporter
 */
function createTransporter() {
  const rawPass = process.env.GMAIL_APP_PASSWORD;
  if (!rawPass) {
    return null;
  }

  const cleanPass = rawPass.replace(/\s+/g, '');

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: cleanPass,
    },
  });
}

/**
 * Format date display text (single day vs multi day)
 */
function formatDateDisplay(submission: BookingSubmission): string {
  if (submission.tripType === 'multi' && submission.endDate) {
    const s = new Date(submission.preferredDate);
    const e = new Date(submission.endDate);
    const diffDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const durationLabel =
      diffDays > 1 ? `（${diffDays - 1}泊${diffDays}日 / 全${diffDays}日間）` : '（1日間）';
    return `${submission.preferredDate} 〜 ${submission.endDate} ${durationLabel}`;
  }

  return `${submission.preferredDate}${
    submission.alternativeDate ? `（第2希望: ${submission.alternativeDate}）` : ''
  }`;
}

/**
 * 1. Send Notification Email to Guide Admin (nihongoguide01@gmail.com)
 */
export async function sendAdminBookingEmail(
  submission: BookingSubmission,
  bookingCode: string
): Promise<boolean> {
  const dateText = formatDateDisplay(submission);
  const adminUrl = `${SITE_URL}/admin/bookings`;

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1e293b; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #0B2545; padding: 20px 24px; color: #ffffff;">
        <span style="background: #f59e0b; color: #000; font-size: 11px; font-weight: bold; padding: 3px 8px; rounded: 4px; text-transform: uppercase;">新規予約リクエスト</span>
        <h2 style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold;">
          予約管理番号: <span style="color: #fcd34d;">${bookingCode}</span>
        </h2>
      </div>

      <div style="padding: 24px;">
        <p style="font-size: 14px; margin-top: 0;">
          お客様より新しいツアー予約・無料相談リクエストが届きました。内容をご確認の上、24時間以内にご連絡をお願いいたします。
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; width: 35%; color: #64748b;">予約管理番号</th>
            <td style="padding: 10px; font-weight: bold; font-family: monospace; font-size: 14px; color: #0B2545;">${bookingCode}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b;">お客様名</th>
            <td style="padding: 10px; font-weight: bold;">${submission.name} 様 <span style="font-size: 11px; color: #64748b;">(${submission.kana})</span></td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b;">ツアープラン</th>
            <td style="padding: 10px; font-weight: bold; color: #0B2545;">${submission.tourName || submission.tourSlug}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b;">ご希望日程</th>
            <td style="padding: 10px; font-weight: bold; font-family: monospace; color: #d97706;">${dateText}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b;">参加人数</th>
            <td style="padding: 10px;">大人 <strong>${submission.adultsCount}</strong>名 / お子様 <strong>${submission.childrenCount}</strong>名</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b;">宿泊先ホテル</th>
            <td style="padding: 10px;">${submission.hotelName || '未定・未入力'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b;">第一連絡先</th>
            <td style="padding: 10px; font-family: monospace; font-weight: bold;">
              <span style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-right: 4px;">[${submission.contactType.toUpperCase()}]</span>
              ${submission.contactValue}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b;">メールアドレス</th>
            <td style="padding: 10px; font-family: monospace;">${submission.email || '未入力'}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 10px; background: #f8fafc; vertical-align: top; color: #64748b;">ご要望・ご相談詳細</th>
            <td style="padding: 10px; white-space: pre-wrap; font-size: 12px; background: #fdfaf6; border-radius: 6px;">${submission.specialRequests || '特になし'}</td>
          </tr>
        </table>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${adminUrl}" style="display: inline-block; background: #0B2545; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 13px;">
            管理ダッシュボードを開いて対応する →
          </a>
        </div>
      </div>
    </div>
  `;

  // 1. Try Gmail SMTP
  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"ベトナム日本語ガイド システム" <${GMAIL_USER}>`,
        to: ADMIN_EMAIL,
        replyTo: submission.email || GMAIL_USER,
        subject: `【新規予約: ${bookingCode}】${submission.name}様 (${submission.preferredDate})`,
        html: htmlContent,
      });
      console.log(`[EMAIL] Admin notification sent via Gmail SMTP for ${bookingCode}`);
      return true;
    } catch (err) {
      console.error('[EMAIL] Failed to send admin notification via Gmail SMTP:', err);
    }
  }

  // 2. Fallback to Resend API if configured
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: ADMIN_EMAIL,
          subject: `【新規予約: ${bookingCode}】${submission.name}様 (${submission.preferredDate})`,
          html: htmlContent,
        }),
      });
      console.log(`[EMAIL] Admin notification sent via Resend for ${bookingCode}`);
      return true;
    } catch (resendErr) {
      console.error('[EMAIL] Failed to send admin notification via Resend:', resendErr);
    }
  }

  return false;
}

/**
 * 2. Send Polite Thank-you & Reception Confirmation Email to Customer
 */
export async function sendCustomerConfirmationEmail(
  submission: BookingSubmission,
  bookingCode: string,
  customerEmail: string
): Promise<boolean> {
  const dateText = formatDateDisplay(submission);

  const customerHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.7; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      {/* Header Banner */}
      <div style="background: linear-gradient(135deg, #0B2545 0%, #133E68 100%); padding: 24px 28px; color: #ffffff;">
        <span style="background: #f59e0b; color: #000; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">受付完了</span>
        <h1 style="margin: 10px 0 4px 0; font-size: 20px; font-weight: bold; color: #ffffff;">
          【ベトナム日本語ガイド】ご予約・ご相談リクエストを承りました
        </h1>
        <p style="margin: 0; font-size: 12px; color: #cbd5e1;">
          ダナン・ホイアン 1日1組限定プライベートツアー
        </p>
      </div>

      <div style="padding: 28px;">
        <p style="font-size: 14px; margin-top: 0;">
          <strong>${submission.name} 様</strong>
        </p>

        <p style="font-size: 13px; color: #334155;">
          この度はベトナム日本語ガイド（プライベートツアー）へのお問い合わせ・仮予約をいただき、誠にありがとうございます。<br />
          専属ガイドのアン トー（Anh Tho）です。
        </p>

        <p style="font-size: 13px; color: #334155;">
          以下の内容でリクエストを受け付けいたしました。<br />
          専属ガイドが内容を確認の上、<strong>24時間以内</strong>にご指定の連絡先（LINEまたはこちらのメール）へ、旅程プラン詳細・お見積もりをご案内させていただきます。
        </p>

        {/* Booking Code Highlight Box */}
        <div style="background: #fefce8; border: 2px dashed #f59e0b; border-radius: 10px; padding: 16px; text-align: center; margin: 24px 0;">
          <span style="font-size: 11px; font-weight: bold; color: #92400e; display: block; text-transform: uppercase;">お客様の予約管理番号</span>
          <span style="font-size: 24px; font-weight: 900; font-family: monospace; color: #0B2545; letter-spacing: 1px;">
            ${bookingCode}
          </span>
          <span style="font-size: 11px; color: #78350f; display: block; margin-top: 4px;">
            ※今後のやり取りや確認の際、こちらの番号をお伝えいただくとスムーズです。
          </span>
        </div>

        {/* Details Table */}
        <h3 style="font-size: 14px; font-weight: bold; color: #0B2545; margin: 24px 0 12px 0; border-left: 4px solid #f59e0b; padding-left: 8px;">
          お申し込み内容の控え
        </h3>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; width: 35%; color: #64748b;">ツアープラン</th>
            <td style="padding: 10px; font-weight: bold; color: #0B2545;">${submission.tourName || submission.tourSlug}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b;">ご希望日程</th>
            <td style="padding: 10px; font-weight: bold; font-family: monospace; color: #d97706;">${dateText}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b;">参加人数</th>
            <td style="padding: 10px;">大人 <strong>${submission.adultsCount}</strong>名${submission.childrenCount > 0 ? ` / お子様 <strong>${submission.childrenCount}</strong>名` : ''}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b;">宿泊先ホテル</th>
            <td style="padding: 10px;">${submission.hotelName || '未定・未入力'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <th style="text-align: left; padding: 10px; background: #f8fafc; color: #64748b;">第一連絡先</th>
            <td style="padding: 10px; font-family: monospace;">[${submission.contactType.toUpperCase()}] ${submission.contactValue}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 10px; background: #f8fafc; vertical-align: top; color: #64748b;">ご相談内容・ご要望</th>
            <td style="padding: 10px; white-space: pre-wrap; font-size: 12px; background: #fdfaf6;">${submission.specialRequests || '特になし'}</td>
          </tr>
        </table>

        {/* Important Reassurance Notices */}
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; font-size: 12px; color: #166534; margin: 20px 0;">
          <p style="margin: 0 0 6px 0; font-weight: bold;">
            🌿 ご安心ください（事前決済は不要です）
          </p>
          <ul style="margin: 0; padding-left: 18px; line-height: 1.6;">
            <li>このフォームを送信した時点では、<strong>予約確定ではありません</strong>。ガイドより日程・プランをご確認させていただいた上で確定となります。</li>
            <li>ツアー料金は<strong>ベトナム到着後に全額お支払い</strong>いただけます（日本円・ベトナムドン両替対応）。</li>
            <li>ご予定日の1週間前までのキャンセルは、キャンセル料は一切かかりません。</li>
          </ul>
        </div>

        {/* LINE Callout */}
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold; color: #0B2545;">
            LINEでもスムーズにご相談・やり取りいただけます
          </p>
          <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b;">
            公式LINEを追加いただき「予約番号 ${bookingCode} の${submission.name}です」と一言メッセージをいただければ、最優先でスムーズにご案内可能です。
          </p>
          <a href="https://lin.ee/vssKBHS" style="display: inline-block; background: #06C755; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 12px;">
            公式LINEで連絡する (ID: @564pshie)
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0 20px 0;" />

        {/* Signature */}
        <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
          <strong style="color: #0B2545; font-size: 13px;">ベトナム日本語ガイド（Anh Tho Guide Service）</strong><br />
          専属ガイド: アン トー（Anh Tho / JLPT N1取得）<br />
          E-mail: <a href="mailto:nihongoguide01@gmail.com" style="color: #0284c7; text-decoration: none;">nihongoguide01@gmail.com</a><br />
          公式サイト: <a href="https://vietnam-nihongo-guide.com" style="color: #0284c7; text-decoration: none;">https://vietnam-nihongo-guide.com</a><br />
          公式LINE: @564pshie / Instagram: @vietnam_nihongo_guide.co<br />
          所在地: Da Nang & Hoi An, Vietnam
        </div>
      </div>
    </div>
  `;

  // 1. Try Gmail SMTP
  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"ベトナム日本語ガイド (Anh Tho)" <${GMAIL_USER}>`,
        to: customerEmail,
        replyTo: GMAIL_USER,
        subject: `【ベトナム日本語ガイド】ご予約・ご相談リクエストを承りました（予約番号: ${bookingCode}）`,
        html: customerHtml,
      });
      console.log(`[EMAIL] Customer confirmation sent via Gmail SMTP to ${customerEmail}`);
      return true;
    } catch (err) {
      console.error('[EMAIL] Failed to send customer confirmation via Gmail SMTP:', err);
    }
  }

  // 2. Fallback to Resend API
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: customerEmail,
          reply_to: GMAIL_USER,
          subject: `【ベトナム日本語ガイド】ご予約・ご相談リクエストを承りました（予約番号: ${bookingCode}）`,
          html: customerHtml,
        }),
      });
      console.log(`[EMAIL] Customer confirmation sent via Resend to ${customerEmail}`);
      return true;
    } catch (resendErr) {
      console.error('[EMAIL] Failed to send customer confirmation via Resend:', resendErr);
    }
  }

  return false;
}
