'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import InstagramIcon from '@/components/InstagramIcon';
import XIcon from '@/components/XIcon';
import { SITE_CONFIG } from '@/lib/seo';

import AvailabilityNoticeBanner from '@/components/AvailabilityNoticeBanner';
import { DayAvailability } from '@/types';

interface ContactClientProps {
  initialTour?: string;
}

export default function ContactClient({ initialTour }: ContactClientProps) {

  const [tripType, setTripType] = useState<'single' | 'multi'>('single');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [availabilityList, setAvailabilityList] = useState<DayAvailability[]>([]);

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);

    // Smooth scroll to form on mobile when selection is complete
    if (
      typeof window !== 'undefined' &&
      window.innerWidth < 1024 &&
      (tripType === 'single' ? Boolean(start) : Boolean(start && end))
    ) {
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
          <span className="text-[#0B2545] font-bold">空き状況・予約・無料相談</span>
        </nav>

        {/* Page Title */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>CALENDAR & RESERVATION</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B2545] tracking-tight">
            空き状況・予約・無料相談フォーム
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            専属ガイドによる完全プライベートツアーのため、<strong>1日1組様限定</strong>となっております。
            <strong>事前決済不要</strong>で、ツアー料金はベトナム到着後に全額お支払いいただけます（日本円・ベトナムドン対応）。
            下記カレンダーで空き状況をご確認の上、お気軽にお申し込み・ご相談ください。
          </p>

          {/* Reassurance pills */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-700">
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              事前決済不要・到着後に全額お支払い
            </span>
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              送信時点では予約確定ではありません
            </span>
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <MessageCircle className="w-3.5 h-3.5 text-[#06c755]" />
              LINEでの事前相談も大歓迎
            </span>
          </div>
        </div>

        {/* 2 Ways to Book / Consult Guide Banner */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs mb-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs">①</span>
              <span>通常プランから予約相談</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              希望プランと日程を選択しフォームを送信。内容確認後、LINEまたはメールで詳細をご案内します。<strong>この時点では予約確定ではありません。</strong>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center text-xs">②</span>
              <span>個別相談・オーダーメイド</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              「行きたい場所を組み合わせたい」「自分たちだけの旅程を作りたい」「まだ予定が決まっていない」方は、LINEやSNSからいつでもお気軽にご相談ください。
            </p>
          </div>
        </div>

        {/* Main 2-Column Layout: Calendar & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Calendar & LINE info */}
          <div className="lg:col-span-6 space-y-6">
            <AvailabilityCalendar
              tripType={tripType}
              onTripTypeChange={setTripType}
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={handleDateRangeChange}
              onAvailabilityLoaded={setAvailabilityList}
            />

            {/* Selected Date Range Notice & Status Reassurance */}
            <AvailabilityNoticeBanner
              tripType={tripType}
              startDate={startDate}
              endDate={endDate}
              availabilityList={availabilityList}
            />

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

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <a
                  href={SITE_CONFIG.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-24 h-24 bg-white rounded-xl border border-slate-200 p-1 flex items-center justify-center shadow-xs shrink-0 hover:scale-105 transition-transform"
                >
                  <Image
                    src="/images/guide/line-qr.png"
                    alt="LINE公式QRコード"
                    width={90}
                    height={90}
                    className="object-contain rounded-lg"
                  />
                </a>
                <div className="space-y-1.5 text-center sm:text-left">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    「フォーム入力が面倒」「日程がまだ確定していない」「旅程の相談だけしたい」という方は、公式LINEから直接メッセージをお送りください。
                  </p>
                  <p className="text-xs font-bold text-slate-800">
                    LINE ID: <span className="text-[#06c755] font-mono">{SITE_CONFIG.lineId}</span>
                  </p>
                </div>
              </div>

              <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <a
                  href={SITE_CONFIG.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-13 px-3 bg-[#06c755] hover:bg-[#05b34c] text-white rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2.5"
                >
                  <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                  <div className="text-left leading-tight min-w-0">
                    <div className="font-bold text-xs">公式LINE</div>
                    <div className="text-[10px] opacity-90 font-mono truncate">ID: {SITE_CONFIG.lineId}</div>
                  </div>
                </a>

                <a
                  href={SITE_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-13 px-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2.5"
                >
                  <InstagramIcon className="w-5 h-5 text-white shrink-0" />
                  <div className="text-left leading-tight min-w-0">
                    <div className="font-bold text-xs">Instagram DM</div>
                    <div className="text-[10px] opacity-90 break-all leading-tight">@{SITE_CONFIG.instagramHandle}</div>
                  </div>
                </a>

                <a
                  href={SITE_CONFIG.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-13 px-3 bg-slate-900 hover:bg-black text-white rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2.5"
                >
                  <XIcon className="w-4 h-4 text-white shrink-0" />
                  <div className="text-left leading-tight min-w-0">
                    <div className="font-bold text-xs">X (Twitter)</div>
                    <div className="text-[10px] opacity-90 font-mono truncate">@{SITE_CONFIG.xHandle}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div id="booking-form-section" className="lg:col-span-6">
            <BookingForm
              initialTourSlug={initialTour}
              tripType={tripType}
              onTripTypeChange={setTripType}
              preferredDate={startDate}
              onPreferredDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
              availabilityList={availabilityList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
