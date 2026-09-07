'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, RotateCcw } from 'lucide-react';
import { DayAvailability } from '@/types';
import { formatJapaneseDate } from '@/components/AvailabilityNoticeBanner';

export interface AvailabilityCalendarProps {
  tripType?: 'single' | 'multi';
  onTripTypeChange?: (tripType: 'single' | 'multi') => void;
  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  onAvailabilityLoaded?: (list: DayAvailability[]) => void;
  // Fallbacks for backward compatibility
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}

export default function AvailabilityCalendar({
  tripType = 'single',
  onTripTypeChange,
  startDate = '',
  endDate = '',
  onDateRangeChange,
  onAvailabilityLoaded,
  selectedDate = '',
  onSelectDate,
}: AvailabilityCalendarProps) {
  // Resolve effective active values
  const effectiveStart = startDate || selectedDate || '';
  const effectiveEnd = tripType === 'multi' ? endDate : '';

  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);
  const [availabilityList, setAvailabilityList] = useState<DayAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hover state for range selection preview
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [isPickingEnd, setIsPickingEnd] = useState<boolean>(false);

  // When effectiveStart or effectiveEnd changes externally, reset isPickingEnd if range complete
  useEffect(() => {
    if (tripType === 'multi') {
      if (effectiveStart && effectiveEnd) {
        setIsPickingEnd(false);
        setHoverDate(null);
      } else if (effectiveStart && !effectiveEnd) {
        setIsPickingEnd(true);
      }
    } else {
      setIsPickingEnd(false);
      setHoverDate(null);
    }
  }, [tripType, effectiveStart, effectiveEnd]);

  // Fetch availability when year/month changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/availability?year=${currentYear}&month=${currentMonth}&t=${Date.now()}`, {
      cache: 'no-store',
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.availability) {
          setAvailabilityList(data.availability);
          onAvailabilityLoaded?.(data.availability);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch availability:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentYear, currentMonth, onAvailabilityLoaded]);

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

  // Build calendar matrix
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun, 6 = Sat

  // Lookup map for fast status resolution
  const availabilityMap = useMemo(() => {
    const map = new Map<string, DayAvailability>();
    availabilityList.forEach((item) => {
      map.set(item.date, item);
    });
    return map;
  }, [availabilityList]);

  const weekDayLabels = [
    { label: '日', isWeekend: true, color: 'text-red-500' },
    { label: '月', isWeekend: false, color: 'text-slate-600' },
    { label: '火', isWeekend: false, color: 'text-slate-600' },
    { label: '水', isWeekend: false, color: 'text-slate-600' },
    { label: '木', isWeekend: false, color: 'text-slate-600' },
    { label: '金', isWeekend: false, color: 'text-slate-600' },
    { label: '土', isWeekend: true, color: 'text-blue-500' },
  ];

  // Duration text helper
  const tripDurationText = useMemo(() => {
    if (tripType !== 'multi' || !effectiveStart || !effectiveEnd) return null;
    const s = new Date(effectiveStart);
    const e = new Date(effectiveEnd);
    const diffDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (isNaN(diffDays) || diffDays <= 0) return null;
    if (diffDays === 1) return '（日帰り / 1日間）';
    return `（${diffDays - 1}泊${diffDays}日 / 全${diffDays}日間）`;
  }, [tripType, effectiveStart, effectiveEnd]);

  // Click handling
  const handleDateClick = (dateStr: string) => {
    if (tripType === 'single') {
      if (onDateRangeChange) {
        onDateRangeChange(dateStr, '');
      }
      onSelectDate?.(dateStr);
      return;
    }

    // Multi-day mode
    if (!effectiveStart || (effectiveStart && effectiveEnd) || !isPickingEnd) {
      // Start fresh selection
      setIsPickingEnd(true);
      setHoverDate(null);
      if (onDateRangeChange) {
        onDateRangeChange(dateStr, '');
      }
      onSelectDate?.(dateStr);
    } else {
      // We already have effectiveStart and are picking end date
      if (dateStr < effectiveStart) {
        // Clicked date is earlier than start: make this the new start date
        setIsPickingEnd(true);
        setHoverDate(null);
        if (onDateRangeChange) {
          onDateRangeChange(dateStr, '');
        }
        onSelectDate?.(dateStr);
      } else {
        // Complete the range selection
        setIsPickingEnd(false);
        setHoverDate(null);
        if (onDateRangeChange) {
          onDateRangeChange(effectiveStart, dateStr);
        }
      }
    }
  };

  // Hover handling
  const handleDateMouseEnter = (dateStr: string) => {
    if (tripType === 'multi' && isPickingEnd && effectiveStart) {
      if (dateStr >= effectiveStart) {
        setHoverDate(dateStr);
      } else {
        setHoverDate(null);
      }
    }
  };

  const handleGridMouseLeave = () => {
    if (isPickingEnd) {
      setHoverDate(null);
    }
  };

  const handleResetDates = () => {
    setIsPickingEnd(false);
    setHoverDate(null);
    if (onDateRangeChange) {
      onDateRangeChange('', '');
    }
    onSelectDate?.('');
  };

  // Determine active visual end target (either confirmed end date, or hovered date during selection)
  const previewEnd = tripType === 'multi' && isPickingEnd ? hoverDate : null;
  const activeEnd = effectiveEnd || previewEnd || '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      {/* 1. Trip Type Switcher */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <span className="text-xs font-bold text-slate-700">
          日程タイプ選択:
        </span>
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => onTripTypeChange?.('single')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              tripType === 'single'
                ? 'bg-white text-[#0B2545] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>☀️ 1日プラン</span>
          </button>
          <button
            type="button"
            onClick={() => onTripTypeChange?.('multi')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              tripType === 'multi'
                ? 'bg-[#0B2545] text-amber-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🗓️ 複数日（周遊・連泊）</span>
          </button>
        </div>
      </div>

      {/* 2. Month Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-amber-500" />
          <h3 className="text-base sm:text-lg font-bold text-[#0B2545]">
            {currentYear}年 {currentMonth}月 空き状況
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            aria-label="前月へ"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            aria-label="次月へ"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Interactive Selection Hint Banner */}
      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between gap-2">
        {tripType === 'multi' ? (
          effectiveStart && effectiveEnd ? (
            <div className="flex items-center justify-between w-full gap-2 text-slate-800 font-bold">
              <span className="flex items-center gap-1.5 text-amber-900">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                <span>
                  選択期間: {formatJapaneseDate(effectiveStart)} 〜 {formatJapaneseDate(effectiveEnd)}{' '}
                  <span className="text-slate-600 font-normal">{tripDurationText}</span>
                </span>
              </span>
              <button
                type="button"
                onClick={handleResetDates}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 shrink-0 underline"
              >
                <RotateCcw className="w-3 h-3" />
                リセット
              </button>
            </div>
          ) : isPickingEnd && effectiveStart ? (
            <div className="text-amber-800 font-bold flex items-center gap-1.5 animate-pulse">
              <span>👉</span>
              <span>
                次に<strong>【ツアー終了日】</strong>をタップしてください（開始日: {formatJapaneseDate(effectiveStart)}）
              </span>
            </div>
          ) : (
            <div className="text-slate-600 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>カレンダー上で【ツアー開始日】と【終了日】をタップして期間を選択してください</span>
            </div>
          )
        ) : effectiveStart ? (
          <div className="flex items-center justify-between w-full text-slate-800 font-bold">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span>選択日: {formatJapaneseDate(effectiveStart)}</span>
            </span>
            <button
              type="button"
              onClick={handleResetDates}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 shrink-0 underline"
            >
              <RotateCcw className="w-3 h-3" />
              解除
            </button>
          </div>
        ) : (
          <div className="text-slate-600 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>カレンダー上でご希望の日付をタップしてください</span>
          </div>
        )}
      </div>

      {/* 4. Weekday Row */}
      <div className="grid grid-cols-7 gap-1 text-center py-2 text-xs font-bold border-b border-slate-100">
        {weekDayLabels.map((item, idx) => (
          <div key={idx} className={item.color}>
            {item.label}
          </div>
        ))}
      </div>

      {/* 5. Calendar Days Grid (Always rendered to guarantee ZERO Cumulative Layout Shift) */}
      <div
        className="grid grid-cols-7 gap-1.5 pt-1"
        onMouseLeave={handleGridMouseLeave}
      >
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-xl bg-slate-50/40" />
          ))}

          {/* Month day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayStr = String(dayNum).padStart(2, '0');
            const monthStr = String(currentMonth).padStart(2, '0');
            const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

            const item = availabilityMap.get(dateStr);
            const status = item?.status || 'available';
            const isBooked = status === 'booked';
            const isLimited = status === 'limited';

            // Range checks
            const isStart = Boolean(effectiveStart && dateStr === effectiveStart);
            const isEnd = Boolean(activeEnd && dateStr === activeEnd && activeEnd !== effectiveStart);
            const isSameDay = Boolean(
              effectiveStart && activeEnd === effectiveStart && dateStr === effectiveStart
            );
            const isBetween = Boolean(
              effectiveStart && activeEnd && dateStr > effectiveStart && dateStr < activeEnd
            );
            const hasMultiRange = Boolean(
              effectiveStart && activeEnd && activeEnd > effectiveStart
            );

            // Single date check
            const isSingleSelected = tripType === 'single' && isStart;

            return (
              <div
                key={dateStr}
                className="relative flex items-center justify-center"
                onMouseEnter={() => handleDateMouseEnter(dateStr)}
              >
                {/* Horizontal Connector Strip Behind Start/Between/End */}
                {hasMultiRange && (
                  <>
                    {/* If isStart: extend half bridge to the right */}
                    {isStart && (
                      <div className="absolute inset-y-1 right-0 w-1/2 bg-amber-200/80 z-0 rounded-r-none" />
                    )}
                    {/* If isBetween: full bridge across the cell */}
                    {isBetween && (
                      <div className="absolute inset-y-1 -inset-x-1 bg-amber-200/80 z-0" />
                    )}
                    {/* If isEnd: extend half bridge to the left */}
                    {isEnd && (
                      <div className="absolute inset-y-1 left-0 w-1/2 bg-amber-200/80 z-0 rounded-l-none" />
                    )}
                  </>
                )}

                {/* Day Interactive Cell Button */}
                <button
                  type="button"
                  aria-label={`${currentYear}年${currentMonth}月${dayNum}日 ${
                    isLoading
                      ? '空き状況確認中'
                      : isBooked
                      ? '満席 (提携ガイド対応可)'
                      : isLimited
                      ? '残り僅か'
                      : '空きあり'
                  }`}
                  onClick={() => handleDateClick(dateStr)}
                  className={`w-full h-14 sm:h-16 p-1 rounded-xl flex flex-col items-center justify-between border transition-all text-left relative z-10 cursor-pointer ${
                    isStart || isEnd || isSingleSelected || isSameDay
                      ? 'bg-[#0B2545] border-[#0B2545] text-white shadow-md ring-2 ring-amber-400'
                      : isBetween
                      ? 'bg-amber-100/90 border-amber-300 text-amber-950 font-bold hover:bg-amber-200/90'
                      : isBooked
                      ? 'border-rose-200/80 bg-rose-50/40 text-slate-700 hover:border-rose-400 hover:bg-rose-100/50'
                      : isLimited
                      ? 'border-amber-200 bg-amber-50/50 hover:border-amber-400 hover:bg-amber-100/60'
                      : 'border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/40 bg-white'
                  }`}
                >
                  {/* Date Number */}
                  <span
                    className={`text-xs font-bold leading-none ${
                      isStart || isEnd || isSingleSelected || isSameDay
                        ? 'text-white'
                        : isBetween
                        ? 'text-amber-950'
                        : isBooked
                        ? 'text-slate-800'
                        : 'text-slate-700'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {/* Status Indicator Badge */}
                  <div className="w-full flex justify-center pb-0.5">
                    {isLoading ? (
                      <span className="text-[9px] text-slate-400 font-medium flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse shrink-0"></span>
                        確認中
                      </span>
                    ) : isBooked ? (
                      <span
                        className={`text-[9px] font-bold px-1 py-0.2 rounded leading-tight flex items-center gap-0.5 ${
                          isStart || isEnd || isSingleSelected || isSameDay
                            ? 'bg-rose-500 text-white'
                            : isBetween
                            ? 'bg-rose-500 text-white'
                            : 'text-rose-600 bg-rose-100/80'
                        }`}
                        title="専属ガイド満席（提携日本語ガイド手配可能）"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 inline-block"></span>
                        満席(提携)
                      </span>
                    ) : isLimited ? (
                      <span
                        className={`text-[9px] font-medium flex items-center gap-0.5 ${
                          isStart || isEnd || isSingleSelected || isSameDay
                            ? 'text-amber-300'
                            : 'text-amber-600'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        残り僅か
                      </span>
                    ) : (
                      <span
                        className={`text-[9px] font-medium flex items-center gap-0.5 ${
                          isStart || isEnd || isSingleSelected || isSameDay
                            ? 'text-emerald-300'
                            : 'text-emerald-600'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        空き
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

      {/* 6. Legend & Reassurance Note */}
      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">🟢 空き（即時予約可）</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-slate-600">🟡 残り僅か</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span className="text-rose-600 font-medium">🔴 満席（提携ガイド対応可）</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
          ※ 満席の日程が含まれる場合でも、<strong>信頼できる提携の日本語ガイド（日本人対応実績多数）</strong>を手配してご案内可能です。お気軽に選択・ご相談ください。
        </p>
      </div>
    </div>
  );
}
