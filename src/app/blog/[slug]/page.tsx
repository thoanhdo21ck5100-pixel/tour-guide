import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  Lightbulb,
  ArrowRight,
  MessageCircle,
  Compass,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { getBlogPostBySlug, BLOG_POSTS_DATA } from '@/lib/data/blog';
import { getTourBySlug } from '@/lib/data/tours';
import { constructMetadata, generateBlogPostSchema, generateBreadcrumbSchema, SITE_CONFIG } from '@/lib/seo';
import GuideStrategicValueCard from '@/components/GuideStrategicValueCard';
import InstagramIcon from '@/components/InstagramIcon';
import XIcon from '@/components/XIcon';

export async function generateStaticParams() {
  return BLOG_POSTS_DATA.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return constructMetadata({ title: '記事が見つかりません', noIndex: true });
  }

  return constructMetadata({
    title: `${post.title} | ダナン観光ブログ`,
    description: post.excerpt,
    image: post.coverImage,
    canonical: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const tourSlugs = post.relatedTourSlugs && post.relatedTourSlugs.length > 0
    ? post.relatedTourSlugs
    : post.relatedTourSlug
    ? [post.relatedTourSlug]
    : [];

  const relatedTours = tourSlugs
    .map((s) => getTourBySlug(s))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);
  const jsonLd = generateBlogPostSchema(post);
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: 'ホーム', url: '/' },
    { name: '現地ブログ', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  // Related blog posts
  const relatedPosts = (post.relatedBlogSlugs || [])
    .map((s) => getBlogPostBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== undefined && p.slug !== post.slug);

  const displayRelatedPosts = relatedPosts.length > 0
    ? relatedPosts
    : BLOG_POSTS_DATA.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="bg-[#FDFBF7] min-h-screen py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* ① Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            ホーム
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-amber-600 transition-colors">
            現地ブログ
          </Link>
          <span>/</span>
          <span className="text-[#0B2545] font-bold truncate max-w-xs sm:max-w-sm">
            {post.title}
          </span>
        </nav>

        {/* ② & ③ & ④ Article Header */}
        <header className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {/* ② Category */}
            <span className="px-3 py-1 bg-amber-500 text-white font-bold rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {post.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readingTime}
            </span>
          </div>

          {/* ③ H1 */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B2545] tracking-tight leading-snug">
            {post.title}
          </h1>

          {/* ④ Author */}
          <div className="flex items-center gap-3 pt-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-300">
              <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{post.author.name}</p>
              <p className="text-[11px] text-slate-500">{post.author.role}</p>
            </div>
          </div>
        </header>

        {/* ⑤ Cover Image */}
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md mb-8 bg-slate-100">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            className="object-cover"
          />
        </div>

        {/* ⑥ この記事の結論 / 要点 (Answer-First Box) */}
        {post.keyTakeaway && (
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/90 border-2 border-amber-300/80 shadow-xs mb-8 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>この記事の結論 / 要点（Answer-First）</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
              {post.keyTakeaway}
            </p>
          </div>
        )}

        {/* ⑦ 目次（Table of Contents） */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-8">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>目次（Contents）</span>
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {post.content.sections.map((sec, i) => (
              <li key={i} className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                <span className="text-amber-500 font-bold">›</span>
                <a href={`#section-${i}`}>{sec.heading}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* ⑧ & ⑨ Article Body & Section Tips */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-8 text-slate-800 leading-relaxed">
          {/* Intro */}
          <p className="text-sm sm:text-base leading-relaxed text-slate-700 border-l-4 border-amber-500 pl-4 py-1 italic bg-amber-50/40 rounded-r-xl">
            {post.content.intro}
          </p>

          {/* ⑧ Main content sections */}
          {post.content.sections.map((sec, idx) => (
            <section key={idx} id={`section-${idx}`} className="space-y-4 pt-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#0B2545] pb-2 border-b border-slate-100">
                {sec.heading}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {sec.body}
              </p>

              {/* ⑨ 現地ガイドのポイント (Tips Callout) */}
              {sec.tips && sec.tips.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2 my-4">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>現地ガイドからのアドバイス＆注意点:</span>
                  </div>
                  <ul className="space-y-1.5 pl-2">
                    {sec.tips.map((tip, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}

          {/* ⑩ まとめ (Conclusion) */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-base font-bold text-[#0B2545] mb-2">まとめ</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {post.content.conclusion}
            </p>
          </div>

          {/* Guide Support Card */}
          <GuideStrategicValueCard
            mode="blog"
            relatedTourSlug={post.relatedTourSlug || post.relatedTourSlugs?.[0]}
            className="mt-8 mb-4"
          />

          {/* ⑪ この記事に関連するツアープラン */}
          {relatedTours.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-2 text-xs text-amber-800 font-bold mb-1">
                <Compass className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-bold text-[#0B2545]">
                  この記事に関連するプライベートツアープラン
                </span>
              </div>
              <div className={`grid grid-cols-1 ${relatedTours.length > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
                {relatedTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="p-6 rounded-2xl bg-gradient-to-br from-[#0B2545] to-[#133E68] text-white shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold mb-2">
                        {tour.categoryLabel}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                        {tour.title}
                      </h3>
                      <p className="text-xs text-slate-200 mb-4 line-clamp-2 leading-relaxed">
                        {tour.shortDescription}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-700 mt-auto">
                      <div>
                        <span className="text-[11px] text-slate-300 block">完全定額・事前決済不要:</span>
                        <span className="text-base font-bold text-amber-300">
                          {tour.priceJpy.toLocaleString('ja-JP')}円 / 名
                        </span>
                      </div>
                      <Link
                        href={`/tours/${tour.slug}`}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <span>ツアー詳細を見る</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ⑫ 関連記事 (Related Blog Posts) */}
          {displayRelatedPosts.length > 0 && (
            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-sm font-bold text-[#0B2545] mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>こちらの記事もよく読まれています</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayRelatedPosts.map((rPost) => (
                  <Link
                    key={rPost.id}
                    href={`/blog/${rPost.slug}`}
                    className="group p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between bg-slate-50/50"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {rPost.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0B2545] group-hover:text-amber-600 transition-colors line-clamp-2">
                        {rPost.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {rPost.excerpt}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{rPost.readingTime}</span>
                      <span className="text-amber-600 font-bold flex items-center gap-0.5">
                        読む <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ⑬ LINE / 相談 CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center space-y-3">
            <h3 className="text-base font-bold text-[#0B2545]">
              ベトナム旅行のご質問・旅程のご相談はお気軽にどうぞ
            </h3>
            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
              「このスポットとあのスポットを1日で回れる？」「ホテル周辺の治安は？」など、LINE・SNSより日本語で直接ご相談いただけます（相談無料・事前決済不要）。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={SITE_CONFIG.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>公式LINEで相談する</span>
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
                <span>Instagram DM</span>
              </a>
              <a
                href={SITE_CONFIG.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <XIcon className="w-4 h-4 text-white" />
                <span>X / Twitter</span>
              </a>
            </div>
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">タグ:</span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0B2545] hover:text-amber-600 transition-colors"
          >
            <span>← 現地ブログ一覧へ戻る</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
