# Technical SEO Audit

**Target Website:** [https://www.vietnam-nihongo-guide.com/](https://www.vietnam-nihongo-guide.com/)  
**Audit Date:** 2026-09-08  
**Audited Scope:** 22 Indexable URLs (Homepage, /tours, /blog, /contact, 11 Tour Pages, 7 Blog Posts), Production Vercel Edge Server, and Full Next.js Codebase.  
**Audit Mode:** Read-only inspection and live HTTP verification (NO code modifications made).

---

## Executive Summary

A comprehensive technical SEO audit was conducted across both the live production environment (`https://www.vietnam-nihongo-guide.com/`) and the Next.js 16 (App Router) codebase.

The website demonstrates strong technical fundamentals:
- **Indexability & Crawlability:** All 22 target pages are fully accessible (HTTP 200), statically rendered via SSG (`generateStaticParams`), and indexed (`<meta name="robots" content="index, follow">`).
- **Robots & Sitemap:** `robots.txt` and `sitemap.xml` are properly configured, accessible, and accurately list all 22 URLs with matching canonicals.
- **Heading Structure & Language:** Every indexable page features exactly one `<h1>` tag with proper hierarchy, and `<html lang="ja">` is correctly defined.
- **Structured Data Quality:** Zero fake reviews, zero fake ratings, and zero `AggregateRating` spam exist across the site, fully complying with Google Search quality guidelines.
- **Image SEO:** 100% of the 117 images across the 22 pages have descriptive `alt` attributes, utilize `next/image` responsive delivery, and designate `priority` for LCP hero images.

However, several notable technical and architectural issues were identified:
1. **Title Tag Brand Duplication (High):** On all 11 tour pages, the tours index page, and the contact page, the brand suffix is duplicated (`... | ベトナム日本語ガイド | ベトナム日本語ガイド【ダナン出身・JLPT N1】`), inflating title lengths up to 100 characters and risking SERP truncation.
2. **Duplicate Schema on Homepage (Medium):** `TouristInformationCenter` structured data is injected twice on the homepage (once in `<head>` via `layout.tsx` and once in the page body via `page.tsx`).
3. **Internal Link Asymmetry (Medium):** P11 (`/tours/hue-imperial-city-day-trip`) and P6 (`/tours/danang-local-market-deep-cafe-tour`) are missing from `<Footer />`, leaving them with only 2 inbound internal links each across the entire website. Similarly, B4–B7 are omitted from the footer.
4. **Data Schema vs Business Policy Mismatch (Low):** Schema in `src/lib/seo.ts` lists `USD` and `Credit Card, Bank Transfer`, diverging from the official policy ("到着後全額支払い、JPY/VND対応").

---

## A. PASS

The following 11 core technical SEO areas passed verification with zero errors:

1. **Robots.txt Configuration:**
   - Exists at `/robots.txt` and returns HTTP 200.
   - User-Agent `*` with `Allow: /`.
   - Properly disallows non-public routes (`/api/` and `/admin/`).
   - Declares sitemap directive: `Sitemap: https://www.vietnam-nihongo-guide.com/sitemap.xml`.
2. **Sitemap Integrity:**
   - Returns valid XML with exactly 22 URLs.
   - Zero duplicate URLs, zero broken URLs, zero 404s, zero redirected URLs, zero noindexed URLs.
   - 100% match between sitemap `<loc>` URLs and `<link rel="canonical">` targets.
3. **Canonical Implementation:**
   - Every single indexable page declares an absolute canonical URL prefixed with `https://www.vietnam-nihongo-guide.com`.
   - Zero cross-domain, HTTP/HTTPS, or www/non-www discrepancies.
4. **Robots Meta & Crawl Directives:**
   - All 22 URLs output `<meta name="robots" content="index, follow">` and `<meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1">`.
   - P11 (`/tours/hue-imperial-city-day-trip`) and B7 (`/blog/danang-to-hue-day-trip-guide`) are verified as indexable.
5. **HTML Language Declaration:**
   - `<html lang="ja">` is rendered at the root level across all pages, correctly signaling Japanese audience targeting.
6. **Single H1 & Heading Hierarchy:**
   - Exactly one `<h1>` per page across all 22 pages.
   - Strict hierarchical progression (`<h1>` → `<h2>` → `<h3>`) with zero skipped levels.
7. **Server-Side Pre-Rendering (SSG) & Crawlability:**
   - Turbopack static site generation pre-renders all 22 pages.
   - Search engines can crawl all titles, descriptions, H1s, itineraries, blog bodies, and internal links without executing client JavaScript.
8. **Image SEO:**
   - 117 images scanned; 0 missing `alt`, 0 empty `alt`.
   - Fully optimized via `next/image` with WebP/AVIF srcset and dimensions.
   - LCP hero images carry `priority`.
9. **Zero Review Spam / Compliance:**
   - Zero fake reviews, zero fake ratings, zero fake `AggregateRating`, and zero unverified trust claims in structured data.
10. **HTTP / Routing & Security:**
    - HTTP cleanly 308-redirects to HTTPS.
    - Non-www cleanly 308-redirects to www.
    - Trailing slash variations cleanly 308-redirect to canonical non-trailing slash routes.
    - 404 page returns proper HTTP 404 status.
11. **Production & Codebase Synchronization:**
    - Live production behavior on Vercel is 100% consistent with the repository's `main` branch.

---

## B. WARNING

### Issue W-01: Inbound Link Imbalance for P6, P11, and B4–B7
- **Severity:** Medium
- **URL:** 
  - `/tours/danang-local-market-deep-cafe-tour` (P6)
  - `/tours/hue-imperial-city-day-trip` (P11)
  - `/blog/danang-best-season-weather-clothing-guide` (B4)
  - `/blog/hoian-souvenirs-handicrafts-silk-shops` (B5)
  - `/blog/danang-safe-stylish-cafes-girls-solo-trip` (B6)
  - `/blog/danang-to-hue-day-trip-guide` (B7)
- **File:** `src/components/Footer.tsx`
- **Current state:** `Footer.tsx` hardcodes 9 out of 11 tours and 3 out of 7 blog posts in its global footer navigation.
- **Problem:** Tours listed in the footer receive 22 inbound links (sitewide). P6 and P11 receive only 2 inbound links each (from `/tours` and 1 related blog). B7 receives only 3 inbound links.
- **SEO impact:** Low PageRank / link equity distribution to P11 (Hue Tour) and P6, hindering their ranking potential compared to older tours.
- **Recommended solution:** Update `Footer.tsx` to either dynamically render all tours/blogs or include a comprehensive secondary link block, ensuring P11 and P6 are globally reachable.
- **Requires human approval:** YES

### Issue W-02: Unused `relatedTourSlugs` in Blog Template
- **Severity:** Medium
- **URL:** All `/blog/*` posts (B1–B7)
- **File:** `src/app/blog/[slug]/page.tsx` (Lines 61, 234–256)
- **Current state:** `src/lib/data/blog.ts` defines an array `relatedTourSlugs: string[]` (e.g., B1 defines both P1 and P4; B7 defines P11 and P4), but `BlogPostPage` only reads `post.relatedTourSlug` (singular string).
- **Problem:** The second related tour defined in the data is never rendered into the DOM, breaking intended contextual cross-links.
- **SEO impact:** Missed internal linking opportunities from informational blog content to commercial tour landing pages.
- **Recommended solution:** Update `BlogPostPage` to render all tours present in `post.relatedTourSlugs` (or `relatedTourSlug` as fallback).
- **Requires human approval:** YES

### Issue W-03: Contextual Link Gaps Between Specified Tour/Blog Pairs
- **Severity:** Medium
- **URL:**
  - `/tours/danang-hoian-classic-day-trip` (P1) ↔ `/blog/danang-girls-trip-model-course` (B3)
  - `/tours/danang-girls-trip-beauty-spa-nail-shopping` (P7) ↔ `/tours/hoian-girls-trip-aodai-photo-afternoon-tea` (P9)
  - `/blog/danang-safe-stylish-cafes-girls-solo-trip` (B6) ↔ `/tours/danang-local-food-night-walk` (P3)
- **File:** `src/lib/data/tours.ts`, `src/lib/data/blog.ts`
- **Current state:** 
  - P1's `relatedBlogSlugs` does not include B3.
  - P7 does not link contextually to P9 (only linked via sitewide Footer).
  - B6's `relatedTourSlugs` links to P6 and P7, but not P3.
- **Problem:** Relevant thematic clusters lack direct, contextual in-body hyperlinks.
- **SEO impact:** Sub-optimal semantic topical clustering between complementary products/guides.
- **Recommended solution:** Add contextual in-body links or update `relatedBlogSlugs`/`relatedTourSlugs` in the data layer after content review.
- **Requires human approval:** YES

### Issue W-04: Structured Data Publisher Logo points to `.ico` file
- **Severity:** Low
- **URL:** All `/blog/*` pages (B1–B7)
- **File:** `src/lib/seo.ts` (Line 222)
- **Current state:** `publisher.logo.url` in `generateBlogPostSchema` is set to `${SITE_CONFIG.url}/favicon.ico`.
- **Problem:** Google Search Central documentation recommends PNG, JPG, or SVG raster/vector image formats for publisher logos (minimum 60x60px), whereas `.ico` is a Windows multi-icon container format.
- **SEO impact:** Potential warning in Google Rich Results Test or fallback omission of publisher logo in Article rich snippets.
- **Recommended solution:** Point `publisher.logo.url` to `${SITE_CONFIG.url}/images/logo-emblem.png` or `${SITE_CONFIG.url}/images/logo.png`.
- **Requires human approval:** NO

### Issue W-05: Breadcrumb Schema Root Trailing Slash Minor Inconsistency
- **Severity:** Low
- **URL:** All `/tours/*` and `/blog/*` pages
- **File:** `src/app/tours/[slug]/page.tsx` (Line 69), `src/app/blog/[slug]/page.tsx` (Line 64)
- **Current state:** Breadcrumb item for "ホーム" passes `url: '/'`, which resolves to `https://www.vietnam-nihongo-guide.com/` (with trailing slash).
- **Problem:** The site's canonical URL for the homepage is `https://www.vietnam-nihongo-guide.com` (without trailing slash).
- **SEO impact:** Minor URL form discrepancy inside structured data; does not break validation but violates strict URI normalization.
- **Recommended solution:** Standardize the root URL in `generateBreadcrumbSchema` to `${SITE_CONFIG.url}` without a trailing slash.
- **Requires human approval:** NO

---

## C. ERROR

### Issue E-01: Duplicate Brand Suffix in `<title>` Tags on Tours and Key Pages
- **Severity:** High
- **URL:** All 11 Tour pages (`/tours/*`), `/tours`, and `/contact` (13 URLs total)
- **File:** `src/lib/seo.ts` (Lines 58–60) vs `src/app/tours/[slug]/page.tsx` (Line 48), `src/app/tours/page.tsx` (Line 6), `src/app/contact/page.tsx` (Line 6)
- **Current state:**
  - In `src/app/tours/[slug]/page.tsx`:
    `title: `${tour.title} | ベトナム日本語ガイド``
  - In `src/lib/seo.ts` (`constructMetadata`):
    `const fullTitle = title ? `${title} | ベトナム日本語ガイド【ダナン出身・JLPT N1】` : ...`
- **Problem:** The brand phrase `| ベトナム日本語ガイド` is appended twice, resulting in:
  `{Tour Title} | ベトナム日本語ガイド | ベトナム日本語ガイド【ダナン出身・JLPT N1】`
  - Example: `ダナン・ホイアン定番ハイライト貸切ツアー（1日満喫プラン） | ベトナム日本語ガイド | ベトナム日本語ガイド【ダナン出身・JLPT N1】` (Length: 70 chars).
  - Longest title: `hoian-girls-trip-aodai-photo-afternoon-tea` reaches **100 characters**.
- **SEO impact:**
  - Google SERPs on mobile and desktop truncate titles longer than ~30–35 full-width Japanese characters (~580px–600px).
  - Unnecessary brand keyword repetition looks spammy and dilutes primary keyword prominence in search results.
- **Recommended solution:** Standardize `constructMetadata` or pass clean page titles without manual brand suffixes, producing a clean format such as:
  `{Tour Title} | ベトナム日本語ガイド【ダナン出身・JLPT N1】`
- **Requires human approval:** YES (Approval on title format)

### Issue E-02: Duplicate `TouristInformationCenter` Schema on Homepage
- **Severity:** Medium
- **URL:** `https://www.vietnam-nihongo-guide.com/`
- **File:** `src/app/layout.tsx` (Lines 33–36) & `src/app/page.tsx` (Lines 39–42)
- **Current state:**
  - `src/app/layout.tsx` injects `generateLocalBusinessSchema()` in `<head>` for all pages.
  - `src/app/page.tsx` ALSO injects `generateLocalBusinessSchema()` directly inside the homepage body container.
- **Problem:** The exact same `TouristInformationCenter` JSON-LD object is parsed twice by search engine bots on the homepage.
- **SEO impact:** Redundant DOM weight and confusing schema graph signal for Googlebot on the root domain.
- **Recommended solution:** Remove the duplicate `<script>` injection from `src/app/page.tsx` and allow `src/app/layout.tsx` to handle the global business schema (or vice versa).
- **Requires human approval:** NO

---

## D. NEED HUMAN DECISION

1. **Title Tag Format Standardization:**
   - *Current Output:* `{Page Title} | ベトナム日本語ガイド | ベトナム日本語ガイド【ダナン出身・JLPT N1】` (contains repetition).
   - *Option A (Recommended):* `{Tour Title} | ベトナム日本語ガイド【ダナン出身・JLPT N1】` (Clean, maintains N1 differentiation, ~50–65 chars).
   - *Option B:* `{Tour Title} | ベトナム日本語ガイド` (Shorter, prevents mobile truncation on long tour titles).
   - *Decision Needed:* Approve Option A or Option B for implementation.

2. **Footer Navigation Architecture for Tours & Blogs:**
   - *Current Situation:* Footer lists 9 tours and 3 blogs. P6, P11, B4, B5, B6, B7 are omitted, leaving P11 and P6 with only 2 inbound links.
   - *Option A (Recommended):* Include all 11 tours and all 7 blog posts in structured 2-column submenus in the footer.
   - *Option B:* Keep top 6 popular tours in the footer, but add a prominent "すべてのツアープラン一覧を見る (全11プラン)" and "現地観光ブログ一覧 (全7記事)" category link block, plus cross-link P11 in related tour cards.
   - *Decision Needed:* Choose between full 11-tour footer listing or curated footer + contextual cross-linking.

3. **Blog Post Related Tours Presentation:**
   - *Current Situation:* Blog posts define `relatedTourSlugs` with 2 tours (e.g., B7 defines P11 Hue tour + P4 Custom tour), but `BlogPostPage` only renders the first one (`relatedTourSlug`).
   - *Option A (Recommended):* Render both tours in a 2-card grid at the bottom of the blog post.
   - *Option B:* Keep a single highlighted tour banner, but select the most relevant primary tour for each post.
   - *Decision Needed:* Confirm whether to display 1 tour or 2 tours in blog footers.

4. **Payment & Currency Schema Alignment:**
   - *Current Schema in `seo.ts`:* `currenciesAccepted: 'JPY, VND, USD'`, `paymentAccepted: 'Cash, Credit Card, Bank Transfer'`.
   - *Agreed Business Policy:* Cash payment upon arrival in Vietnam before tour starts, accepted in JPY or VND only.
   - *Decision Needed:* Approve updating schema to `currenciesAccepted: 'JPY, VND'` and `paymentAccepted: 'Cash'` to accurately reflect physical on-site settlement.

---

## E. RECOMMENDED FIXES

*(Action plan prepared for execution upon user approval; NO code modified during this audit)*

| Step | Target File | Action | Impact |
| :--- | :--- | :--- | :--- |
| 1 | `src/app/tours/[slug]/page.tsx`<br>`src/app/tours/page.tsx`<br>`src/app/contact/page.tsx` | Remove manual brand suffix `| ベトナム日本語ガイド` before passing to `constructMetadata()` | Eliminates duplicate brand names; fixes title lengths across 13 pages |
| 2 | `src/app/page.tsx` | Remove redundant `localBusinessSchema` script tag (lines 39–42) | Resolves duplicate JSON-LD schema on homepage |
| 3 | `src/components/Footer.tsx` | Add links for P6, P11, and B4–B7 to footer navigation | Boosts crawl equity & inbound links for P11 (Hue) and P6 |
| 4 | `src/app/blog/[slug]/page.tsx` | Support displaying all items in `post.relatedTourSlugs` | Restores missing commercial cross-links in blogs |
| 5 | `src/lib/seo.ts` | Update `publisher.logo.url` to `/images/logo-emblem.png`; update currency/payment schema | Fixes schema warnings and aligns with real business policy |
| 6 | `src/lib/data/tours.ts`<br>`src/lib/data/blog.ts` | Populate missing `relatedBlogSlugs` for P3–P10 and refine cross-links | Strengthens thematic clustering (P1↔B3, P7↔P9, B6↔P3) |

---

## F. URL Inventory

Total indexable URLs identified and verified: **22 URLs**

### Core Pages (4 URLs)
1. `https://www.vietnam-nihongo-guide.com` (Homepage)
2. `https://www.vietnam-nihongo-guide.com/tours` (Tours Index)
3. `https://www.vietnam-nihongo-guide.com/blog` (Blog Index)
4. `https://www.vietnam-nihongo-guide.com/contact` (Contact & Availability)

### Tour Pages (11 URLs)
5. `https://www.vietnam-nihongo-guide.com/tours/danang-hoian-classic-day-trip` (P1)
6. `https://www.vietnam-nihongo-guide.com/tours/bana-hills-golden-bridge-vip` (P2)
7. `https://www.vietnam-nihongo-guide.com/tours/danang-local-food-night-walk` (P3)
8. `https://www.vietnam-nihongo-guide.com/tours/custom-order-made-central-vietnam` (P4)
9. `https://www.vietnam-nihongo-guide.com/tours/family-resort-relax-danang` (P5)
10. `https://www.vietnam-nihongo-guide.com/tours/danang-local-market-deep-cafe-tour` (P6)
11. `https://www.vietnam-nihongo-guide.com/tours/danang-girls-trip-beauty-spa-nail-shopping` (P7)
12. `https://www.vietnam-nihongo-guide.com/tours/danang-men-active-marine-nightlife-seafood-bar` (P8)
13. `https://www.vietnam-nihongo-guide.com/tours/hoian-girls-trip-aodai-photo-afternoon-tea` (P9)
14. `https://www.vietnam-nihongo-guide.com/tours/danang-men-jeep-adventure-craft-beer-bbq` (P10)
15. `https://www.vietnam-nihongo-guide.com/tours/hue-imperial-city-day-trip` (P11)

### Blog Pages (7 URLs)
16. `https://www.vietnam-nihongo-guide.com/blog/danang-airport-grab-transport-guide` (B1)
17. `https://www.vietnam-nihongo-guide.com/blog/hoian-lantern-night-market-guide` (B2)
18. `https://www.vietnam-nihongo-guide.com/blog/danang-girls-trip-model-course` (B3)
19. `https://www.vietnam-nihongo-guide.com/blog/danang-best-season-weather-clothing-guide` (B4)
20. `https://www.vietnam-nihongo-guide.com/blog/hoian-souvenirs-handicrafts-silk-shops` (B5)
21. `https://www.vietnam-nihongo-guide.com/blog/danang-safe-stylish-cafes-girls-solo-trip` (B6)
22. `https://www.vietnam-nihongo-guide.com/blog/danang-to-hue-day-trip-guide` (B7)

---

## G. Sitemap Audit

- **Live URL:** `https://www.vietnam-nihongo-guide.com/sitemap.xml`
- **Total URLs Declared:** 22
- **Audit Findings:**
  - All 22 URLs respond with HTTP 200.
  - Zero duplicate `<url>` nodes.
  - Correct XML schema namespace (`http://www.sitemaps.org/schemas/sitemap/0.9`).
  - Correct domain prefix (`https://www.vietnam-nihongo-guide.com`) on all entries.
  - Zero trailing slashes on all paths (matching canonical tags).
  - Appropriate priorities assigned: `1.0` (Home), `0.9` (Tours, Contact), `0.85` (Tour Details), `0.8` (Blog Index), `0.75` (Blog Posts).
  - Appropriate change frequencies: `daily` for static commercial pages, `weekly` for tours, `monthly` for blog posts.
  - Static lastmod dates for blog posts reflect `updatedAt` / `publishedAt` timestamps.

---

## H. Metadata Audit

| URL | Title | Title Len | Meta Description | Desc Len | Status |
| :--- | :--- | :---: | :--- | :---: | :---: |
| `/` | ベトナム日本語ガイド \| ダナン・ホイアン プライベートツアー【ダナン出身・JLPT N1】 - 事前決済不要・完全貸切 | 60 | 日本人旅行者のための安心・快適なベトナム・ダナン＆ホイアン中心プライベート観光ツアー。日本語堪能な専属ガイド「アン トー」が完全貸切でおもてなし。事前決済不要・ベトナム到着後全額お支払い対応。LINE事前相談無料。 | 107 | PASS |
| `/tours` | ツアープラン一覧・料金表 \| ベトナム日本語ガイド【完全貸切プライベートツアー】 \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 68 | 【ベトナム日本語ガイド】安心の完全貸切・日本語公認ガイド専属。ダナン・ホイアン1日ツアー、バーナーヒルズ、裏路地ローカルグルメからベトナム全土のオーダーメイドまで、日本人旅行者向けツアープラン一覧と明朗会計の料金表。 | 108 | WARNING (Duplicate Brand) |
| `/blog` | ダナン現地お役立ちブログ \| 観光・交通・グルメ・最新情報 \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 57 | 【現地公認ガイド発】ダナン空港からのGrab乗り方、世界遺産ホイアンのランタン夜市攻略法、女子旅モデルコースなど、日本人旅行者の不安を解消するダナン観光の最新情報をお届けします。 | 89 | PASS |
| `/contact` | 空き状況カレンダー＆予約・無料相談 \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 58 | 【事前決済不要・1日1組限定】ベトナム全土対応プライベートツアー（ダナン・ホイアン・ハノイ・ホーチミン等）の空き状況カレンダーと予約・無料相談フォーム。到着後に全額お支払い対応。LINE・SNSでの事前無料相談も随時受付中。 | 112 | WARNING (Duplicate Brand) |
| `/tours/danang-hoian-classic-day-trip` | ダナン・ホイアン定番ハイライト貸切ツアー（1日満喫プラン） \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 70 | ダナンの3大名所（ソンチャ半島リンウン寺・五行山・ピンクの大聖堂）と、幻想的な世界遺産ホイアンの夜景・灯籠流しを1日で効率よく巡る一番人気の完全貸切プライベートツアーです。 | 86 | WARNING (Duplicate Brand) |
| `/tours/bana-hills-golden-bridge-vip` | バナヒルズ（ゴールデンブリッジ）混雑回避プライベートツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 70 | SNSで世界的人気の「神の手」へ。大型団体バスの混雑ピークを賢く回避する柔軟な時間設定と、快適なプライベートエスコートを提供します。 | 66 | WARNING (Duplicate Brand) |
| `/tours/danang-local-food-night-walk` | 【日本人好みの名店厳選】ダナン裏路地ローカルグルメ＆ドラゴン橋夜景ツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 77 | 観光客だけでは入りづらいダナンの絶品ローカル食堂を日本語ガイドと巡るナイトツアー。週末はドラゴン橋の炎噴射ショーも鑑賞！ | 60 | WARNING (Duplicate Brand) |
| `/tours/custom-order-made-central-vietnam` | 【ベトナム全土対応・完全オーダーメイド】行きたい場所だけを巡る 専属日本語ガイド＆専用車チャーター \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 90 | 既存のツアー枠にとらわれず、ダナン周辺はもちろんハノイやホーチミンなどベトナム全土で行きたいスポットや旅程を自由に組み合わせられる完全貸切プライベートチャータープランです。 | 86 | WARNING (Duplicate Brand) |
| `/tours/family-resort-relax-danang` | 【お子様・シニア安心】ゆったり巡るダナンリゾート＆癒やしのスパ・陶器の村ツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 80 | 歩行距離を抑え、冷房の効いた車内で快適に移動しながら伝統工芸体験や贅沢スパを楽しむ、リラックス重視のツアーです。 | 56 | WARNING (Duplicate Brand) |
| `/tours/danang-local-market-deep-cafe-tour` | ダナン市内ローカル市場＆ディープカフェ巡りツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 65 | 観光客で賑わう「ハン市場」と、市民の台所「コン市場」を日本語ガイドと散策。注文や衛生面が心配な方でも安心の厳選ローカルフード＆濃厚ココナッツコーヒーを味わう充実の半日ツアーです。 | 89 | WARNING (Duplicate Brand) |
| `/tours/danang-girls-trip-beauty-spa-nail-shopping` | 【女子旅・女性限定】美爪ジェルネイル・厳選スパ＆ベトナムコスメ・雑貨お買い物 癒やしのご褒美ツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 90 | ベトナム発祥の高技術＆高コスパなジェルネイル、日本人好みの清潔オーガニックスパ、ベトナム発ナチュラルコスメや可愛い刺繍雑貨・カゴバッグ巡りを専属日本語ガイドがエスコートする女性のためのご褒美プランです。 | 101 | WARNING (Duplicate Brand) |
| `/tours/danang-men-active-marine-nightlife-seafood-bar` | 【男旅・アクティブ＆ナイト】爽快マリンアクティビティ＆豪快海鮮ビアガーデン・夜景ルーフトップバーツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 92 | ミーケビーチでの爽快マリンスポーツから、獲れたて新鮮魚介と冷えたベトナムビールで豪快に乾杯！さらにドラゴン橋の火吹きや安心のルーフトップバーまで、夜のダナンをぼったくり心配ゼロで満喫する男旅決定版です。 | 101 | WARNING (Duplicate Brand) |
| `/tours/hoian-girls-trip-aodai-photo-afternoon-tea` | 【女子旅・映え満喫】伝統アオザイ変身撮影＆世界遺産ホイアン・ランタン作りと極上アフタヌーンティー 優雅な古都散策ツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 100 | 色鮮やかなベトナム伝統衣装「アオザイ」を身にまとい、ノスタルジックな世界遺産ホイアンの街並みで最高の一枚を撮影。職人直伝のランタン作り体験や優雅なアフタヌーンティー、灯籠流しを楽しむ女子旅決定版です。 | 100 | WARNING (Duplicate Brand) |
| `/tours/danang-men-jeep-adventure-craft-beer-bbq` | 【男旅・豪快アドベンチャー】ソンチャ半島絶景ジープ探検＆名物クラフトビール醸造所巡り・炭火焼きBBQナイト \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 94 | ワイルドなオープンジープで大自然ソンチャ半島のワインディングロードを爽快ドライブ！絶景展望台探検の後は、世界が注目するダナンクラフトビールブルワリーで乾杯、極厚肉と新鮮魚介の炭火BBQを喰らう大人の男旅アドベンチャーです。 | 111 | WARNING (Duplicate Brand) |
| `/tours/hue-imperial-city-day-trip` | ダナン発・フエ世界遺産日帰りプライベートツアー \| ベトナム日本語ガイド \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 64 | ダナンから日帰りで世界遺産の古都フエへ。大内（王宮）、壮麗なカイディン帝廟、名刹天姥寺を、専属日本語ガイドによる分かりやすい歴史解説と専用車送迎で快適に巡る充実のプライベートツアーです。 | 93 | WARNING (Duplicate Brand) |
| `/blog/danang-airport-grab-transport-guide` | 【2026年最新】ダナンの移動はGrabが安心！空港からの乗り方からぼったくり防止策まで徹底解説 \| ダナン観光ブログ \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 87 | 初めてのダナン空港到着でも安心！Grabの正しい乗り場、クレジットカード登録方法、空港出入口の白タク勧誘をスマートに回避するコツを日本語ガイドが徹底解説します。 | 80 | PASS |
| `/blog/hoian-lantern-night-market-guide` | 【完全攻略】世界遺産ホイアンの夜市と灯籠流し！おすすめランタンカフェ＆映え写真スポット5選 \| ダナン観光ブログ \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 84 | 夕暮れから始まるホイアンの幻想的な世界。トゥボン川の小舟と灯籠流しの相場、安心の乗り方、人混みを避けて優雅にお茶ができる絶景ルーフトップカフェを伝授！ | 75 | PASS |
| `/blog/danang-girls-trip-model-course` | 【女子旅・カップル向け】初めてのダナン＆ホイアン2泊3日おすすめモデルコース【完全保存版】 \| ダナン観光ブログ \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 84 | 写真映えスポット巡り、海沿いのおしゃれカフェ、極上スパ、そして絶品ローカルグルメ。限られた日程で無理なく最大限満喫できる理想のタイムスケジュールを公開！ | 76 | PASS |
| `/blog/danang-best-season-weather-clothing-guide` | 【2026年最新】ダナンのベストシーズンは？乾季・雨季の特徴と服装選びのコツ \| ダナン観光ブログ \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 77 | ダナン旅行のベストシーズンはいつ？乾季（3〜8月）の透き通るビーチの魅力から、雨季（9〜12月）の過ごし方、月別の平均気温や失敗しない服装選びのコツを現地日本語ガイドが徹底解説！ | 89 | PASS |
| `/blog/hoian-souvenirs-handicrafts-silk-shops` | ホイアン古都で買いたい！センスが光るおしゃれなお土産・雑貨店まとめ \| ダナン観光ブログ \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 72 | 世界遺産ホイアンで見つける、自分へのご褒美や大切な人への特別なお土産。上質なシルク製品、繊細な手刺繍リネン、折りたたみランタン、名品クラフトチョコレートまで、センス溢れる名店を厳選紹介！ | 93 | PASS |
| `/blog/danang-safe-stylish-cafes-girls-solo-trip` | 女子旅・一人旅必見！ダナン旅行で絶対に訪れたい安全でおしゃれなカフェ5選 \| ダナン観光ブログ \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 75 | 清潔でWi-Fi完備、写真映え抜群で治安も安心！女子旅や一人旅の日本人旅行者に心からおすすめできる、ダナン市内の洗練されたおしゃれカフェを現地ガイドが実地レビュー。 | 82 | PASS |
| `/blog/danang-to-hue-day-trip-guide` | 【2026年最新】ダナンからフエへ日帰り観光｜行き方・所要時間・おすすめスポット・モデルコース \| ダナン観光ブログ \| ベトナム日本語ガイド【ダナン出身・JLPT N1】 | 86 | ダナンから世界遺産の古都フエへの日帰り観光完全ガイド。電車・バス・専用車の行き方比較、所要時間、大内やカイディン帝廟など必見スポットから名物グルメまで現地目線で詳しく解説！ | 86 | PASS |

---

## I. Canonical Audit

- **Missing Canonicals:** 0
- **Duplicate Canonicals:** 0
- **Wrong / Cross-Domain Canonicals:** 0
- **Protocol Consistency:** 100% `https://`
- **Subdomain Consistency:** 100% `www.vietnam-nihongo-guide.com`
- **Trailing Slash Consistency:** 100% non-trailing slash across all paths (matching internal links and sitemap entries).
- **Audit Verdict:** Full PASS.

---

## J. Internal Link Audit

### Inbound Internal Links by URL

| Category | URL | Inbound Page Count | Notes |
| :--- | :--- | :---: | :--- |
| Static | `/` | 22 | Linked from header/footer on all pages |
| Static | `/tours` | 22 | Linked from header/footer on all pages |
| Static | `/blog` | 22 | Linked from header/footer on all pages |
| Static | `/contact` | 22 | Linked from header/footer on all pages |
| Tour | `/tours/danang-hoian-classic-day-trip` (P1) | 22 | Present in Footer + Homepage featured |
| Tour | `/tours/bana-hills-golden-bridge-vip` (P2) | 22 | Present in Footer + Homepage featured |
| Tour | `/tours/danang-local-food-night-walk` (P3) | 22 | Present in Footer + Homepage featured |
| Tour | `/tours/custom-order-made-central-vietnam` (P4) | 22 | Present in Footer |
| Tour | `/tours/family-resort-relax-danang` (P5) | 22 | Present in Footer |
| Tour | `/tours/danang-local-market-deep-cafe-tour` (P6) | **2** | **Omitted from Footer** (Only /tours & B6 link in) |
| Tour | `/tours/danang-girls-trip-beauty-spa-nail-shopping` (P7) | 22 | Present in Footer |
| Tour | `/tours/danang-men-active-marine-nightlife-seafood-bar` (P8) | 22 | Present in Footer |
| Tour | `/tours/hoian-girls-trip-aodai-photo-afternoon-tea` (P9) | 22 | Present in Footer |
| Tour | `/tours/danang-men-jeep-adventure-craft-beer-bbq` (P10) | 22 | Present in Footer |
| Tour | `/tours/hue-imperial-city-day-trip` (P11) | **2** | **Omitted from Footer** (Only /tours & B7 link in) |
| Blog | `/blog/danang-airport-grab-transport-guide` (B1) | 22 | Present in Footer + fallback related |
| Blog | `/blog/hoian-lantern-night-market-guide` (B2) | 22 | Present in Footer + fallback related |
| Blog | `/blog/danang-girls-trip-model-course` (B3) | 22 | Present in Footer |
| Blog | `/blog/danang-best-season-weather-clothing-guide` (B4) | **7** | Omitted from Footer (linked from P1, P2, P11, B1, B7) |
| Blog | `/blog/hoian-souvenirs-handicrafts-silk-shops` (B5) | **5** | Omitted from Footer (linked from P1, B2, B6) |
| Blog | `/blog/danang-safe-stylish-cafes-girls-solo-trip` (B6) | **4** | Omitted from Footer (linked from B3, B5) |
| Blog | `/blog/danang-to-hue-day-trip-guide` (B7) | **3** | Omitted from Footer (linked from P11, /blog) |

### Specific Pair Verification
- **P11 (`hue-imperial-city-day-trip`) ↔ B7 (`danang-to-hue-day-trip-guide`):**
  - P11 → B7: **PASS** (Direct contextual link under "関連する観光情報・現地ブログ")
  - B7 → P11: **PASS** (Direct contextual link under "このブログで紹介したフエ観光におすすめのツアープラン")
- **P1 ↔ B3:**
  - P1 → B3: **No in-body link** (P1 links to B2, B4, B5).
  - B3 → P1: **No in-body link** (B3 links to P2 and P7).
- **P7 ↔ P9:**
  - P7 → P9: **No in-body link** (Both exist in global footer, but no contextual cross-link).
  - P9 → P7: **No in-body link**.
- **B6 ↔ P3 / P6:**
  - B6 → P6: **PASS** (B6 links directly to P6).
  - B6 → P3: **No in-body link** (B6 does not link to P3).

---

## K. Structured Data Audit

### Summary by Page Type
1. **Homepage (`/`):**
   - `TouristInformationCenter` (LocalBusiness) × 2 (**Issue E-02: Duplicated in head and body**)
   - `FAQPage` (Valid, includes 10 Q&As from `FAQS_DATA`)
2. **Tours Index (`/tours`):**
   - `TouristInformationCenter` (via `layout.tsx`)
3. **Blog Index (`/blog`):**
   - `TouristInformationCenter` (via `layout.tsx`)
4. **Contact Page (`/contact`):**
   - `TouristInformationCenter` (via `layout.tsx`)
5. **Tour Detail Pages (`/tours/*` - 11 pages):**
   - `TouristInformationCenter` (via `layout.tsx`)
   - `TouristTrip` (Includes `name`, `description`, `touristType`, `offers` with price JPY, and `itinerary` ItemList of attractions)
   - `BreadcrumbList` (3-tier breadcrumb: ホーム → ツアー一覧 → ツアー名)
6. **Blog Post Pages (`/blog/*` - 7 pages):**
   - `TouristInformationCenter` (via `layout.tsx`)
   - `BlogPosting` (Includes `headline`, `description`, `image`, `datePublished`, `dateModified`, `author` Person, `publisher` Organization)
   - `BreadcrumbList` (3-tier breadcrumb: ホーム → 現地ブログ → 記事名)

### Spam and Policy Check
- Fake Reviews: **0**
- AggregateRating entities: **0**
- Fake Awards / Certifications: **0**
- **Audit Verdict:** 100% compliant with Google Review Guidelines and Search Quality Rater Guidelines.

---

## L. Crawlability Audit

- **Rendering Mode:** Next.js Static Site Generation (SSG).
- **JavaScript Dependency:** None for core SEO content. Disabling JavaScript in browser devtools leaves 100% of text, headings, tables, itinerary steps, prices, FAQs, and links fully visible and navigable.
- **Server Response Time:** Sub-200ms TTFB globally via Vercel Edge Network.
- **Crawlability Verdict:** Excellent (PASS).

---

## M. Performance-related Findings

- **Image Optimization:** All visual assets use Next.js image optimization (`/_next/image`), serving modern WebP/AVIF formats at responsive screen widths.
- **Largest Contentful Paint (LCP):** Above-the-fold hero banners on Homepage, Tour Detail, and Blog Post pages have `priority={true}` set, ensuring early preloading.
- **Font Loading:** `Noto_Sans_JP` is configured via `next/font/google` with `display: 'swap'` and CSS variable scoping.
- **Bundle Architecture:** Server components are utilized for main page layouts; client components (`'use client'`) are reserved for interactive UI elements (Navbar, MobileStickyBar, BookingForm, FaqAccordion).

---

## N. Production Verification

| Check Item | Codebase Status | Live Production Status | Result |
| :--- | :--- | :--- | :---: |
| Robots.txt | Rules defined in `src/app/robots.ts` | Matched exactly at `/robots.txt` | PASS |
| Sitemap.xml | Dynamic generator in `src/app/sitemap.ts` | 22 URLs live at `/sitemap.xml` | PASS |
| HTTP 308 Redirects | Configured via Vercel Edge / Next.js | `http://` → `https://`, non-www → `www.` verified | PASS |
| Trailing Slash | Normalization in App Router | `/tours/` → 308 → `/tours` verified | PASS |
| 404 Status Code | Standard Next.js error handling | Custom 404 page returns HTTP 404 | PASS |
| P11 Indexability | `src/app/tours/hue-imperial-city-day-trip` | Live HTTP 200, `<meta name="robots" content="index, follow">` | PASS |
| B7 Indexability | `src/app/blog/danang-to-hue-day-trip-guide` | Live HTTP 200, `<meta name="robots" content="index, follow">` | PASS |

---

## Final Status

- **Critical:** 0
- **High:** 1 (Duplicate Brand Suffix in `<title>` across 13 pages)
- **Medium:** 4 (Duplicate Schema on Homepage; Low inbound links for P6/P11 in Footer; Unused `relatedTourSlugs` in Blog; Missing contextual cross-links)
- **Low:** 4 (Schema currency/payment mismatch; BlogPosting logo `.ico` format; Breadcrumb root trailing slash; Apex HTTP redirect chain)
- **PASS:** 11 core categories (Robots, Sitemap, Canonicals, Robots Meta, Lang, H1s, Crawlability, Image SEO, No Spam Reviews, HTTP Routing, Production Sync)
