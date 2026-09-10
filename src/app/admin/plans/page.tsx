import { getAllCustomTourPlansAdmin } from '@/lib/supabase';
import TourPlansManagerClient from '@/components/admin/TourPlansManagerClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminTourPlansPage() {
  const plans = await getAllCustomTourPlansAdmin();
  return <TourPlansManagerClient initialPlans={plans} />;
}
