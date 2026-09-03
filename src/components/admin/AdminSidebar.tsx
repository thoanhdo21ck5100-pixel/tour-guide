'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Calendar,
  Compass,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'ダッシュボード', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'カレンダー空き管理', href: '/admin/calendar', icon: Calendar },
    { label: 'ツアープラン CMS', href: '/admin/tours', icon: Compass },
    { label: '現地ブログ CMS', href: '/admin/blog', icon: FileText },
    { label: '予約リクエスト', href: '/admin/bookings', icon: Inbox },
  ];

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_session');
    }
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-[#07192E] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 min-h-screen">
      {/* Top Section */}
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 tracking-wider block">
              MANAGEMENT CONSOLE
            </span>
            <h2 className="text-sm font-bold text-white tracking-tight">
              ダナンガイド 管理画面
            </h2>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1.5 text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-500 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-800 space-y-3 text-xs">
        {/* View Live Site Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>一般サイトを開く</span>
          </span>
          <span className="text-[10px] text-slate-500">別タブ</span>
        </Link>

        {/* Guide Credentials & Logout */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">専属ガイド (Anh Tho)</p>
              <p className="text-[10px] text-emerald-400">ログイン中</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
            title="ログアウト"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
