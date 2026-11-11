# ساختار پیشنهادی پروژه

```text
src/
  app/
    (marketing)/
      page.tsx
      about/page.tsx
      audiences/[slug]/page.tsx
      journeys/[slug]/page.tsx
      insights/[slug]/page.tsx
      contact/page.tsx
    api/contact/route.ts
    sitemap.ts
    robots.ts
    layout.tsx
    not-found.tsx
    error.tsx
  components/
    layout/ navigation/ content/ forms/ seo/ ui/
  content/
  features/contact/
  lib/
  schemas/
  types/
```

نام‌ها باید دامنه‌محور باشند. محتوای CMS یا adapter آن در `content`/`lib` جدا از componentها نگهداری شود.
