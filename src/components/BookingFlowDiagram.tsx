import React from 'react';
import {
  Compass,
  CalendarDays,
  Send,
  UserCheck,
  MessageCircle,
  CheckCircle2,
  Plane,
  Coins,
  Smile,
} from 'lucide-react';

interface BookingFlowDiagramProps {
  className?: string;
  showTitle?: boolean;
}

export default function BookingFlowDiagram({
  className = '',
  showTitle = true,
}: BookingFlowDiagramProps) {
  const steps = [
    {
      num: '01',
      title: 'PLANを選ぶ',
      desc: 'ご希望に合ったツアープランを選択',
      icon: Compass,
    },
    {
      num: '02',
      title: '希望日・人数を入力',
      desc: '日程・参加人数・ご要望を入力',
      icon: CalendarDays,
    },
    {
      num: '03',
      title: '予約フォームを送信',
      desc: '事前のお支払いは不要です',
      icon: Send,
    },
    {
      num: '04',
      title: 'アン トーが内容確認',
      desc: '空き状況やご希望内容をチェック',
      icon: UserCheck,
    },
    {
      num: '05',
      title: 'LINE / メールで確認',
      desc: '日程・集合場所・詳細のすり合わせ',
      icon: MessageCircle,
    },
    {
      num: '06',
      title: '予約確定',
      desc: 'スケジュール決定・手配完了',
      icon: CheckCircle2,
    },
    {
      num: '07',
      title: 'ベトナム到着',
      desc: 'ダナン・中部へようこそ！',
      icon: Plane,
    },
    {
      num: '08',
      title: '開始前に100%支払い',
      desc: '日本円（JPY）またはドン（VND）',
      icon: Coins,
    },
    {
      num: '09',
      title: 'ツアー開始',
      desc: '安心の専属プライベート観光へ',
      icon: Smile,
    },
  ];

  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs ${className}`}>
      {showTitle && (
        <div className="mb-6 text-center sm:text-left">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
            HOW IT WORKS
          </span>
          <h3 className="text-base sm:text-xl font-bold text-[#0B2545]">
            ご予約からツアー当日までの流れ
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            ご予約時の事前決済は不要です。旅程の調整やご質問もお気軽にどうぞ。
          </p>
        </div>
      )}

      {/* Steps Flow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isPayment = idx === 7;
          return (
            <div
              key={step.num}
              className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isPayment
                  ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isPayment
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white text-[#0B2545] border border-slate-200 shadow-xs'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isPayment
                      ? 'bg-amber-200 text-amber-900 font-bold'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  STEP {step.num}
                </span>
              </div>

              <div>
                <h4
                  className={`text-xs sm:text-sm font-bold ${
                    isPayment ? 'text-amber-950' : 'text-[#0B2545]'
                  }`}
                >
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note for Custom Tour */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div>
          <span className="font-bold text-slate-800">💡 オーダーメイド・アレンジをご希望の場合:</span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            予約フォームの「ご希望・ご質問」欄に「ホイアンでランタンを見たい」「ゆっくりした日程にしたい」などご自由にご記入ください。LINEでも直接ご相談いただけます。
          </p>
        </div>
      </div>
    </div>
  );
}
