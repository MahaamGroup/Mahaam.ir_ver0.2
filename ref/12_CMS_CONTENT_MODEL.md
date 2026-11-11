# مدل محتوای CMS

## موجودیت‌ها

### Audience

`title`, `slug`, `summary`, `hero`, `concerns[]`, `opportunities[]`, `journeys[]`, `insights[]`, `faqs[]`, `seo`, `status`.

### Journey

`title`, `slug`, `summary`, `hero`, `fitFor[]`, `considerations[]`, `processSteps[]`, `audiences[]`, `experiences[]`, `insights[]`, `faqs[]`, `seo`, `status`.

### Insight

`title`, `slug`, `excerpt`, `body`, `category`, `tags[]`, `coverImage`, `relatedAudiences[]`, `relatedJourneys[]`, `seo`, `publishedAt`, `status`.

### Experience

`title`, `summary`, `type`, `body`, `media[]`, `dateOrPeriod`, `claimsApproved`, `relatedJourneys[]`, `status`.

### FAQ و Global Settings

FAQ شامل پرسش، پاسخ، دسته، ترتیب و ارتباط‌هاست. Global Settings شامل ناوبری، فوتر، راه‌های تماسِ تأییدشده، متن رضایت و SEO سازمانی است.

## کنترل انتشار

وضعیت‌ها: `draft`, `in_review`, `published`, `archived`. انتشار Experience، آمار، شریک یا هر claim فقط بعد از تأیید صریح امکان‌پذیر است.
