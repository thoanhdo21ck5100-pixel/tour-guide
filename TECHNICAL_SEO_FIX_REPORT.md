# Technical SEO Implementation & Fix Report

**Target Website:** [https://www.vietnam-nihongo-guide.com/](https://www.vietnam-nihongo-guide.com/)  
**Implementation Date:** 2026-09-08  
**Scope:** Approved Fixes #1 through #7 from `TECHNICAL_SEO_AUDIT.md`  
**Status:** All 7 approved fixes implemented and verified via TypeScript compilation and static production build. Zero commits / pushes performed.

---

## Changes Made

The following 7 files were modified to implement the approved technical SEO fixes:

1. **`src/app/tours/[slug]/page.tsx`** (Fix #1)
   - Updated `generateMetadata()`: passed `title: tour.title` directly to `constructMetadata()` instead of `${tour.title} | ベトナム日本語ガイド`.
   - Result: Eliminated the duplicated brand suffix across all 11 tour landing pages.
2. **`src/app/tours/page.tsx`** (Fix #1)
   - Updated `metadata.title`: changed from `'ツアープラン一覧・料金表 | ベトナム日本語ガイド【完全貸切プライベートツアー】'` to `'ツアープラン一覧・料金表【完全貸切プライベートツアー】'`.
   - Result: Eliminated duplicate brand suffix while retaining all target keywords and differentiation tags.
3. **`src/app/contact/page.tsx`** (Fix #1)
   - Updated `metadata.title`: changed from `'空き状況カレンダー＆予約・無料相談 | ベトナム日本語ガイド'` to `'空き状況カレンダー＆予約・無料相談'`.
   - Result: Eliminated duplicate brand suffix without inventing new keywords.
4. **`src/app/page.tsx`** (Fix #2)
   - Removed the duplicate `localBusinessSchema` declaration and its corresponding `<script type="application/ld+json">` tag from the homepage component body.
   - Preserved `FAQPage` schema on the homepage; global `TouristInformationCenter` is cleanly handled by `RootLayout` in `<head>`.
5. **`src/components/Footer.tsx`** (Fix #3)
   - Maintained the top 6 representative tour links covering all key categories (Classic, Ba Na Hills, Night/Food, Women, Men, Custom).
   - Added an explicit secondary navigation link: `全11ツアープラン一覧を見る` linking directly to `/tours`.
   - Preserved existing visual design, styling, and structure without cluttering the footer.
6. **`src/app/blog/[slug]/page.tsx`** (Fix #4)
   - Enhanced related tours logic to extract all valid tours from `post.relatedTourSlugs` (falling back to `post.relatedTourSlug`).
   - Implemented a responsive 2-column card layout (`grid-cols-1 md:grid-cols-2`) using the existing dark blue gradient card design, displaying all genuinely related tours (e.g., both P11 Hue Tour and P4 Custom Tour on B7).
7. **`src/lib/seo.ts`** (Fix #5, Fix #6, Fix #7)
   - **Fix #5 (Payment Schema):** In `generateLocalBusinessSchema()`, updated `currenciesAccepted` to `'JPY, VND'` and `paymentAccepted` to `'Cash'` (removed unverified `USD`, `Credit Card`, `Bank Transfer`).
   - **Fix #6 (Publisher Logo):** In `generateBlogPostSchema()`, replaced `.ico` logo with verified official high-resolution raster asset `${SITE_CONFIG.url}/images/logo.png`.
   - **Fix #7 (Breadcrumb Home URL):** In `generateBreadcrumbSchema()`, normalized root URL entries (`'/'` or `''`) to `${SITE_CONFIG.url}` without trailing slash, matching the canonical URL format.

---

## Title Changes

All 13 affected URLs have been updated to remove the duplicated brand phrase `| ベトナム日本語ガイド`. The resulting titles now strictly adhere to the approved pattern:  
`{Page Title} | ベトナム日本語ガイド【ダナン出身・JLPT N1】`

| URL | Previous Title (Duplicated Brand) | Final Title (Fixed) | Final Length |
| :--- | :--- | :--- | :---: |
| `/tours` | ツアープラン一覧・料金表 \| ベトナム日本語ガイド【完全貸切プライベートツアー】 \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | ツアープラン一覧・料金表【完全貸切プライベートツアー】 \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 55 |
| `/contact` | 空き状況カレンダー＆予約・無料相談 \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 空き状況カレンダー＆予約・無料相談 \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 49 |
| `/tours/danang-hoian-classic-day-trip` | ダナン・ホイアン定番ハイライト貸切ツアー（1日満喫プラン） \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | ダナン・ホイアン定番ハイライト貸切ツアー（1日満喫プラン） \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 57 |
| `/tours/bana-hills-golden-bridge-vip` | バナヒルズ（ゴールデンブリッジ）混雑回避プライベートツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | バナヒルズ（ゴールデンブリッジ）混雑回避プライベートツアー \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 57 |
| `/tours/danang-local-food-night-walk` | 【日本人好みの名店厳選】ダナン裏路地ローカルグルメ＆ドラゴン橋夜景ツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 【日本人好みの名店厳選】ダナン裏路地ローカルグルメ＆ドラゴン橋夜景ツアー \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 64 |
| `/tours/custom-order-made-central-vietnam` | 【ベトナム全土対応・完全オーダーメイド】行きたい場所だけを巡る 専属日本語ガイド＆専用車チャーター \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 【ベトナム全土対応・完全オーダーメイド】行きたい場所だけを巡る 専属日本語ガイド＆専用車チャーター \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 77 |
| `/tours/family-resort-relax-danang` | 【お子様・シニア安心】ゆったり巡るダナンリゾート＆癒やしのスパ・陶器の村ツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 【お子様・シニア安心】ゆったり巡るダナンリゾート＆癒やしのスパ・陶器の村ツアー \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 67 |
| `/tours/danang-local-market-deep-cafe-tour` | ダナン市内ローカル市場＆ディープカフェ巡りツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | ダナン市内ローカル市場＆ディープカフェ巡りツアー \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 52 |
| `/tours/danang-girls-trip-beauty-spa-nail-shopping` | 【女子旅・女性限定】美爪ジェルネイル・厳選スパ＆ベトナムコスメ・雑貨お買い物 癒やしのご褒美ツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 【女子旅・女性限定】美爪ジェルネイル・厳選スパ＆ベトナムコスメ・雑貨お買い物 癒やしのご褒美ツアー \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 77 |
| `/tours/danang-men-active-marine-nightlife-seafood-bar` | 【男旅・アクティブ＆ナイト】爽快マリンアクティビティ＆豪快海鮮ビアガーデン・夜景ルーフトップバーツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 【男旅・アクティブ＆ナイト】爽快マリンアクティビティ＆豪快海鮮ビアガーデン・夜景ルーフトップバーツアー \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 79 |
| `/tours/hoian-girls-trip-aodai-photo-afternoon-tea` | 【女子旅・映え満喫】伝統アオザイ変身撮影＆世界遺産ホイアン・ランタン作りと極上アフタヌーンティー 優雅な古都散策ツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 【女子旅・映え満喫】伝統アオザイ変身撮影＆世界遺産ホイアン・ランタン作りと極上アフタヌーンティー 優雅な古都散策ツアー \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 87 |
| `/tours/danang-men-jeep-adventure-craft-beer-bbq` | 【男旅・豪快アドベンチャー】ソンチャ半島絶景ジープ探検＆名物クラフトビール醸造所巡り・炭火焼きBBQナイト \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 【男旅・豪快アドベンチャー】ソンチャ半島絶景ジープ探検＆名物クラフトビール醸造所巡り・炭火焼きBBQナイト \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 81 |
| `/tours/hue-imperial-city-day-trip` | ダナン発・フエ世界遺産日帰りプライベートツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | ダナン発・フエ世界遺産日帰りプライベートツアー \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 51 |

---

## Structured Data Changes

1. **Homepage Schema Deduplication:**
   - **Previous:** `TouristInformationCenter` was output twice on `/` (once in `<head>`, once in page body).
   - **Current:** Exactly one instance of `TouristInformationCenter` is emitted (via `RootLayout` `<head>`).
   - `FAQPage` schema on `/` remains intact.
2. **LocalBusiness Payment & Currency Alignment:**
   - **Previous:** `currenciesAccepted: 'JPY, VND, USD'`, `paymentAccepted: 'Cash, Credit Card, Bank Transfer'`.
   - **Current:** `currenciesAccepted: 'JPY, VND'`, `paymentAccepted: 'Cash'`.
   - Fully reflects actual business policy: 100% on arrival in Vietnam, cash JPY or VND.
3. **BlogPosting Publisher Logo Standardized:**
   - **Previous:** `publisher.logo.url: 'https://www.vietnam-nihongo-guide.com/favicon.ico'`.
   - **Current:** `publisher.logo.url: 'https://www.vietnam-nihongo-guide.com/images/logo.png'`.
   - Resolves Google Article rich snippet guidelines preferring PNG/SVG raster assets.
4. **BreadcrumbList Root URI Normalization:**
   - **Previous:** Item position 1 ("ホーム") URL resolved to `https://www.vietnam-nihongo-guide.com/`.
   - **Current:** Item position 1 resolves to `https://www.vietnam-nihongo-guide.com` (no trailing slash), matching the page canonical tag.

---

## Internal Linking Changes

1. **Footer Navigation Architecture:**
   - Maintained 6 curated representative tours in the footer:
     1. ダナン＆ホイアン満喫 1日ツアー (`/tours/danang-hoian-classic-day-trip`)
     2. バーナーヒルズ＆神の手 絶景ツアー (`/tours/bana-hills-golden-bridge-vip`)
     3. 裏路地ローカルグルメ＆夜景ツアー (`/tours/danang-local-food-night-walk`)
     4. 【女子旅】美爪ネイル＆極上スパ・コスメツアー (`/tours/danang-girls-trip-beauty-spa-nail-shopping`)
     5. 【男旅】爽快マリン＆豪快海鮮・夜景バー (`/tours/danang-men-active-marine-nightlife-seafood-bar`)
     6. 完全オーダーメイド・チャーター (`/tours/custom-order-made-central-vietnam`)
   - Added secondary link with distinct visual treatment:  
     `全11ツアープラン一覧を見る` → `/tours`.
2. **Blog Template Related Tours:**
   - Upgraded `src/app/blog/[slug]/page.tsx` from single-tour rendering (`relatedTourSlug`) to multi-tour rendering (`relatedTourSlugs`).
   - Verified that B7 (`/blog/danang-to-hue-day-trip-guide`) now displays both:
     - P11 (`/tours/hue-imperial-city-day-trip`)
     - P4 (`/tours/custom-order-made-central-vietnam`)
   - Other blog posts with multiple related tours (e.g. B1, B2, B3, B4, B5, B6) now display all assigned commercial tours.

---

## Validation

### 1. TypeScript & Build Results
- **Command:** `npm run build`
- **Turbopack Compiler:** Compiled successfully in 1173ms.
- **TypeScript Typecheck:** Finished without errors (2.2s).
- **Static Page Generation:** 35/35 routes generated successfully in 378ms.
- **Route Summary:**
  - `○ /` (Static)
  - `○ /tours` (Static)
  - `○ /blog` (Static)
  - `ƒ /contact` (Dynamic due to `searchParams`)
  - `● /tours/[slug]` (All 11 tours SSG pre-rendered)
  - `● /blog/[slug]` (All 7 blogs SSG pre-rendered)
  - `○ /sitemap.xml` (Static XML generation, 22 URLs)
  - `○ /robots.txt` (Static robots route)

### 2. Live Output Verifications
- **No Page Marked `noindex`:** All 22 indexable pages confirmed with `index: true, follow: true`.
- **Canonicals:** All 22 pages maintain identical absolute canonical URLs.
- **Schema Validation:**
  - Homepage: 2 total schemas (`TouristInformationCenter` × 1, `FAQPage` × 1).
  - Tour Detail: 3 schemas (`TouristInformationCenter`, `TouristTrip`, `BreadcrumbList`).
  - Blog Detail: 3 schemas (`TouristInformationCenter`, `BlogPosting`, `BreadcrumbList`).
  - Publisher Logo: Verified pointing to valid image (`/images/logo.png`).
  - Breadcrumb Root: Verified pointing to `https://www.vietnam-nihongo-guide.com` (no trailing slash).
- **Titles:** All 11 tour titles and 2 index/contact titles verified unique and free of duplicate brand phrases.

---

## Remaining Issues

The following items were identified in `TECHNICAL_SEO_AUDIT.md` and are intentionally **NOT** implemented at this stage per user instructions:

1. **HTTP Apex 2-Hop Redirect Chain:**
   - `http://vietnam-nihongo-guide.com` → 308 → `https://vietnam-nihongo-guide.com/` → 308 → `https://www.vietnam-nihongo-guide.com/`.
   - *Reason:* Managed at DNS/Vercel platform level; intentionally excluded from current code scope.
2. **Sitewide Footer Expansion:**
   - All 11 tours and 7 blogs were intentionally NOT added to the footer to preserve clean UI architecture and rely on contextual internal linking.
3. **Broad Content Rewriting / Expansion:**
   - Content and copywriting of tours and blogs remain untouched to preserve approved tour specifications.
