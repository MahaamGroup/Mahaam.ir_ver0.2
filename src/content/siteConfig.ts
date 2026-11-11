/**
 * Global Site Configuration & Master Copy
 * Mahaam International Group
 */

export const siteConfig = {
  name: 'گروه بین‌المللی مهام',
  englishName: 'Mahaam International Group',
  tagline: 'همراه تصمیم‌های مهم و مسیرهای آینده',
  description: 'گروه بین‌المللی مهام همراه افراد، متخصصان، مدیران و سازمان‌هاست تا فرصت‌های توسعه، ارتباطات حرفه‌ای و تجربه‌های بین‌المللی متناسب با شرایط واقعی خود را بهتر بشناسند.',
  logo: '/site_logo.png',
  
  navigation: [
    { label: 'خانه', href: '/' },
    { 
      label: 'مخاطبان', 
      href: '/audiences',
      children: [
        { label: 'پزشکان و سلامت', href: '/audiences/health', desc: 'برای متخصصان حوزه بهداشت و درمان' },
        { label: 'وکلا و حقوقی', href: '/audiences/law', desc: 'برای متخصصان حقوق و مشاوران قانونی' },
        { label: 'مدیران', href: '/audiences/management', desc: 'برای مدیران ارشد و استراتژیک' },
        { label: 'صاحبان کسب‌وکار', href: '/audiences/business', desc: 'برای کارآفرینان و توسعه بازار' },
        { label: 'متخصصان', href: '/audiences/specialists', desc: 'برای مهندسان، پژوهشگران و اساتید' },
      ]
    },
    { 
      label: 'مسیرها', 
      href: '/journeys',
      children: [
        { label: 'کشف فرصت‌ها', href: '/journeys/discovery', desc: 'شناخت گزینه‌ها و تحلیل شرایط' },
        { label: 'تجربه‌های بین‌المللی', href: '/journeys/experience', desc: 'شناخت میدانی محیط‌ها و مجموعه‌ها' },
        { label: 'استقرار و توسعه', href: '/journeys/development', desc: 'زیرساخت‌های شروع فعالیت' },
        { label: 'رشد و همکاری بلندمدت', href: '/journeys/growth', desc: 'توسعه ارتباطات و پروژه‌های مشترک' },
      ]
    },
    { label: 'ارزیابی مسیر', href: '/decision-engine' },
    { label: 'تجربه‌ها', href: '/experiences' },
    { label: 'بینش‌ها', href: '/insights' },
    { label: 'درباره گروه مهام', href: '/about' },
    { label: 'ارتباط با ما', href: '/contact' },
  ],

  contact: {
    phone: '۰۲۱-۲۲۶۶۳۰۰۲',
    phoneSecondary: '۰۲۱-۲۲۶۶۳۰۰۱',
    rawPhone: '+982122663002',
    rawPhoneSecondary: '+982122663001',
    email: 'info@mahaam.ir',
    inquiryEmail: 'inquiry@mahaam.ir',
    address: 'تهران، خیابان جردن (نلسون ماندلا)، خیابان سلطانی (سایه)، پلاک ۸۲، طبقه چهارم',
    workingHours: 'شنبه تا چهارشنبه ۹:۳۰ الی ۱۷:۳۰',
    social: [
      { name: 'LinkedIn', href: 'https://linkedin.com/company/mahaam-group' },
      { name: 'Telegram', href: 'https://t.me/mahaam_insights' },
      { name: 'Aparat', href: 'https://aparat.com/mahaam' },
    ]
  },

  principles: [
    {
      title: 'Audience Driven',
      desc: 'ابتدا هویت و مسئله واقعی مخاطب شناخته می‌شود، نه تحمیل خدمات.'
    },
    {
      title: 'Journey Driven',
      desc: 'مخاطب در یک سیر تحلیلی و مرحله‌بندی‌شده قرار می‌گیرد.'
    },
    {
      title: 'Decision Driven',
      desc: 'هدف غایی، توانمندسازی مخاطب در تصمیم‌گیری آگاهانه و کاهش ریسک است.'
    }
  ]
};
