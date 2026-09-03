'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
}

export default function ImageUploader({
  currentImageUrl,
  onImageUploaded,
  label = '画像アップロード（Supabase Storage）',
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('画像ファイル（JPEG, PNG, WebPなど）を選択してください。');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'アップロードに失敗しました。');
      }

      setPreviewUrl(data.url);
      setUploadedFileName(data.fileName);
      onImageUploaded(data.url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setUploadError(err.message);
      } else {
        setUploadError('アップロードエラーが発生しました。');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl(undefined);
    setUploadedFileName(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700">{label}</label>

      {/* Preview Box */}
      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
          <div className="relative h-48 sm:h-56 w-full">
            <Image
              src={previewUrl}
              alt="プレビュー画像"
              fill
              className="object-cover"
              unoptimized={previewUrl.startsWith('data:')}
            />
          </div>

          <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium truncate max-w-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{uploadedFileName || '画像設定済み'}</span>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>削除・変更</span>
            </button>
          </div>
        </div>
      ) : (
        /* Upload Drag & Drop Area */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/70 hover:bg-amber-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-amber-600 group-hover:scale-105 transition-all">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            {isUploading ? (
              <p className="text-xs font-bold text-amber-700 animate-pulse">
                Supabase Storageにアップロード中...
              </p>
            ) : (
              <>
                <p className="text-xs font-bold text-slate-700">
                  クリックまたはドラッグ＆ドロップで画像を選択
                </p>
                <p className="text-[11px] text-slate-400">
                  PNG, JPG, WebP（最大5MB / タイムスタンプ付与自動保存）
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
