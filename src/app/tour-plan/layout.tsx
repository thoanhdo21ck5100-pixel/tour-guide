import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '個人ツアープラン・記念写真照会 | ベトナム日本語ガイド',
  description:
    '確定した旅程スケジュール、お迎え時間、および専属ガイドが撮影したツアー写真をご確認いただけます。',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function TourPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
