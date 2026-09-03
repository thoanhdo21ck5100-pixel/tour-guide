import Link from 'next/link';
import Image from 'next/image';
import {
  MessageCircle,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
  HeartHandshake,
  Check,
  MapPin,
  Car,
  QrCode,
} from 'lucide-react';
import TrustBadges from '@/components/TrustBadges';
import TourCard from '@/components/TourCard';
import BlogCard from '@/components/BlogCard';
import FaqAccordion from '@/components/FaqAccordion';
import InstagramIcon from '@/components/InstagramIcon';
import { getFeaturedTours } from '@/lib/data/tours';
import { getFeaturedBlogPosts } from '@/lib/data/blog';
import { SITE_CONFIG } from '@/lib/seo';

export default function HomePage() {
  const featuredTours = getFeaturedTours();
  const featuredPosts = getFeaturedBlogPosts();

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#07192E] via-[#0B2545] to-[#133E68] text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Glowing atmospheric orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ベトナム観光総局公認・完全貸切ツアー</span>
              </div>

              {/* Primary SEO Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.25]">
                安心の日本語で巡る、
                <br />
                一生モノの
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                  ダナン プライベートツアー
                </span>
              </h1>

              {/* Subheading with Secondary Keywords */}
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl mx-auto lg:mx-0">
                ベトナム・ダナン観光は、日本語堪能な専属ローカルガイドにお任せください。五行山、バーナーヒルズ（神の手）、世界遺産ホイアンのランタン夜市まで、専用車で他人に気兼ねなくマイペースに満喫いただけます。
              </p>

              {/* Key selling bullets */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  日本語検定N1ガイド専属
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  1日1組様限定・完全プライベート
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  チップ不要の明朗会計
                </span>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>空き状況の確認・予約する</span>
                </Link>
                <Link
                  href="/contact#line-consultation"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>LINEで無料旅程相談</span>
                </Link>
              </div>

              {/* Metrics & Social Proof */}
              <div className="pt-6 border-t border-slate-700/60 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">99.4%</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">日本人顧客満足度</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">1,200組+</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">累計ご案内実績</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">100%</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">完全貸切専用車</div>
                </div>
              </div>
            </div>

            {/* Hero Right Column: Guide & Photo Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative Frame */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/30 shadow-2xl bg-slate-900">
                  <div className="relative h-96 w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1000&q=80"
                      alt="ダナン・ホイアンの美しい景色とプライベートツアー"
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-transparent to-black/30" />
                  </div>

                  {/* Floating Guide Intro Card */}
                  <div className="p-5 bg-[#0B2545]/95 backdrop-blur-md border-t border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0">
                        <Image
                          src="/images/guide/avatar.jpg"
                          alt="専属ガイド アン トー (Anh Tho)"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                          YOUR PERSONAL GUIDE
                        </span>
                        <h2 className="text-base font-bold text-white">
                          アン トー (Anh Tho)
                        </h2>
                        <p className="text-xs text-slate-300">
                          神戸経済大学卒 / 日本語能力試験N1
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                      「日本のみなさま、シンチャオ！神戸経済大学で学び、日本のおもてなし文化に触れました。温かい心でダナン＆ホイアンの特別な旅をお手伝いします。」
                    </p>
                  </div>
                </div>

                {/* Floating Satisfaction Stamp */}
                <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 py-2.5 px-4 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-black text-[#0B2545]">4.98</span>
                      <div className="flex text-amber-400">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Googleクチコミ高評価
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BADGES SECTION */}
      <section className="py-12 bg-[#FDFBF7] border-b border-slate-200/80 -mt-6 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <TrustBadges />
        </div>
      </section>

      {/* 3. FEATURED TOURS SECTION */}
      <section className="py-16 sm:py-24 bg-slate-50/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-600 tracking-wider block mb-1">
              POPULAR PRIVATE TOURS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B2545] tracking-tight">
              日本人旅行者に選ばれる 人気のツアープラン
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              全ツアー完全貸切・エアコン付き専用車確約。ご家族やお友達同士だけで、ゆったりとプライベートな時間をお楽しみいただけます。
            </p>
          </div>

          {/* Tours Grid (Top 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

          {/* View All Tours CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0B2545] hover:bg-[#133E68] text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <span>すべてのツアー＆プラン一覧を見る</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US / GUIDE PROFILE SECTION */}
      <section id="guide" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image & Credentials */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <div className="relative h-80 sm:h-96 w-full">
                  <Image
                    src="/images/guide/about.jpg"
                    alt="ダナン専属ガイド アン トー (Anh Tho)"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/80 via-transparent to-transparent" />
                </div>
                <div className="p-6 bg-[#0B2545] text-white">
                  <h3 className="text-lg font-bold">ダナン専属ガイド：アン トー (Anh Tho)</h3>
                  <p className="text-xs text-amber-300 mt-1">
                    神戸経済大学 卒業 / 日本語能力試験N1取得
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div>✔ 神戸経済大学 卒業</div>
                    <div>✔ 日本語能力試験N1 (JLPT N1)</div>
                    <div>✔ 日本人向けガイド・折衝 2年</div>
                    <div>✔ 1日1組様限定・完全貸切</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Story & Hospitality */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold text-amber-600 tracking-wider block">
                ABOUT YOUR GUIDE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
                「ただ名所を回るだけではない、
                <br />
                心あたたまるベトナム体験をお届けしたい」
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                初めまして、ダナン専属ガイドのアン トー (Anh Tho) と申します。神戸経済大学で学び、日本のみなさんの礼儀正しさや「おもてなし」の心に深く感銘を受けました。
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                大学卒業後は、日本人観光客の皆様のご案内や日系パートナー企業との折衝業務に2年間従事してまいりました。日本のお客様が大切にされる「時間厳守」「清潔さ」「細やかな心配り」を徹底し、一人ひとりに寄り添った温かいガイドをお約束します。
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                「言葉が通じない不安」「不当なぼったくりタクシーへの警戒」「団体ツアーのせわしないスケジュール」...そうしたストレスを一切なくし、ご家族や大切な人と一生モノの思い出を作っていただけるよう、1日1組様限定の完全貸切プライベートツアーで心を込めてエスコートいたします。
              </p>

              {/* 3 Reassurances */}
              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0B2545]">
                      日本人のお好みに合わせた柔軟なスケジュール
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      「疲れたからカフェで一休みしたい」「このお土産をもっとゆっくり見たい」など、その場での変更も大歓迎です。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0B2545]">
                      安全・清潔なレストランの厳選
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      お腹を壊す心配のない衛生的なローカル店や、パクチー・辛いものが苦手な方への配慮を徹底しています。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0B2545]">
                      映える写真撮影もお任せください
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ホイアンのランタンやバーナーヒルズの神の手など、プロ顔負けのベストアングルでたくさん思い出をお撮りします。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="py-16 sm:py-24 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-600 tracking-wider block mb-1">
              VOICE OF TRAVELERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
              ご利用いただいたお客様のリアルなご感想
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              ご夫婦旅行、女子旅、三世代のご家族旅行まで、多くの日本人旅行者の方にご満足いただいています。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {'★'.repeat(5)}
                  <span className="text-xs font-bold text-slate-700 ml-1">5.0</span>
                </div>
                <h3 className="text-sm font-bold text-[#0B2545] mb-2">
                  「日本語がとてもお上手で、両親も大喜びでした」
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  70代の両親を連れてのダナン＆ホイアン旅行で利用しました。階段の多い五行山では歩きやすいルートを選んでくださり、専用車もとても清潔で快適でした。アン トーさんの細やかな気配りに感動です！
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-bold text-slate-700">T.佐藤様ご家族（東京都 / 3名参加）</span>
                <span>2026年1月参加</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {'★'.repeat(5)}
                  <span className="text-xs font-bold text-slate-700 ml-1">5.0</span>
                </div>
                <h3 className="text-sm font-bold text-[#0B2545] mb-2">
                  「女子旅で映え写真を100枚以上撮ってくれました！」
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ホイアンの夜市とランタンカフェに連れて行ってもらいました。どこで撮れば綺麗に写るかを熟知されていて、素敵な写真がたくさん残せました。美味しいバインセオのお店も最高でした！
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-bold text-slate-700">M.渡辺様・K.田中様（大阪府 / 女子旅）</span>
                <span>2026年2月参加</span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {'★'.repeat(5)}
                  <span className="text-xs font-bold text-slate-700 ml-1">5.0</span>
                </div>
                <h3 className="text-sm font-bold text-[#0B2545] mb-2">
                  「LINEでの事前相談から当日まで完璧なサポート」
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  初めてのベトナムで不安でしたが、旅行前にLINEで服装や両替について質問できたのが本当に助かりました。当日のバーナーヒルズも混雑を避けて案内していただき大満足です。
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-bold text-slate-700">H.小林様ご夫妻（神奈川県 / ハネムーン）</span>
                <span>2026年2月参加</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LATEST SEO BLOG HIGHLIGHTS */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-amber-600 tracking-wider block mb-1">
                LOCAL TRAVEL GUIDE & BLOG
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
                現地ガイドが教える ダナン観光お役立ち情報
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
            >
              <span>ブログ一覧へ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-600 tracking-wider block mb-1">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
              ダナン旅行のよくあるご質問（FAQ）
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              気になる疑問やお支払い、キャンセル規定についてまとめました。
            </p>
          </div>

          <FaqAccordion />

          <div className="mt-10 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <p className="text-xs sm:text-sm text-amber-900 font-bold">
              ここにない疑問やオーダーメイドのご要望も大歓迎です！
            </p>
            <p className="text-xs text-amber-800 mt-1">
              公式LINEまたは予約フォームよりいつでもお気軽にお問い合わせください。
            </p>
          </div>
        </div>
      </section>

      {/* 8. QUICK CONTACT / LINE BANNER CTA */}
      <section id="line-consultation" className="py-16 sm:py-20 bg-gradient-to-br from-[#07192E] to-[#0B2545] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white/5 border border-white/15 rounded-3xl p-8 sm:p-12 backdrop-blur-md relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Info */}
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  <MessageCircle className="w-3.5 h-3.5 fill-emerald-300" />
                  LINE事前相談は完全無料
                </span>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug">
                  旅の計画段階でもお気軽にどうぞ！
                  <br />
                  公式LINEで専属ガイドに直接相談
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  「このフライト時間でホイアンまで行ける？」「おすすめの海鮮レストランは？」「小さな子供がいるけれど大丈夫？」など、現地にいる日本人対応ガイドが迅速に丁寧にお返事いたします。
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={SITE_CONFIG.lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#06c755] hover:bg-[#05b34c] text-white font-black text-sm rounded-2xl shadow-xl hover:scale-102 transition-all"
                  >
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>公式LINEで相談</span>
                  </a>

                  <a
                    href={SITE_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-black text-sm rounded-2xl shadow-xl hover:scale-102 transition-all"
                  >
                    <InstagramIcon className="w-5 h-5 text-white" />
                    <span>Instagram DMで相談</span>
                  </a>

                  <Link
                    href="/contact"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-2xl transition-all"
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>空き状況カレンダー</span>
                  </Link>
                </div>
              </div>

              {/* Right QR Box */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white rounded-2xl text-slate-900 text-center shadow-lg">
                <div className="relative w-40 h-40 bg-white rounded-xl border border-slate-200 p-2 flex items-center justify-center shadow-xs">
                  <Image
                    src="/images/guide/line-qr.jpg"
                    alt="LINE公式QRコード"
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>
                <div className="mt-3 space-y-1">
                  <span className="text-xs font-bold text-slate-800 block">
                    LINE ID: <span className="text-[#06c755]">bii010121</span>
                  </span>
                  <a
                    href={SITE_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>@{SITE_CONFIG.instagramHandle}</span>
                  </a>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  スマホでQRを読み取って友だち追加
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
