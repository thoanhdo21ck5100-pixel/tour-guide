'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // If we're already on the login page, bypass check
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const checkAuth = async () => {
      // 1. Check Supabase auth session if configured
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsAuthenticated(true);
          return;
        }
      }

      // 2. Check local fallback session
      if (typeof window !== 'undefined') {
        const localSession = localStorage.getItem('admin_session');
        if (localSession) {
          try {
            const parsed = JSON.parse(localSession);
            if (parsed && parsed.email) {
              setIsAuthenticated(true);
              return;
            }
          } catch {
            localStorage.removeItem('admin_session');
          }
        }
      }

      // Not authenticated -> redirect to login
      setIsAuthenticated(false);
      router.push('/admin/login');
    };

    checkAuth();
  }, [pathname, router]);

  // If on login page, render children directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading spinner while verifying auth guard
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
        <span>管理者権限を確認中...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans text-slate-800">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto min-h-screen flex flex-col">
        {children}
      </main>
    </div>
  );
}
