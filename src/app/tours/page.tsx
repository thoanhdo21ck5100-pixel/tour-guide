import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import ToursClient from './ToursClient';

export const metadata: Metadata = constructMetadata({
  title: 'ツアープラン一覧・料金表 | ベトナム日本語ガイド【完全貸切プライベートツアー】',
  description:
    '【ベトナム日本語ガイド】安心の完全貸切・日本語公認ガイド専属。ダナン・ホイアン1日ツアー、バーナーヒルズ、裏路地ローカルグルメからベトナム全土のオーダーメイドまで、日本人旅行者向けツアープラン一覧と明朗会計の料金表。',
  canonical: '/tours',
});

export default function ToursPage() {
  return <ToursClient />;
}
