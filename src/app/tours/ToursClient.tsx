'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TOURS_DATA } from '@/lib/data/tours';
import TourCard from '@/components/TourCard';
import { TourCategory } from '@/types';
import { Sparkles, MessageCircle, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import XIcon from '@/components/XIcon';
import { SITE_CONFIG } from '@/lib/seo';
import GuideStrategicValueCard from '@/components/GuideStrategicValueCard';

export default function ToursClient() {
  const [selectedCategory, setSelectedCategory] = useState<TourCategory>('all');

  const filteredTours =
    selectedCategory === 'all'
      ? TOURS_DATA
      : TOURS_DATA.filter((tour) => tour.category === selectedCategory);

  const categories: { key: TourCategory; label: string; count: number }[] = [
    { key: 'all', label: 'すべてのツアー', count: TOURS_DATA.length },
    {
      key: 'classic',
      label: '王道ハイライト',
      count: TOURS_DATA.filter((t) => t.category === 'classic').length,
    },
    {
      key: 'women',
      label: '女子旅・ビューティー',
      count: TOURS_DATA.filter((t) => t.category === 'women').length,
    },
    {
      key: 'men',
      label: '男旅・アクティブ＆ナイト',
      count: TOURS_DATA.filter((t) => t.category === 'men').length,
    },
    {
      key: 'food',
      label: 'グルメ＆ローカル',
      count: TOURS_DATA.filter((t) => t.category === 'food').length,
    },
    {
      key: 'custom',
      label: '完全オーダーメイド',
      count: TOURS_DATA.filter((t) => t.category === 'custom').length,
    },
    {
      key: 'family',
      label: 'ファミリー・癒やし',
      count: TOURS_DATA.filter((t) => t.category === 'family').length,
    },
  ];

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            ホーム
          </Link>
          <span>/</span>
          <span className="text-[#0B2545] font-bold">ツアー一覧・料金</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-bold text-amber-600 tracking-wider block mb-1">
            ALL PRIVATE TOURS & PLANS
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0B2545] tracking-tight">
            ベトナム プライベートツアープラン一覧
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            すべてのツアーは他のお客様と同乗しない「完全プライベート貸切（1日1組様限定）」。
            冷暖房完備の専用車と日本語検定N1ガイドが、安心・安全・快適にダナン・ホイアンをはじめベトナム各地をご案内します。行きたい都市やオリジナル旅程のオーダーメイドも承ります。
          </p>

          {/* Quick Assurance Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-700">
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              明朗会計・チップ不要
            </span>
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              3日前までキャンセル無料
            </span>
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <MessageCircle className="w-3.5 h-3.5 text-[#06c755]" />
              LINE旅程事前相談無料
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
            <span>絞り込み:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-[#0B2545] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        {/* Strategic Guide Value & Omotenashi Standard */}
        <GuideStrategicValueCard mode="tour" className="mt-14" />

        {/* Order-made Custom Tour Callout Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#0B2545] to-[#133E68] text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold inline-block mb-3">
              100% ORDER-MADE
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              行きたい場所だけを自由に巡る「完全オーダーメイド」も大歓迎！
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
              「フエの古都巡りと話題のカフェを組み合わせたい」「ゴルフ場送迎のあとに海鮮レストランへ直行したい」など、既存のツアープランにないご要望もLINEで日本語でお気軽にご相談ください。
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="h-11 px-6 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center justify-center"
              >
                オーダーメイドのご相談・お見積り
              </Link>
              <a
                href={SITE_CONFIG.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                LINEで相談する
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-1.5"
              >
                <InstagramIcon className="w-4 h-4 text-white shrink-0" />
                Instagram DMで相談
              </a>
              <a
                href={SITE_CONFIG.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-1.5"
              >
                <XIcon className="w-3.5 h-3.5 text-white shrink-0" />
                X / Twitterで相談
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
