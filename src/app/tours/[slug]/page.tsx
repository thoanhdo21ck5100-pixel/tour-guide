import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Heart,
  HelpCircle,
  ArrowRight,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { getTourBySlug, TOURS_DATA, calculateGroupTourPrice } from '@/lib/data/tours';
import { getBlogPostBySlug, BLOG_POSTS_DATA } from '@/lib/data/blog';
import { constructMetadata, generateTouristTripSchema, generateBreadcrumbSchema, SITE_CONFIG } from '@/lib/seo';
import InstagramIcon from '@/components/InstagramIcon';
import XIcon from '@/components/XIcon';
import GuideStrategicValueCard from '@/components/GuideStrategicValueCard';
import BookingFlowDiagram from '@/components/BookingFlowDiagram';

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
    title: tour.title,
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
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: 'ホーム', url: '/' },
    { name: 'ツアー一覧', url: '/tours' },
    { name: tour.title, url: `/tours/${tour.slug}` },
  ]);

  // Related blog posts
  const relatedBlogPosts = (tour.relatedBlogSlugs || [])
    .map((s) => getBlogPostBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const displayBlogs = relatedBlogPosts.length > 0
    ? relatedBlogPosts
    : BLOG_POSTS_DATA.slice(0, 2);

  // Standard FAQs combined with tour-specific FAQs
  const standardFaqs = [
    {
      question: '表示されている料金には、車代や食事代も含まれていますか？',
      answer:
        'いいえ。表示料金は日本語ガイドの基本料金です。専用車・送迎車、観光施設の入場料、お食事、アクティビティなどの費用は別途となります。ご希望の内容をお伺いしたうえで、必要な手配と費用を事前にご案内いたしますので、安心してご相談ください。',
    },
    {
      question: '自分で車やレストランを手配する必要がありますか？',
      answer:
        'いいえ。ご希望に応じて、専用車・レストラン・観光チケット・アクティビティなどの手配をサポートいたします。行きたい場所やご希望の過ごし方をお知らせいただければ、内容を確認したうえで具体的なプランをご案内します。',
    },
    {
      question: '最終的な旅行費用は事前に確認できますか？',
      answer:
        'はい。ご希望の人数・行程・移動方法・観光施設・お食事などを確認したうえで、必要な手配と実費の目安をご案内いたします。内容をご確認いただき、ご相談のうえで行程を決定します。',
    },
    {
      question: '当日の集合場所とお迎え時間はどうなりますか？',
      answer: `ご宿泊ホテルのロビーへ専属日本語ガイドがお迎えにあがります（${tour.meetingPlace}）。専用車の手配も承ります。前日までにLINEまたはメールで詳細なお時間をご案内いたします。`,
    },
    {
      question: 'キャンセルや日程変更のルールを教えてください。',
      answer:
        'キャンセルをご希望の場合は、ご予定日の1週間前までにご連絡ください。キャンセルや日程変更についてご相談がある場合は、LINEまたはメールからお気軽にご連絡ください。',
    },
  ];

  // Merge tour-specific FAQs (deduplicating by question)
  const existingQuestions = new Set(standardFaqs.map((f) => f.question));
  const tourSpecificFaqs = (tour.faqs || []).filter(
    (f) => !existingQuestions.has(f.question)
  );
  const faqs = [...standardFaqs, ...tourSpecificFaqs];

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ① Breadcrumb */}
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

        {/* ② & ③ Tour Header Banner (H1 & Hero/Summary) */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl bg-slate-900">
          <div className="relative h-72 sm:h-96 md:h-[420px] w-full">
            <Image
              src={tour.heroImage}
              alt={tour.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07192E] via-[#07192E]/40 to-transparent" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-2.5 sm:space-y-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
              {tour.badge && (
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-amber-500 text-white font-bold rounded-full shadow-xs">
                  {tour.badge}
                </span>
              )}
              <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-white/20 backdrop-blur-md text-white font-medium rounded-full">
                {tour.categoryLabel}
              </span>
              <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-amber-300 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>事前決済不要・現地払い</span>
              </span>
              <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-slate-200">
                <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>所要時間: {tour.duration}</span>
              </span>
            </div>

            {/* ② H1 */}
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight break-words">
              {tour.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-3xl leading-relaxed">
              {tour.subtitle}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* ④ このツアーの概要 */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-[#0B2545] border-l-4 border-amber-500 pl-3 mb-3 sm:mb-4">
                このツアーの概要
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {tour.fullDescription}
              </p>
            </div>

            {/* ⑤ このツアーで訪れる主なスポット */}
            {tour.visitedSpots && tour.visitedSpots.length > 0 && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs">
                <h2 className="text-base sm:text-lg font-bold text-[#0B2545] border-l-4 border-amber-500 pl-3 mb-3 sm:mb-4">
                  このツアーで訪れる主なスポット
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  {tour.visitedSpots.map((spot, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                          <h3 className="text-xs sm:text-sm font-bold text-[#0B2545]">
                            {spot.name}
                          </h3>
                        </div>
                        {spot.description && (
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {spot.description}
                          </p>
                        )}
                      </div>
                      {spot.relatedBlogSlug && (
                        <div className="mt-3 pt-2 border-t border-slate-200/60">
                          <Link
                            href={`/blog/${spot.relatedBlogSlug}`}
                            className="text-[11px] text-amber-700 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <span>見どころ詳細ガイドを見る</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ⑥ このツアーがおすすめの方 */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-[#0B2545] border-l-4 border-amber-500 pl-3 mb-3 sm:mb-4">
                このツアーがおすすめの方
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {tour.recommendFor.map((rec, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 p-2.5 rounded-lg bg-amber-50/40 border border-amber-100"
                  >
                    <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ⑦ 当日のツアースケジュール */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-6">
                <h2 className="text-base sm:text-lg font-bold text-[#0B2545] border-l-4 border-amber-500 pl-3">
                  当日のツアースケジュール（モデル日程）
                </h2>
                <span className="text-[11px] text-slate-400 pl-4 sm:pl-0">
                  ※完全貸切のため、当日の時間調整も可能です
                </span>
              </div>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-300 space-y-8 my-4">
                {tour.itinerary.map((step, idx) => (
                  <div key={idx} className="relative group">
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

            {/* ⑧ ツアーの特徴・おすすめポイント */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-[#0B2545] border-l-4 border-amber-500 pl-3 mb-3 sm:mb-4">
                ツアーの特徴・おすすめポイント
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {tour.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ⑨ アン トーが現地でサポートできること */}
            <GuideStrategicValueCard mode="tour" />

            {/* ⑩ 料金について（ビジネスモデル解説＆人数別シミュレーション） */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-amber-200/90 shadow-xs space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
                <h2 className="text-base sm:text-lg font-bold text-[#0B2545] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>料金と人数別シミュレーション</span>
                </h2>
                <span className="self-start sm:self-auto text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0 whitespace-nowrap">
                  事前決済不要・到着後払い
                </span>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
                <p className="font-bold text-[#0B2545]">
                  当ツアーは、他のお客様と混乗しない「完全プライベート案内（1組貸切）」です。
                </p>
                <p className="text-slate-700">
                  基本料金は1名様料金となり、<strong>2人目以降はたったの＋1,000円/名</strong>のみ。人数が増えるほど、1人あたりのご負担が驚くほどお得になります。
                </p>
                <p className="text-slate-600 text-[11px] sm:text-xs">
                  ※専用車・送迎車、観光施設の入場料、お食事・お飲み物、アクティビティ等の実費はガイド基本料金とは別途となります。ご希望の内容をお伺いしたうえで、必要な手配と費用を事前に丁寧にご案内いたします。
                </p>
              </div>

              {/* 人数別 料金シミュレーション表 */}
              <div>
                <span className="text-xs font-bold text-amber-800 block mb-2">
                  【人数別】日本語ガイド基本料金（1組貸切総額 / 1人あたり目安）
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                  {[1, 2, 3, 4].map((pax) => {
                    const { totalJpy, perPersonJpy } = calculateGroupTourPrice(tour.priceJpy, pax);
                    const isPopular = pax === 2;
                    return (
                      <div
                        key={pax}
                        className={`p-2.5 sm:p-3 rounded-xl border text-center relative transition-all ${
                          isPopular
                            ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/40 shadow-xs'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {isPopular && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                            一番人気！
                          </span>
                        )}
                        <span className="text-[11px] sm:text-xs font-bold text-slate-700 block">
                          {pax}名様ご利用
                        </span>
                        <div className="my-1">
                          <span className="text-base sm:text-xl font-black text-[#0B2545]">
                            {totalJpy.toLocaleString('ja-JP')}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-bold text-slate-600">円</span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 py-0.5 px-1.5 sm:px-2 rounded-md border border-emerald-200/60 inline-block leading-tight">
                          1人あたり {perPersonJpy.toLocaleString('ja-JP')}円
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  ※5名様以上の場合も、1名様追加につき＋1,000円のみとなります。
                </p>
                {tour.priceNote && (
                  <p className="text-xs text-slate-500 mt-1">{tour.priceNote}</p>
                )}
              </div>
            </div>

            {/* ⑪ & ⑫ 料金に含まれるもの・含まれないもの */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs">
                <h3 className="text-xs sm:text-sm font-bold text-emerald-800 flex items-center gap-2 mb-3 sm:mb-4">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span>料金に含まれるもの</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {tour.included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2 mb-3 sm:mb-4">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                  <span>料金に含まれないもの（実費別途）</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {tour.excluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-slate-400 font-bold shrink-0">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ご希望に応じて各種手配もサポートします */}
            <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/60 rounded-2xl p-4 sm:p-6 md:p-8 border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-start sm:items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                <h3 className="text-sm sm:text-lg font-bold text-[#0B2545] leading-snug break-words">
                  ご希望に応じて各種手配もサポートします
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                専用車、レストラン、観光チケット、アクティビティなど、ご希望の内容に合わせて手配・予約をサポートいたします。
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                必要な費用については、事前に内容と料金をご案内し、ご相談のうえで決定いたします。お客様がすべてご自身で手配する必要はございませんので、安心してご相談ください。
              </p>
            </div>

            {/* ⑬ 集合・送迎について */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-[#0B2545] border-l-4 border-amber-500 pl-3 mb-3">
                集合・送迎について
              </h2>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">{tour.meetingPlace}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    お客様のご希望に合わせて専用車の手配を承ります。他のお客様との混乗は一切ございません。前日までに集合場所・時間を丁寧にご案内いたします。
                  </p>
                </div>
              </div>
            </div>

            {/* ⑭ お支払いについて */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#0B2545] border-l-4 border-amber-500 pl-3 mb-2 flex items-center gap-2">
                <span>お支払いについて</span>
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-900">
                  日本語ガイド料金は、ベトナム到着後、ツアー開始前に全額お支払いいただきます。
                </p>
                <p>
                  お支払いは、<strong className="text-[#0B2545]">日本円（JPY）またはベトナムドン（VND）</strong>で可能です。ご予約時にガイド料金のお支払いは必要ありません。
                </p>
                <p className="text-slate-600">
                  専用車、入場料、お食事、アクティビティなど、別途発生する実費については、ツアー内容を確認したうえで事前にご案内いたします。手配に必要な費用のお支払い方法・タイミングについては、内容に応じて個別にご案内いたします。
                </p>
              </div>
            </div>

            {/* ⑮ キャンセルについて */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-[#0B2545] border-l-4 border-amber-500 pl-3 mb-3 flex items-center gap-2">
                <span>キャンセルについて</span>
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-900">
                  キャンセルをご希望の場合は、ご予定日の1週間前までにご連絡ください。
                </p>
                <p className="text-slate-600">
                  キャンセルや日程変更についてご相談がある場合は、LINEまたはメールからお気軽にご連絡ください。
                </p>
              </div>
            </div>

            {/* ⑯ ご予約の流れ (Booking Flow Diagram) */}
            <BookingFlowDiagram />

            {/* ⑰ よくある質問 */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-[#0B2545] border-l-4 border-amber-500 pl-3 mb-3 sm:mb-4">
                よくある質問（FAQ）
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-start gap-2 font-bold text-[#0B2545]">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </div>
                    <p className="text-slate-600 pl-6 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ⑱ 関連する観光情報 */}
            {displayBlogs.length > 0 && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <h2 className="text-base sm:text-lg font-bold text-[#0B2545] border-l-4 border-amber-500 pl-3">
                    関連する観光情報・現地ブログ
                  </h2>
                  <Link
                    href="/blog"
                    className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1 self-start sm:self-auto pl-4 sm:pl-0 shrink-0"
                  >
                    <span>ブログ一覧</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                  {displayBlogs.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          {post.category}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-[#0B2545] group-hover:text-amber-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{post.publishedAt}</span>
                        <span className="text-amber-600 font-bold flex items-center gap-0.5">
                          記事を読む <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ⑲ Right Column: Sticky Pricing & Booking Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 border border-slate-200/90 shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-amber-600">
                  日本語ガイド基本料金（1組貸切）
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  人数追加＋1,000円/名
                </span>
              </div>

              {/* Price display */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-black text-[#0B2545]">
                  {tour.priceJpy.toLocaleString('ja-JP')}
                </span>
                <span className="text-sm font-bold text-slate-700">円〜</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 mb-3 text-xs text-emerald-900 flex items-center justify-between">
                <span className="font-semibold">2名利用時（1人あたり）:</span>
                <span className="font-black text-sm text-emerald-800">
                  {Math.round((tour.priceJpy + 1000) / 2).toLocaleString('ja-JP')}円
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                ※交通費・入場料・お食事等の実費は別途となります。
              </p>
              {tour.priceNote && (
                <p className="text-[11px] text-slate-400 mt-1">{tour.priceNote}</p>
              )}

              {/* Highlights summary */}
              <div className="my-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>日本語対応の専属ガイド</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>ご希望に合わせた旅程相談</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>現地での観光・移動サポート</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>各種予約・手配のご相談</span>
                </div>
              </div>

              <div className="p-2.5 mb-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs font-semibold text-slate-700">
                実費については事前にご案内します
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href={`/contact?tour=${tour.slug}`}
                  className="w-full h-12 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-white shrink-0" />
                  <span>このプランについて無料相談する</span>
                </Link>

                <a
                  href={SITE_CONFIG.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 px-6 rounded-xl bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                  <span>LINEでこのツアーを相談する</span>
                </a>

                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <InstagramIcon className="w-4 h-4 text-white shrink-0" />
                  <span>Instagram DMで質問する</span>
                </a>

                <a
                  href={SITE_CONFIG.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <XIcon className="w-4 h-4 text-white shrink-0" />
                  <span>X / Twitterで質問する</span>
                </a>
              </div>

              <div className="mt-4 text-center">
                <span className="text-[10px] text-slate-400">
                  ※事前決済不要。ガイド基本料金はベトナム到着後、ツアー開始前にお支払いいただけます（日本円・VND対応）。実費は事前相談のうえご案内いたします。
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
