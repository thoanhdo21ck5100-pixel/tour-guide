import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'ファイルがアップロードされていません。' }, { status: 400 });
    }

    // Check size limit (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'ファイルサイズは5MB以下にしてください。' }, { status: 400 });
    }

    // Enforce unique timestamp-based file naming convention
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueFileName = `${Date.now()}-${sanitizedOriginalName}`;
    const contentType = file.type || 'image/jpeg';
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Try uploading to Supabase Storage bucket 'guide-assets' if connected
    if (supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('guide-assets')
          .upload(uniqueFileName, buffer, {
            contentType,
            upsert: false,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('guide-assets')
            .getPublicUrl(uniqueFileName);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            fileName: uniqueFileName,
            storage: 'supabase',
          });
        } else {
          console.warn('Supabase storage upload returned error, falling back:', error);
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload threw exception, falling back:', storageErr);
      }
    }

    // 2. Offline / Local Fallback: Convert to Base64 Data URL so local testing works immediately
    const base64String = buffer.toString('base64');
    const dataUrl = `data:${contentType};base64,${base64String}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: uniqueFileName,
      storage: 'fallback_data_url',
      note: 'Supabase Storage未接続のため、ローカルプレビュー用Data URLを生成しました。',
    });
  } catch (error) {
    console.error('File upload handler error:', error);
    return NextResponse.json({ error: '画像のアップロード中にエラーが発生しました。' }, { status: 500 });
  }
}
