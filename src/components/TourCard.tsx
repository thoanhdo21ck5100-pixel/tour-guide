import Link from 'next/link';
import Image from 'next/image';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Tour } from '@/types';

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full"
    >
      {/* Card Image */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
        <Image
          src={tour.heroImage}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {tour.badge && (
            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
              {tour.badge}
            </span>
          )}
          <span className="px-2.5 py-1 bg-black/50 backdrop-blur-xs text-white text-[11px] font-medium rounded-full">
            {tour.categoryLabel}
          </span>
        </div>

        {/* Duration & Reassurance Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>所要時間: {tour.duration}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md text-amber-300 font-bold text-[11px]">
            <span>事前決済不要</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0B2545] leading-snug group-hover:text-amber-600 transition-colors">
            {tour.title}
          </h3>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
            {tour.shortDescription}
          </p>

          {/* Highlights Bullets */}
          <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
            {tour.highlights.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70 inline-block mb-1">
              （2名様以上: 1人あたり{Math.round((tour.priceJpy + 1000) / 2).toLocaleString('ja-JP')}円〜）
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
                {tour.priceJpy.toLocaleString('ja-JP')}
              </span>
              <span className="text-xs font-bold text-slate-600">円〜</span>
              <span className="text-[10px] text-slate-400 font-normal ml-0.5">/ 貸切</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#0B2545] text-white text-xs font-bold rounded-xl group-hover:bg-amber-600 transition-colors shadow-xs shrink-0 mb-0.5">
            <span>プラン詳細</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
