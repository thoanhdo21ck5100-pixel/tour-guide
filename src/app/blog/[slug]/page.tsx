import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  User,
  Lightbulb,
  ArrowRight,
  MessageCircle,
  Share2,
  Compass,
} from 'lucide-react';
import { getBlogPostBySlug, BLOG_POSTS_DATA } from '@/lib/data/blog';
import { getTourBySlug } from '@/lib/data/tours';
import { constructMetadata, generateBlogPostSchema, generateBreadcrumbSchema } from '@/lib/seo';
import GuideStrategicValueCard from '@/components/GuideStrategicValueCard';

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

  const relatedTour = post.relatedTourSlug ? getTourBySlug(post.relatedTourSlug) : null;
  const jsonLd = generateBlogPostSchema(post);
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: 'ホーム', url: '/' },
    { name: '現地ブログ', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

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
        {/* Breadcrumb */}
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

        {/* Article Header */}
        <header className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
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

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B2545] tracking-tight leading-snug">
            {post.title}
          </h1>

          {/* Author snippet */}
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

        {/* Cover Image */}
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md mb-10 bg-slate-100">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Table of Contents Box */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-10">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            目次（Contents）
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

        {/* Article Body */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-8 text-slate-800 leading-relaxed">
          {/* Intro */}
          <p className="text-sm sm:text-base leading-relaxed text-slate-700 border-l-4 border-amber-500 pl-4 py-1 italic bg-amber-50/40 rounded-r-xl">
            {post.content.intro}
          </p>

          {/* Sections */}
          {post.content.sections.map((sec, idx) => (
            <section key={idx} id={`section-${idx}`} className="space-y-4 pt-4">
              <h2 className="text-lg sm:text-xl font-bold text-[#0B2545] pb-2 border-b border-slate-100">
                {sec.heading}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {sec.body}
              </p>

              {/* Tips Callout */}
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

          {/* Conclusion */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-base font-bold text-[#0B2545] mb-2">まとめ</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {post.content.conclusion}
            </p>
          </div>

          {/* Strategic Guide Value & Consultation Callout */}
          <GuideStrategicValueCard
            mode="blog"
            relatedTourSlug={post.relatedTourSlug}
            className="mt-8 mb-4"
          />

          {/* Related Tour Recommendation Box */}
          {relatedTour && (
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#0B2545] to-[#133E68] text-white shadow-md">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-bold mb-2">
                <Compass className="w-4 h-4" />
                <span>この記事に関連するプライベートツアープラン</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                {relatedTour.title}
              </h3>
              <p className="text-xs text-slate-200 mb-4 line-clamp-2">
                {relatedTour.shortDescription}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-700">
                <div>
                  <span className="text-xs text-slate-300">安心の完全定額: </span>
                  <span className="text-lg font-bold text-amber-300">
                    {relatedTour.priceJpy.toLocaleString()}円 / 名
                  </span>
                </div>
                <Link
                  href={`/tours/${relatedTour.slug}`}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>ツアー詳細を見る</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

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
