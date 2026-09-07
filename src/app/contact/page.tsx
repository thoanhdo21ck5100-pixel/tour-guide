import { Suspense } from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import ContactClient from './ContactClient';

export const metadata: Metadata = constructMetadata({
  title: '空き状況・無料相談・お問い合わせ | ベトナム日本語ガイド',
  description:
    '【1日1組限定】ダナン・ホイアン中心の日本語プライベートツアー。空き状況の確認、旅程のご相談、お見積りフォーム。LINEでの事前無料相談も随時受付中。安心の日本語対応（JLPT N1）。',
  canonical: '/contact',
});

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-20 text-center text-xs text-slate-500">
          予約カレンダーを読み込み中...
        </div>
      }
    >
      <ContactClient />
    </Suspense>
  );
}
