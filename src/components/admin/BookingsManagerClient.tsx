'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Inbox,
  Calendar,
  Users,
  Hotel,
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
  Camera,
  MapPin,
  Sparkles,
  Edit3,
  Eye,
  Phone,
  FileText,
  Compass,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import { BookingSubmission, CustomTourPlan } from '@/types';
import TourPlanEditorModal from '@/components/admin/TourPlanEditorModal';
import { TOURS_DATA } from '@/lib/data/tours';

interface Props {
  initialBookings: BookingSubmission[];
  initialPlans?: CustomTourPlan[];
}

// Parse special requests to extract clean tags and customer's pure message
function parseSpecialRequests(rawText?: string) {
  if (!rawText) return { tags: [], message: '' };

  const tags: string[] = [];
  const lines = rawText.split('\n');
  const messageLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Filter out redundant metadata tags that are already displayed in dedicated cards
    if (trimmed.startsWith('【予約管理番号:') || trimmed.startsWith('【予備メールアドレス:')) {
      continue;
    }

    // Capture consultation and trip type tags
    if (trimmed.startsWith('【ご相談内容:')) {
      const match = trimmed.match(/【ご相談内容:\s*([^】]+)】/);
      if (match) tags.push(match[1]);
      continue;
    }
    if (trimmed.startsWith('【日程タイプ:')) {
      const match = trimmed.match(/【日程タイプ:\s*([^】]+)】/);
      if (match) tags.push(match[1]);
      continue;
    }
    if (trimmed.startsWith('【専属ガイド満席日含む') || trimmed.startsWith('【提携日本語ガイド')) {
      tags.push('提携ガイド手配相談あり');
      continue;
    }

    messageLines.push(trimmed);
  }

  return {
    tags,
    message: messageLines.join('\n').trim(),
  };
}

// Map tour slug or tour name to friendly Japanese title
function resolveTourDisplayTitle(b: BookingSubmission): { title: string; isCustom: boolean } {
  if (b.tourSlug === 'custom-order-made-central-vietnam' || b.tourSlug === 'custom-consultation') {
    return {
      title: b.tourName || 'オーダーメイドプライベートツアー（完全自由設計）',
      isCustom: true,
    };
  }

  const matched = TOURS_DATA.find((t) => t.slug === b.tourSlug);
  if (matched) {
    return { title: matched.title, isCustom: false };
  }

  if (b.tourName && b.tourName !== b.tourSlug) {
    return { title: b.tourName, isCustom: false };
  }

  // Friendly formatting for slugs like da-nang-city-highlights
  const readable = (b.tourName || b.tourSlug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return { title: readable, isCustom: false };
}

export default function BookingsManagerClient({ initialBookings, initialPlans = [] }: Props) {
  const [bookings, setBookings] = useState<BookingSubmission[]>(initialBookings);
  const [tourPlans, setTourPlans] = useState<CustomTourPlan[]>(initialPlans);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(() => new Date().toLocaleTimeString('ja-JP'));
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<CustomTourPlan> | null>(null);
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Play audio alert on new booking
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio not permitted or not supported
    }
  };

  // Fetch live bookings and tour plans simultaneously
  const refreshData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const [bookingsRes, plansRes] = await Promise.all([
        fetch(`/api/admin/bookings?t=${Date.now()}`, { cache: 'no-store' }),
        fetch(`/api/admin/tour-plans?t=${Date.now()}`, { cache: 'no-store' }),
      ]);

      if (bookingsRes.ok) {
        const bData = await bookingsRes.json();
        if (Array.isArray(bData.bookings)) {
          setBookings((prev) => {
            if (bData.bookings.length > prev.length) {
              playAlertSound();
            }
            return bData.bookings;
          });
        }
      }

      if (plansRes.ok) {
        const pData = await plansRes.json();
        if (Array.isArray(pData.plans)) {
          setTourPlans(pData.plans);
        }
      }

      setLastRefreshedAt(new Date().toLocaleTimeString('ja-JP'));
    } catch (err) {
      console.warn('Failed to refresh admin data:', err);
    } finally {
      if (!isSilent) setIsRefreshing(false);
    }
  }, []);

  // Polling every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Copy contact value
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick status change from card dropdown
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

        // Update local tourPlans cache
        const targetBooking = bookings.find((b) => b.id === id);
        if (targetBooking?.bookingCode) {
          setTourPlans((prev) =>
            prev.map((p) =>
              p.tourCode === targetBooking.bookingCode
                ? { ...p, status: newStatus === 'confirmed' ? 'confirmed' : newStatus === 'cancelled' ? 'cancelled' : 'draft' }
                : p
            )
          );
        }

        const label =
          newStatus === 'confirmed'
            ? '予約確定・日程FIX'
            : newStatus === 'cancelled'
            ? 'キャンセル'
            : '未対応（返信待ち）';

        setSyncToast({
          message: `ステータスを「${label}」に更新しました。お客様の確認画面にも即時反映されます。`,
          type: 'success',
        });
        setTimeout(() => setSyncToast(null), 4000);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Copy personalized confirmation message for LINE/Email (Item 3)
  const handleCopyConfirmationMessage = (b: BookingSubmission, plan?: CustomTourPlan) => {
    const customerEmail = b.email || (b.contactType === 'email' ? b.contactValue : plan?.customerEmail || '');
    const identifier = customerEmail || b.contactValue;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vietnam-nihongo-guide.com';
    const previewUrl = `${origin}/tour-plan?code=${encodeURIComponent(b.bookingCode || '')}&email=${encodeURIComponent(identifier)}`;

    const tourTitle = plan?.tourTitle || b.tourName || b.tourSlug;
    const tourDateText =
      b.tripType === 'multi' && (b.endDate || b.alternativeDate)
        ? `${b.preferredDate} 〜 ${b.endDate || b.alternativeDate}`
        : b.preferredDate;

    const message = `${b.name} 様

お世話になっております。ベトナム・ダナン専属日本語ガイドのアン トーです。
この度はプライベートツアーのお申し込み誠にありがとうございます！

お打ち合わせ内容に基づき、当日のツアープランおよび専用車の手配が【予約確定・日程FIX】いたしました。

▼ 確定ツアープラン概要:
・ツアー名: ${tourTitle}
・日程: ${tourDateText}
・お迎え予定時間: ${plan?.pickupTime || '08:30'}
・お迎え場所: ${b.hotelName || plan?.pickupLocation || '宿泊先ホテルロビー'}
・参加人数: 大人 ${b.adultsCount}名 / お子様 ${b.childrenCount}名

当日の詳細なタイムライン行程やお迎え場所は、下記のお客様専用ページよりいつでもご確認いただけます。ツアー終了後はこちらのページに撮影したツアー写真（Google Drive）も公開されます。

▼ お客様専用 旅程・写真確認ページ:
${previewUrl}

※事前決済は不要です。ツアー料金はベトナム到着後にガイドへ直接お支払いいただけます（日本円・VND両替対応）。
当日は専用車とガイドがホテルロビーへお迎えにあがります。
何か変更のご希望やご質問がございましたら、いつでもこちらのLINEまでお気軽にご連絡ください！`;

    navigator.clipboard.writeText(message);
    setSyncToast({
      message: `「${b.name} 様」への確定案内文（お客様専用リンク付き）をコピーしました！LINEやメールにそのまま貼り付けて送信できます。`,
      type: 'success',
    });
    setTimeout(() => setSyncToast(null), 5000);
  };

  // Open Edit / Customize Plan modal
  const handleOpenEditPlan = (b: BookingSubmission) => {
    const customerEmail = b.email || (b.contactType === 'email' ? b.contactValue : '');
    const targetCode = b.bookingCode?.trim().toUpperCase();

    // Check if an existing custom tour plan is already created
    const existing = tourPlans.find(
      (p) => (targetCode && p.tourCode === targetCode) || (b.id && p.bookingId === b.id)
    );

    if (existing) {
      // Use existing full plan so all customized schedule items, photos, and notes are preserved!
      setEditingPlan(existing);
    } else {
      // Pre-fill brand new custom plan from booking submission details
      const display = resolveTourDisplayTitle(b);
      setEditingPlan({
        bookingId: b.id,
        tourCode: targetCode || undefined,
        customerName: b.name,
        customerKana: b.kana,
        customerEmail,
        customerPhone: `[${b.contactType.toUpperCase()}] ${b.contactValue}`,
        tourTitle: display.title,
        tourDate: b.preferredDate,
        endDate: b.endDate || b.alternativeDate,
        pickupTime: '08:30',
        adultsCount: b.adultsCount,
        childrenCount: b.childrenCount,
        pickupLocation: b.hotelName,
        guideNotes: b.specialRequests,
        status: b.status === 'confirmed' ? 'confirmed' : 'confirmed', // Default to confirmed when admin creates/customizes plan
      });
    }

    setPlanModalOpen(true);
  };

  // Filtering
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (filter !== 'all' && b.status !== filter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = b.name.toLowerCase().includes(q) || b.kana.toLowerCase().includes(q);
        const matchTour = (b.tourName || b.tourSlug).toLowerCase().includes(q);
        const matchContact = b.contactValue.toLowerCase().includes(q);
        const matchEmail = b.email ? b.email.toLowerCase().includes(q) : false;
        const matchCode = b.bookingCode ? b.bookingCode.toLowerCase().includes(q) : false;
        return matchName || matchTour || matchContact || matchEmail || matchCode;
      }
      return true;
    });
  }, [bookings, filter, searchQuery]);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  return (
    <div className="p-4 sm:p-8 md:p-10 space-y-6 max-w-7xl w-full mx-auto">
      {/* Sync Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-[#0B2545] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-amber-400/40 flex items-center gap-3 text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">{syncToast.message}</span>
          </div>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              RESERVATIONS & CUSTOM ITINERARIES
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              自動同期中
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B2545] flex items-center gap-3">
            予約リクエスト＆ツアープラン管理
            {pendingCount > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs">
                未対応 {pendingCount}件
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500">
            お客様のお申し込み内容を確認し、旅程のカスタマイズ編集・予約確定（FIX）・写真リンク設定を一元管理できます。
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block font-bold">最終更新</span>
            <span suppressHydrationWarning className="text-xs font-mono font-black text-slate-700">{lastRefreshedAt}</span>
          </div>

          <button
            type="button"
            onClick={() => refreshData(false)}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-[#0B2545] hover:bg-[#133E68] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>最新情報を取得</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Filter Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#0B2545] text-white border-[#0B2545] shadow-sm ring-2 ring-[#0B2545]/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold ${filter === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
              全件表示
            </span>
            <FileText className={`w-4 h-4 ${filter === 'all' ? 'text-amber-400' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-1">{bookings.length} <span className="text-xs font-normal">件</span></div>
        </button>

        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filter === 'pending'
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm ring-2 ring-amber-500/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold ${filter === 'pending' ? 'text-amber-100' : 'text-amber-600'}`}>
              未対応・返信待ち
            </span>
            <Clock className={`w-4 h-4 ${filter === 'pending' ? 'text-white' : 'text-amber-500'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-black mt-1 ${filter === 'pending' ? 'text-white' : 'text-amber-600'}`}>
            {pendingCount} <span className="text-xs font-normal">件</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilter('confirmed')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filter === 'confirmed'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-600/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold ${filter === 'confirmed' ? 'text-emerald-100' : 'text-emerald-600'}`}>
              予約確定・日程FIX
            </span>
            <CheckCircle2 className={`w-4 h-4 ${filter === 'confirmed' ? 'text-white' : 'text-emerald-500'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-black mt-1 ${filter === 'confirmed' ? 'text-white' : 'text-emerald-600'}`}>
            {confirmedCount} <span className="text-xs font-normal">件</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilter('cancelled')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filter === 'cancelled'
              ? 'bg-slate-700 text-white border-slate-700 shadow-sm ring-2 ring-slate-700/20'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold ${filter === 'cancelled' ? 'text-slate-300' : 'text-slate-400'}`}>
              キャンセル済
            </span>
            <XCircle className={`w-4 h-4 ${filter === 'cancelled' ? 'text-white' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl sm:text-3xl font-black mt-1 ${filter === 'cancelled' ? 'text-white' : 'text-slate-400'}`}>
            {cancelledCount} <span className="text-xs font-normal">件</span>
          </div>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-2xs">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="お客様名、ツアー名、管理番号（JPVN-XXXX）、LINE IDやメールアドレスで即時検索..."
          className="w-full text-xs outline-none bg-transparent placeholder:text-slate-400 font-medium text-slate-800"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:text-slate-600 text-xs px-2.5 py-1 bg-slate-100 rounded-lg cursor-pointer"
          >
            クリア
          </button>
        )}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 text-xs space-y-3 shadow-xs">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-600 text-sm">該当する予約リクエストはありません</p>
          <p className="text-[11px]">検索条件を変更するか、最新情報を再取得してください。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isUpdating = updatingId === b.id;
            const targetCode = b.bookingCode?.trim().toUpperCase();

            // Match existing CustomTourPlan
            const plan = tourPlans.find(
              (p) => (targetCode && p.tourCode === targetCode) || (b.id && p.bookingId === b.id)
            );

            const displayTour = resolveTourDisplayTitle(b);
            const { tags: consultationTags, message: cleanUserMessage } = parseSpecialRequests(b.specialRequests);
            const customerEmail = b.email || (b.contactType === 'email' ? b.contactValue : plan?.customerEmail || '');
            const customerPreviewUrl = `/tour-plan?code=${encodeURIComponent(b.bookingCode || '')}&email=${encodeURIComponent(customerEmail)}`;

            const isConfirmed = b.status === 'confirmed';
            const isCancelled = b.status === 'cancelled';

            return (
              <div
                key={b.id || b.bookingCode}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md overflow-hidden ${
                  isConfirmed
                    ? 'border-emerald-300/80 ring-1 ring-emerald-100'
                    : isCancelled
                    ? 'border-slate-200 opacity-80'
                    : 'border-amber-300/80 ring-1 ring-amber-100/70 bg-gradient-to-b from-amber-50/20 to-white'
                }`}
              >
                {/* Header of the Booking Card */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/60">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Tour Code Chip */}
                    <div className="inline-flex items-center gap-1.5 bg-[#0B2545] text-white px-3 py-1 rounded-xl shadow-xs">
                      <span className="font-mono text-xs font-black tracking-wider">
                        {b.bookingCode || `#${b.id?.slice(0, 8)}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(b.bookingCode || '', b.id!)}
                        className="p-1 hover:bg-white/20 rounded-md text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="予約管理番号をコピー"
                      >
                        {copiedId === b.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    {/* Quick Status Dropdown */}
                    <div className="relative inline-flex items-center">
                      <select
                        value={b.status || 'pending'}
                        onChange={(e) =>
                          handleStatusChange(
                            b.id!,
                            e.target.value as 'pending' | 'confirmed' | 'cancelled'
                          )
                        }
                        disabled={isUpdating}
                        className={`text-xs font-bold pl-3 pr-8 py-1.5 rounded-xl border outline-none cursor-pointer transition-all appearance-none ${
                          isConfirmed
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                            : isCancelled
                            ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                            : 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        <option value="pending">⏳ 未対応（返信待ち）</option>
                        <option value="confirmed">✅ 予約確定・日程FIX</option>
                        <option value="cancelled">✖ キャンセル</option>
                      </select>
                      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">
                        ▼
                      </div>
                      {isUpdating && <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400 ml-1.5" />}
                    </div>

                    {/* Plan Configuration Badge */}
                    {plan && plan.schedule && plan.schedule.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        旅程FIX（{plan.schedule.length}行程）
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                        日程作成待ち
                      </span>
                    )}

                    {/* Photo Status Tag */}
                    {plan?.driveUrl && (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                          plan.photoStatus === 'expired'
                            ? 'bg-slate-100 text-slate-500 border-slate-300'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}
                      >
                        <Camera className="w-3 h-3" />
                        {plan.photoStatus === 'expired' ? '写真期限終了' : '写真公開中'}
                      </span>
                    )}
                  </div>

                  {/* Actions & Timestamp */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Primary Button: Edit / Customize Plan */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditPlan(b)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
                      title="この予約内容を編集・旅程をカスタマイズして確定"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{plan ? '予約・プラン詳細編集' : '確定プラン作成・編集'}</span>
                    </button>

                    {/* 1-Click Confirmation Message Copier for LINE/Email (Item 3) */}
                    <button
                      type="button"
                      onClick={() => handleCopyConfirmationMessage(b, plan)}
                      className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-300 shadow-2xs transition-colors cursor-pointer"
                      title="お客様へ送信する確定案内メッセージ（専用確認リンク付き）を1クリックでコピー"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-600" />
                      <span>確定案内文コピー</span>
                    </button>

                    {/* Customer View Preview Button */}
                    <a
                      href={customerPreviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-white hover:bg-slate-100 text-[#0B2545] rounded-xl border border-slate-300 shadow-2xs transition-colors"
                      title="お客様専用の確認画面（/tour-plan）を新しいタブでプレビュー確認"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>お客様画面</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>

                    <span className="text-[11px] text-slate-400 ml-1 hidden lg:inline">
                      受付: {b.createdAt ? new Date(b.createdAt).toLocaleDateString('ja-JP') : '-'}
                    </span>
                  </div>
                </div>

                {/* Body Details Bento Grid */}
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Tile 1: Traveler Identity */}
                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      お客様情報
                    </span>
                    <p className="text-base font-black text-slate-900 tracking-tight">
                      {b.name} <span className="text-xs font-normal text-slate-500">様</span>
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">フリガナ: {b.kana}</p>
                    <div className="pt-1.5 border-t border-slate-200/60 mt-2 flex items-center gap-1.5 text-slate-700 font-bold">
                      <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>大人 {b.adultsCount}名 / お子様 {b.childrenCount}名</span>
                    </div>
                  </div>

                  {/* Tile 2: Tour Plan & Dates */}
                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-between">
                      <span>ご希望ツアー＆日程</span>
                      {displayTour.isCustom && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded">
                          オーダーメイド
                        </span>
                      )}
                    </span>
                    <p className="font-bold text-[#0B2545] text-xs leading-snug line-clamp-2" title={displayTour.title}>
                      {displayTour.title}
                    </p>

                    <div className="pt-1 border-t border-slate-200/60 space-y-1">
                      {b.tripType === 'multi' && (b.endDate || b.alternativeDate) ? (
                        <div className="bg-amber-100/60 p-1.5 rounded-lg text-[11px] text-amber-950 font-mono font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{b.preferredDate} 〜 {b.endDate || b.alternativeDate}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] text-slate-700 font-mono font-bold">
                          <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{b.preferredDate}</span>
                          {b.alternativeDate && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              (第2: {b.alternativeDate})
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate">
                        <Hotel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{b.hotelName || 'ホテル未定・未入力'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tile 3: Contact & Immediate Action */}
                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      連絡先・即時連絡
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                          b.contactType === 'line'
                            ? 'bg-[#06C755]/15 text-[#05963f]'
                            : b.contactType === 'instagram'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {b.contactType}
                      </span>
                      <p className="font-mono text-xs font-bold text-slate-800 select-all truncate">
                        {b.contactValue}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopy(b.contactValue, `contact_${b.id}`)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                        title="連絡先をコピー"
                      >
                        {copiedId === `contact_${b.id}` ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    {b.email && b.contactType !== 'email' && (
                      <div className="text-[11px] text-slate-500 truncate">
                        <span className="text-[10px] text-slate-400">予備メール: </span>
                        <a href={`mailto:${b.email}`} className="text-blue-600 hover:underline font-mono">
                          {b.email}
                        </a>
                      </div>
                    )}

                    {/* Direct Contact Buttons */}
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {b.contactType === 'line' && (
                        <a
                          href={`https://line.me/R/ti/p/~${encodeURIComponent(b.contactValue)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-lg transition-colors shadow-2xs"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>LINE友だち追加</span>
                          <ExternalLink className="w-2 h-2 opacity-70" />
                        </a>
                      )}
                      {b.contactType === 'instagram' && (
                        <a
                          href={`https://instagram.com/${b.contactValue.replace(/^@/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white rounded-lg transition-opacity shadow-2xs"
                        >
                          <InstagramIcon className="w-3 h-3 text-white" />
                          <span>Instagram</span>
                          <ExternalLink className="w-2 h-2 opacity-70" />
                        </a>
                      )}
                      {(b.contactType === 'email' || b.email) && (
                        <a
                          href={`mailto:${b.contactType === 'email' ? b.contactValue : b.email}?subject=【ベトナム日本語ガイド】ツアーのご予約・ご相談について`}
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-[#0B2545] hover:bg-[#133E68] text-white rounded-lg transition-colors shadow-2xs"
                        >
                          <Mail className="w-3 h-3" />
                          <span>メール返信</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Tile 4: Sync & Photo Status Summary */}
                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      お客様画面（/tour-plan）の表示
                    </span>

                    <div className="space-y-1">
                      {isConfirmed ? (
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>予約確定・日程FIX 表示中</span>
                        </div>
                      ) : isCancelled ? (
                        <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[11px] flex items-center gap-1.5 font-bold">
                          <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>キャンセル済み 表示中</span>
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-1.5 font-bold">
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>仮予約受付中・ガイド確認中</span>
                        </div>
                      )}

                      {plan?.driveUrl ? (
                        <div className="space-y-1 pt-1">
                          <div className="text-[11px] text-slate-700 flex items-center gap-1 font-bold">
                            <Camera className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>
                              写真: {plan.photoStatus === 'expired' ? '期限終了（アクセス停止中）' : '7日間ダウンロード公開中'}
                            </span>
                          </div>
                          {plan.photoStatus === 'expired' ? (
                            <p className="text-[10px] text-rose-700 font-bold bg-rose-50 border border-rose-200 p-1.5 rounded-lg leading-relaxed">
                              ⚠️ 7日ルール終了: Google Drive空き容量確保のため、フォルダの削除・整理を推奨します。
                            </p>
                          ) : (
                            <p className="text-[10px] text-emerald-700 font-medium">
                              {plan.photosExpireAt ? `有効期限: ${plan.photosExpireAt.split('T')[0]} まで` : '本日より7日間有効'}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 pt-1">
                          写真リンク未登録（催行後に編集から追加可能）
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Consultation details & special requests */}
                {(consultationTags.length > 0 || cleanUserMessage) && (
                  <div className="px-4 sm:px-5 pb-4 pt-0">
                    <div className="p-3.5 bg-slate-50/90 rounded-xl text-xs text-slate-700 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-amber-500" />
                          お客様からの特記事項・ご相談詳細:
                        </span>

                        {consultationTags.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {consultationTags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {cleanUserMessage && (
                        <p className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans bg-white p-2.5 rounded-lg border border-slate-200/60">
                          {cleanUserMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tour Plan Editor & Customization Modal */}
      {planModalOpen && (
        <TourPlanEditorModal
          key={editingPlan?.id || editingPlan?.tourCode || 'new_editor'}
          isOpen={planModalOpen}
          initialPlan={editingPlan}
          onClose={() => setPlanModalOpen(false)}
          onSaved={(savedPlan) => {
            setPlanModalOpen(false);
            refreshData(true);
            const statusLabel =
              savedPlan.status === 'confirmed'
                ? '予約確定・日程FIX'
                : savedPlan.status === 'cancelled'
                ? 'キャンセル'
                : '仮予約・下書き';

            setSyncToast({
              message: `「${savedPlan.customerName} 様」のツアープラン（${savedPlan.tourCode}）を保存しました。ステータス【${statusLabel}】が管理画面およびお客様確認画面に即時反映されました。`,
              type: 'success',
            });
            setTimeout(() => setSyncToast(null), 6000);
          }}
        />
      )}
    </div>
  );
}
