'use client';

import { useMemo } from 'react';
import { DayAvailability } from '@/types';
import { ShieldCheck, Clock, CheckCircle } from 'lucide-react';

interface AvailabilityNoticeBannerProps {
  tripType: 'single' | 'multi';
  startDate: string;
  endDate: string;
  availabilityList: DayAvailability[];
}

/**
 * Format date string YYYY-MM-DD into Japanese M月D日(曜)
 */
export function formatJapaneseDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  const dateObj = new Date(dateStr);
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const dayName = !isNaN(dateObj.getTime()) ? `(${dayNames[dateObj.getDay()]})` : '';
  return `${m}月${d}日${dayName}`;
}

/**
 * Calculate all dates array between start and end (inclusive)
 */
export function getDatesInRange(startStr: string, endStr: string): string[] {
  if (!startStr) return [];
  if (!endStr || endStr === startStr) return [startStr];

  const dates: string[] = [];
  const curr = new Date(startStr);
  const end = new Date(endStr);

  if (isNaN(curr.getTime()) || isNaN(end.getTime()) || curr > end) {
    return [startStr];
  }

  // Safety loop cap at 60 days
  let count = 0;
  while (curr <= end && count < 60) {
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const d = String(curr.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    curr.setDate(curr.getDate() + 1);
    count++;
  }

  return dates;
}

export default function AvailabilityNoticeBanner({
  tripType,
  startDate,
  endDate,
  availabilityList,
}: AvailabilityNoticeBannerProps) {
  const dates = useMemo(() => {
    if (!startDate) return [];
    if (tripType === 'single') return [startDate];
    return getDatesInRange(startDate, endDate || startDate);
  }, [tripType, startDate, endDate]);

  const availabilityMap = useMemo(() => {
    const map = new Map<string, DayAvailability>();
    availabilityList.forEach((item) => {
      map.set(item.date, item);
    });
    return map;
  }, [availabilityList]);

  const { bookedDates, limitedDates } = useMemo(() => {
    const booked: string[] = [];
    const limited: string[] = [];

    dates.forEach((d) => {
      const item = availabilityMap.get(d);
      if (item?.status === 'booked') {
        booked.push(d);
      } else if (item?.status === 'limited') {
        limited.push(d);
      }
    });

    return { bookedDates: booked, limitedDates: limited };
  }, [dates, availabilityMap]);

  if (dates.length === 0) {
    return null;
  }

  // 1. Case: Contains fully booked days (専属ガイド満席日がある場合)
  if (bookedDates.length > 0) {
    const bookedDaysText = bookedDates.map(formatJapaneseDate).join('・');

    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50 border-2 border-amber-300/90 text-slate-800 shadow-sm animate-in fade-in slide-in-from-top-1 duration-300 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs text-base">
            🤝
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#0B2545] flex items-center gap-1.5">
              <span>専属ガイド満席日のご案内・安心サポート</span>
            </h4>
            <span className="inline-block text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md mt-0.5">
              提携の日本語ガイド（日本人対応経験豊富）を手配可能
            </span>
          </div>
        </div>

        <div className="text-xs leading-relaxed text-slate-700 bg-white/90 p-3.5 rounded-xl border border-amber-200/80 space-y-2">
          <p>
            ご希望の日程の中に、専属ガイドの予約が埋まっている日（
            <strong className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
              {bookedDaysText}
            </strong>
            ）が含まれておりますが、<strong className="text-[#0B2545]">どうぞご安心ください。</strong>
          </p>
          <p>
            専属ガイドが対応できない日程につきましては、日本人のお客様へのご案内経験が豊富な
            <strong className="text-amber-900">【信頼できる提携の専属日本語ガイド】</strong>
            を手配し、変わらぬ高品質なサービスでしっかりサポートいたします。
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>このまま安心して予約・ご相談いただけます（追加料金等は一切不要です）</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Case: Contains limited days (残り僅かの日が含まれる場合)
  if (limitedDates.length > 0) {
    const limitedDaysText = limitedDates.map(formatJapaneseDate).join('・');

    return (
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300/80 text-amber-950 flex items-start gap-3 text-xs animate-in fade-in duration-200 shadow-xs">
        <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-xs text-amber-900">
            【予約枠残り僅か】
          </h4>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            ご希望日程（<strong className="text-amber-950 font-bold">{limitedDaysText}</strong>
            ）はご予約枠が残り僅かとなっております。お早めのご予約・無料相談をおすすめいたします。
          </p>
        </div>
      </div>
    );
  }

  // 3. Case: All available (すべて空きあり)
  return (
    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-2.5 text-xs animate-in fade-in duration-200 shadow-xs">
      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
      <div>
        <span className="font-bold text-emerald-900">ご希望の日程はすべて【空きあり】です</span>
        <span className="text-[11px] text-emerald-700 block sm:inline sm:ml-2">
          専属ガイドが担当可能です。スムーズにご案内できます。
        </span>
      </div>
    </div>
  );
}
