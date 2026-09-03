import Link from 'next/link';
import { Calendar, Compass, FileText, Inbox, Plus, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { getAllTours, getAllBlogs, fetchAllBookingsAdmin } from '@/lib/supabase';

export default async function AdminDashboardPage() {
  const tours = await getAllTours();
  const blogs = await getAllBlogs();
  const bookings = await fetchAllBookingsAdmin();

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl w-full mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-600 block">ADMIN CONSOLE</span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B2545]">
            ダナンガイド 管理ダッシュボード
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            カレンダーの空き枠切り替え、ツアープラン更新、ブログ記事作成を一元管理
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/calendar"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>カレンダー空き管理</span>
          </Link>
          <Link
            href="/admin/tours/new"
            className="px-4 py-2.5 bg-[#0B2545] hover:bg-[#133E68] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>新規ツアー作成</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calendar Card */}
        <Link
          href="/admin/calendar"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-amber-600 transition-colors">
              管理へ →
            </span>
          </div>
          <h2 className="text-xs font-bold text-slate-500 mt-3">カレンダー管理</h2>
          <div className="text-xl font-black text-[#0B2545] mt-1">ワンクリック切替</div>
          <p className="text-[11px] text-slate-400 mt-0.5">空き / 満席を即時反映</p>
        </Link>

        {/* Tours Card */}
        <Link
          href="/admin/tours"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-amber-600 transition-colors">
              CMSへ →
            </span>
          </div>
          <h2 className="text-xs font-bold text-slate-500 mt-3">掲載中ツアー</h2>
          <div className="text-2xl font-black text-[#0B2545] mt-1">{tours.length} 件</div>
          <p className="text-[11px] text-slate-400 mt-0.5">プラン編集＆価格設定</p>
        </Link>

        {/* Blog Card */}
        <Link
          href="/admin/blog"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-amber-600 transition-colors">
              CMSへ →
            </span>
          </div>
          <h2 className="text-xs font-bold text-slate-500 mt-3">公開ブログ記事</h2>
          <div className="text-2xl font-black text-[#0B2545] mt-1">{blogs.length} 本</div>
          <p className="text-[11px] text-slate-400 mt-0.5">SEO対策・現地最新情報</p>
        </Link>

        {/* Bookings Card */}
        <Link
          href="/admin/bookings"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-amber-600 transition-colors">
              一覧へ →
            </span>
          </div>
          <h2 className="text-xs font-bold text-slate-500 mt-3">受信予約件数</h2>
          <div className="text-2xl font-black text-[#0B2545] mt-1">{bookings.length} 件</div>
          <p className="text-[11px] text-slate-400 mt-0.5">お客様からの仮予約</p>
        </Link>
      </div>

      {/* Recent Bookings List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-[#0B2545]">最近の予約リクエスト</h2>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>すべて見る</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            現在新しい予約リクエストはありません。
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-semibold">お名前</th>
                  <th className="pb-3 font-semibold">ツアー名</th>
                  <th className="pb-3 font-semibold">希望日</th>
                  <th className="pb-3 font-semibold">人数</th>
                  <th className="pb-3 font-semibold">連絡先</th>
                  <th className="pb-3 font-semibold">ステータス</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3 font-bold text-slate-800">
                      {b.name} <span className="text-[10px] text-slate-400">({b.kana})</span>
                    </td>
                    <td className="py-3 text-slate-700 truncate max-w-xs">{b.tourName || b.tourSlug}</td>
                    <td className="py-3 font-mono text-slate-600">{b.preferredDate}</td>
                    <td className="py-3 text-slate-600">大人{b.adultsCount}名 / 子{b.childrenCount}名</td>
                    <td className="py-3 text-slate-600 font-mono">
                      <span className="uppercase text-[10px] font-bold text-slate-400 mr-1">
                        [{b.contactType}]
                      </span>
                      {b.contactValue}
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {b.status === 'pending' ? '未確認 / 返信待ち' : b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
