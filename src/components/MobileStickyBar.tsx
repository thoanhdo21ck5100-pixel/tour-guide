'use client';

import Link from 'next/link';
import { MessageCircle, Calendar } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import { SITE_CONFIG } from '@/lib/seo';

export default function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-2 px-2.5">
      <div className="grid grid-cols-3 gap-1.5">
        <a
          href={SITE_CONFIG.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 py-2.5 px-1.5 rounded-xl bg-[#06c755] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-transform"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white" />
          <span>LINE相談</span>
        </a>

        <a
          href={SITE_CONFIG.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 py-2.5 px-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white text-[11px] font-bold shadow-xs active:scale-95 transition-transform"
        >
          <InstagramIcon className="w-3.5 h-3.5 text-white" />
          <span>Instagram</span>
        </a>

        <Link
          href="/contact"
          className="flex items-center justify-center gap-1 py-2.5 px-1.5 rounded-xl bg-[#0B2545] text-white text-[11px] font-bold shadow-xs active:scale-95 transition-transform"
        >
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>空き・予約</span>
        </Link>
      </div>
    </div>
  );
}
