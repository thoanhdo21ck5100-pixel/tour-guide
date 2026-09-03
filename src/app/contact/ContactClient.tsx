'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import BookingForm from '@/components/BookingForm';
import {
  Calendar,
  MessageCircle,
  ShieldCheck,
  PhoneCall,
  Clock,
  QrCode,
  Sparkles,
} from 'lucide-react';

export default function ContactClient() {
  const searchParams = useSearchParams();
  const initialTour = searchParams.get('tour') || undefined;

  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // Smooth scroll to form on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const formElem = document.getElementById('booking-form-section');
      if (formElem) {
        formElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            ホーム
          </Link>
          <span>/</span>
          <span className="text-[#0B2545] font-bold">空き状況カレンダー・ご予約</span>
        </nav>

        {/* Page Title */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>CALENDAR & RESERVATION</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B2545] tracking-tight">
            空き状況カレンダー＆仮予約フォーム
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            専属ガイドによる完全プライベートツアーのため、<strong>1日1組様限定</strong>となっております。
            下記カレンダーで空き日程（🟢 空き）をご確認の上、フォームより仮予約リクエストをお送りください。
          </p>

          {/* Reassurance pills */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-700">
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              仮予約段階での決済なし（無料）
            </span>
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              24時間以内に必ず返信
            </span>
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <MessageCircle className="w-3.5 h-3.5 text-[#06c755]" />
              LINEでの事前相談も受付中
            </span>
          </div>
        </div>

        {/* Main 2-Column Layout: Calendar & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Calendar & LINE info */}
          <div className="lg:col-span-6 space-y-6">
            <AvailabilityCalendar
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
            />

            {/* Selected Date Notice */}
            {selectedDate && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4 animate-in fade-in">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 block">
                    選択中の日付:
                  </span>
                  <span className="text-base font-black text-emerald-900">
                    {selectedDate}
                  </span>
                </div>
                <span className="text-xs text-emerald-700">
                  右の予約フォームに自動セットされました
                </span>
              </div>
            )}

            {/* LINE Quick Consultation Box */}
            <div id="line-consultation" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#06c755]/15 text-[#06c755] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 fill-[#06c755]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                    QUICK INQUIRY
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#0B2545]">
                    LINEで気軽に直接チャット相談
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                「フォーム入力が面倒」「日程がまだ確定していない」「旅程の相談だけしたい」という方は、公式LINEから直接メッセージをお送りください。
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 py-3 px-4 bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>公式LINEを開く（@danang_guide）</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div id="booking-form-section" className="lg:col-span-6">
            <BookingForm
              initialDate={selectedDate}
              initialTourSlug={initialTour}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
