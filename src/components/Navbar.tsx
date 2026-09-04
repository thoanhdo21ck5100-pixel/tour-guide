'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, MessageCircle, Calendar, ShieldCheck } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import { SITE_CONFIG } from '@/lib/seo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Notification Bar for Trust */}
      <div className="bg-[#0B2545] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1 text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            ベトナム政府公認ガイド
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span>1日1組限定の完全貸切プライベートツアー</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-emerald-300 font-medium">LINEで事前相談いつでも無料受付中</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src="/images/logo-emblem.png"
              alt="ダナン日本語ガイド"
              width={44}
              height={44}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-base sm:text-lg font-bold text-[#0B2545] tracking-tight leading-tight group-hover:text-[#133E68] transition-colors">
              ダナン日本語ガイド
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-amber-600 tracking-wider leading-tight">
              プライベートツアー
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            ホーム
          </Link>
          <Link href="/tours" className="hover:text-amber-600 transition-colors">
            ツアー一覧
          </Link>
          <Link href="/blog" className="hover:text-amber-600 transition-colors">
            現地ブログ
          </Link>
          <Link href="/#guide" className="hover:text-amber-600 transition-colors">
            ガイド紹介
          </Link>
          <Link href="/#faq" className="hover:text-amber-600 transition-colors">
            よくある質問
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href={SITE_CONFIG.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#06c755] bg-emerald-50 border border-emerald-200 rounded-full hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#06c755]" />
            <span>LINE相談</span>
          </a>
          <a
            href={SITE_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-pink-600 bg-pink-50 border border-pink-200 rounded-full hover:bg-pink-100 transition-colors"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
            <span>Instagram</span>
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-full hover:from-amber-600 hover:to-amber-700 shadow-sm hover:shadow transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>空き状況・予約</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-[#0B2545] rounded-lg focus:outline-hidden"
          aria-label="メニューを開く"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4 text-base font-medium text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100 hover:text-amber-600"
            >
              ホーム
            </Link>
            <Link
              href="/tours"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100 hover:text-amber-600"
            >
              ツアー一覧・料金
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100 hover:text-amber-600"
            >
              現地お役立ちブログ
            </Link>
            <Link
              href="/#guide"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100 hover:text-amber-600"
            >
              ガイド紹介（専属アン トー）
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100 hover:text-amber-600"
            >
              よくある質問（FAQ）
            </Link>
            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href={SITE_CONFIG.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#06c755] text-white rounded-xl font-bold text-sm shadow-sm"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                LINEで無料相談する
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white rounded-xl font-bold text-sm shadow-sm"
              >
                <InstagramIcon className="w-5 h-5 text-white" />
                Instagram DMで相談する
              </a>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#0B2545] text-white rounded-xl font-bold text-sm shadow-sm"
              >
                <Calendar className="w-5 h-5 text-amber-400" />
                空き状況の確認・予約フォームへ
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
