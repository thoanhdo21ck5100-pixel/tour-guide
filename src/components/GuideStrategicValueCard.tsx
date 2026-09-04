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
      id: 'food',
      icon: UtensilsCrossed,
      tag: '食の安全・ぼったくり回避',
      title: '地元民が通う名店選び＆胃腸に優しい衛生管理',
      shortDesc: '観光客向け割高店を避け、日本人のデリケートな胃腸にも安心な清潔店へ',
      problem:
        'SNSやネット検索で見つかる店は「観光客向けで価格が高すぎる」「氷や水、調理環境の衛生面が不安」という落とし穴が少なくありません。',
      solution:
        '日本の大学を卒業し清潔基準を熟知した専属ガイドが、氷の品質や油、調理器具の清潔さを確認済みの「地元民が本当に愛する名店」へ直行。注文時の「氷なし」「香草別添え」などの細かなリクエストもベトナム語で完全代行します。',
      guideQuestion:
        '『観光客向けではなく、地元の人が本当に通っていて衛生面も安心できる名店はどこ？』',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      iconColor: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'weather',
      icon: CloudRain,
      tag: '天候・混雑の神対応',
      title: '突発的な雨や混雑でも気分を落とさない臨機応変なルート切替',
      shortDesc: 'バーナーヒルズの濃霧やホイアンの過密も、即座に最適な屋内プランへ',
      problem:
        '「バーナーヒルズに着いたら濃霧で神の手が見えない」「ホイアンの通りが人で埋め尽くされて歩けない」など、個人旅行では天候や混雑のトラブルで旅程が崩れがちです。',
      solution:
        'ネットの口コミはリアルタイムの雲の動きや混雑度を解決できません。専属ガイドがいれば「霧なら古城ワインセラーや屋内テーマパークへ」「雨のホイアンなら情緒ある屋根付きカフェや極上スパへ」と、その場でベストな屋内プランへ瞬時に切り替えられます。',
      guideQuestion:
        '『今日のような天候（混雑）の時は、どの屋内スポットや穴場カフェに変更すれば楽しめますか？』',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      iconColor: 'text-sky-600 bg-sky-50',
    },
    {
      id: 'shopping',
      icon: Scissors,
      tag: '買い物・仕立ての適正価格',
      title: 'ホイアンのオーダーメイド＆お土産で損しない老舗工房直行',
      shortDesc: '表通りの高い中間マージンや粗悪品を回避し、本物の天然シルクを地元価格で',
      problem:
        'ホイアンの仕立て服や市場のお土産は、観光客だけで入ると「化繊混じりを本物シルクと偽られる」「中間マージンが上乗せされた観光客価格を請求される」リスクがあります。',
      solution:
        '長年の信頼関係を持つ専属ガイドが同行することで、観光客価格ではなく「地元適正価格」で本物の高品質シルクやリネンを選定。仕上がった洋服のホテルお届けまで確実にサポートします。',
      guideQuestion:
        '『適正な地元価格で、本物の天然シルクを仕立ててくれる信頼できる老舗工房はどこ？』',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      iconColor: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'omotenashi',
      icon: Sparkles,
      tag: 'AI/Google検索との決定打',
      title: '日本の大学卒・JLPT N1が誇る「おもてなしの心（Omotenashi）」',
      shortDesc: '言葉の通訳を超え、日本人の習慣・美意識・心地よい気配りを深く理解',
      problem:
        'Google検索や生成AIは一般的な知識を教えてくれますが、旅の現場で「いま疲れていないか」「体調に合わせた室温調整」「心地よい歩行ペース」といった心情に寄り添うことはできません。',
      solution:
        '神戸経済大学を卒業し日本語能力試験N1を取得したガイドだからこそ、日本基準の清潔感・時間厳守・以心伝心の気配りを徹底。移動や交渉のストレスをすべて取り除き、旅の「楽しい時間」だけに100%浸っていただけます。',
      guideQuestion:
        '『（事前にLINEで）私たちの好みに合わせて、無理のない理想のタイムスケジュールを組んでくれますか？』',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      iconColor: 'text-emerald-600 bg-emerald-50',
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
              ? '現地プロ直伝・戦略的旅の知恵袋'
              : '専属ガイドだから約束できる安心基準'}
          </span>
        </div>
        <h3 className="text-lg sm:text-2xl font-black text-[#0B2545] tracking-tight">
          ネット検索やAIには真似できない「専属日本語ガイドの4大価値」
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          「自力で回る旅」と「専属プライベートガイドを付ける旅」の決定的な違い。
          旅先でそのまま使える「プロへの質問フレーズ」とともに、安心のおもてなし基準を公開します。
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
              <span>個人旅行・ネット検索だけの落とし穴:</span>
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
            ※このような質問を投げていただければ、ガイドがご予算や好みに合わせて最高のご提案をいたします。
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
            日系大学卒の専属ガイドが、日本語で親身にお答えします（相談無料・キャンセル規定明記）
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
