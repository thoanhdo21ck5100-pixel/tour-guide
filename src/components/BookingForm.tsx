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
        throw new Error(data.error || '送信中にエラーが発生しました。');
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
      {/* Success State */}
      {isSuccess ? (
        <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-bold text-[#0B2545] tracking-tight">
            お問い合わせありがとうございます。
          </h3>
          <p className="text-sm text-slate-700 font-medium mt-2 leading-relaxed max-w-md mx-auto">
            内容を確認のうえ、LINEまたはメールにてご連絡いたします。
            <br />
            <span className="text-amber-700 font-bold">※この時点では予約確定ではありません。</span>
          </p>

          {bookingId && (
            <p className="text-xs text-slate-400 mt-2">
              お問い合わせ管理番号: <span className="font-mono font-bold text-slate-600">{bookingId}</span>
            </p>
          )}

          <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs leading-relaxed text-slate-700 space-y-2">
            <p className="font-bold text-[#0B2545] flex items-center gap-1.5 text-sm">
              <CalendarCheck className="w-4 h-4 text-emerald-600" />
              今後の流れについて
            </p>
            <p>
              ご入力いただいたご連絡先（{formData.contactType.toUpperCase()}: {formData.contactValue}）宛てに、原則<strong>24時間以内</strong>にご希望の日程・プランのご提案をお送りいたします。
            </p>
            <p className="text-slate-500">
              旅程やお見積りの内容に十分ご納得いただいてから、ご予約を確定いたします。
            </p>
          </div>

          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-xs font-bold text-emerald-800">
                LINEでさらにスムーズにやり取り可能！
              </p>
              <p className="text-[11px] text-emerald-700">
                公式LINEを追加して「相談フォームを送った{formData.name}です」と一言送っていただければ迅速に対応いたします。
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
            className="mt-6 text-xs text-slate-500 underline hover:text-slate-700 cursor-pointer"
          >
            別の日程や別の内容で再度相談する
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-600 tracking-wider block">
              CONSULTATION FORM
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#0B2545]">
              ベトナム旅行の無料相談・お見積り
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              完全プライベートのため1日1組様限定となります。旅程のご相談・お見積り・空き状況の確認など、お気軽にお送りください。※この時点では予約は確定しません。
            </p>
          </div>

          {/* Error notification */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Dates Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ご希望の日程（第1希望） <span className="text-rose-500">*必須</span>
              </label>
              <input
                type="date"
                required
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                ※左のカレンダーをクリックしても自動入力されます
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

          {/* 2. Number of Pax */}
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

          {/* 3. Tour Selection */}
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

          {/* 4. Hotel Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ご宿泊先ホテル名（または予定エリア・都市） <span className="text-slate-400 font-normal">（未定の場合は「未定」）</span>
            </label>
            <input
              type="text"
              placeholder="例: ハイアット リージェンシー ダナン、ホイアン旧市街周辺など（未定でもOK）"
              value={formData.hotelName}
              onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          {/* 5. Message / Special Requests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ご相談・ご質問・ご要望
            </label>
            <textarea
              rows={3}
              placeholder="例: フライト到着が14:00なので15:00スタートにできますか？高齢の両親がいるので歩くペースをゆっくりにしたいです。パクチーが苦手です。"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          {/* 6. Customer Name & Contact Preference */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  希望のご連絡方法 <span className="text-rose-500">*必須</span>
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
          </div>

          {/* Reassurance note */}
          <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-600 border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span>
                ご入力いただいた個人情報はご連絡のみに使用いたします。キャンセルポリシーの詳細については、ご予約確定前にご案内いたします。
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>送信中...</span>
              </>
            ) : (
              <span>無料で相談する</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
