'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tour } from '@/types';
import ImageUploader from '@/components/admin/ImageUploader';
import Toast from '@/components/admin/Toast';
import { ArrowLeft, Save, Loader2, Trash2, Plus, Clock, MapPin } from 'lucide-react';

interface TourEditorClientProps {
  initialTour?: Tour | null;
  isNew?: boolean;
}

export default function TourEditorClient({ initialTour, isNew }: TourEditorClientProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<Tour>>({
    slug: initialTour?.slug || '',
    title: initialTour?.title || '',
    subtitle: initialTour?.subtitle || '',
    category: initialTour?.category || 'classic',
    categoryLabel: initialTour?.categoryLabel || '王道ハイライト',
    duration: initialTour?.duration || '約8時間',
    priceJpy: initialTour?.priceJpy || 12000,
    priceVnd: initialTour?.priceVnd || 2000000,
    priceNote: initialTour?.priceNote || '',
    heroImage: initialTour?.heroImage || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    badge: initialTour?.badge || '',
    isFeatured: initialTour?.isFeatured ?? true,
    shortDescription: initialTour?.shortDescription || '',
    fullDescription: initialTour?.fullDescription || '',
    highlights: initialTour?.highlights || ['完全貸切専用車＆日本語専属ガイド', 'ダナン市内ホテル往復送迎付き'],
    itinerary: initialTour?.itinerary || [
      { time: '09:00', title: 'ホテルお迎え', description: '専属車にてお迎えに上がります。' },
    ],
    included: initialTour?.included || ['専用車代', '日本語ガイド料', '入場料'],
    excluded: initialTour?.excluded || ['お食事時の追加飲料', '個人的諸費用'],
    meetingPlace: initialTour?.meetingPlace || 'お客様のご宿泊ホテルロビー',
    cancellationPolicy: initialTour?.cancellationPolicy || 'ご参加日の3日前までキャンセル無料。',
    recommendFor: initialTour?.recommendFor || ['初めてのダナン旅行の方', 'ご家族・カップル'],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '保存に失敗しました。');
      }

      setToastMessage('ツアープランを正常に保存しました！');
      setTimeout(() => {
        router.push('/admin/tours');
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('保存エラーが発生しました。');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.slug) return;
    if (!confirm(`ツアー「${formData.title}」を本当に削除しますか？`)) return;

    try {
      const res = await fetch(`/api/admin/tours?slug=${formData.slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/tours');
        router.refresh();
      }
    } catch (err) {
      alert('削除に失敗しました。');
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-4xl w-full mx-auto">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/tours"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0B2545] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ツアー一覧へ戻る</span>
        </Link>

        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>このツアーを削除</span>
          </button>
        )}
      </div>

      {/* Title */}
      <div>
        <span className="text-xs font-bold text-amber-600 block">TOUR EDITOR</span>
        <h1 className="text-xl sm:text-2xl font-black text-[#0B2545]">
          {isNew ? '新規ツアープランの作成' : `ツアープラン編集: ${initialTour?.title}`}
        </h1>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              スラグ (URL識別子) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={!isNew}
              placeholder="danang-hoian-classic-day-trip"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              例: danang-half-day-custom（小文字英数字とハイフン）
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              カテゴリー <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                const val = e.target.value as Tour['category'];
                const labelMap: Record<string, string> = {
                  classic: '王道ハイライト',
                  women: '女子旅・ビューティー',
                  men: '男旅・アクティブ＆ナイト',
                  food: 'グルメ＆ローカル',
                  custom: '完全オーダーメイド',
                  family: 'ファミリー・癒やし',
                };
                setFormData({
                  ...formData,
                  category: val,
                  categoryLabel: labelMap[val] || '王道ハイライト',
                });
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
            >
              <option value="classic">王道ハイライト</option>
              <option value="women">女子旅・ビューティー</option>
              <option value="men">男旅・アクティブ＆ナイト</option>
              <option value="food">グルメ＆ローカル</option>
              <option value="custom">完全オーダーメイド</option>
              <option value="family">ファミリー・癒やし</option>
            </select>
          </div>
        </div>

        {/* Tour Title & Subtitle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            ツアータイトル <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="例: 【1番人気】ダナン＆世界遺産ホイアン満喫 1日完全プライベートツアー"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            サブタイトル <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="五行山から夕暮れのホイアン旧市街＆灯籠流しまで..."
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Pricing & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              日本円料金 (JPY) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              min={0}
              value={formData.priceJpy}
              onChange={(e) => setFormData({ ...formData, priceJpy: parseInt(e.target.value, 10) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ベトナムドン参考料金 (VND)
            </label>
            <input
              type="number"
              required
              min={0}
              value={formData.priceVnd}
              onChange={(e) => setFormData({ ...formData, priceVnd: parseInt(e.target.value, 10) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              所要時間 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="例: 約8〜9時間"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Hero Image Uploader connected to Supabase Storage */}
        <div className="pt-2">
          <ImageUploader
            label="ツアーメイン写真（Supabase Storage: guide-assets）"
            currentImageUrl={formData.heroImage}
            onImageUploaded={(url) => setFormData({ ...formData, heroImage: url })}
          />
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            短い説明 (カード表示用) <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            required
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            詳細説明 (ツアー詳細ページ用) <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            required
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>保存中...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>ツアープランを保存する</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
