import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import ToursClient from './ToursClient';

export const metadata: Metadata = constructMetadata({
  title: 'ツアープラン一覧・料金表【日本語ガイド専属プライベートツアー】',
  description:
    '【ベトナム日本語ガイド】安心の完全プライベート・日本語検定N1専属ガイド。ダナン・ホイアン1日ツアー、バーナーヒルズ、裏路地ローカルグルメからベトナム全土のオーダーメイドまで、ツアープラン一覧と日本語ガイド基本料金表。',
  canonical: '/tours',
});

export default function ToursPage() {
  return <ToursClient />;
}
