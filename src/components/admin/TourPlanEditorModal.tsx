'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Camera,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
  Check,
} from 'lucide-react';
import { CustomTourPlan, TourPlanScheduleItem, PhotoStatus } from '@/types';
import { generateTourCode } from '@/lib/supabaseClient';

interface Props {
  initialPlan?: Partial<CustomTourPlan> | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (plan: CustomTourPlan) => void;
}

export default function TourPlanEditorModal({
  initialPlan,
  isOpen,
  onClose,
  onSaved,
}: Props) {
  const isEditing = Boolean(initialPlan?.id);

  const [tourCode, setTourCode] = useState(initialPlan?.tourCode || generateTourCode());
  const [customerName, setCustomerName] = useState(initialPlan?.customerName || '');
  const [customerKana, setCustomerKana] = useState(initialPlan?.customerKana || '');
  const [customerEmail, setCustomerEmail] = useState(initialPlan?.customerEmail || '');
  const [customerPhone, setCustomerPhone] = useState(initialPlan?.customerPhone || '');
  const [tourTitle, setTourTitle] = useState(
    initialPlan?.tourTitle || 'オーダーメイドプライベートツアー'
  );
  const [tourDate, setTourDate] = useState(
    () => initialPlan?.tourDate || new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(initialPlan?.endDate || '');
  const [pickupTime, setPickupTime] = useState(initialPlan?.pickupTime || '08:30');
  const [pickupLocation, setPickupLocation] = useState(initialPlan?.pickupLocation || '');
  const [adultsCount, setAdultsCount] = useState<number>(initialPlan?.adultsCount ?? 1);
  const [childrenCount, setChildrenCount] = useState<number>(initialPlan?.childrenCount ?? 0);
  const [participantsNotes, setParticipantsNotes] = useState(
    initialPlan?.participantsNotes || ''
  );

  const defaultSchedule: TourPlanScheduleItem[] = [
    {
      time: '08:30',
      title: 'ホテルロビーお迎え・出発',
      description: '専属日本語ガイドと専用車がホテルでお出迎え。',
      location: '宿泊先ホテル',
    },
    {
      time: '12:00',
      title: '昼食（ベトナム名物料理）',
      description: 'おすすめの清潔なレストランにてランチ。',
      location: 'ダナン市内',
    },
    {
      time: '19:30',
      title: 'ホテルご送迎・解散',
      description: '安全にホテルまでお送りいたします。',
      location: '宿泊先ホテル',
    },
  ];

  const [schedule, setSchedule] = useState<TourPlanScheduleItem[]>(
    initialPlan?.schedule && initialPlan.schedule.length > 0
      ? initialPlan.schedule
      : defaultSchedule
  );

  const [guideNotes, setGuideNotes] = useState(
    initialPlan?.guideNotes ||
      '事前決済は不要です。ツアー料金はベトナム到着後に全額お支払いいただけます（日本円・ベトナムドン両替対応）。'
  );
  const [driveUrl, setDriveUrl] = useState(initialPlan?.driveUrl || '');
  const [photoStatus, setPhotoStatus] = useState<PhotoStatus>(
    initialPlan?.photoStatus || (initialPlan?.driveUrl ? 'ready' : 'pending')
  );

  const [photosExpireDate, setPhotosExpireDate] = useState<string>(() => {
    if (initialPlan?.photosExpireAt) {
      return initialPlan.photosExpireAt.split('T')[0];
    }
    const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  });

  const [status, setStatus] = useState<'draft' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'>(
    initialPlan?.status || 'confirmed'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Synchronize all input fields when initialPlan or isOpen changes
  useEffect(() => {
    if (!isOpen) return;

    if (initialPlan) {
      setTourCode(initialPlan.tourCode || generateTourCode());
      setCustomerName(initialPlan.customerName || '');
      setCustomerKana(initialPlan.customerKana || '');
      setCustomerEmail(initialPlan.customerEmail || '');
      setCustomerPhone(initialPlan.customerPhone || '');
      setTourTitle(initialPlan.tourTitle || 'オーダーメイドツアー');
      setTourDate(initialPlan.tourDate || new Date().toISOString().split('T')[0]);
      setEndDate(initialPlan.endDate || '');
      setPickupTime(initialPlan.pickupTime || '08:30');
      setPickupLocation(initialPlan.pickupLocation || '');
      setAdultsCount(initialPlan.adultsCount ?? 1);
      setChildrenCount(initialPlan.childrenCount ?? 0);
      setParticipantsNotes(initialPlan.participantsNotes || '');

      if (initialPlan.schedule && initialPlan.schedule.length > 0) {
        setSchedule(initialPlan.schedule);
      } else {
        setSchedule([
          {
            time: '受付完了',
            title: '専属ガイド（アン トー）が旅程を確認・作成中',
            description: '仮予約リクエストを受け付けました。専属ガイドより24時間以内にご連絡いたします。',
            location: initialPlan.pickupLocation || '宿泊先ホテル',
          },
          {
            time: initialPlan.tourDate || 'ツアー初日',
            title: 'ツアー初日・お迎え',
            description: '専用車と専属日本語ガイドがホテルロビーへお迎えにあがります。',
            location: initialPlan.pickupLocation || '宿泊先ホテル',
          },
        ]);
      }

      setGuideNotes(
        initialPlan.guideNotes ||
          '事前決済は不要です。ツアー料金はベトナム到着後に全額お支払いいただけます（日本円・ベトナムドン両替対応）。'
      );
      setDriveUrl(initialPlan.driveUrl || '');

      const isPast = Boolean(
        initialPlan.photosExpireAt && new Date(initialPlan.photosExpireAt).getTime() <= Date.now()
      );
      if (isPast) {
        setPhotoStatus('expired');
      } else {
        setPhotoStatus(initialPlan.photoStatus || (initialPlan.driveUrl ? 'ready' : 'pending'));
      }

      if (initialPlan.photosExpireAt) {
        setPhotosExpireDate(initialPlan.photosExpireAt.split('T')[0]);
      } else {
        const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        setPhotosExpireDate(d.toISOString().split('T')[0]);
      }
      setStatus(initialPlan.status || 'confirmed');
    } else {
      // Clean state for new tour plan
      setTourCode(generateTourCode());
      setCustomerName('');
      setCustomerKana('');
      setCustomerEmail('');
      setCustomerPhone('');
      setTourTitle('ダナン・ホイアン 1日オーダーメイドプライベートツアー');
      setTourDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setPickupTime('08:30');
      setPickupLocation('');
      setAdultsCount(2);
      setChildrenCount(0);
      setParticipantsNotes('');
      setSchedule(defaultSchedule);
      setGuideNotes('歩きやすいスニーカー・日傘・帽子をご持参ください。両替や現地決済もガイドがサポートします。');
      setDriveUrl('');
      setPhotoStatus('pending');
      const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      setPhotosExpireDate(d.toISOString().split('T')[0]);
      setStatus('confirmed');
    }
  }, [initialPlan, isOpen]);

  if (!isOpen) return null;

  // Add new schedule item
  const handleAddScheduleItem = () => {
    setSchedule((prev) => [
      ...prev,
      { time: '14:00', title: '', description: '', location: '' },
    ]);
  };

  // Update schedule item
  const handleUpdateScheduleItem = (
    index: number,
    field: keyof TourPlanScheduleItem,
    value: string
  ) => {
    setSchedule((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Remove schedule item
  const handleRemoveScheduleItem = (index: number) => {
    setSchedule((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset 7 days from now
  const handleSet7DaysExpiry = () => {
    const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    setPhotosExpireDate(d.toISOString().split('T')[0]);
  };

  // Handle Drive URL change with automatic 7-day calculation and status switch
  const handleDriveUrlChange = (value: string) => {
    setDriveUrl(value);
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      setPhotoStatus('ready');
      // Automatically calculate exact 7 days from today
      const expDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      setPhotosExpireDate(expDate.toISOString().split('T')[0]);
    } else {
      setPhotoStatus('pending');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim() || !tourTitle.trim() || !tourDate) {
      setErrorMessage('お名前、メールアドレス、ツアー名、日程は必須項目です。');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const trimmedDriveUrl = driveUrl.trim();
    let finalPhotoStatus: PhotoStatus = 'pending';
    let finalPhotosExpireAt: string | undefined = undefined;

    if (trimmedDriveUrl) {
      const expDate = photosExpireDate
        ? new Date(`${photosExpireDate}T23:59:59Z`)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      finalPhotosExpireAt = expDate.toISOString();

      if (expDate.getTime() <= Date.now() || photoStatus === 'expired') {
        finalPhotoStatus = 'expired';
      } else {
        finalPhotoStatus = 'ready';
      }
    }

    const payload: Partial<CustomTourPlan> = {
      id: initialPlan?.id,
      tourCode: tourCode.trim().toUpperCase(),
      bookingId: initialPlan?.bookingId,
      customerName: customerName.trim(),
      customerKana: customerKana.trim() || undefined,
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim() || undefined,
      tourTitle: tourTitle.trim(),
      tourDate,
      endDate: endDate || undefined,
      pickupTime: pickupTime.trim() || undefined,
      pickupLocation: pickupLocation.trim() || undefined,
      adultsCount,
      childrenCount,
      participantsNotes: participantsNotes.trim() || undefined,
      schedule,
      guideNotes: guideNotes.trim() || undefined,
      driveUrl: trimmedDriveUrl || undefined,
      photoStatus: finalPhotoStatus,
      photosUploadedAt: trimmedDriveUrl ? (initialPlan?.photosUploadedAt || new Date().toISOString()) : undefined,
      photosExpireAt: finalPhotosExpireAt,
      status,
    };

    try {
      const res = await fetch('/api/admin/tour-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || '保存に失敗しました。');
      } else {
        onSaved(data.data);
        onClose();
      }
    } catch (err) {
      console.error('Save plan error:', err);
      setErrorMessage('通信エラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0B2545] text-white p-6 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              CUSTOM TOUR PLAN & PHOTOS
            </span>
            <h2 className="text-lg sm:text-xl font-black">
              {isEditing ? 'オーダーメイドツアープラン編集' : '新規ツアープラン作成'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Tour Code & Customer Identity */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              基本情報・ツアー管理番号（JPVN-XXXX）
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Tour Code */}
              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  ツアー管理番号 <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tourCode}
                    onChange={(e) => setTourCode(e.target.value.toUpperCase())}
                    placeholder="JPVN-8392"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-800 uppercase bg-white outline-none focus:border-amber-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setTourCode(generateTourCode())}
                    className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg shrink-0 transition-colors"
                    title="新番号を再生成"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  お客様氏名 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="例: 山田 太郎"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Customer Kana */}
              <div>
                <label className="block text-slate-600 font-bold mb-1">フリガナ</label>
                <input
                  type="text"
                  value={customerKana}
                  onChange={(e) => setCustomerKana(e.target.value)}
                  placeholder="例: ヤマダ タロウ"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none focus:border-amber-500"
                />
              </div>

              {/* Customer Email (Crucial for 2-factor lookup) */}
              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  メールアドレス（照会照合用） <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="例: yamada@gmail.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-600 font-bold mb-1">電話番号 / LINE ID</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="例: +81 90-1234-5678 / LINE: yamada123"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  プラン・手配ステータス <span className="text-rose-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as 'draft' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled')
                  }
                  className={`w-full px-3 py-2 rounded-lg border outline-none font-bold text-xs transition-colors cursor-pointer ${
                    status === 'confirmed'
                      ? 'border-emerald-400 bg-emerald-50/50 text-emerald-900'
                      : status === 'cancelled'
                      ? 'border-slate-400 bg-slate-100 text-slate-800'
                      : 'border-amber-400 bg-amber-50/50 text-amber-900'
                  }`}
                >
                  <option value="draft">⏳ 仮予約・下書き（ガイド調整中）</option>
                  <option value="confirmed">✅ 予約確定・日程FIX（専属手配完了・お客様画面に即時公開）</option>
                  <option value="in_progress">🚗 ツアー催行中（当日案内中）</option>
                  <option value="completed">🎉 ツアー完了（全行程終了）</option>
                  <option value="cancelled">✖ キャンセル（受付停止）</option>
                </select>
                {status === 'confirmed' ? (
                  <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2 mt-1.5 font-medium leading-relaxed">
                    ✨ 「予約確定・日程FIX」で保存すると、予約管理テーブルとお客様画面（/tour-plan）の双方が即座に「予約確定・専属手配完了」に同期され、最新スケジュールがお客様に表示されます。
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-1.5 font-medium leading-relaxed">
                    ⏳ 「仮予約・下書き」の状態では、お客様の確認画面には「仮予約受付中・専属ガイド確認中」と表示されます。
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Tour Details & Logistics */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              ツアー日程＆送迎・参加人数
            </h3>

            <div>
              <label className="block text-slate-600 font-bold mb-1">
                ツアープラン名称 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={tourTitle}
                onChange={(e) => setTourTitle(e.target.value)}
                placeholder="例: ダナン・ホイアン 1日オーダーメイドプライベートツアー"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none focus:border-amber-500 font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  催行日 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={tourDate}
                  onChange={(e) => setTourDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">終了日（複数日のみ）</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">お迎え時間</label>
                <input
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="例: 08:30"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">集合・お迎え場所</label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="例: ハイアット リージェンシー ロビー"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-bold mb-1">大人人数</label>
                <input
                  type="number"
                  min={1}
                  value={adultsCount}
                  onChange={(e) => setAdultsCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">お子様人数</label>
                <input
                  type="number"
                  min={0}
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1">参加者特記（任意）</label>
                <input
                  type="text"
                  value={participantsNotes}
                  onChange={(e) => setParticipantsNotes(e.target.value)}
                  placeholder="例: チャイルドシート1台、車椅子対応"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Detailed Schedule Milestones */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                当日のスケジュール・タイムライン行程（時系列）
              </h3>
              <button
                type="button"
                onClick={handleAddScheduleItem}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>時間枠を追加</span>
              </button>
            </div>

            <div className="space-y-3">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 relative"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => handleUpdateScheduleItem(index, 'time', e.target.value)}
                      placeholder="例: 08:30 または 09:00 - 10:30"
                      className="w-36 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-xs bg-slate-50 outline-none"
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateScheduleItem(index, 'title', e.target.value)}
                      placeholder="行程タイトル（例: 五行山・玄空洞探検）"
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-xs outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveScheduleItem(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.location || ''}
                      onChange={(e) => handleUpdateScheduleItem(index, 'location', e.target.value)}
                      placeholder="場所（例: 五行山 (Marble Mountains)）"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs outline-none"
                    />
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => handleUpdateScheduleItem(index, 'description', e.target.value)}
                      placeholder="詳細説明・案内メモ"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Guide Notes */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              ガイドからの事前連絡・服装・注意事項メモ
            </label>
            <textarea
              rows={2}
              value={guideNotes}
              onChange={(e) => setGuideNotes(e.target.value)}
              placeholder="お客様へ事前に伝えておくべき注意点（服装、持ち物、両替など）"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none text-xs"
            />
          </div>

          {/* Section 5: Photo Album & 7-Day Expiry Policy */}
          <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-300 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-600" />
                ツアー写真リンク＆7日間ダウンロード期限設定
              </h3>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">
                7日間自動整理ポリシー
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">
                  Google Drive / 共有アルバムURL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={driveUrl}
                    onChange={(e) => handleDriveUrlChange(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full px-3 py-2 pl-9 rounded-lg border border-slate-300 bg-white outline-none font-mono text-xs focus:border-amber-500"
                  />
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {driveUrl.trim() ? (
                  <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] space-y-2">
                    <div className="flex items-start gap-1.5 font-bold">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Google Drive写真リンクが認識されました（本日より7日間: {photosExpireDate} まで有効）</span>
                    </div>

                    {/* Permission Checklist */}
                    <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200/80 text-[11px] text-slate-800 space-y-1.5 font-sans">
                      <p className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                        <span>🛡️</span> Google Drive 共有設定チェック（お客様のアクセス権限エラー防止）:
                      </p>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-0" />
                        <span>① 共有設定: <strong>「一般的なアクセス ➔ リンクを知っている全員」</strong> に変更済み</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-0" />
                        <span>② ロール権限: <strong>「閲覧者（写真の閲覧・ダウンロードのみ）」</strong> に指定済み</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <span>💡</span> 写真アップロードのコツ:
                    </p>
                    <p className="text-amber-800 leading-relaxed">
                      Google Driveでフォルダ作成後、共有設定を<strong>「リンクを知っている全員が閲覧可能」</strong>にしてURLを貼り付けてください。ツアー終了後7日を過ぎるとお客様画面からは自動的にアクセス停止となります。
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">写真公開ステータス</label>
                <select
                  value={photoStatus}
                  onChange={(e) => setPhotoStatus(e.target.value as PhotoStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold text-xs"
                >
                  <option value="pending">⏳ 写真準備中（未アップロード）</option>
                  <option value="ready">✅ 写真公開中（7日間ダウンロード有効）</option>
                  <option value="expired">🔒 ダウンロード期限終了（アクセス無効）</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-bold">写真保存期限（7日ルール）</label>
                  <button
                    type="button"
                    onClick={handleSet7DaysExpiry}
                    className="text-[10px] font-bold text-amber-700 underline hover:text-amber-900"
                  >
                    +7日後を設定
                  </button>
                </div>
                <input
                  type="date"
                  value={photosExpireDate}
                  onChange={(e) => setPhotosExpireDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#133E68] text-white font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>保存中...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEditing ? '変更を保存する' : 'ツアープランを作成'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
