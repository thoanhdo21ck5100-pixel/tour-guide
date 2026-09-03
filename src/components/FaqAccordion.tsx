'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: '雨が降った場合、ツアーはどうなりますか？',
    answer:
      '少雨決行となります。ベトナムの雨はスコール（短時間の通り雨）が多く、カフェ等で少し雨宿りしながら柔軟にスケジュールを調整いたします。台風や危険な天候の場合は、前日または当日にご相談のうえ、日程変更または全額返金（キャンセル料無料）でご対応いたします。',
  },
  {
    question: 'ガイドやドライバーへのチップは必要ですか？',
    answer:
      'チップは一切不要です。当ツアーの料金にはガイド料および専用車代がすべて含まれた「明朗会計」となっております。現地で追加の心付けを心配することなく、心置きなくツアーをお楽しみください。',
  },
  {
    question: 'お支払い方法について教えてください（日本円・クレカ等）',
    answer:
      'ツアー当日に現金（ベトナムドン または 日本円）でのお支払いが可能です。また、事前のお振込みやクレジットカード決済をご希望の場合は、予約確定後にオンライン決済リンクを発行いたします。',
  },
  {
    question: 'パクチーや香草、辛いものが苦手ですが食事の調整はできますか？',
    answer:
      'もちろん可能です！事前に「香草抜き」「辛味別添え」などを専属ガイドがお店へ正確に伝えます。また、日本人の味覚に合った清潔で美味しいレストランを選定しておりますので、安心してお召し上がりいただけます。',
  },
  {
    question: '1人旅でもプライベートツアーに参加できますか？',
    answer:
      'はい、お一人様でのご参加も大歓迎です！専用車とガイドを独り占めできるため、ご自身の興味に合わせた自由なペースで安全に観光していただけます。1名様参加時の特別料金をお見積もりいたしますので、お気軽にお問い合わせください。',
  },
  {
    question: '予約後のキャンセル規定はどうなっていますか？',
    answer:
      'ご参加日の3日前までキャンセル料は【無料】です。急なフライト変更や体調不良等の場合でも、LINEでご連絡いただければ日程の振替など柔軟に対応いたします。（2日前〜前日：ツアー代金の50%、当日：100%）',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="border border-slate-200/90 rounded-2xl bg-white overflow-hidden transition-all shadow-xs"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black shrink-0">
                  Q
                </span>
                <span className="text-sm sm:text-base font-bold text-[#0B2545]">
                  {faq.question}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-amber-600' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40 flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  A
                </span>
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
