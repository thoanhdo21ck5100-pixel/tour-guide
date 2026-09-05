import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAllBlogs, upsertBlog, deleteBlog } from '@/lib/supabase';
import { BlogPost } from '@/types';

const BlogSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'スラグは小文字英数字とハイフンのみで入力してください。'),
  title: z.string().min(3, '記事タイトルを入力してください。'),
  excerpt: z.string().min(10, '記事の抜粋を入力してください。'),
  category: z.string().min(1, 'カテゴリーを入力してください。'),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().min(1, 'アイキャッチ画像URLを指定してください。'),
  publishedAt: z.string().min(1),
  readingTime: z.string().default('5分で読める'),
  featured: z.boolean().default(false),
  author: z.object({
    name: z.string().default('アン トー (Anh Tho)'),
    role: z.string().default('ダナン出身 / 日本語能力試験N1'),
    avatar: z.string().default('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
  }),
  content: z.object({
    intro: z.string().min(10, '導入文を入力してください。'),
    sections: z.array(
      z.object({
        heading: z.string().min(1),
        body: z.string().min(1),
        tips: z.array(z.string()).optional(),
      })
    ).min(1, '少なくとも1つの見出し・本文セクションを入力してください。'),
    conclusion: z.string().min(1, 'まとめ文を入力してください。'),
  }),
  relatedTourSlug: z.string().optional(),
});

export async function GET() {
  try {
    const blogs = await getAllBlogs();
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return NextResponse.json({ error: 'ブログ記事の取得に失敗しました。' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parseResult = BlogSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'バリデーションエラーが発生しました。' },
        { status: 400 }
      );
    }

    const savedBlog = await upsertBlog(parseResult.data as BlogPost, 'admin_user');
    return NextResponse.json({ success: true, blog: savedBlog });
  } catch (error) {
    console.error('Failed to save blog:', error);
    return NextResponse.json({ error: 'ブログ記事の保存に失敗しました。' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: '削除対象のスラグを指定してください。' }, { status: 400 });
    }

    await deleteBlog(slug);
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return NextResponse.json({ error: 'ブログ記事の削除に失敗しました。' }, { status: 500 });
  }
}
