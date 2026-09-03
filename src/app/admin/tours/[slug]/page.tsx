import { getAllTours } from '@/lib/supabase';
import TourEditorClient from './TourEditorClient';

export default async function AdminTourEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isNew = slug === 'new';

  let initialTour = null;
  if (!isNew) {
    const tours = await getAllTours();
    initialTour = tours.find((t) => t.slug === slug) || null;
  }

  return <TourEditorClient initialTour={initialTour} isNew={isNew} />;
}
