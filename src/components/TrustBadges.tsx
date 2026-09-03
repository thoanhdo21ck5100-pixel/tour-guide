import { Award, Users, DollarSign, MessageCircleHeart } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: Award,
      title: '日本語能力試験N1専属',
      subtitle: '神戸経済大学 卒業',
      description: '日本留学経験と2年間の折衝・ガイド実績。丁寧な日本語と温かいおもてなしでご案内します。',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      icon: Users,
      title: '完全貸切プライベート',
      subtitle: '他のお客様との混乗ゼロ',
      description: 'ご家族・カップル・お友達だけの専用車ツアー。他人に気を使わず写真撮影や休憩も自由自在です。',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      icon: DollarSign,
      title: '明朗会計・チップ不要',
      subtitle: '現地での不当な追加請求なし',
      description: '車代・ガイド代・入場料を明確に提示。ガイドへのチップを気にする必要も一切ありません。',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      icon: MessageCircleHeart,
      title: 'LINE事前相談いつでも無料',
      subtitle: 'ご予約前のご質問大歓迎',
      description: '旅程の相談から天候の確認、おすすめの服装まで、日本人スタッフがLINEで丁寧にお答えします。',
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
