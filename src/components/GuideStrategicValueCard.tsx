'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UtensilsCrossed,
  CloudRain,
  Scissors,
  Sparkles,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/seo';

interface GuideStrategicValueCardProps {
  mode?: 'blog' | 'tour';
  relatedTourSlug?: string;
  className?: string;
}

export default function GuideStrategicValueCard({
  mode = 'blog',
  relatedTourSlug,
  className = '',
}: GuideStrategicValueCardProps) {
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillars = [
    {
      id: 'language',
      icon: MessageCircle,
      tag: '言葉の不安を解消',
      title: '日本語での円滑なコミュニケーション',
      shortDesc: 'JLPT N1取得ガイドが、歴史の解説から細かなニュアンスまで対応',
      problem:
        '個人旅行では、観光地での歴史や見どころの理解が深まりにくいだけでなく、英語やベトナム語が通じない場面で意思疎通に困ることがあります。',
      solution:
        '日本語能力試験N1を取得し、日系企業との業務経験（2年）を持つ専属ガイド（アン トー）が全行程をアテンド。観光地の歴史や背景の詳しい解説はもちろん、細かなニュアンスや好みのご要望も日本語でしっかり汲み取ります。',
      guideQuestion:
        '『この名所の歴史や見どころ、地元でのエピソードを詳しく教えてもらえますか？』',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'food',
      icon: UtensilsCrossed,
      tag: '注文・適正価格の代行',
      title: '現地での注文・お買い物サポート',
      shortDesc: 'ベトナム語でのメニュー注文代行やお土産の地元適正価格を確認',
      problem:
        'ローカル食堂ではベトナム語メニューしかなく注文に苦労したり、市場では観光客価格が提示されて値段交渉に戸惑うことがあります。',
      solution:
        'レストランでの「氷なし」「香草別添え」などの細かなリクエストをベトナム語で完全代行。市場やお土産店でも、品質の良い本物の商品を地元適正価格で選べるようサポートします。',
      guideQuestion:
        '『地元の人に愛されていて、日本人の口に合うおすすめのメニューを注文してもらえますか？』',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      iconColor: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'transport',
      icon: ShieldCheck,
      tag: '快適な専用車移動',
      title: '冷房完備の専用車でのスムーズな移動',
      shortDesc: '暑さや雨でも安心。スーツケースも積んだまま手ぶらで観光',
      problem:
        '日中の厳しい暑さや急なスコール、荷物が多い時の配車アプリ待ちやドライバーとの合流トラブルは、旅の大きな疲労原因になります。',
      solution:
        'お客様グループ専用のエアコン完備車両をご用意。お荷物やお土産を車内に置いたまま、涼しく快適に目的地へドア・ツー・ドアで移動できます。',
      guideQuestion:
        '『移動中に荷物を車に置いたまま、身軽に散策できますか？』',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      iconColor: 'text-sky-600 bg-sky-50',
    },
    {
      id: 'flexible',
      icon: Sparkles,
      tag: 'プライベートの柔軟性',
      title: '体調やペースに合わせた柔軟なスケジュール',
      shortDesc: '他のお客様を気にせず、その場で休憩やルート順序を調整可能',
      problem:
        '団体ツアーでは他のお客様に合わせた固定スケジュールとなり、疲れても休憩しづらかったり、好みの場所に長く滞在できないことがあります。',
      solution:
        '完全貸切プライベートツアーのため、当日の体調や天候、混雑状況に合わせて休憩を挟んだり、見学順序をその場で柔軟に調整できます。',
      guideQuestion:
        '『少し歩き疲れたので、近くの落ち着いたカフェで休憩を挟めますか？』',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      iconColor: 'text-purple-600 bg-purple-50',
    },
  ];

  const current = pillars[activePillar];
  const CurrentIcon = current.icon;

  return (
    <div
      className={`rounded-3xl border border-amber-200/80 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20 shadow-md p-6 sm:p-8 relative overflow-hidden ${className}`}
    >
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold tracking-wide uppercase shadow-xs mb-2.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>
            {mode === 'blog'
              ? '現地ガイドサポート'
              : 'アン トーが現地でサポートできること'}
          </span>
        </div>
        <h3 className="text-lg sm:text-2xl font-black text-[#0B2545] tracking-tight">
          専属プライベートガイドだから約束できる「4つの安心サポート」
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          安心の日本語対応と完全貸切ならではの柔軟性。旅先でそのまま使えるプロへの相談フレーズと合わせてご紹介します。
        </p>
      </div>

      {/* Nav Tabs for the 4 Pillars */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          const isActive = idx === activePillar;
          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => setActivePillar(idx)}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-white/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-amber-100 text-amber-900' : 'text-slate-400'
                  }`}
                >
                  0{idx + 1}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-700 block truncate">
                  {pillar.tag}
                </span>
                <span
                  className={`text-xs font-bold line-clamp-1 ${
                    isActive ? 'text-[#0B2545]' : 'text-slate-700'
                  }`}
                >
                  {pillar.title.split('＆')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Pillar Detail Content Card */}
      <div className="relative z-10 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${current.iconColor}`}
            >
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${current.badgeColor}`}
              >
                {current.tag}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-[#0B2545] mt-1">
                {current.title}
              </h4>
            </div>
          </div>
        </div>

        {/* Problem vs Guide Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-3.5">
            <span className="font-bold text-rose-700 flex items-center gap-1 mb-1">
              <span>✕</span>
              <span>個人旅行で生じやすい不安・手間:</span>
            </span>
            <p className="text-slate-700 leading-relaxed">{current.problem}</p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5">
            <span className="font-bold text-emerald-700 flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>専属日本語ガイドが同行する安心のメリット:</span>
            </span>
            <p className="text-slate-700 leading-relaxed">{current.solution}</p>
          </div>
        </div>

        {/* Actionable Prompt to Ask the Guide */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>【実践】旅行者が専属ガイドにそのまま使える質問フレーズ:</span>
          </div>
          <p className="text-slate-900 font-bold bg-white/90 p-2.5 rounded-lg border border-amber-200/60 text-xs sm:text-sm tracking-wide text-amber-950">
            {current.guideQuestion}
          </p>
          <p className="text-[11px] text-amber-800 mt-2">
            ※このようなご相談も、お客様のご希望に合わせて柔軟に対応いたします。
          </p>
        </div>
      </div>

      {/* Conversion Banner & Direct LINE Link */}
      <div className="relative z-10 mt-6 pt-5 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold text-amber-700 flex items-center justify-center sm:justify-start gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            ご出発前の不安やお店選びも、LINEで直接ご相談いただけます
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            日本語能力試験N1専属ガイドが日本語でお答えします（事前相談無料・事前決済不要）
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <a
            href={SITE_CONFIG.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#06c755] hover:bg-[#05b34c] text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>LINEで質問・相談する</span>
          </a>

          {mode === 'blog' && relatedTourSlug ? (
            <Link
              href={`/tours/${relatedTourSlug}`}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#0B2545] hover:bg-[#133E68] text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>関連ツアーを見る</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/tours"
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#0B2545] hover:bg-[#133E68] text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>ツアー一覧を見る</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
