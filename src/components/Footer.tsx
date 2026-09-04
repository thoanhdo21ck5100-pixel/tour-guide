import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import { SITE_CONFIG } from '@/lib/seo';

export default function Footer() {
  return (
    <footer className="bg-[#07192E] text-slate-300 pt-16 pb-28 sm:pb-16 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Guide Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0 rounded-full bg-white/5 p-1 border border-white/10 shadow-md">
                <Image
                  src="/images/logo-emblem.png"
                  alt="ANH THO TOUR GUIDE"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wider">ANH THO</h3>
                <p className="text-xs text-amber-400 font-semibold tracking-wider">ダナン日本語ガイド</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              神戸経済大学卒・日本語能力試験N1保持の専属ガイド「アン トー (Anh Tho)」による完全貸切のプライベートツアー。安心・安全・おもてなしの心で、一生の思い出に残るダナン・ホイアンの旅をお届けします。
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>神戸経済大学 経済学部 卒業</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>日本語能力試験（JLPT）N1取得</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>日本人向けガイド・折衝経験 2年（完全貸切・明朗会計）</span>
              </div>
            </div>
          </div>

          {/* Tours Links */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider mb-4 border-l-2 border-amber-500 pl-2.5">
              おすすめツアー
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/tours/danang-hoian-classic-day-trip" className="hover:text-amber-400 transition-colors">
                  ダナン＆ホイアン満喫 1日ツアー
                </Link>
              </li>
              <li>
                <Link href="/tours/bana-hills-golden-bridge-vip" className="hover:text-amber-400 transition-colors">
                  バーナーヒルズ＆神の手 絶景ツアー
                </Link>
              </li>
              <li>
                <Link href="/tours/danang-local-food-night-walk" className="hover:text-amber-400 transition-colors">
                  裏路地ローカルグルメ＆夜景ツアー
                </Link>
              </li>
              <li>
                <Link href="/tours/custom-order-made-central-vietnam" className="hover:text-amber-400 transition-colors">
                  完全オーダーメイド・チャーター
                </Link>
              </li>
              <li>
                <Link href="/tours/family-resort-relax-danang" className="hover:text-amber-400 transition-colors">
                  ファミリー＆シニア安心の癒やし旅
                </Link>
              </li>
            </ul>
          </div>

          {/* Local Guides & SEO Articles */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider mb-4 border-l-2 border-amber-500 pl-2.5">
              ダナン現地お役立ち情報
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/blog/danang-airport-grab-transport-guide" className="hover:text-amber-400 transition-colors">
                  空港から市内への移動＆Grab乗り方
                </Link>
              </li>
              <li>
                <Link href="/blog/hoian-lantern-night-market-guide" className="hover:text-amber-400 transition-colors">
                  ホイアン夜市＆灯籠流し完全攻略
                </Link>
              </li>
              <li>
                <Link href="/blog/danang-girls-trip-model-course" className="hover:text-amber-400 transition-colors">
                  ダナン女子旅2泊3日おすすめモデルコース
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-amber-400 transition-colors">
                  よくある質問（チップ・天候・支払い）
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  ガイド空き状況カレンダー
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & LINE Inquiry */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider mb-4 border-l-2 border-amber-500 pl-2.5">
              お問い合わせ・無料相談
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              旅程のご相談、お見積り、お日にちの空き確認など、日本語でお気軽にご連絡ください。
            </p>
            <div className="space-y-3 text-xs">
              <a
                href={SITE_CONFIG.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#06c755]/15 border border-[#06c755]/30 text-emerald-300 hover:bg-[#06c755]/25 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#06c755] shrink-0" />
                <span>公式LINEで即時相談 (ID: {SITE_CONFIG.lineId})</span>
              </a>
              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-300 hover:bg-pink-500/25 transition-all"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Instagram DM（@{SITE_CONFIG.instagramHandle}）</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:thoanhdo21ck5100@gmail.com" className="hover:text-white transition-colors">
                  thoanhdo21ck5100@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+84968781121" className="hover:text-white transition-colors font-mono">
                  +84 968 781 121 (ベトナム現地)
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Da Nang City & Hoi An, Vietnam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} ダナン プライベートツアー コンシェルジュ. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>プライバシーポリシー</span>
            <span>特定商取引法に基づく表記</span>
            <span>キャンセルポリシー</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
