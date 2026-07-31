# زروان (Zervan)

سایت «کیمیای زمان» برای زروان — کاشی و سرامیک دست‌ساز.

## اجرا روی سیستم شما

```bash
npm install
npm run dev
```

سپس http://localhost:3000 را باز کنید.

## دیپلوی روی Vercel

1. این ریپازیتوری را در گیت‌هاب push کنید.
2. در [vercel.com](https://vercel.com) گزینه‌ی **New Project** را بزنید و ریپو را انتخاب کنید.
3. Framework Preset باید خودکار روی **Next.js** ست شود. نیازی به تنظیم دستی نیست.
4. Deploy را بزنید.

## قبل از دیپلوی واقعی (پابلیش نهایی) این‌ها را انجام دهید

این پروژه یک اسکلت فنی کامل و قابل اجراست، اما چند چیز placeholder هستند:

- **مدل سه‌بعدی**: `public/models/clay-morph-set.glb` وجود ندارد — باید در Blender با ۷ مورف‌تارگت (shape keys) روی یک توپولوژی مشترک ساخته و اکسپورت شود. تا وقتی این فایل نباشد، صفحه‌ی اصلی روی لود مدل خطا می‌دهد.
- **تصاویر پرتفولیو**: مسیرهای `public/portfolio/*.webp` در `data/portfolio.json` باید با عکس‌های واقعی پروژه‌ها جایگزین شوند.
- **شماره تماس**: در `components/ui/ProjectContactLinks.tsx`، مقادیر `PHONE` و `TELEGRAM_USERNAME` را با شماره و آیدی واقعی زروان جایگزین کنید (بهتر است این‌ها را به‌صورت متغیر محیطی `NEXT_PUBLIC_WHATSAPP_PHONE` و `NEXT_PUBLIC_TELEGRAM_USERNAME` هم منتقل کنید).
- **اتصال شیدر لعاب به مورف‌مش**: در `TimeSculptorCanvas.tsx` یک TODO باقی مانده — `ClayMorphMesh` باید یک prop برای override کردن متریال بپذیرد تا فاز دوم (لعاب) روی همان مش فاز اول اعمال شود.
- **فونت فارسی**: فعلاً فقط `serif` عمومی تنظیم شده. یک فونت نمایشی فارسی (مثل «Estedad» یا «Vazirmatn») را با `next/font/local` اضافه کنید و در `tailwind.config.js` جایگزین کنید.
- **دامنه در متادیتا**: در `app/layout.tsx` و `app/projects/[slug]/page.tsx` آدرس `https://zervan.studio` جای‌گذاری شده — با دامنه‌ی واقعی جایگزین کنید.

## ساختار

```
/app
  layout.tsx          ← RTL + متادیتا کلی سایت
  page.tsx             ← صفحه‌ی اصلی (Chrono-Sculptor)
  /api/generate-piece   ← موتور کیمیای داده (بدون هوش مصنوعی، قانون‌محور)
  /projects/[slug]      ← صفحه‌ی سئوپسند هر پروژه‌ی پرتفولیو
/components
  /canvas               ← صحنه سه‌بعدی، مش مورف، شیدر لعاب
  /ui                   ← آمولت‌ها، دراور پرتفولیو، نمایش شعر
/data
  portfolio.json
  poetryDatabase.json
```
