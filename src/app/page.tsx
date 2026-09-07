import Link from 'next/link';
import Image from 'next/image';
import {
  MessageCircle,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Check,
  CheckCircle2,
  Clock,
  Heart,
  HelpCircle,
  Plane,
  Car,
  ChevronRight,
  MapPin,
  Users,
} from 'lucide-react';
import TrustBadges from '@/components/TrustBadges';
import TourCard from '@/components/TourCard';
import BlogCard from '@/components/BlogCard';
import FaqAccordion from '@/components/FaqAccordion';
import InstagramIcon from '@/components/InstagramIcon';
import XIcon from '@/components/XIcon';
import { getFeaturedTours } from '@/lib/data/tours';
import { getFeaturedBlogPosts } from '@/lib/data/blog';
import { FAQS_DATA } from '@/lib/data/faqs';
import { SITE_CONFIG, generateLocalBusinessSchema, generateFaqSchema } from '@/lib/seo';

export default function HomePage() {
  const featuredTours = getFeaturedTours();
  const featuredPosts = getFeaturedBlogPosts();
  const localBusinessSchema = generateLocalBusinessSchema();
  const faqSchema = generateFaqSchema(FAQS_DATA);

  // 7 Common Inquiries / Questions for Section 10
  const consultationExamples = [
    {
      q: 'まだ日程が決まっていないのですが、相談してもいいですか？',
      a: 'もちろん大歓迎です。フライトの時期や滞在日数に合わせたおすすめの過ごし方やシーズン情報をご案内します。',
    },
    {
      q: '小さな子ども（または高齢の両親）がいますが、無理のない旅程を組めますか？',
      a: '階段や長距離歩行の少ないルート、車内でゆったり休憩できる優しいスケジュールをオーダーメイドで組み立てます。',
    },
    {
      q: 'パクチーや辛いものが苦手ですが、食事はどうなりますか？',
      a: '注文時に香草抜きや辛さ控えめを通訳します。日本人の味覚に合い、衛生面でも安心できる清潔なお店へご案内します。',
    },
    {
      q: 'ホイアンのランタン祭りを見たいのですが、何時頃に行くのがベストですか？',
      a: '夕暮れから夜にかけてのベストな時間帯や、混雑を避けて写真が撮れる裏道ルートをお伝えします。',
    },
    {
      q: '雨が降った場合の代わりのプランはありますか？',
      a: '屋内テーマパークや地下ワインセラー、落ち着いたカフェやスパなど、雨でも気分よく楽しめるプランに臨機応変に切り替えます。',
    },
    {
      q: 'おすすめのカフェやお土産屋さんに寄ることはできますか？',
      a: '地元民が愛する名物カフェや、ぼったくりのない適正価格で買える信頼できるお土産店へ自由にお立ち寄りいただけます。',
    },
    {
      q: 'ハノイやホーチミンの相談もできますか？',
      a: 'はい。ダナン・ホイアンが中心ですが、ハノイやホーチミンなどベトナム全土のご相談も承っています。旅程に合わせてご相談ください。',
    },
  ];

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#07192E] via-[#0B2545] to-[#133E68] text-white pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Glowing atmospheric orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ダナン出身・JLPT N1の日本語ガイド（1日1組限定）</span>
              </div>

              {/* Primary Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.25]">
                安心の日本語で巡る、
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                  ダナン・ホイアンの旅。
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl mx-auto lg:mx-0">
                ダナン出身・JLPT N1のアン トーが、旅行前のご相談から当日のご案内まで、日本語で丁寧にサポートします。
                他のお客様との相乗りは一切なし。完全プライベートであなたのペースに寄り添います。
              </p>

              {/* 3 Honest USPs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 text-xs text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ダナン出身・JLPT N1（自然な日本語）</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>日本人対応 2年の業務経験</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1日1組・快適な専用車を手配</span>
                </span>
              </div>

              {/* Primary LINE Action & Plan Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 max-w-lg mx-auto lg:mx-0">
                <a
                  href={SITE_CONFIG.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                  <span>LINEで無料相談する</span>
                </a>

                <Link
                  href="#featured-tours"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition-all"
                >
                  <span>おすすめプランを見る</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Reassurance text */}
              <p className="text-xs text-slate-300">
                ※ご相談は無料です。無理な営業は一切いたしません。旅程の質問だけでもお気軽にどうぞ。
              </p>

              {/* Secondary Social Channels */}
              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-300">
                <span className="text-[11px] text-slate-400">その他の窓口:</span>
                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-pink-300 transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram</span>
                </a>
                <span className="text-slate-600">|</span>
                <a
                  href={SITE_CONFIG.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <XIcon className="w-3.5 h-3.5 text-slate-300" />
                  <span>X (Twitter)</span>
                </a>
                <span className="text-slate-600">|</span>
                <Link href="/contact" className="hover:text-amber-300 transition-colors">
                  Webフォーム
                </Link>
              </div>
            </div>

            {/* Hero Right Column: Guide Intro Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/30 shadow-2xl bg-slate-900">
                  <div className="relative h-96 w-full">
                    <Image
                      src="/images/guide/anh-tho-avatar-v3.jpg"
                      alt="専属ガイド アン トー (Anh Tho)"
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-[#0B2545]/30 to-transparent" />
                  </div>

                  {/* Floating Guide Fact Box */}
                  <div className="p-5 sm:p-6 bg-[#0B2545]/95 backdrop-blur-md border-t border-slate-700">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-0.5">
                          PERSONAL GUIDE
                        </span>
                        <h2 className="text-lg font-bold text-white leading-tight">
                          アン トー (Anh Tho)
                        </h2>
                        <p className="text-xs text-slate-300 mt-1">
                          ダナン出身 / JLPT N1 / 日本人対応 2年経験
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                      「日本のみなさま、はじめまして！ダナンで生まれ育ちました。言葉の心配なく、安心してベトナム旅行を楽しんでいただけるよう、旅行前のご相談から当日の案内まで真心を込めてサポートいたします。」
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
                      <span className="text-amber-300 font-bold">1日1組様限定</span>
                      <a
                        href={SITE_CONFIG.lineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-300 hover:text-emerald-200 font-bold flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-emerald-300" />
                        <span>LINEで挨拶してみる ›</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BADGES SECTION (4 HONEST PILLARS) */}
      <section className="py-12 bg-[#FDFBF7] border-b border-slate-200/80 -mt-6 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <TrustBadges />
        </div>
      </section>

      {/* 3. MICRO LINE CTA BANNER */}
      <section className="bg-emerald-50 border-b border-emerald-100 py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs sm:text-sm font-bold text-emerald-950">
              日程が決まっていなくても大丈夫。まずはLINEでお気軽にご相談ください。
            </p>
          </div>
          <a
            href={SITE_CONFIG.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#06c755] hover:bg-[#05b34c] text-white text-xs font-bold rounded-full shadow-xs shrink-0 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span>LINEで質問する（無料）</span>
          </a>
        </div>
      </section>

      {/* 4. 初めての方へ (TO FIRST-TIME TRAVELERS) */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-600 tracking-wider block mb-1">
              FOR FIRST-TIME VISITORS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
              ベトナム旅行で、こんな不安はありませんか？
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              海外旅行、特に言葉や文化が異なるベトナムでは、誰もが少しの不安を抱えています。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-sm font-bold text-[#0B2545] mb-2">言葉の壁が心配</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                英語やベトナム語が通じるか不安。レストランの注文やお店での買い物、万が一の体調不良時に意思疎通できるか心配。
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-sm font-bold text-[#0B2545] mb-2">移動やタクシーの不安</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                空港到着後の客引きや、ぼったくりタクシーが怖い。Grabの配車や使い方が分からず無駄な時間を使いたくない。
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-sm font-bold text-[#0B2545] mb-2">本当のローカルを知りたい</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                観光客向けの割高な店ではなく、地元の人が本当に通う美味しいお店や、衛生面でも安心できる名店に行きたい。
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-sm font-bold text-[#0B2545] mb-2">自分たちのペースで回りたい</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                見知らぬ人との大型バスツアーは疲れる。家族や友達同士だけで、好きな場所でゆっくり写真を撮りながら過ごしたい。
              </p>
            </div>
          </div>

          {/* Guide Reassurance Card */}
          <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-300 text-center max-w-3xl mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-[#0B2545]">
              アン トーのプライベートツアーなら、
              <br className="sm:hidden" />
              その不安をすべて解消できます。
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
              旅行前のご相談から当日の案内まで、すべて日本語で丁寧に対応。
              人数や行程に合わせて専用車を手配するため、移動も快適で安心です。
            </p>
            <div className="mt-5">
              <a
                href={SITE_CONFIG.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#06c755] hover:bg-[#05b34c] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>旅行前の不安をLINEで相談してみる</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ご相談から当日までの流れ (BOOKING / CONSULTATION FLOW 6 STEPS) */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-amber-600 tracking-wider block mb-1">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
              ご相談から当日までの流れ
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              お問い合わせ・ご相談の段階では予約は確定しません。内容にご納得いただいてから確定となります。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-[#0B2545] mb-1.5">LINEまたはフォームからご相談</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ご希望の日程、人数、行きたい場所などをお気軽にお知らせください。「まだ何も決まっていない」状態でも大丈夫です。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-[#0B2545] mb-1.5">旅程とお見積りのご提案</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                いただいたご希望に合わせて、無理のないタイムスケジュールとお見積りを作成し、日本語でご案内します。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-[#0B2545] mb-1.5">内容の調整・ご確認</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                「ここも寄りたい」「出発時間をずらしたい」など、ご納得いただけるまで何度でも無料で調整いたします。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="text-sm font-bold text-[#0B2545] mb-1.5">ご予約の確定</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                プラン・日程・料金にご納得いただいた時点で、ご予約が正式に確定となります。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center mb-3">
                5
              </div>
              <h3 className="text-sm font-bold text-[#0B2545] mb-1.5">旅行前のご相談</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                旅行が近づいたら、現地の気候や服装、両替、持ち物など、気になったことをいつでもLINEで質問いただけます。
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center mb-3">
                6
              </div>
              <h3 className="text-sm font-bold text-[#0B2545] mb-1.5">当日のお出迎え・ご案内</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                当日は空港またはホテルロビーへ専用車でお迎えにあがります。安心・安全な旅をお楽しみください。
              </p>
            </div>
          </div>

          {/* Caveat Box */}
          <div className="mt-10 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-amber-950 font-bold">
              内容にご納得いただいてから、ご予約を確定します。
            </p>
            <p className="text-xs text-amber-800 mt-1">
              ご相談やお見積りの段階でお支払いは一切発生しませんので、お気軽にご連絡ください。
            </p>
          </div>
        </div>
      </section>

      {/* 6. なぜ、アン トーなのか？ (WHY ANH THO?) */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-amber-600 tracking-wider block mb-1">
              WHY CHOOSE ANH THO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
              なぜ、アン トーなのか？
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              見知らぬツアー会社ではなく、「安心できる個人ガイド」に任せる理由があります。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-base">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B2545] mb-1.5">
                  地元ダナン出身だから、定番も穴場も知っている
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  ダナン生まれ・ダナン育ちだからこそ、定番の観光スポットはもちろん、ガイドブックには載っていない地元の美味しいお店や静かな撮影スポットまで熟知しています。
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-base">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B2545] mb-1.5">
                  日本人対応2年の経験から、日本人の安心感を大切にする
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  日本人のお客様への対応や日系企業との折衝業務を2年間経験。時間厳守や清潔さ、細やかな気配りなど、日本のお客様が求める安心基準を大切にしています。
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-base">
                3
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B2545] mb-1.5">
                  団体ツアーにはない、完全プライベートな自由度
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  他のお客様に合わせる必要はありません。「ここで少しゆっくりお茶したい」「このお土産をもっと見たい」など、当日の気分や体調に合わせて柔軟に変更できます。
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 font-bold text-base">
                4
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B2545] mb-1.5">
                  旅の前からLINEでつながる安心感
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  「出発前の服装」「現地のお金の両替」「持ち物」など、出発前のちょっとした疑問もLINEで事前に解消。当日初めて会う前から安心感が生まれます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 1日1組。だから、あなたの旅だけを考えます。 */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#07192E] to-[#0B2545] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold tracking-wider">
            <Heart className="w-3.5 h-3.5 text-amber-400" />
            <span>1 GROUP PER DAY POLICY</span>
          </span>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            1日1組。
            <br />
            だから、あなたの旅だけを考えます。
          </h2>

          <p className="text-xs sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto">
            効率を求めて何組ものツアーを掛け持ちすることはありません。
            <br />
            一日にご案内するのは、あなたの一組だけ。
            <br className="hidden sm:inline" />
            疲れたらカフェで休憩し、気に入った景色があれば気の済むまで眺める。
            <br />
            あなたの旅のペースが、ツアーのスケジュールです。
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              相乗り一切なし
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              当日の行程調整OK
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              専用車手配（エアコン完備）
            </span>
          </div>
        </div>
      </section>

      {/* 8. FEATURED TOURS SECTION (TOP 3 PLANS) */}
      <section id="featured-tours" className="py-16 sm:py-24 bg-slate-50/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-600 tracking-wider block mb-1">
              FEATURED PLANS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B2545] tracking-tight">
              おすすめのツアープラン
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              初めてのダナン旅行に人気の王道プランから、自由自在のオーダーメイドまで。全プラン完全貸切です。
            </p>
          </div>

          {/* Top 3 Tours Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredTours.slice(0, 3).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

          {/* Big Button to View All 10 Tours */}
          <div className="mt-12 text-center space-y-3">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0B2545] hover:bg-[#133E68] text-white font-bold text-sm sm:text-base rounded-full shadow-md hover:shadow-xl hover:scale-102 active:scale-98 transition-all"
            >
              <span>すべてのプランを見る（全10プラン）</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
            <p className="text-xs text-slate-500">
              ※女子旅プラン、男旅アクティブ、ローカル市場グルメ、フエ古都世界遺産など多彩にご用意しています
            </p>
          </div>
        </div>
      </section>

      {/* 9. ABOUT ANH THO (PERSONAL NARRATIVE & VERIFIED FACTS) */}
      <section id="guide" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Guide Photo */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <div className="relative h-96 sm:h-[460px] w-full">
                  <Image
                    src="/images/guide/anh-tho-about-v3.jpg"
                    alt="ベトナム日本語ガイド アン トー (Anh Tho)"
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/80 via-transparent to-transparent" />
                </div>
                <div className="p-6 bg-[#0B2545] text-white">
                  <h3 className="text-lg font-bold">アン トー (Anh Tho)</h3>
                  <p className="text-xs text-amber-300 mt-1">
                    ダナン出身 / 日本語能力試験（JLPT）N1取得
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-700 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">・出身:</span>
                      <span>ベトナム・ダナン（生粋のローカル）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">・日本語:</span>
                      <span>JLPT N1取得（流暢・自然な日本語）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">・経験:</span>
                      <span>日本人のお客様・日系企業との業務経験 2年</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">・エリア:</span>
                      <span>ダナン・ホイアン中心（ベトナム全土対応可能）</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guide Story Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold text-amber-600 tracking-wider block">
                ABOUT ANH THO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
                はじめまして、アン トーです。
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>
                  ベトナム・ダナンで生まれ育ちました。
                </p>
                <p>
                  日本語能力試験（JLPT）N1を取得し、これまで2年間、日本人のお客様への対応や日系企業との折衝業務に携わってきました。
                </p>
                <p>
                  ダナンやホイアンには、ガイドブックには載っていない美しい風景や、地元の人しか知らない美味しいお店がたくさんあります。
                </p>
                <p>
                  「言葉が通じない不安」を「旅の安心と楽しさ」に変えられるよう、一組一組のお客様を大切にご案内いたします。
                </p>
                <p className="font-bold text-[#0B2545]">
                  ベトナムでお会いできるのを楽しみにしています。
                </p>
              </div>

              {/* Action */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={SITE_CONFIG.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>アン トーにLINEで直接メッセージ</span>
                </a>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all"
                >
                  <span>お問い合わせフォーム</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. こんなことも、お気軽にご相談ください (WHAT YOU CAN ASK) */}
      <section className="py-16 sm:py-24 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-600 tracking-wider block mb-1">
              FEEL FREE TO ASK
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
              こんなことも、お気軽にご相談ください
            </h2>

            {/* Honest Service Status Note */}
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 max-w-xl mx-auto text-xs text-amber-900 leading-relaxed">
              <p className="font-semibold">
                現在、サービスを準備・運営しています。
              </p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                一組一組のお客様に丁寧に向き合うことを大切にしています。
              </p>
            </div>
          </div>

          {/* 7 Questions & Answers Cards */}
          <div className="space-y-3.5">
            {consultationExamples.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    Q
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0B2545]">
                    {item.q}
                  </h3>
                </div>
                <div className="flex items-start gap-3 pl-9">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Micro CTA */}
          <div className="mt-10 text-center space-y-3">
            <p className="text-xs sm:text-sm font-bold text-slate-700">
              どんな小さなことでも、LINEでお気軽にどうぞ。
            </p>
            <a
              href={SITE_CONFIG.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#06c755] hover:bg-[#05b34c] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>LINEで無料相談してみる</span>
            </a>
          </div>
        </div>
      </section>

      {/* 11. LOCAL BLOG & TRAVEL TIPS */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-amber-600 tracking-wider block mb-1">
                LOCAL TRAVEL TIPS
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

      {/* 12. FAQ SECTION */}
      <section id="faq" className="py-16 sm:py-24 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-600 tracking-wider block mb-1">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
              よくあるご質問（FAQ）
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              ご予約の流れ、お支払い、専用車、キャンセル規定などについてまとめました。
            </p>
          </div>

          <FaqAccordion />

          <div className="mt-10 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <p className="text-xs sm:text-sm text-amber-900 font-bold">
              ここにない疑問やご要望もお気軽にどうぞ！
            </p>
            <p className="text-xs text-amber-800 mt-1">
              公式LINEよりいつでもお気軽にお問い合わせください。
            </p>
          </div>
        </div>
      </section>

      {/* 13. BOTTOM CTA SECTION */}
      <section id="line-consultation" className="py-16 sm:py-20 bg-gradient-to-br from-[#07192E] to-[#0B2545] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white/5 border border-white/15 rounded-3xl p-8 sm:p-12 backdrop-blur-md text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-300" />
              事前相談・お見積り無料
            </span>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              ダナン・ホイアンの旅を、
              <br />
              安心の日本語で始めませんか？
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              旅程のご相談、お見積り、空き状況の確認など、
              <br className="hidden sm:inline" />
              どんな小さなことでもLINEでお気軽にお問い合わせください。
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={SITE_CONFIG.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                <span>LINEで無料相談する</span>
              </a>

              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Webお問い合わせフォームはこちら</span>
              </Link>
            </div>

            <p className="text-[11px] text-slate-400 pt-2">
              ※ご相談は無料です。ご予約確定前にお支払いは発生しません。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
