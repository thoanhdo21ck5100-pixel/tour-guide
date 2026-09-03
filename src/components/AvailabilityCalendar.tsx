'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';
import { DayAvailability } from '@/types';

interface AvailabilityCalendarProps {
  selectedDate?: string;
  onSelectDate: (date: string) => void;
}

export default function AvailabilityCalendar({
  selectedDate,
  onSelectDate,
}: AvailabilityCalendarProps) {
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth() + 1);
  const [availabilityList, setAvailabilityList] = useState<DayAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch availability when year/month changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/availability?year=${currentYear}&month=${currentMonth}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.availability) {
          setAvailabilityList(data.availability);
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

  // Build calendar matrix
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun, 6 = Sat

  // Lookup map for fast status resolution
  const availabilityMap = new Map<string, DayAvailability>();
  availabilityList.forEach((item) => {
    availabilityMap.set(item.date, item);
  });

  const weekDayLabels = [
    { label: '日', isWeekend: true, color: 'text-red-500' },
    { label: '月', isWeekend: false, color: 'text-slate-600' },
    { label: '火', isWeekend: false, color: 'text-slate-600' },
    { label: '水', isWeekend: false, color: 'text-slate-600' },
    { label: '木', isWeekend: false, color: 'text-slate-600' },
    { label: '金', isWeekend: false, color: 'text-slate-600' },
    { label: '土', isWeekend: true, color: 'text-blue-500' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      {/* Header with Month Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
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

      {/* Weekday Row */}
      <div className="grid grid-cols-7 gap-1 text-center py-2.5 text-xs font-bold border-b border-slate-100">
        {weekDayLabels.map((item, idx) => (
          <div key={idx} className={item.color}>
            {item.label}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
          カレンダー空き状況を読み込み中...
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1.5 pt-3">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-xl bg-slate-50/50" />
          ))}

          {/* Month day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayStr = String(dayNum).padStart(2, '0');
            const monthStr = String(currentMonth).padStart(2, '0');
            const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

            const item = availabilityMap.get(dateStr);
            const status = item?.status || 'available';
            const isSelected = selectedDate === dateStr;
            const isBooked = status === 'booked';
            const isLimited = status === 'limited';

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isBooked}
                onClick={() => onSelectDate(dateStr)}
                className={`h-14 sm:h-16 p-1 rounded-xl flex flex-col items-center justify-between border transition-all text-left relative ${
                  isSelected
                    ? 'border-[#0B2545] bg-[#0B2545] text-white shadow-md ring-2 ring-amber-400'
                    : isBooked
                    ? 'border-slate-100 bg-slate-100/70 text-slate-400 cursor-not-allowed'
                    : isLimited
                    ? 'border-amber-200 bg-amber-50/50 hover:border-amber-400 hover:bg-amber-100/50'
                    : 'border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/40 bg-white'
                }`}
              >
                {/* Date Number */}
                <span
                  className={`text-xs font-bold leading-none ${
                    isSelected
                      ? 'text-white'
                      : isBooked
                      ? 'text-slate-400'
                      : 'text-slate-700'
                  }`}
                >
                  {dayNum}
                </span>

                {/* Status Badge */}
                <div className="w-full flex justify-center pb-0.5">
                  {isBooked ? (
                    <span className="text-[10px] font-medium text-rose-500 flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      満席
                    </span>
                  ) : isLimited ? (
                    <span
                      className={`text-[10px] font-medium flex items-center gap-0.5 ${
                        isSelected ? 'text-amber-300' : 'text-amber-600'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      残り僅か
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-medium flex items-center gap-0.5 ${
                        isSelected ? 'text-emerald-300' : 'text-emerald-600'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      空き
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Legend & Instructions */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">🟢 空きあり（予約可）</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-600">🟡 残りわずか</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-400">🔴 満席（受付終了）</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-[11px]">
          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>日付をタップすると予約フォームに自動入力されます</span>
        </div>
      </div>
    </div>
  );
}
