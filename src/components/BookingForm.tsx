'use client';

import { useState, useEffect } from 'react';
import { TOURS_DATA } from '@/lib/data/tours';
import { ContactMethod } from '@/types';
import { CheckCircle, AlertCircle, Loader2, MessageCircle, CalendarCheck, ShieldCheck } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import { SITE_CONFIG } from '@/lib/seo';

interface BookingFormProps {
  initialDate?: string;
  initialTourSlug?: string;
}

export default function BookingForm({ initialDate, initialTourSlug }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    kana: '',
    contactType: 'line' as ContactMethod,
    contactValue: '',
    backupEmail: '',
    consultationType: 'このプランを予約したい',
    tripType: 'single' as 'single' | 'multi',
    tourSlug: initialTourSlug || 'danang-hoian-classic-day-trip',
    preferredDate: initialDate || '',
    endDate: '',
    alternativeDate: '',
    adultsCount: 2,
    childrenCount: 0,
    hotelName: '',
    specialRequests: '',
  });

  // Sync when initialDate changes from calendar selection
  useEffect(() => {
    if (initialDate) {
      setFormData((prev) => ({ ...prev, preferredDate: initialDate }));
    }
  }, [initialDate]);

  useEffect(() => {
    if (initialTourSlug) {
      setFormData((prev) => ({ ...prev, tourSlug: initialTourSlug }));
    }
  }, [initialTourSlug]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Helper to calculate trip duration
  const getTripDurationText = (start: string, end: string) => {
    if (!start || !end) return null;
    const s = new Date(start);
    const e = new Date(end);
    const diffDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (isNaN(diffDays) || diffDays <= 0) return null;
    if (diffDays === 1) return '（日帰り / 1日間）';
    return `（${diffDays - 1}泊${diffDays}日 / 全${diffDays}日間）`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Multi-day validation: end date must be on or after start date
    if (formData.tripType === 'multi') {
      if (!formData.endDate) {
        setErrorMessage('複数日プランの場合はツアー終了日を選択してください。');
        return;
      }
      if (formData.endDate < formData.preferredDate) {
        setErrorMessage('ツアー終了日は開始日以降の日付を選択してください。');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const emailValue =
        formData.contactType === 'email'
          ? formData.contactValue.trim()
          : formData.backupEmail.trim();

      // Format clean readable structured header in specialRequests
      const durationTag =
        formData.tripType === 'multi' && formData.endDate
          ? `【日程タイプ: 複数日（${formData.preferredDate} 〜 ${formData.endDate} ${getTripDurationText(formData.preferredDate, formData.endDate) || ''}）】`
          : `【日程タイプ: 1日プラン（希望日: ${formData.preferredDate}）】`;

      const backupEmailTag =
        formData.contactType !== 'email' && formData.backupEmail.trim()
          ? `【予備メールアドレス: ${formData.backupEmail.trim()}】`
          : '';

      const consultationTag = formData.consultationType
        ? `【ご相談内容: ${formData.consultationType}】`
        : '';

      const tags = [durationTag, backupEmailTag, consultationTag].filter(Boolean).join('\n');
      const combinedRequests = tags
        ? `${tags}${formData.specialRequests.trim() ? `\n\n${formData.specialRequests.trim()}` : ''}`
        : formData.specialRequests.trim();

      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: emailValue || undefined,
          tripType: formData.tripType,
          endDate: formData.tripType === 'multi' ? formData.endDate : undefined,
          alternativeDate:
            formData.tripType === 'multi' ? formData.endDate : formData.alternativeDate || undefined,
          specialRequests: combinedRequests,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '予約送信中にエラーが発生しました。');
      }

      setBookingId(data.bookingId);
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('予期せぬエラーが発生しました。時間をおいて再度お試しください。');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative">
      {/* Success State Modal / Overlay */}
      {isSuccess ? (
        <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-bold text-[#0B2545] tracking-tight">
            予約・相談リクエストを承りました！
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            受付管理番号: <span className="font-mono font-bold text-slate-700">{bookingId}</span>
          </p>

          <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs leading-relaxed text-slate-700 space-y-2">
            <p className="font-bold text-[#0B2545] flex items-center gap-1.5 text-sm">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              今後の流れについて
            </p>
            <p>
              ご入力いただいた連絡先（{formData.contactType.toUpperCase()}: {formData.contactValue}）
              {formData.contactType !== 'email' && formData.backupEmail.trim() && (
                <span className="font-semibold text-slate-800">
                  {' '}／ 予備メール: {formData.backupEmail.trim()}
                </span>
              )}
              宛てに、内容を確認のうえLINEまたはメールにてご連絡いたします。
            </p>
            <p className="text-amber-700 font-bold bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              ※このフォームを送信した時点では、予約確定ではありません。内容を確認後、詳細をご案内いたします。
            </p>
            <p className="text-slate-600">
              ※事前決済は不要です。ツアー料金はベトナム到着後に全額お支払いいただけます（日本円・ベトナムドン対応）。
            </p>
          </div>

          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-xs font-bold text-emerald-800">
                LINEでさらにスムーズにやり取り可能！
              </p>
              <p className="text-[11px] text-emerald-700">
                公式LINEを追加して「予約相談した{formData.name}です」と一言送っていただくと最優先で返信いたします。
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <a
                href={SITE_CONFIG.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#06c755] hover:bg-[#05b34c] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                LINE友だち追加
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
                Instagram DM
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setFormData((prev) => ({
                ...prev,
                preferredDate: '',
                endDate: '',
                alternativeDate: '',
                specialRequests: '',
              }));
            }}
            className="mt-6 text-xs text-slate-500 hover:text-slate-800 underline transition-colors"
          >
            別の日程や別のツアーを相談する
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Header */}
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
              RESERVATION & INQUIRY
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#0B2545] tracking-tight">
              プライベートツアー 予約・無料相談フォーム
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              事前決済不要・到着後に全額お支払い。内容確認後、LINEまたはメールで詳細をご連絡します（送信時点では予約確定ではありません）。
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                お名前（漢字） <span className="text-rose-500">*必須</span>
              </label>
              <input
                type="text"
                required
                placeholder="例: 山田 太郎"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                フリガナ（カタカナ） <span className="text-rose-500">*必須</span>
              </label>
              <input
                type="text"
                required
                placeholder="例: ヤマダ タロウ"
                value={formData.kana}
                onChange={(e) => setFormData({ ...formData, kana: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>

          {/* Contact Preference */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  希望のご連絡ツール <span className="text-rose-500">*必須</span>
                </label>
                <select
                  value={formData.contactType}
                  onChange={(e) =>
                    setFormData({ ...formData, contactType: e.target.value as ContactMethod })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="line">LINE (推奨)</option>
                  <option value="instagram">Instagram DM</option>
                  <option value="email">メールアドレス</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {formData.contactType === 'line'
                    ? 'LINE ID または お電話番号'
                    : formData.contactType === 'email'
                    ? 'ご連絡先メールアドレス'
                    : formData.contactType === 'instagram'
                    ? 'Instagramユーザーネーム (@...)'
                    : 'WhatsApp番号'}{' '}
                  <span className="text-rose-500">*必須</span>
                </label>
                <input
                  type={formData.contactType === 'email' ? 'email' : 'text'}
                  required
                  placeholder={
                    formData.contactType === 'line'
                      ? '例: yamada_line123 または 090-xxxx-xxxx'
                      : formData.contactType === 'email'
                      ? '例: yamada@example.com'
                      : formData.contactType === 'instagram'
                      ? '例: @taro_travel_danang'
                      : '例: +81-90-xxxx-xxxx'
                  }
                  value={formData.contactValue}
                  onChange={(e) => setFormData({ ...formData, contactValue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
            </div>

            {/* Dedicated Email Field (Optional for backup / ID typo prevention) */}
            {formData.contactType !== 'email' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>
                    メールアドレス <span className="text-slate-400 font-normal">（任意・予備連絡先）</span>
                  </span>
                  <span className="text-[10px] text-amber-600 font-normal">
                    ※ID入力ミス防止・確認用
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="例: yamada@example.com（LINEのID検索が不可の際などの予備連絡先として）"
                  value={formData.backupEmail}
                  onChange={(e) => setFormData({ ...formData, backupEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  ※LINE等のIDに誤りがあった場合の確認用としてご入力いただけます（任意）
                </span>
              </div>
            )}
          </div>

          {/* Tour Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ご希望のツアープラン <span className="text-rose-500">*必須</span>
            </label>
            <select
              value={formData.tourSlug}
              onChange={(e) => setFormData({ ...formData, tourSlug: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            >
              {TOURS_DATA.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.title} ({t.duration} / {t.priceJpy.toLocaleString('ja-JP')}円〜)
                </option>
              ))}
              <option value="custom-consultation">
                【旅程相談】行きたい場所を相談して決めたい（無料）
              </option>
            </select>
          </div>

          {/* Consultation Type (ご相談内容) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              ご相談内容 <span className="text-rose-500">*必須</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { value: 'このプランを予約したい', label: 'このプランを予約したい' },
                { value: 'このプランをアレンジしたい', label: 'このプランをアレンジしたい' },
                { value: 'オーダーメイドで相談したい', label: 'オーダーメイドで相談したい' },
                { value: 'その他', label: 'その他・ご質問' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    formData.consultationType === opt.value
                      ? 'border-amber-500 bg-amber-50/70 text-[#0B2545] font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="consultationType"
                    value={opt.value}
                    checked={formData.consultationType === opt.value}
                    onChange={(e) =>
                      setFormData({ ...formData, consultationType: e.target.value })
                    }
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            {formData.consultationType === 'このプランをアレンジしたい' && (
              <p className="text-[11px] text-amber-700 mt-2 bg-amber-50 p-2.5 rounded-lg border border-amber-200/80">
                💡 「ホイアンでは〇〇に行きたい」「昼食をベトナム料理に変更したい」など、下のご要望欄にお気軽にご記入ください。
              </p>
            )}
          </div>

          {/* Trip Duration Type (1日のみ vs 複数日・日程期間) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ツアー日程タイプ <span className="text-rose-500">*必須</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tripType: 'single' })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  formData.tripType === 'single'
                    ? 'border-amber-500 bg-amber-50/80 text-[#0B2545] font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>☀️ 1日プラン（日帰り）</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, tripType: 'multi' })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  formData.tripType === 'multi'
                    ? 'border-amber-500 bg-amber-50/80 text-[#0B2545] font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>🗓️ 複数日（周遊・連泊）</span>
              </button>
            </div>
          </div>

          {/* Dates Selection */}
          {formData.tripType === 'single' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  第1希望日 <span className="text-rose-500">*必須</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  ※左のカレンダーから日付をクリックしても自動入力されます
                </span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  第2希望日 <span className="text-slate-400 font-normal">（任意）</span>
                </label>
                <input
                  type="date"
                  value={formData.alternativeDate}
                  onChange={(e) => setFormData({ ...formData, alternativeDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ツアー開始日 <span className="text-rose-500">*必須</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    ※左のカレンダーから日付をクリックしてもセットされます
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ツアー終了日（最終日） <span className="text-rose-500">*必須</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={formData.preferredDate || undefined}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
              </div>

              {formData.preferredDate && formData.endDate && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold flex items-center justify-between">
                  <span>
                    🗓️ ご希望日程: {formData.preferredDate} 〜 {formData.endDate}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-950 text-[11px]">
                    {getTripDurationText(formData.preferredDate, formData.endDate) || '期間設定済'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Number of Pax */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                大人（中学生以上） <span className="text-rose-500">*必須</span>
              </label>
              <select
                value={formData.adultsCount}
                onChange={(e) =>
                  setFormData({ ...formData, adultsCount: parseInt(e.target.value, 10) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} 名様
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                お子様（小学生以下）
              </label>
              <select
                value={formData.childrenCount}
                onChange={(e) =>
                  setFormData({ ...formData, childrenCount: parseInt(e.target.value, 10) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} 名様
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hotel Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ご宿泊先ホテル名（または予定エリア・都市）
            </label>
            <input
              type="text"
              placeholder="例: ハイアット リージェンシー ダナン、ハノイ旧市街、ホーチミン市内など（未定の場合は「未定」）"
              value={formData.hotelName}
              onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          {/* Message / Special Requests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ご質問・ご要望・希望都市やアレルギー等
            </label>
            <textarea
              rows={3}
              placeholder="例: フライト到着が14:00なので15:00スタートにできますか？ダナン以外の都市（ハノイやホーチミン等）のツアーも相談したいです。パクチーが苦手です。"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          {/* Reassurance note */}
          <div className="p-3.5 bg-slate-50 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-600 border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-800">
                事前決済不要（ツアー料金はベトナム到着後に全額お支払い）
              </p>
              <p className="text-slate-600 leading-relaxed">
                ※フォーム送信時点では予約確定ではありません。内容を確認後、LINEまたはメールで詳細をご案内いたします。
                キャンセルをご希望の場合は、原則としてご予定日の1週間前までにご連絡ください（1週間前までのキャンセル：キャンセル料なし）。
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>送信中...</span>
              </>
            ) : (
              <span>予約・無料相談を申し込む（事前決済不要）</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
