'use client';

import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import Toast from '@/components/admin/Toast';
import { DayAvailability, DayAvailabilityStatus } from '@/types';

export default function AdminCalendarManagerPage() {
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);
  const [availabilityList, setAvailabilityList] = useState<DayAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [lastAuditUpdate, setLastAuditUpdate] = useState<string | null>(null);

  // Fetch month availability
  const loadMonthData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/availability?year=${currentYear}&month=${currentMonth}`);
      const data = await res.json();
      if (data.availability) {
        setAvailabilityList(data.availability);
      }
    } catch (err) {
      console.error('Failed to load availability:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMonthData();
  }, [currentYear, currentMonth]);

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Quick toggle status on cell click
  const handleToggleDay = async (dateStr: string, currentStatus: DayAvailabilityStatus) => {
    // Status cycle: available -> booked -> limited -> available
    let nextStatus: DayAvailabilityStatus = 'booked';
    if (currentStatus === 'available') {
      nextStatus = 'booked';
    } else if (currentStatus === 'booked') {
      nextStatus = 'limited';
    } else {
      nextStatus = 'available';
    }

    const statusLabel =
      nextStatus === 'booked' ? '満席（受付終了）' : nextStatus === 'limited' ? '残りわずか' : '空きあり（予約可）';

    // Optimistic UI update
    setAvailabilityList((prev) =>
      prev.map((item) => (item.date === dateStr ? { ...item, status: nextStatus } : item))
    );

    try {
      const res = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateStr,
          status: nextStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '更新に失敗しました。');
      }

      setToastType('success');
      setToastMessage(`${dateStr} のステータスを【${statusLabel}】に更新しました`);
      setLastAuditUpdate(`${dateStr} (${new Date().toLocaleTimeString('ja-JP')})`);
    } catch (err: unknown) {
      // Rollback on error
      setAvailabilityList((prev) =>
        prev.map((item) => (item.date === dateStr ? { ...item, status: currentStatus } : item))
      );
      setToastType('error');
      setToastMessage(err instanceof Error ? err.message : '更新エラーが発生しました');
    }
  };

  // Build calendar matrix
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();

  const availabilityMap = new Map<string, DayAvailability>();
  availabilityList.forEach((item) => {
    availabilityMap.set(item.date, item);
  });

  // Calculate month summary counts
  const availableCount = availabilityList.filter((a) => a.status === 'available').length;
  const bookedCount = availabilityList.filter((a) => a.status === 'booked').length;
  const limitedCount = availabilityList.filter((a) => a.status === 'limited').length;

  const weekDayLabels = [
    { label: '日', color: 'text-rose-500' },
    { label: '月', color: 'text-slate-600' },
    { label: '火', color: 'text-slate-600' },
    { label: '水', color: 'text-slate-600' },
    { label: '木', color: 'text-slate-600' },
    { label: '金', color: 'text-slate-600' },
    { label: '土', color: 'text-blue-500' },
  ];

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-5xl w-full mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-amber-600 block">AVAILABILITY MANAGER</span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B2545]">
            カレンダー空き枠 管理画面
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            日付セルをタップすると「空き 🟢 ➔ 満席 🔴 ➔ 残りわずか 🟡」の順で即座に切り替わります。
          </p>
        </div>

        {/* Audit timestamp pill */}
        {lastAuditUpdate && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>最終更新: {lastAuditUpdate}</span>
          </div>
        )}
      </div>

      {/* Month Summary KPI Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            🟢
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-bold block">空き日程</span>
            <span className="text-lg font-black text-slate-800">{availableCount} 日</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
            🔴
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-bold block">満席・予約済</span>
            <span className="text-lg font-black text-slate-800">{bookedCount} 日</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            🟡
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-bold block">残り1組様</span>
            <span className="text-lg font-black text-slate-800">{limitedCount} 日</span>
          </div>
        </div>
      </div>

      {/* Main Calendar Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        {/* Month Navigation */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg font-black text-[#0B2545]">
              {currentYear}年 {currentMonth}月 スケジュール
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
              aria-label="前月"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setCurrentYear(now.getFullYear());
                setCurrentMonth(now.getMonth() + 1);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              今月
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
              aria-label="次月"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday Row */}
        <div className="grid grid-cols-7 gap-1 text-center py-3 text-xs font-bold border-b border-slate-100">
          {weekDayLabels.map((item, idx) => (
            <div key={idx} className={item.color}>
              {item.label}
            </div>
          ))}
        </div>

        {/* Calendar Days Matrix */}
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400">
            カレンダーを読み込み中...
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2 pt-4">
            {/* Empty offset days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`offset-${i}`} className="h-20 rounded-xl bg-slate-50/50" />
            ))}

            {/* Month Day Cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayStr = String(dayNum).padStart(2, '0');
              const monthStr = String(currentMonth).padStart(2, '0');
              const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

              const item = availabilityMap.get(dateStr);
              const status = item?.status || 'available';

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleToggleDay(dateStr, status)}
                  className={`h-20 p-2 rounded-2xl flex flex-col justify-between border-2 transition-all text-left cursor-pointer group hover:scale-102 hover:shadow-md ${
                    status === 'booked'
                      ? 'border-rose-200 bg-rose-50/70 hover:border-rose-400'
                      : status === 'limited'
                      ? 'border-amber-200 bg-amber-50/70 hover:border-amber-400'
                      : 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-slate-800">{dayNum}</span>
                    <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      切替 ↺
                    </span>
                  </div>

                  <div className="w-full">
                    {status === 'booked' ? (
                      <span className="w-full py-1 px-1.5 rounded-lg bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs">
                        🔴 満席
                      </span>
                    ) : status === 'limited' ? (
                      <span className="w-full py-1 px-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs">
                        🟡 残少
                      </span>
                    ) : (
                      <span className="w-full py-1 px-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs">
                        🟢 空き
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              🟢 空きあり（予約受付中）
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              🔴 満席（受付停止）
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              🟡 残りわずか（1組様）
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Info className="w-3.5 h-3.5 text-amber-500" />
            <span>ここでの切り替えは、お客様側の予約カレンダー（/contact）に即時同期されます</span>
          </div>
        </div>
      </div>
    </div>
  );
}
