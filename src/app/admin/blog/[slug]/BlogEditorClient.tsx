'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlogPost } from '@/types';
import ImageUploader from '@/components/admin/ImageUploader';
import Toast from '@/components/admin/Toast';
import { ArrowLeft, Save, Loader2, Trash2, Plus, X } from 'lucide-react';
import { TOURS_DATA } from '@/lib/data/tours';

interface BlogEditorClientProps {
  initialPost?: BlogPost | null;
  isNew?: boolean;
}

export default function BlogEditorClient({ initialPost, isNew }: BlogEditorClientProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    slug: initialPost?.slug || '',
    title: initialPost?.title || '',
    excerpt: initialPost?.excerpt || '',
    category: initialPost?.category || '観光・写真映え',
    tags: initialPost?.tags || ['ダナン観光', 'ローカル情報'],
    coverImage: initialPost?.coverImage || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    publishedAt: initialPost?.publishedAt || new Date().toISOString().split('T')[0],
    readingTime: initialPost?.readingTime || '5分で読める',
    featured: initialPost?.featured ?? false,
    author: initialPost?.author || {
      name: 'アン トー (Anh Tho)',
      role: '神戸経済大学卒 / 日本語能力試験N1',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    content: initialPost?.content || {
      intro: 'ダナン・ホイアン旅行で絶対に知っておきたいポイントを現地ガイドが徹底解説します。',
      sections: [
        {
          heading: '1. おすすめの見どころとポイント',
          body: '混雑を避ける時間帯や、現地での注意点を把握しておくことで快適に楽しめます。',
          tips: ['日中の直射日光対策に帽子や日傘をご用意ください。'],
        },
      ],
      conclusion: '不安な点があれば、いつでもお気軽に公式LINEでお問い合わせください！',
    },
    relatedTourSlug: initialPost?.relatedTourSlug || 'danang-hoian-classic-day-trip',
  });

  const [newTagInput, setNewTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const currentTags = formData.tags || [];
    if (!currentTags.includes(newTagInput.trim())) {
      setFormData({ ...formData, tags: [...currentTags, newTagInput.trim()] });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((t) => t !== tagToRemove),
    });
  };

  const handleAddSection = () => {
    const currentSections = formData.content?.sections || [];
    setFormData({
      ...formData,
      content: {
        intro: formData.content?.intro || '',
        conclusion: formData.content?.conclusion || '',
        sections: [
          ...currentSections,
          {
            heading: `${currentSections.length + 1}. 新しい見出し`,
            body: 'ここに詳しい解説や体験談を記述します。',
            tips: ['現地でのアドバイス'],
          },
        ],
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '記事の保存に失敗しました。');
      }

      setToastMessage('ブログ記事を正常に保存しました！');
      setTimeout(() => {
        router.push('/admin/blog');
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
    if (!confirm(`記事「${formData.title}」を本当に削除しますか？`)) return;

    try {
      const res = await fetch(`/api/admin/blog?slug=${formData.slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/blog');
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
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0B2545] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ブログ一覧へ戻る</span>
        </Link>

        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>この記事を削除</span>
          </button>
        )}
      </div>

      {/* Title */}
      <div>
        <span className="text-xs font-bold text-amber-600 block">BLOG ARTICLE EDITOR</span>
        <h1 className="text-xl sm:text-2xl font-black text-[#0B2545]">
          {isNew ? '新しいSEOブログ記事を執筆' : `ブログ記事編集: ${initialPost?.title}`}
        </h1>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {/* Slug & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              スラグ (URL識別子) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              disabled={!isNew}
              placeholder="danang-cafe-guide-2026"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              例: hoian-lantern-festival（小文字英数字とハイフン）
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              カテゴリー <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="例: 交通・移動 / 観光・写真映え / グルメ / モデルコース"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            記事タイトル <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="例: 【2026年最新】ダナン空港から市内ホテルへの移動ガイド！Grab乗り方完全解説"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            記事の抜粋 (一覧カード表示用) <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            required
            placeholder="初めてのダナン空港到着でも安心！Grab乗り場と注意点を..."
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Cover Image connected to Supabase Storage */}
        <div className="pt-2">
          <ImageUploader
            label="アイキャッチ画像（Supabase Storage: guide-assets）"
            currentImageUrl={formData.coverImage}
            onImageUploaded={(url) => setFormData({ ...formData, coverImage: url })}
          />
        </div>

        {/* Reading Time & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">公開日</label>
            <input
              type="date"
              required
              value={formData.publishedAt}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">読了目安時間</label>
            <input
              type="text"
              required
              placeholder="例: 5分で読める"
              value={formData.readingTime}
              onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">タグ</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(formData.tags || []).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg flex items-center gap-1 font-medium"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="新しいタグを入力してEnterまたは追加"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              追加
            </button>
          </div>
        </div>

        {/* Article Content Intro */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            導入文 (リード文) <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={formData.content?.intro || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                content: {
                  intro: e.target.value,
                  sections: formData.content?.sections || [],
                  conclusion: formData.content?.conclusion || '',
                },
              })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">本文セクション</label>
            <button
              type="button"
              onClick={handleAddSection}
              className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>セクションを追加</span>
            </button>
          </div>

          {(formData.content?.sections || []).map((sec, sIdx) => (
            <div key={sIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B2545]">セクション {sIdx + 1}</span>
                {(formData.content?.sections || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (formData.content?.sections || []).filter((_, idx) => idx !== sIdx);
                      setFormData({
                        ...formData,
                        content: {
                          intro: formData.content?.intro || '',
                          conclusion: formData.content?.conclusion || '',
                          sections: updated,
                        },
                      });
                    }}
                    className="text-xs text-rose-500 hover:text-rose-700"
                  >
                    削除
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="見出し (例: 1. トゥボン川の灯籠流しと小舟遊覧の適正相場)"
                value={sec.heading}
                onChange={(e) => {
                  const updated = [...(formData.content?.sections || [])];
                  updated[sIdx].heading = e.target.value;
                  setFormData({
                    ...formData,
                    content: {
                      intro: formData.content?.intro || '',
                      conclusion: formData.content?.conclusion || '',
                      sections: updated,
                    },
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold bg-white"
              />

              <textarea
                rows={3}
                placeholder="本文..."
                value={sec.body}
                onChange={(e) => {
                  const updated = [...(formData.content?.sections || [])];
                  updated[sIdx].body = e.target.value;
                  setFormData({
                    ...formData,
                    content: {
                      intro: formData.content?.intro || '',
                      conclusion: formData.content?.conclusion || '',
                      sections: updated,
                    },
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
              />
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            まとめ (結論) <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            required
            value={formData.content?.conclusion || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                content: {
                  intro: formData.content?.intro || '',
                  sections: formData.content?.sections || [],
                  conclusion: e.target.value,
                },
              })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Related Tour Slug */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            記事末尾におすすめする関連ツアー
          </label>
          <select
            value={formData.relatedTourSlug || ''}
            onChange={(e) => setFormData({ ...formData, relatedTourSlug: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
          >
            <option value="">なし</option>
            {TOURS_DATA.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
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
                <span>ブログ記事を保存する</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
