import { getAllBlogs } from '@/lib/supabase';
import BlogEditorClient from './BlogEditorClient';

export default async function AdminBlogEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isNew = slug === 'new';

  let initialPost = null;
  if (!isNew) {
    const blogs = await getAllBlogs();
    initialPost = blogs.find((b) => b.slug === slug) || null;
  }

  return <BlogEditorClient initialPost={initialPost} isNew={isNew} />;
}
