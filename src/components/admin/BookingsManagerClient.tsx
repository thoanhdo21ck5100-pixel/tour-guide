'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Inbox,
  Calendar,
  Users,
  Hotel,
  ShieldCheck,
  RefreshCw,
  Search,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  Volume2,
} from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import { BookingSubmission } from '@/types';

interface Props {
  initialBookings: BookingSubmission[];
}

export default function BookingsManagerClient({ initialBookings }: Props) {
  const [bookings, setBookings] = useState<BookingSubmission[]>(initialBookings);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(() => new Date().toLocaleTimeString('ja-JP'));

  // Audio alert on new booking
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio not permitted or not supported
    }
  };

  // Fetch live bookings
  const refreshBookings = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/admin/bookings?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.bookings)) {
          setBookings((prev) => {
            // Check if there are newly arrived bookings
            if (data.bookings.length > prev.length) {
              playAlertSound();
            }
            return data.bookings;
          });
          setLastRefreshedAt(new Date().toLocaleTimeString('ja-JP'));
        }
      }
    } catch (err) {
      console.warn('Failed to refresh bookings:', err);
    } finally {
      if (!isSilent) setIsRefreshing(false);
    }
  }, []);

  // Polling every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      refreshBookings(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshBookings]);

  // Copy contact value
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Update status in Supabase
  const handleStatusChange = async (id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtering
  const filteredBookings = bookings.filter((b) => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q) || b.kana.toLowerCase().includes(q);
      const matchTour = (b.tourName || b.tourSlug).toLowerCase().includes(q);
      const matchContact = b.contactValue.toLowerCase().includes(q);
      const matchEmail = b.email ? b.email.toLowerCase().includes(q) : false;
      return matchName || matchTour || matchContact || matchEmail;
    }
    return true;
  });

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-6xl w-full mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-600 block">RESERVATIONS & INQUIRIES</span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B2545] flex items-center gap-2.5">
            予約リクエスト管理
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse">
                未対応 {pendingCount}件
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            お客様からの仮予約申し込み・LINE/メール等の連絡先詳細（30秒毎に自動更新）
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block">最終更新</span>
            <span className="text-xs font-mono font-bold text-slate-700">{lastRefreshedAt}</span>
          </div>

          <button
            type="button"
            onClick={() => refreshBookings(false)}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-[#0B2545] hover:bg-[#133E68] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>最新情報を取得</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={`text-[11px] font-bold block ${filter === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
            全件表示
          </span>
          <div className="text-2xl font-black mt-0.5">{bookings.length} 件</div>
        </button>

        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filter === 'pending'
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={`text-[11px] font-bold block ${filter === 'pending' ? 'text-amber-100' : 'text-amber-600'}`}>
            未対応・返信待ち
          </span>
          <div className="text-2xl font-black mt-0.5 text-amber-600 group-hover:text-amber-700" style={{ color: filter === 'pending' ? '#fff' : undefined }}>
            {pendingCount} 件
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilter('confirmed')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filter === 'confirmed'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={`text-[11px] font-bold block ${filter === 'confirmed' ? 'text-emerald-100' : 'text-emerald-600'}`}>
            予約確定済
          </span>
          <div className="text-2xl font-black mt-0.5 text-emerald-600" style={{ color: filter === 'confirmed' ? '#fff' : undefined }}>
            {confirmedCount} 件
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilter('cancelled')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filter === 'cancelled'
              ? 'bg-slate-700 text-white border-slate-700 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className={`text-[11px] font-bold block ${filter === 'cancelled' ? 'text-slate-300' : 'text-slate-400'}`}>
            キャンセル済
          </span>
          <div className="text-2xl font-black mt-0.5 text-slate-400" style={{ color: filter === 'cancelled' ? '#fff' : undefined }}>
            {cancelledCount} 件
          </div>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="お客様名、ツアー名、LINE IDやメールアドレスで検索..."
          className="w-full text-xs outline-none bg-transparent placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:text-slate-600 text-xs px-2"
          >
            クリア
          </button>
        )}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 text-xs space-y-2">
          <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
          <p>該当する予約リクエストはありません。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isUpdating = updatingId === b.id;
            return (
              <div
                key={b.id}
                className={`bg-white rounded-2xl border transition-all p-6 shadow-xs hover:shadow-md space-y-4 ${
                  b.status === 'pending'
                    ? 'border-amber-200 bg-amber-50/10'
                    : b.status === 'confirmed'
                    ? 'border-emerald-200'
                    : 'border-slate-200 opacity-75'
                }`}
              >
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      #{b.id?.slice(0, 8)}...
                    </span>

                    {/* Status Dropdown / Pill */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={b.status || 'pending'}
                        onChange={(e) =>
                          handleStatusChange(
                            b.id!,
                            e.target.value as 'pending' | 'confirmed' | 'cancelled'
                          )
                        }
                        disabled={isUpdating}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer transition-colors ${
                          b.status === 'pending'
                            ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                            : b.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        <option value="pending">⏳ 未対応（返信待ち）</option>
                        <option value="confirmed">✅ 予約確定済</option>
                        <option value="cancelled">✖ キャンセル</option>
                      </select>
                      {isUpdating && <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />}
                    </div>
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
                    <p className="text-[11px] text-slate-400">フリガナ: {b.kana}</p>
                  </div>

                  {/* Tour & Date */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">希望ツアー＆日程</span>
                    <p className="font-bold text-[#0B2545] mt-0.5 line-clamp-2" title={b.tourName || b.tourSlug}>
                      {b.tourName || b.tourSlug}
                    </p>
                    {b.specialRequests?.includes('複数日') && b.alternativeDate ? (
                      <div className="mt-1">
                        <span className="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-bold text-[10px] mb-0.5">
                          🗓️ 複数日・周遊プラン
                        </span>
                        <p className="text-[11px] text-slate-800 font-mono font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                          {b.preferredDate} 〜 {b.alternativeDate}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-[11px] text-slate-600 font-mono mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                          第1希望: <span className="font-bold">{b.preferredDate}</span>
                        </p>
                        {b.alternativeDate && (
                          <p className="text-[10px] text-slate-400 font-mono pl-4">第2希望: {b.alternativeDate}</p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Pax & Hotel */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">参加人数＆ホテル</span>
                    <p className="text-slate-700 mt-0.5 flex items-center gap-1 font-bold">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      大人 {b.adultsCount}名 / 小人 {b.childrenCount}名
                    </p>
                    <p className="text-slate-600 text-[11px] mt-1 flex items-center gap-1">
                      <Hotel className="w-3 h-3 text-slate-400 shrink-0" />
                      {b.hotelName || '未定・未入力'}
                    </p>
                  </div>

                  {/* Contact Method & Direct Action */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">連絡先・即時連絡</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold uppercase text-[10px] text-slate-700">
                        {b.contactType}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(b.contactValue, b.id!)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        title="連絡先をコピー"
                      >
                        {copiedId === b.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="font-mono text-xs font-bold text-slate-800 mt-1 select-all break-all">
                      {b.contactValue}
                    </p>

                    {/* Backup Email if exists */}
                    {b.email && b.contactType !== 'email' && (
                      <div className="mt-1.5 pt-1 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-normal">予備メール:</span>
                        <a
                          href={`mailto:${b.email}?subject=【ベトナム日本語ガイド】ツアーのご予約について`}
                          className="font-mono text-[11px] font-bold text-blue-600 hover:underline break-all block"
                        >
                          {b.email}
                        </a>
                      </div>
                    )}

                    {/* Quick Direct Link Action Button */}
                    <div className="mt-2">
                      {b.contactType === 'line' && (
                        <a
                          href={`https://line.me/R/ti/p/~${encodeURIComponent(b.contactValue)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-lg transition-colors shadow-xs"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>LINEで友だち追加</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      )}
                      {b.contactType === 'instagram' && (
                        <a
                          href={`https://instagram.com/${b.contactValue.replace(/^@/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white rounded-lg transition-opacity shadow-xs"
                        >
                          <InstagramIcon className="w-3 h-3 text-white" />
                          <span>Instagramを開く</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      )}
                      {(b.contactType === 'email' || b.email) && (
                        <a
                          href={`mailto:${b.contactType === 'email' ? b.contactValue : b.email}?subject=【ベトナム日本語ガイド】ツアーのご予約・ご相談について`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-[#0B2545] hover:bg-[#133E68] text-white rounded-lg transition-colors shadow-xs"
                        >
                          <Mail className="w-3 h-3" />
                          <span>メール返信を作成</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {b.specialRequests && (
                  <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                    <span className="font-bold text-slate-900 block mb-0.5">特記事項・ご相談詳細:</span>
                    <p className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans">
                      {b.specialRequests}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
