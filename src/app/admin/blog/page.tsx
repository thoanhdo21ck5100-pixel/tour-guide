import Link from 'next/link';
import Image from 'next/image';
import { Plus, FileText, Edit3, Calendar, Clock, ExternalLink } from 'lucide-react';
import { getAllBlogs } from '@/lib/supabase';

export default async function AdminBlogListPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-600 block">BLOG CMS</span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B2545]">
            現地ブログ記事一覧・CMS管理
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            SEO記事の執筆、写真アップロード、タグ管理、ツアープランとの紐づけ
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>新しい記事を執筆</span>
        </Link>
      </div>

      {/* Blogs List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3.5 px-4">アイキャッチ / 記事タイトル</th>
                <th className="py-3.5 px-4">カテゴリー</th>
                <th className="py-3.5 px-4">公開日</th>
                <th className="py-3.5 px-4">読了目安</th>
                <th className="py-3.5 px-4">タグ</th>
                <th className="py-3.5 px-4 text-right">アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogs.map((post) => (
                <tr key={post.slug} className="hover:bg-slate-50/70">
                  {/* Image & Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                          unoptimized={post.coverImage.startsWith('data:')}
                        />
                      </div>
                      <div className="max-w-md">
                        <span className="font-bold text-slate-800 line-clamp-1">{post.title}</span>
                        <span className="text-[11px] text-slate-400 font-mono">/blog/{post.slug}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {post.category}
                    </span>
                  </td>

                  {/* Published Date */}
                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {post.publishedAt}
                    </span>
                  </td>

                  {/* Reading Time */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {post.readingTime}
                    </span>
                  </td>

                  {/* Tags */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="一般公開記事を確認"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/blog/${post.slug}`}
                        className="px-3 py-1.5 bg-[#0B2545] hover:bg-[#133E68] text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>編集</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
