import { Award, Users, DollarSign, MessageCircleHeart } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: Award,
      title: 'ダナン出身・JLPT N1',
      subtitle: '自然な日本語で安心コミュニケーション',
      description: 'ダナン生まれ・ダナン育ちならではの現地知識と、日本語能力試験N1の安心対応。言葉の心配なく旅を満喫いただけます。',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      icon: Users,
      title: '日本人のお客様対応 2年',
      subtitle: '日系企業との業務経験・日本基準の気配り',
      description: '日本人のお客様対応や日系企業との折衝業務を2年間経験。時間厳守と丁寧なやり取りを何よりも大切にしています。',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      icon: DollarSign,
      title: '1日1組限定・専用車手配',
      subtitle: '完全貸切・マイペースな旅',
      description: '他の方との相乗りは一切なし。ご参加人数・行き先に合わせてエアコン完備の快適な専用車を手配します。',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      icon: MessageCircleHeart,
      title: 'LINEで気軽に無料相談',
      subtitle: '旅程の相談・ご質問いつでも歓迎',
      description: '旅程の組み方からおすすめ店、天候まで何でも日本語で相談OK。ご納得いただくまで予約は確定しません。',
      color: 'text-emerald-700 bg-emerald-50/80 border-emerald-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div
            key={index}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${badge.color} group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-600 block">
                  {badge.subtitle}
                </span>
                <h3 className="text-sm font-bold text-[#0B2545] tracking-tight">
                  {badge.title}
                </h3>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              {badge.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
