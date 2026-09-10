'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Camera,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { CustomTourPlan } from '@/types';
import TourPlanEditorModal from '@/components/admin/TourPlanEditorModal';

interface Props {
  initialPlans: CustomTourPlan[];
}

export default function TourPlansManagerClient({ initialPlans }: Props) {
  const [plans, setPlans] = useState<CustomTourPlan[]>(initialPlans);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'in_progress' | 'completed'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CustomTourPlan | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshPlans = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/tour-plans');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.plans)) {
          setPlans(data.plans);
        }
      }
    } catch (err) {
      console.error('Failed to refresh tour plans:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`ツアープラン【${code}】を削除してもよろしいですか？`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/tour-plans?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPlans((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSavedPlan = (savedPlan: CustomTourPlan) => {
    setPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === savedPlan.id || p.tourCode === savedPlan.tourCode);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedPlan;
        return next;
      }
      return [savedPlan, ...prev];
    });
  };

  // Filter & Search
  const filteredPlans = plans.filter((p) => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = p.tourCode.toLowerCase().includes(q);
      const matchName = p.customerName.toLowerCase().includes(q);
      const matchEmail = p.customerEmail.toLowerCase().includes(q);
      const matchTitle = p.tourTitle.toLowerCase().includes(q);
      return matchCode || matchName || matchEmail || matchTitle;
    }
    return true;
  });

  const photosReadyCount = plans.filter((p) => p.driveUrl && p.photoStatus === 'ready').length;
  const upcomingCount = plans.filter((p) => p.status === 'confirmed').length;

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-6xl w-full mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-600 block uppercase">
            CUSTOM ITINERARY & PHOTO MANAGEMENT
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B2545] flex items-center gap-2">
            ツアー日程＆写真管理
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            お客様専用の確定スケジュール作成、JPVNコード自動生成、Google Drive写真公開（7日間期限）
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refreshPlans}
            disabled={isRefreshing}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
            title="最新情報に更新"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingPlan(null);
              setIsEditorOpen(true);
            }}
            className="px-4 py-2.5 bg-[#0B2545] hover:bg-[#133E68] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>新規ツアープラン作成</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 block">総プラン数</span>
          <div className="text-2xl font-black text-[#0B2545] mt-1">{plans.length} 件</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-bold text-emerald-600 block">日程確定・準備中</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{upcomingCount} 件</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-bold text-amber-600 block">写真公開中（Drive）</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{photosReadyCount} 件</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 block">写真保存ルール</span>
          <div className="text-xs font-bold text-slate-700 mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>公開後7日間自動整理</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="JPVNコード、氏名、メールで検索..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-amber-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {(['all', 'confirmed', 'in_progress', 'completed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors whitespace-nowrap ${
                filter === st
                  ? 'bg-[#0B2545] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all'
                ? 'すべて'
                : st === 'confirmed'
                ? '確定済'
                : st === 'in_progress'
                ? '催行中'
                : '完了'}
            </button>
          ))}
        </div>
      </div>

      {/* Tour Plans List */}
      {filteredPlans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs space-y-2">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
          <p>該当するツアープランはありません。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPlans.map((p) => {
            const directUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/tour-plan?code=${encodeURIComponent(p.tourCode)}&email=${encodeURIComponent(p.customerEmail)}`;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300 shadow-2xs">
                      {p.tourCode}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        p.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : p.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {p.status === 'confirmed'
                        ? '✅ 日程確定済'
                        : p.status === 'in_progress'
                        ? '🚗 催行中'
                        : p.status === 'completed'
                        ? '🎉 ツアー完了'
                        : p.status}
                    </span>

                    {/* Copy Direct Magic Link for Customer */}
                    <button
                      type="button"
                      onClick={() => handleCopy(directUrl, `link_${p.id}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 px-2 py-0.5 rounded hover:bg-blue-50 transition-colors"
                      title="お客様用の直通確認リンクをコピー"
                    >
                      {copiedKey === `link_${p.id}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">リンクをコピーしました</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>お客様用URLをコピー</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actions (Edit / Delete / Preview) */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`/tour-plan?code=${encodeURIComponent(p.tourCode)}&email=${encodeURIComponent(p.customerEmail)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-500 hover:text-[#0B2545] rounded-lg hover:bg-slate-100 transition-colors"
                      title="お客様向け画面をプレビュー"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingPlan(p);
                        setIsEditorOpen(true);
                      }}
                      className="p-1.5 text-amber-600 hover:text-amber-800 rounded-lg hover:bg-amber-50 transition-colors"
                      title="編集"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.tourCode)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Customer */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">お客様情報</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{p.customerName}</p>
                    <p className="font-mono text-slate-500 text-[11px]">{p.customerEmail}</p>
                    {p.customerPhone && (
                      <p className="text-slate-400 text-[10px] mt-0.5">{p.customerPhone}</p>
                    )}
                  </div>

                  {/* Tour & Dates */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">ツアー名・日程</span>
                    <p className="font-bold text-[#0B2545] mt-0.5 line-clamp-1">{p.tourTitle}</p>
                    <p className="font-mono text-slate-700 mt-1 flex items-center gap-1 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      {p.tourDate}
                      {p.endDate ? ` 〜 ${p.endDate}` : ''}
                    </p>
                  </div>

                  {/* Pickup & Pax */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">お迎え＆参加人数</span>
                    <p className="text-slate-700 mt-0.5 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {p.pickupTime || '08:30'} 集合
                    </p>
                    <p className="text-slate-500 text-[11px] truncate" title={p.pickupLocation}>
                      {p.pickupLocation || '宿泊先ホテル'}
                    </p>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      大人 {p.adultsCount}名 / 子 {p.childrenCount}名
                    </p>
                  </div>

                  {/* Photos Status & Drive */}
                  {(() => {
                    const isPhotoExpired = Boolean(
                      p.photoStatus === 'expired' ||
                      (p.photosExpireAt && new Date(p.photosExpireAt).getTime() <= Date.now())
                    );

                    return (
                      <div className={`p-3 rounded-xl border ${isPhotoExpired ? 'bg-rose-50/50 border-rose-200' : 'bg-amber-50/50 border-amber-200/50'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                            <Camera className="w-3 h-3 text-amber-600" />
                            記念写真
                          </span>
                          {isPhotoExpired && (
                            <span className="text-[9px] font-black bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded">
                              期限切れ
                            </span>
                          )}
                          {!isPhotoExpired && p.driveUrl && (
                            <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                              公開中
                            </span>
                          )}
                        </div>

                        {p.driveUrl ? (
                          <div className="mt-1 space-y-1">
                            <a
                              href={p.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1 font-bold text-[11px] ${isPhotoExpired ? 'text-slate-500 hover:text-slate-700' : 'text-[#0B2545] hover:underline'}`}
                              title={isPhotoExpired ? '期限切れですが管理者として確認可能' : 'Driveフォルダを開く'}
                            >
                              <span>Driveフォルダ{isPhotoExpired ? '（管理者確認用）' : 'を開く'}</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                            {p.photosExpireAt && (
                              <p className={`text-[10px] font-bold ${isPhotoExpired ? 'text-rose-700' : 'text-amber-900'}`}>
                                保存期限: {new Date(p.photosExpireAt).toLocaleDateString('ja-JP')}
                                {isPhotoExpired ? '（終了）' : ''}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                            <span>未アップロード</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Timeline Preview */}
                {p.schedule && p.schedule.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      確定スケジュール（全 {p.schedule.length} 項目）:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {p.schedule.map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-[11px] text-slate-700 flex items-center gap-1"
                        >
                          <span className="font-mono font-bold text-amber-700">{s.time}</span>
                          <span>{s.title}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {isEditorOpen && (
        <TourPlanEditorModal
          key={editingPlan ? editingPlan.id : 'new'}
          isOpen={isEditorOpen}
          initialPlan={editingPlan}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingPlan(null);
          }}
          onSaved={handleSavedPlan}
        />
      )}
    </div>
  );
}
