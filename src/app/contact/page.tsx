import { Suspense } from 'react';
import { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import ContactClient from './ContactClient';

export const metadata: Metadata = constructMetadata({
  title: '空き状況カレンダー＆仮予約・お問い合わせ | ベトナム日本語ガイド',
  description:
    '【1日1組限定】ベトナム全土対応プライベートツアー（ダナン・ホイアン・ハノイ・ホーチミン等）の空き状況カレンダーと仮予約お申し込みフォーム。LINEでの事前無料相談も随時受付中。安心の日本語対応＆キャンセル無料。',
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
