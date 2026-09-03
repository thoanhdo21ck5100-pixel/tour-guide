import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  Calendar,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { getTourBySlug, TOURS_DATA } from '@/lib/data/tours';
import { constructMetadata, generateTouristTripSchema } from '@/lib/seo';

export async function generateStaticParams() {
  return TOURS_DATA.map((tour) => ({
    slug: tour.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    return constructMetadata({ title: 'ツアーが見つかりません', noIndex: true });
  }

  return constructMetadata({
    title: `${tour.title} | ダナン プライベートツアー`,
    description: tour.shortDescription,
    image: tour.heroImage,
    canonical: `/tours/${tour.slug}`,
  });
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const jsonLd = generateTouristTripSchema(tour);

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            ホーム
          </Link>
          <span>/</span>
          <Link href="/tours" className="hover:text-amber-600 transition-colors">
            ツアー一覧
          </Link>
          <span>/</span>
          <span className="text-[#0B2545] font-bold truncate max-w-xs sm:max-w-md">
            {tour.title}
          </span>
        </nav>

        {/* Tour Header Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl bg-slate-900">
          <div className="relative h-72 sm:h-96 md:h-[420px] w-full">
            <Image
              src={tour.heroImage}
              alt={tour.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07192E] via-[#07192E]/40 to-transparent" />
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {tour.badge && (
                <span className="px-3 py-1 bg-amber-500 text-white font-bold rounded-full">
                  {tour.badge}
                </span>
              )}
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white font-medium rounded-full">
                {tour.categoryLabel}
              </span>
              <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {tour.rating} ({tour.reviewCount}件の日本人クチコミ)
              </span>
              <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-slate-200">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                所要時間: {tour.duration}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {tour.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-3xl">
              {tour.subtitle}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details, Highlights, Itinerary */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tour Overview Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-[#0B2545] border-l-4 border-amber-500 pl-3 mb-4">
                ツアー概要・見どころ
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {tour.fullDescription}
              </p>

              {/* Highlights list */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">
                  このツアーのおすすめポイント:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tour.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hour-by-Hour Itinerary Timeline */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base sm:text-lg font-bold text-[#0B2545] border-l-4 border-amber-500 pl-3">
                  当日のツアースケジュール（モデル日程）
                </h2>
                <span className="text-[11px] text-slate-400">
                  ※完全貸切のため、当日の時間調整も可能です
                </span>
              </div>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-300 space-y-8 my-4">
                {tour.itinerary.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Timeline circle node */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-[#0B2545] border-4 border-white text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      {idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-mono font-bold">
                          {step.time}
                        </span>
                        {step.location && (
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {step.location}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#0B2545] pt-1">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  料金に含まれるもの
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {tour.included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-slate-400" />
                  料金に含まれないもの
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {tour.excluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations & Cancellation Note */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#0B2545] mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  こんな方に特におすすめです
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {tour.recommendFor.map((rec, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">集合場所・送迎について:</span>{' '}
                    {tour.meetingPlace}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">キャンセル規定:</span>{' '}
                    {tour.cancellationPolicy}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Pricing & Booking Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-lg">
              <span className="text-[11px] font-bold text-amber-600 block mb-1">
                完全貸切プライベート・明朗会計
              </span>

              {/* Price display */}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-black text-[#0B2545]">
                  {tour.priceJpy.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-slate-700">円 / 名</span>
              </div>
              <p className="text-xs text-slate-500">
                (約 {tour.priceVnd.toLocaleString()} VND)
              </p>
              {tour.priceNote && (
                <p className="text-[11px] text-slate-400 mt-1">{tour.priceNote}</p>
              )}

              {/* Highlights summary */}
              <div className="my-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>日本語検定N1専属ガイド</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>冷房完備の専用車往復送迎</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>3日前までキャンセル無料</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>チップ不要・追加料金なし</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href={`/contact?tour=${tour.slug}`}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>このツアーを仮予約する</span>
                </Link>

                <Link
                  href="/contact#line-consultation"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>LINEでこのツアーについて質問する</span>
                </Link>
              </div>

              <div className="mt-4 text-center">
                <span className="text-[10px] text-slate-400">
                  ※仮予約時点での料金決済は発生しません。
                </span>
              </div>
            </div>

            {/* Guide reassurance box */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                安心
              </div>
              <p className="text-xs text-amber-900 leading-snug">
                1日1組様限定のため、繁忙期（年末年始・GW・夏休み）はお早めの日程確保をおすすめいたします。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
