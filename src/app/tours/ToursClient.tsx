'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TOURS_DATA } from '@/lib/data/tours';
import TourCard from '@/components/TourCard';
import { TourCategory } from '@/types';
import { Sparkles, MessageCircle, SlidersHorizontal, ShieldCheck, MapPin, Users } from 'lucide-react';
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
            すべてのツアーは他のお客様と混乗しない「完全プライベート案内（1日1組様限定）」。
            日本語検定N1専属ガイドが、安心・安全・快適にダナン・ホイアンをはじめベトナム各地をご案内します。専用車の手配やオリジナル旅程のオーダーメイドもご希望に合わせて承ります。
          </p>

          {/* Quick Assurance Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-700">
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs font-semibold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              事前決済不要・到着後に全額払い
            </span>
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              1週間前まで連絡可
            </span>
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
              <MessageCircle className="w-3.5 h-3.5 text-[#06c755]" />
              LINE旅程事前相談無料
            </span>
          </div>
        </div>

        {/* 日本語ガイド基本料金についてのエリア別明朗料金表 */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 border border-amber-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/70 pb-4">
            <div>
              <div className="flex items-center gap-2 text-amber-900 font-black text-base sm:text-lg">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                <span>エリア別・日本語ガイド基本料金表（1組貸切）</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                ガイドの移動拠点・移動時間に応じた明朗会計。他のお客様との混乗なし！
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4" />
              <span>事前決済不要・到着後払い</span>
            </div>
          </div>

          {/* Area pricing grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. ダナン市内 */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#0B2545] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    ダナン市内エリア
                  </span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                    最安 5,000円〜
                  </span>
                </div>
                <div className="space-y-2.5 my-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">半日（4時間）</span>
                      <span className="font-black text-base text-[#0B2545]">5,000円</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                      2名利用時: 1人あたり 3,000円
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">終日（1日満喫）</span>
                      <span className="font-black text-base text-[#0B2545]">10,000円</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                      2名利用時: 1人あたり 5,500円
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                ※五行山、ハン市場、ビーチ、ナイトグルメ等
              </p>
            </div>

            {/* 2. ホイアン周辺 */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#0B2545] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    ホイアン周辺エリア
                  </span>
                  <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">
                    世界遺産
                  </span>
                </div>
                <div className="space-y-2.5 my-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">半日（4時間）</span>
                      <span className="font-black text-base text-[#0B2545]">7,000円</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                      2名利用時: 1人あたり 4,000円
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">終日（1日満喫）</span>
                      <span className="font-black text-base text-[#0B2545]">12,000円</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                      2名利用時: 1人あたり 6,500円
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                ※ダナン〜ホイアン周遊、アオザイ撮影、灯籠流し等
              </p>
            </div>

            {/* 3. 古都フエ・遠郊 */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#0B2545] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    古都フエ・遠郊エリア
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                    長距離専任
                  </span>
                </div>
                <div className="space-y-2.5 my-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">終日（1日専任）</span>
                      <span className="font-black text-base text-[#0B2545]">13,000円</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                      2名利用時: 1人あたり 7,000円
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">鉄道・飛行機エリア</span>
                      <span className="font-bold text-xs text-slate-600">事前お見積り</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      ハノイ・ホーチミン等対応可
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                ※フエは移動に往復4時間以上要するため1日専任制
              </p>
            </div>
          </div>

          {/* Group pricing benefit note */}
          <div className="p-3.5 rounded-2xl bg-amber-100/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-bold">
              <Users className="w-4 h-4 text-amber-700 shrink-0" />
              <span>【グループ利用特典】追加人数はどのプランも「＋1,000円/名」のみ！人数が増えるほど1人あたり超お得</span>
            </div>
            <span className="text-slate-600 text-[11px]">
              ※交通費・入場料・飲食等の実費は別途となります。
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
            <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                href="/contact"
                className="w-full sm:w-auto h-11 px-6 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center justify-center text-center"
              >
                オーダーメイドのご相談・お見積り
              </Link>
              <a
                href={SITE_CONFIG.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial h-11 px-4 sm:px-5 bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                LINE相談
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial h-11 px-4 sm:px-5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <InstagramIcon className="w-4 h-4 text-white shrink-0" />
                Instagram
              </a>
              <a
                href={SITE_CONFIG.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial h-11 px-4 sm:px-5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <XIcon className="w-3.5 h-3.5 text-white shrink-0" />
                X (Twitter)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
