import { ChevronDown } from 'lucide-react';
import { FAQS_DATA } from '@/lib/data/faqs';

export default function FaqAccordion() {
  return (
    <div className="space-y-3">
      {FAQS_DATA.map((faq, idx) => (
        <details
          key={idx}
          open={idx === 0}
          className="group border border-slate-200/90 rounded-2xl bg-white overflow-hidden transition-all shadow-xs"
        >
          <summary className="w-full p-3.5 sm:p-5 text-left flex items-start justify-between gap-3 sm:gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                Q
              </span>
              <span className="text-xs sm:text-base font-bold text-[#0B2545] leading-snug break-words">
                {faq.question}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform duration-200 group-open:rotate-180 group-open:text-amber-600" />
          </summary>

          <div className="px-3.5 sm:px-5 pb-4 sm:pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40 flex items-start gap-2.5 sm:gap-3">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
              A
            </span>
            <p className="whitespace-pre-line break-words">{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
