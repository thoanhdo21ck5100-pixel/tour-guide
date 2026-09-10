'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Download,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Car,
  Sparkles,
  ArrowLeft,
  Camera,
  FileText,
  Printer,
  Info,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { CustomTourPlan } from '@/types';
import { normalizeTourCode } from '@/lib/supabaseClient';

function TourPlanContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const initialEmail = searchParams.get('email') || '';

  const [tourCode, setTourCode] = useState(initialCode);
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [plan, setPlan] = useState<CustomTourPlan | null>(null);

  // Auto-lookup if query params are present
  useEffect(() => {
    if (initialCode && initialEmail) {
      handleLookup(initialCode, initialEmail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode, initialEmail]);

  const handleLookup = async (codeToUse?: string, emailToUse?: string) => {
    const rawCode = (codeToUse ?? tourCode).trim();
    const targetCode = normalizeTourCode(rawCode);
    const targetIdentifier = (emailToUse ?? email).trim();

    if (!targetCode) {
      setErrorMessage('ツアー管理番号（例: JPVN-8820 または 数字4桁）を入力してください。');
      return;
    }
    if (!targetIdentifier || targetIdentifier.length < 2) {
      setErrorMessage('お申し込み時のメールアドレス、LINE ID または お電話番号を入力してください。');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/tour-plan/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tourCode: targetCode, email: targetIdentifier }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || '該当するツアープランが見つかりませんでした。');
        setPlan(null);
      } else {
        setPlan(data.plan);
        setTourCode(targetCode);
      }
    } catch (err) {
      console.error('Lookup error:', err);
      setErrorMessage('通信エラーが発生しました。インターネット接続を確認の上、再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const [nowTimestamp, setNowTimestamp] = useState<number | null>(null);

  useEffect(() => {
    setNowTimestamp(Date.now());
  }, [plan]);

  const daysRemaining =
    plan?.photosExpireAt && nowTimestamp
      ? Math.max(
          0,
          Math.ceil((new Date(plan.photosExpireAt).getTime() - nowTimestamp) / (1000 * 60 * 60 * 24))
        )
      : null;



  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0B2545] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ホームへ戻る</span>
          </Link>

          <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            ご予約者様専用ページ（2段階認証）
          </span>
        </div>

        {/* If no plan is loaded yet -> Show Lookup Form */}
        {!plan ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#1E4E79] p-8 sm:p-10 text-white text-center relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 mb-4 shadow-inner">
                <Search className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block mb-1">
                MY TOUR PLAN & PHOTOS
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                個人ツアープラン・記念写真照会
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-lg mx-auto leading-relaxed">
                確定した旅程スケジュール、お迎え時間、および専属ガイドが撮影したツアー写真（7日間限定）をご確認いただけます。
              </p>
            </div>

            {/* Form Box */}
            <div className="p-6 sm:p-10 space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLookup();
                }}
                className="space-y-5"
              >
                {/* Tour Code Input */}
                <div>
                  <label
                    htmlFor="tourCode"
                    className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide"
                  >
                    ツアー管理番号 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="tourCode"
                      type="text"
                      value={tourCode}
                      onChange={(e) => setTourCode(e.target.value.toUpperCase())}
                      onBlur={() => setTourCode((prev) => normalizeTourCode(prev))}
                      placeholder="例: JPVN-8820 または 8820"
                      className="w-full px-4 py-3.5 pl-11 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none font-mono text-sm font-bold text-slate-800 uppercase tracking-wider transition-all placeholder:text-slate-400 placeholder:font-normal"
                      required
                    />
                    <FileText className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ※受付完了メールまたはLINEにて案内された「JPVN-XXXX」（数字4桁のみの入力も可能）
                  </p>
                </div>

                {/* Email / Contact Identifier Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide"
                  >
                    お申し込み連絡先（メール / LINE ID / お電話番号） <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="例: yamada@gmail.com または yamada_line / 090-xxxx-xxxx"
                      className="w-full px-4 py-3.5 pl-11 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm text-slate-800 transition-all placeholder:text-slate-400"
                      required
                    />
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ※個人情報およびツアー写真保護のため、お申し込み時に入力されたご連絡先との一致が必要です。
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">{errorMessage}</div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>照会中...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>プランと写真を確認する</span>
                    </>
                  )}
                </button>
              </form>

              {/* Production Assistance Note */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-[11px]">
                  <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  ツアー管理番号や照会についてご不明な点がございましたら、公式LINEまでお気軽にお問い合わせください。
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* When Plan is found -> Display Full Plan & Photo Box */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => setPlan(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0B2545] px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>別のプランを照会する</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2545] border border-slate-200 px-3.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>印刷 / PDF保存</span>
              </button>
            </div>

            {/* Main Plan Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Card Header */}
              <div className="bg-[#0B2545] text-white p-6 sm:p-8 relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 flex-wrap">
                      <span className="bg-amber-400 text-slate-950 font-mono font-black text-xs px-3 py-1 rounded-md tracking-wider">
                        {plan.tourCode}
                      </span>
                      {plan.status === 'confirmed' ? (
                        <span className="bg-emerald-500 text-white font-black text-[11px] px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          予約確定・日程FIX（専属手配完了）
                        </span>
                      ) : plan.status === 'cancelled' ? (
                        <span className="bg-slate-600 text-white font-bold text-[11px] px-3 py-1 rounded-full flex items-center gap-1">
                          キャンセル済み
                        </span>
                      ) : (
                        <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          仮予約受付中・専属ガイド確認中
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-slate-300 font-mono">
                      更新日時: {new Date(plan.updatedAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">{plan.tourTitle}</h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 pt-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {plan.customerName} 様 {plan.customerKana ? `(${plan.customerKana})` : ''}
                    </span>
                    <span>|</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      {plan.tourDate}
                      {plan.endDate ? ` 〜 ${plan.endDate}` : ''}
                    </span>
                    <span>|</span>
                    <span>大人 {plan.adultsCount}名 / お子様 {plan.childrenCount}名</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Status Reassurance Banner */}
              {plan.status === 'confirmed' ? (
                <div className="p-4 bg-emerald-50/90 border-b border-emerald-200 flex items-start gap-3 text-xs text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">【ご予約・旅程確定】専属ガイド（アン トー）とお打ち合わせが完了いたしました</p>
                    <p className="text-emerald-800 mt-0.5 leading-relaxed">
                      リクエスト内容に基づき、当日のタイムラインおよび専用車の手配が確定（FIX）しております。事前決済は不要ですので、ツアー当日は下記のお迎え場所・お時間にてお待ちください。
                    </p>
                  </div>
                </div>
              ) : plan.status === 'cancelled' ? (
                <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-start gap-3 text-xs text-slate-700">
                  <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <p>このツアープランはキャンセルされました。ご不明な点がございましたらガイドまでお問い合わせください。</p>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-3 text-xs text-amber-950">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">【仮予約受付完了】専属ガイド（アン トー）がご要望を確認・スケジュール調整中です</p>
                    <p className="text-amber-800 mt-0.5 leading-relaxed">
                      24時間以内にご指定の連絡先（LINEまたはメール）へ最適な旅程プランをご案内いたします。ガイドとお打ち合わせ完了後、こちらの画面に最終確定スケジュールが反映されます。
                    </p>
                  </div>
                </div>
              )}

              {/* Meeting & Logistics Summary */}
              <div className="p-6 sm:p-8 border-b border-slate-100 bg-amber-50/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-2xs space-y-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      お迎え・開始時間
                    </span>
                    <p className="text-base font-black text-slate-800 font-mono">
                      {plan.pickupTime || '調整中・後ほどご連絡'}
                    </p>
                    <p className="text-[11px] text-slate-500">※当日はロビーにてお待ちください</p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-2xs space-y-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      集合・お迎え場所
                    </span>
                    <p className="text-sm font-bold text-slate-800 line-clamp-2">
                      {plan.pickupLocation || '宿泊先ホテル'}
                    </p>
                    <p className="text-[11px] text-slate-500">※専属ガイドがネームプレートを持参</p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-2xs space-y-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1">
                      <Car className="w-3 h-3 text-amber-600" />
                      移動・参加情報
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      専用車送迎（プライベート貸切）
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {plan.participantsNotes || '日本語ガイド（アン トー）が全行程同行'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule Milestones Timeline */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#0B2545] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    当日のスケジュール・行程詳細
                  </h3>
                  <span className="text-[11px] text-slate-400">※当日の交通状況により微調整となる場合があります</span>
                </div>

                {plan.schedule.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    現在ガイドが詳細スケジュールを作成中です。完了次第こちらに反映されます。
                  </p>
                ) : (
                  <div className="relative pl-6 border-l-2 border-amber-300 space-y-6 ml-3 my-2">
                    {plan.schedule.map((item, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline Pin Dot */}
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-xs" />

                        <div className="bg-slate-50 group-hover:bg-amber-50/40 p-4 rounded-2xl border border-slate-200 transition-colors">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono text-xs font-bold">
                              {item.time}
                            </span>

                            {item.location && (
                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-amber-600" />
                                {item.location}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>

                          {item.description && (
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Guide Notes */}
                {plan.guideNotes && (
                  <div className="mt-8 p-4 rounded-2xl bg-sky-50 border border-sky-200/80 text-xs text-slate-700 space-y-1.5">
                    <span className="font-bold text-sky-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      専属ガイド（アン トー）からのワンポイントアドバイス・注意事項
                    </span>
                    <p className="leading-relaxed whitespace-pre-wrap text-slate-700">
                      {plan.guideNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 📸 Tour Photos Section (Google Drive + 7-Day Expiry Notice) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0B2545]">
                      ツアー記念写真アルバム（Google Drive）
                    </h3>
                    <p className="text-xs text-slate-500">
                      ガイドがツアー中に撮影した高画質写真・記念写真をダウンロードいただけます。
                    </p>
                  </div>
                </div>

                {plan.driveUrl && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    写真公開中
                  </span>
                )}
              </div>

              {(() => {
                const isPhotoExpired = Boolean(
                  plan.photoStatus === 'expired' ||
                  (plan.photosExpireAt && nowTimestamp && new Date(plan.photosExpireAt).getTime() <= nowTimestamp)
                );

                const expireFormatted = plan.photosExpireAt
                  ? new Date(plan.photosExpireAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : null;

                if (isPhotoExpired) {
                  return (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/30 border border-rose-200/80 text-slate-800 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-bold text-rose-800 text-sm">
                          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                          <span>【写真ダウンロード保存期限（7日間）終了のお知らせ】</span>
                        </div>
                        <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                          ダウンロード期間終了
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        クラウドストレージ容量の保護およびお客様のプライバシー管理規定に基づき、写真公開期限
                        {expireFormatted ? <strong className="text-rose-700 font-bold">【{expireFormatted}】</strong> : '（公開後7日間）'}
                        を経過いたしましたため、写真フォルダへのアクセスリンクは<strong>自動停止・無効化</strong>されました。
                      </p>

                      <div className="p-3 bg-white/80 rounded-xl border border-rose-100 text-[11px] text-slate-600 space-y-1">
                        <p className="font-bold text-slate-800">写真の再取得についてのご相談</p>
                        <p>
                          データの再発行をご希望の場合は、専属ガイド公式LINEまでお客様のツアー管理番号【<strong>{plan.tourCode}</strong>】をお知らせの上、直接お問い合わせください。
                        </p>
                      </div>

                      <div className="pt-1">
                        <a
                          href="https://line.me/R/ti/p/@564pshie"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>公式LINEでガイドに問い合わせる</span>
                          <ExternalLink className="w-3 h-3 opacity-80" />
                        </a>
                      </div>
                    </div>
                  );
                }

                if (plan.driveUrl) {
                  return (
                    <div className="space-y-4">
                      {/* Download Action Card */}
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              写真公開中
                            </span>
                            {daysRemaining !== null && (
                              <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                {daysRemaining > 0 ? `残り約 ${daysRemaining} 日間` : '本日が最終日'}
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-[#0B2545] text-sm">
                            記念写真フォルダの準備が整いました！
                          </p>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Google Driveより、オリジナル高画質のまま一括ダウンロード可能です。
                          </p>
                        </div>

                        <a
                          href={plan.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3 rounded-xl bg-[#0B2545] hover:bg-[#133E68] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                        >
                          <Download className="w-4 h-4 text-amber-400" />
                          <span>Google Driveで写真を開く</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </a>
                      </div>

                      {/* 7-Day Expiry Countdown & Notice */}
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 text-amber-950 text-xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-amber-900">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>【重要】写真データの保存期間（7日間限定）について</span>
                        </div>

                        <p className="text-xs leading-relaxed text-slate-700">
                          サーバーのストレージ容量の節約およびお客様の大切なプライバシー保護のため、写真リンクの有効期限は
                          {expireFormatted ? (
                            <strong className="text-rose-700 font-bold">【{expireFormatted}まで】</strong>
                          ) : (
                            '【公開後7日間】'
                          )}
                          となっております。
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          期限経過後はリンクが無効化され、データが自動的に削除・整理されますので、お早めにご自身の端末（スマートフォン、PC、Googleフォト等）へ一括ダウンロード・保存をお願い申し上げます。
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
                    <Camera className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-700">
                      現在、ツアー写真の準備・厳選処理を行っております。
                    </p>
                    <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                      ツアー終了後、ガイドが撮影した写真を整理してGoogle Driveへアップロードいたします。アップロードが完了すると、こちらのページから直接ダウンロードいただけます。
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Support / Contact Help */}
            <div className="text-center text-xs text-slate-500 py-4">
              旅程の変更相談や写真ダウンロードに関してご不明な点がございましたら、
              <br className="hidden sm:inline" />
              お気軽に公式LINEまたはメール（<a href="mailto:nihongoguide01@gmail.com" className="text-blue-600 underline">nihongoguide01@gmail.com</a>）へお問い合わせください。
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TourPlanLookupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span>ページを読み込み中...</span>
        </div>
      }
    >
      <TourPlanContent />
    </Suspense>
  );
}
