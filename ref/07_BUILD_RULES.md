# قواعد ساخت و تحویل

## پشتهٔ فنی

Next.js App Router، TypeScript strict، Node.js LTS، pnpm، Tailwind، CSS variables، Server Components به‌صورت پیش‌فرض، Zod برای validation و Lucide برای آیکون‌ها.

## قواعد معماری

- ابتدا server، سپس URL state، سپس state محلی؛ state سراسری فقط با ضرورت روشن.
- هر سرویس، component و utility تک‌مسئولیتی و کوتاه باشد.
- داده‌های واقعی در content layer/CMS نگهداری شوند، نه در JSX.
- خطاهای global و route، 404 و loading state الزامی‌اند.
- هیچ secret یا دادهٔ فرم در repository یا log عمومی قرار نگیرد.

## ممنوعات

کپی placeholder در انتشار، دادهٔ ساختگی، inline style برای طراحی، وابستگی بدون توجیه، component تکراری، CTAهای فشاری و ادعاهای تأییدنشده.

## کیفیت لازم پیش از تحویل

typecheck، lint، تست‌های حیاتی، بررسی keyboard/a11y، اعتبار لینک‌ها و metadata، بازبینی موبایل و production build همگی باید موفق باشند.
