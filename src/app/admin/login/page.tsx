'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Lock, Mail, Loader2, AlertCircle, ShieldCheck, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. If Supabase is connected, attempt authenticating via Supabase Auth
      if (supabase) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!authError) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('admin_session', JSON.stringify({ email, timestamp: Date.now() }));
          }
          router.push('/admin');
          return;
        }

        // If Supabase auth failed, check if it's the offline demo account
        if (email !== 'admin@danang-guide.com' || password !== 'DanangGuide2026!') {
          throw new Error(authError.message || 'メールアドレスまたはパスワードが正しくありません。');
        }
      }

      // 2. Offline / Demo Fallback Account for Testing
      if (email === 'admin@danang-guide.com' && password === 'DanangGuide2026!') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_session', JSON.stringify({ email, timestamp: Date.now() }));
        }
        router.push('/admin');
        return;
      }

      throw new Error('メールアドレスまたはパスワードが正しくありません。');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('ログイン中に予期せぬエラーが発生しました。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@danang-guide.com');
    setPassword('DanangGuide2026!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07192E] via-[#0B2545] to-[#133E68] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white mx-auto shadow-md mb-3">
            <Compass className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold text-amber-600 tracking-wider uppercase block">
            ADMINISTRATOR PORTAL
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B2545]">
            ダナンガイド 管理者ログイン
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            空き状況カレンダー更新・ツアープラン＆ブログ編集
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              メールアドレス
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="admin@danang-guide.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              パスワード
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#0B2545] hover:bg-[#133E68] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>認証中...</span>
              </>
            ) : (
              <span>ログイン</span>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick-Fill Hint */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>テスト用デモ認証情報</span>
            </div>
            <p className="text-[11px] text-amber-800">
              ID: <code className="bg-amber-100 px-1 py-0.5 rounded">admin@danang-guide.com</code>
              <br />
              PW: <code className="bg-amber-100 px-1 py-0.5 rounded">DanangGuide2026!</code>
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="mt-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
            >
              ➔ ワンクリックでデモ情報を入力
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
