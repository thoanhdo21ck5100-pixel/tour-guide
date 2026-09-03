import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import ToursClient from './ToursClient';

export const metadata: Metadata = constructMetadata({
  title: 'ツアープラン一覧・料金表 | ダナン・ホイアン完全貸切プライベートツアー',
  description:
    '【ダナン プライベートツアー】安心の完全貸切・日本語公認ガイド専属。五行山・世界遺産ホイアン1日ツアー、バーナーヒルズ神の手、裏路地ローカルグルメまで、日本人旅行者向けツアープラン一覧と明朗会計の料金表。',
  canonical: '/tours',
});

export default function ToursPage() {
  return <ToursClient />;
}
