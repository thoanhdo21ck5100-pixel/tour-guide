import Link from 'next/link';
import Image from 'next/image';
import { Plus, Compass, Edit3, Star, Clock, ExternalLink } from 'lucide-react';
import { getAllTours } from '@/lib/supabase';

export default async function AdminToursListPage() {
  const tours = await getAllTours();

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-600 block">TOUR CMS</span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B2545]">
            ツアープラン一覧・CMS管理
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ツアーの新規登録、価格設定、旅程スケジュール、写真の変更
          </p>
        </div>

        <Link
          href="/admin/tours/new"
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>新規ツアープランを追加</span>
        </Link>
      </div>

      {/* Tours Grid / List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3.5 px-4">写真 / タイトル</th>
                <th className="py-3.5 px-4">カテゴリー</th>
                <th className="py-3.5 px-4">料金 (JPY)</th>
                <th className="py-3.5 px-4">所要時間</th>
                <th className="py-3.5 px-4">評価</th>
                <th className="py-3.5 px-4 text-right">アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tours.map((tour) => (
                <tr key={tour.slug} className="hover:bg-slate-50/70">
                  {/* Photo & Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                        <Image
                          src={tour.heroImage}
                          alt={tour.title}
                          fill
                          className="object-cover"
                          unoptimized={tour.heroImage.startsWith('data:')}
                        />
                      </div>
                      <div className="max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 line-clamp-1">{tour.title}</span>
                          {tour.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">
                              {tour.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">/tours/{tour.slug}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {tour.categoryLabel}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-bold text-[#0B2545]">
                    {tour.priceJpy.toLocaleString()} 円
                    <span className="block text-[10px] text-slate-400 font-normal">
                      約 {tour.priceVnd.toLocaleString()} VND
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {tour.duration}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {tour.rating}
                      <span className="text-[10px] text-slate-400 font-normal">({tour.reviewCount})</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/tours/${tour.slug}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="一般公開ページを確認"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/tours/${tour.slug}`}
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
