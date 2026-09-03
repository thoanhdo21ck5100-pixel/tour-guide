'use client';

import Link from 'next/link';
import { MessageCircle, Calendar } from 'lucide-react';

export default function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-2.5 px-3">
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/contact#line-consultation"
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#06c755] text-white text-xs font-bold shadow-xs active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>LINE無料相談</span>
        </Link>
        <Link
          href="/contact"
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0B2545] text-white text-xs font-bold shadow-xs active:scale-95 transition-transform"
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>空き状況・予約</span>
        </Link>
      </div>
    </div>
  );
}
