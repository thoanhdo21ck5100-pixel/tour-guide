import { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS_DATA } from '@/lib/data/blog';
import BlogCard from '@/components/BlogCard';
import { constructMetadata } from '@/lib/seo';
import { BookOpen, Sparkles, MessageCircle } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'ダナン現地お役立ちブログ | 観光・交通・グルメ・最新情報',
  description:
    '【現地公認ガイド発】ダナン空港からのGrab乗り方、世界遺産ホイアンのランタン夜市攻略法、女子旅モデルコースなど、日本人旅行者の不安を解消するダナン観光の最新情報をお届けします。',
  canonical: '/blog',
});

export default function BlogIndexPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            ホーム
          </Link>
          <span>/</span>
          <span className="text-[#0B2545] font-bold">現地ブログ</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>LOCAL TRAVEL GUIDE & TIPS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B2545] tracking-tight">
            ダナン現地ガイド発 観光お役立ちブログ
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            ガイドブックには載っていないリアルな最新情報。空港からのアクセスやGrabの乗り方、ぼったくり回避法、穴場のおしゃれカフェ、女子旅モデルコースまで、日本人旅行者目線で詳しく解説します。
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {BLOG_POSTS_DATA.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Consultation Callout */}
        <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-amber-600 flex items-center justify-center md:justify-start gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              記事に関するご質問・個別のご相談もお気軽に
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B2545]">
              「この記事のスポットをツアープランに組み込みたい」も大歓迎！
            </h2>
            <p className="text-xs text-slate-600">
              気になるカフェやお店があれば、専用車チャーターで効率よく巡る旅程をお作りします。
            </p>
          </div>

          <Link
            href="/contact#line-consultation"
            className="px-6 py-3.5 bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            LINEで質問・相談する
          </Link>
        </div>
      </div>
    </div>
  );
}
