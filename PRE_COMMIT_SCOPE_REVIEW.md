# Pre-Commit Scope Review

**Website:** `https://www.vietnam-nihongo-guide.com/`  
**Scope:** Performance / Hydration Changes + Existing ESLint React Hook Errors  
**References:** `TECHNICAL_SEO_AUDIT.md`, `TECHNICAL_SEO_FIX_REPORT.md`, `FINAL_SEO_PRE_COMMIT_REVIEW.md`  

---

## A. Performance / Hydration Changes

Evaluation of the 7 modifications made outside the original 7 Technical SEO fixes:

| # | Change | Problem Solved | Affects Runtime? | Affects SEO? | Affects UI? | Affects Images? | Affects Booking? | Compatibility Risk? | Recommendation | Risk Level | Reason |
| :-: | :--- | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :--- |
| **1** | `src/components/Footer.tsx`<br>`suppressHydrationWarning` | Resolves React Error #418 (Hydration Mismatch) caused by SSR timestamp evaluation of dynamic copyright year `new Date().getFullYear()`. | No | No | No | No | No | None | **KEEP** | **LOW** | Standard React official recommendation for dynamic date/year nodes. Eliminates console runtime error. |
| **2** | `src/app/page.tsx`<br>Remove `priority` from mobile below-fold images; add `sizes` | Eliminates 4 Chrome DevTools yellow warnings (*"The resource ... was preloaded using link preload but not used within a few seconds from the window's load event"*). | No (loads via native lazy load) | Positive (less network contention) | No | Yes (optimal) | No | None | **KEEP** | **LOW** | Next.js best practice: only true above-the-fold LCP elements should have `priority`. Below-the-fold cards should not preload. |
| **3** | `src/app/tours/[slug]/page.tsx`<br>Responsive image `sizes` | Next.js `<Image fill>` defaults to `100vw` without `sizes`, downloading oversized images on desktop/mobile. | No | Positive (faster LCP) | No | Yes (optimal) | No | None | **KEEP** | **LOW** | Standard Next.js Image optimization. Ensures browser downloads correctly sized srcset variant. |
| **4** | `src/app/blog/[slug]/page.tsx`<br>Responsive image `sizes` | Same as #3. Added `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"` to blog cover image. | No | Positive (faster LCP) | No | Yes (optimal) | No | None | **KEEP** | **LOW** | Standard Next.js Image optimization for responsive hero banners. |
| **5** | `src/app/layout.tsx`<br>`Noto_Sans_JP` `preload: false` | Eliminates Lighthouse critical request chaining (*"Avoid chaining critical requests — 1,136 ms"* with 14 `.woff2` font slices totaling ~350 KiB). | No (text renders via system fallback with `display: 'swap'`) | Positive (drastically cuts FCP & LCP latency) | Minimal (seamless font swap) | No | No | None | **KEEP** | **LOW** | Japanese web fonts contain thousands of glyphs split into dozens of unicode slices. Preloading all slices blocks the critical path. `preload: false` allows instant text paint. |
| **6** | `package.json`<br>`browserslist` modern config | Eliminates 14 KiB of legacy polyfills (`Array.prototype.at`, `Object.hasOwn`, `String.prototype.trimStart`, etc.) flagged by Lighthouse (*"Legacy JavaScript"*). | No (modern JS targets) | Positive (smaller JS bundle) | No | No | No | None (all modern Japanese mobile browsers supported) | **KEEP** | **LOW** | Standard modern web configuration targeting active browsers (`defaults and fully supports es6-module, not dead`). |
| **7** | `next.config.ts`<br>`compress: true`, `optimizePackageImports`, `avif/webp` | Optimizes build output: tree-shakes `lucide-react` icons, enables Gzip/Brotli compression, and supports modern AVIF/WebP image formats. | No | Positive (lower TTFB and bundle size) | No | Yes (smaller file size) | No | None | **KEEP** | **LOW** | Next.js official performance features. Reduces unused JavaScript and speeds up asset transfer. |

---

## B. ESLint Errors

Execution of `npm run lint` identifies **8 errors** (and 38 unused variable warnings). All 8 errors belong to `react-hooks/set-state-in-effect`:

| # | File | Line | Current Code Pattern | Why ESLint Reports It | State Purpose | Trigger Condition | Intentional? | Could Alter Booking? | Recommended Fix | Risk Level |
| :-: | :--- | :-: | :--- | :--- | :--- | :--- | :-: | :-: | :--- | :-: |
| **1** | `src/components/AvailabilityCalendar.tsx` | 47:9 | `setIsPickingEnd(false)` in `useEffect` | Synchronous `setState` inside effect body can cause cascading re-renders. | Manages multi-day range state machine (whether user is selecting the start date or end date). | Changes to `[tripType, effectiveStart, effectiveEnd]`. | Yes | **YES** | Derive `isPickingEnd` during render (`tripType === 'multi' && Boolean(effectiveStart && !effectiveEnd)`) instead of synchronizing state in an effect. | **HIGH** |
| **2** | `src/components/AvailabilityCalendar.tsx` | 61:5 | `setIsLoading(true)` in `useEffect` | Synchronous `setState` in effect body before async `fetch`. | Shows loading spinner/skeleton while availability for the selected month is fetched from `/api/availability`. | Changes to `[currentYear, currentMonth]`. | Yes | No | Move `setIsLoading(true)` to the month navigation click handler or initialize state directly. | **LOW** |
| **3** | `src/components/BookingForm.tsx` | 57:7 | `setFormData((prev) => ({ ...prev, tripType: controlledTripType }))` | Synchronous `setState` in effect body syncing incoming prop to local state. | Tracks whether customer is requesting a single-day or multi-day tour. | Changes to `[controlledTripType]`. | Yes | **YES** | Use controlled state derivation (`const tripType = controlledTripType || formData.tripType`) or lift state to parent container. | **HIGH** |
| **4** | `src/components/BookingForm.tsx` | 63:7 | `setFormData((prev) => ({ ...prev, preferredDate: controlledStartDate }))` | Synchronous `setState` in effect body syncing calendar date to form date. | Populates the preferred start date in the booking form when customer clicks a date on `AvailabilityCalendar`. | Changes to `[controlledStartDate, initialDate]`. | Yes | **YES** | Derive value during render or update form state via an explicit callback handler (`onDateSelect`) instead of reactive prop synchronization. | **HIGH** |
| **5** | `src/components/BookingForm.tsx` | 71:7 | `setFormData((prev) => ({ ...prev, endDate: controlledEndDate }))` | Synchronous `setState` in effect body syncing multi-day end date to form. | Populates the return/end date in the booking form for multi-day tours. | Changes to `[controlledEndDate]`. | Yes | **YES** | Derive value during render or pass via explicit selection callback. | **HIGH** |
| **6** | `src/components/BookingForm.tsx` | 77:7 | `setFormData((prev) => ({ ...prev, tourSlug: initialTourSlug }))` | Synchronous `setState` in effect body syncing URL query param tour to form. | Pre-selects the tour plan in the dropdown when customer clicks "Book this plan" from a tour page (e.g. `/contact?tour=hue-imperial-city-day-trip`). | Changes to `[initialTourSlug]`. | Yes | **YES** | Initialize state lazily: `useState(() => ({ ...initialFormData, tourSlug: initialTourSlug || ... }))`. | **HIGH** |
| **7** | `src/app/admin/calendar/page.tsx` | 46:5 | `loadMonthData()` calling `setIsLoading(true)` in `useEffect` | Synchronous `setState` inside effect body. | Fetches admin availability data for calendar editor. | Changes to `[currentYear, currentMonth]`. | Yes | No (admin only) | Move `setIsLoading` to navigation handlers. | **LOW** |
| **8** | `src/app/admin/layout.tsx` | 17:7 | `setIsAuthenticated(true)` in `useEffect` | Synchronous `setState` inside effect body. | Bypasses auth check on `/admin/login`. | Changes to `pathname === '/admin/login'`. | Yes | No (admin only) | Derive authenticated state or handle via middleware. | **LOW** |

---

## C. Booking Flow Regression Risk

### Assessment: **HIGH RISK — HUMAN REVIEW REQUIRED**

The 4 effects in `BookingForm.tsx` (errors #3, #4, #5, #6) and the range effect in `AvailabilityCalendar.tsx` (error #1) are the **backbone of customer inquiry and booking data flow**:
1. **Calendar-to-Form Bridge:** When a user selects a date (or multi-day range) on the interactive calendar on `/contact`, these effects populate `preferredDate` and `endDate` into `BookingForm`.
2. **Tour Pre-Selection:** When a user arrives from a specific tour page (e.g. P11 `/tours/hue-imperial-city-day-trip`), effect #6 ensures the dropdown selects that specific tour rather than defaulting to P1.
3. **Trip Type Synchronicity:** Effect #3 ensures single-day vs multi-day field validation (passenger counts, duration calculation, schedule text) is synchronized.
4. **Final Submission:** The state stored by these effects is sent directly to Supabase (`bookings` table) and dispatches the confirmation email with the unique `VNJP` reference code.

> [!CAUTION]
> **Refactoring Warning:**  
> Changing these synchronization effects to satisfy ESLint must be done with extreme care. A naive refactor could disconnect the calendar from the form or cause the selected tour to reset to default upon re-render, directly impacting live customer conversions.

---

## D. SEO Regression

Verification confirms that none of the performance changes or existing component code alter SEO properties:

| SEO Property | Verified Status |
| :--- | :---: |
| **Canonical URLs** | **PRESERVED** — Canonical domain and route URLs match exactly without trailing slashes. |
| **Robots / Indexing** | **PRESERVED** — `robots.txt` and `noindex` rules on admin routes intact. |
| **Sitemap Generation** | **PRESERVED** — Generates exactly 22 URLs (4 core, 11 tours, 7 blogs). |
| **Metadata & Titles** | **PRESERVED** — All 11 tour titles match `{Tour Name} \| ベトナム日本語ガイド【ダナン出身・JLPT N1】`. |
| **H1 Hierarchy** | **PRESERVED** — Strictly one unique H1 per page. |
| **Structured Data** | **PRESERVED** — Single `TouristInformationCenter` on homepage, valid `FAQPage`, valid `BlogPosting` logo, normalized breadcrumb. |
| **URL Slugs** | **PRESERVED** — All 11 tour and 7 blog slugs remain identical. |

---

## E. Final Recommendation

### **HUMAN REVIEW REQUIRED**

### Recommended Next Steps for Human Reviewer:
1. **Performance / Hydration Changes:** Approve keeping all 7 performance modifications (**KEEP**). They improve Core Web Vitals, fix React error #418, resolve Chrome preload warnings, and introduce zero regression risks.
2. **SEO Fixes:** All 7 approved Technical SEO fixes are already verified and ready.
3. **ESLint Errors:** Make an architectural decision on the 8 `react-hooks/set-state-in-effect` errors:
   - **Option A (Safest & Fastest):** Keep the current working, thoroughly-tested booking synchronization logic as-is, since Next.js production build (`npm run build`) compiles cleanly (exit code 0) and functions properly in production.
   - **Option B (Strict Clean Linting):** Perform a dedicated, surgically tested refactor of `BookingForm` and `AvailabilityCalendar` with comprehensive end-to-end booking flow verification before deploying.
