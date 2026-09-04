'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

import { FAQS_DATA } from '@/lib/data/faqs';

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3">
      {FAQS_DATA.map((faq, idx) => {
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
