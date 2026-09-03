'use client';

import { useState, useEffect } from 'react';
import { TOURS_DATA } from '@/lib/data/tours';
import { ContactMethod } from '@/types';
import { CheckCircle, AlertCircle, Loader2, MessageCircle, CalendarCheck, ShieldCheck } from 'lucide-react';

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
    tourSlug: initialTourSlug || 'danang-hoian-classic-day-trip',
    preferredDate: initialDate || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
            仮予約のリクエストを承りました！
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            予約管理番号: <span className="font-mono font-bold text-slate-700">{bookingId}</span>
          </p>

          <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs leading-relaxed text-slate-700 space-y-2">
            <p className="font-bold text-[#0B2545] flex items-center gap-1.5 text-sm">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              今後の流れについて
            </p>
            <p>
              ご入力いただいた連絡先（{formData.contactType.toUpperCase()}: {formData.contactValue}）宛てに、専属ガイドより原則<strong>24時間以内</strong>に日程の確定および詳しいご案内をお送りいたします。
            </p>
            <p className="text-slate-500">
              ※現時点では「仮予約」となります。ガイドからのご連絡をもって本予約確定となります。
            </p>
          </div>

          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-xs font-bold text-emerald-800">
                LINEでさらにスムーズにやり取り可能！
              </p>
              <p className="text-[11px] text-emerald-700">
                公式LINEを追加して「予約した{formData.name}です」と一言送っていただくと最優先で返信いたします。
              </p>
            </div>
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#06c755] text-white text-xs font-bold rounded-lg shrink-0 flex items-center gap-1.5 shadow-sm hover:bg-[#05b34c]"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              LINE友だち追加
            </a>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                name: '',
                kana: '',
                contactType: 'line',
                contactValue: '',
                tourSlug: 'danang-hoian-classic-day-trip',
                preferredDate: '',
                alternativeDate: '',
                adultsCount: 2,
                childrenCount: 0,
                hotelName: '',
                specialRequests: '',
              });
            }}
            className="mt-6 text-xs text-slate-500 underline hover:text-slate-700"
          >
            別の日程や別のツアーを予約する
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-600 tracking-wider block">
              RESERVATION FORM
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#0B2545]">
              プライベートツアー お申し込み・お問い合わせ
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              完全プライベートのため1日1組様限定となります。気になる点やご要望もお気軽にご記入ください。
            </p>
          </div>

          {/* Error notification */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Customer Name Fields */}
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
                <option value="email">メールアドレス</option>
                <option value="instagram">Instagram DM</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {formData.contactType === 'line'
                  ? 'LINE ID または お電話番号'
                  : formData.contactType === 'email'
                  ? 'メールアドレス'
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

          {/* Dates Selection */}
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
              ご宿泊先ホテル名（または予定エリア）
            </label>
            <input
              type="text"
              placeholder="例: ハイアット リージェンシー ダナン（未定の場合は「未定」）"
              value={formData.hotelName}
              onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          {/* Message / Special Requests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ご質問・ご要望・アレルギー等
            </label>
            <textarea
              rows={3}
              placeholder="例: フライト到着が14:00なので15:00スタートにできますか？パクチーが苦手です。小さな子供が乗れるチャイルドシートはありますか？"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          {/* Reassurance note */}
          <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-600 border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span>
                ご入力いただいた個人情報はツアー手配のご連絡のみに使用し、第三者への開示は一切いたしません。キャンセル規定はご参加日の3日前まで無料です。
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>仮予約を送信中...</span>
              </>
            ) : (
              <span>この内容で仮予約リクエストを送信する（無料）</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
