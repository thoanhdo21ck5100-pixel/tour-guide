import { fetchAllBookingsAdmin } from '@/lib/supabase';
import { Inbox, MessageCircle, Calendar, Users, Hotel, ShieldCheck, Mail } from 'lucide-react';

export default async function AdminBookingsPage() {
  const bookings = await fetchAllBookingsAdmin();

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-600 block">RESERVATIONS & INQUIRIES</span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B2545]">
            予約リクエスト管理
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            お客様からの仮予約申し込み・LINE/メール等の連絡先詳細
          </p>
        </div>

        <div className="px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>総受信件数: {bookings.length} 件</span>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 text-xs">
          現在予約リクエストはありません。
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b, idx) => (
            <div
              key={b.id || idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-4"
            >
              {/* Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">
                    #{b.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {b.status === 'pending' ? '未確定・返信待ち' : b.status}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  受付日時: {b.createdAt ? new Date(b.createdAt).toLocaleString('ja-JP') : '-'}
                </span>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Traveler */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">お客様名</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{b.name}</p>
                  <p className="text-[11px] text-slate-400">({b.kana})</p>
                </div>

                {/* Tour & Date */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">ご希望ツアー＆日程</span>
                  <p className="font-bold text-[#0B2545] mt-0.5 line-clamp-1">{b.tourName || b.tourSlug}</p>
                  <p className="text-[11px] text-slate-600 font-mono mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-600" />
                    第1希望: {b.preferredDate}
                  </p>
                  {b.alternativeDate && (
                    <p className="text-[10px] text-slate-400 font-mono">第2希望: {b.alternativeDate}</p>
                  )}
                </div>

                {/* Pax & Hotel */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">参加人数＆ホテル</span>
                  <p className="text-slate-700 mt-0.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    大人: {b.adultsCount}名 / 小人: {b.childrenCount}名
                  </p>
                  <p className="text-slate-600 text-[11px] mt-0.5 flex items-center gap-1">
                    <Hotel className="w-3 h-3 text-slate-400" />
                    {b.hotelName || '未定・未入力'}
                  </p>
                </div>

                {/* Contact Method */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">ご連絡先</span>
                  <div className="mt-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold uppercase text-[10px] text-slate-700">
                      {b.contactType}
                    </span>
                    <p className="font-mono text-xs font-bold text-slate-800 mt-1 select-all">
                      {b.contactValue}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {b.specialRequests && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-0.5">特記事項・ご質問:</span>
                  <p className="whitespace-pre-wrap">{b.specialRequests}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
