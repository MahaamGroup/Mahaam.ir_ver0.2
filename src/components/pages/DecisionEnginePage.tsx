import React, { useState } from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';
import { assessmentQuestions, decisionMatrixData } from '../../content/decision';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, ShieldCheck, Compass, 
  Send, Check, User, Phone, MessageSquare, HelpCircle, FileText, CheckSquare, Sparkles 
} from 'lucide-react';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { saveAssessment, AssessmentRecord } from '../../lib/assessmentStore';

interface DecisionEnginePageProps {
  onNavigate: (path: string) => void;
}

export const DecisionEnginePage: React.FC<DecisionEnginePageProps> = ({ onNavigate }) => {
  useDocumentMeta({
    title: 'ارزیابی مسیر و تطبیق شایستگی هوشمند',
    description: 'ابزار سنجش شایستگی و تطبیق اختصاصی برای انتخاب بهینه‌ترین مسیر فرامرزی با استانداردهای اروپا و ثبت پرونده برای کارشناسان.',
    canonicalPath: '/decision-engine'
  });

  // Steps:
  // 0: Intro & Decision Matrix
  // 1..5: Diagnostic Questions
  // 6: Specific Identification & Intent Questions
  // 7: Result Page with "ثبت و ارسال برای کارشناسان"
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedLabels, setSelectedLabels] = useState<Record<number, string>>({});
  const [viewMatrix, setViewMatrix] = useState(false);

  // Step 6 Form State:
  const salutationOptions = ['دکتر', 'مهندس', 'استاد', 'وکیل', 'مدیر', 'جناب آقای', 'سرکار خانم'];
  const [salutation, setSalutation] = useState('دکتر');
  const [fullName, setFullName] = useState('');
  
  const communicationChannelOptions = [
    { id: 'whatsapp', label: 'واتساپ (WhatsApp)' },
    { id: 'telegram', label: 'تلگرام (Telegram)' },
    { id: 'bale', label: 'پیام‌رسان بله (Bale)' },
    { id: 'sms', label: 'پیامک (SMS)' },
    { id: 'call', label: 'تماس تلفنی مستقیم' }
  ];
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['واتساپ (WhatsApp)', 'پیامک (SMS)']);
  const [phone, setPhone] = useState('');
  const [mainObjective, setMainObjective] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<AssessmentRecord | null>(null);

  const totalDiagnosticQuestions = assessmentQuestions.length; // 5

  const handleSelectOption = (questionId: number, optionId: string, label: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setSelectedLabels(prev => ({ ...prev, [questionId]: label }));
  };

  const toggleChannel = (label: string) => {
    setSelectedChannels(prev => 
      prev.includes(label) 
        ? prev.filter(c => c !== label) 
        : [...prev, label]
    );
  };

  const handleNext = () => {
    if (currentStep < totalDiagnosticQuestions) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } else if (currentStep === totalDiagnosticQuestions) {
      // Move to Step 6: Specific questions
      setCurrentStep(6);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } else if (currentStep === 6) {
      // Validate Step 6
      if (!fullName.trim() || !phone.trim()) {
        alert('لطفاً نام و شماره تماس خود را وارد نمایید.');
        return;
      }
      if (selectedChannels.length === 0) {
        alert('لطفاً حداقل یک روش دریافت پاسخ را انتخاب نمایید.');
        return;
      }
      // Move to Step 7: Result Screen
      setCurrentStep(7);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } else if (currentStep === 1) {
      setCurrentStep(0);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setSelectedLabels({});
    setFullName('');
    setPhone('');
    setMainObjective('');
    setAdditionalNotes('');
    setSubmissionResult(null);
  };

  // Determine recommended journey based on question 3 (goal)
  const getRecommendation = () => {
    const goalOptionId = answers[3] || 'goal_discovery';
    switch (goalOptionId) {
      case 'goal_experience':
        return {
          title: 'تجربه‌های بین‌المللی (International Experiences)',
          slug: 'experience',
          badge: 'شناخت میدانی و نزدیک محیط‌ها',
          desc: 'با توجه به اینکه اولویت شما لمس عینی محیط کار، حضور در کلینیک‌ها یا نهادهای داوری و تجاری اروپا پیش از هر تصمیم قطعی است، مطالعه مسیر تجربه‌های بین‌المللی افق شفافی به شما می‌دهد.'
        };
      case 'goal_setup':
        return {
          title: 'استقرار و توسعه (Setup & Expansion)',
          slug: 'development',
          badge: 'زیرساخت و حضور پایدار',
          desc: 'شما هدف مشخصی برای ثبت شرکت، تأسیس بازوی تجاری یا ساختار حقوقی فرامرزی دارید؛ لذا مطالعه مسیر استقرار و توسعه همراه با انطباق بانکی و مالیاتی برای پرونده شما مفید خواهد بود.'
        };
      case 'goal_growth':
        return {
          title: 'رشد و همکاری بلندمدت (Growth & Partnership)',
          slug: 'growth',
          badge: 'هم‌افزایی و ائتلاف‌های راهبردی',
          desc: 'تمرکز شما بر مقیاس‌پذیری بین‌المللی، ائتلاف با شرکت‌های اروپایی و سرمایه‌گذاری متقابل است؛ مطالعه این مسیر ساختار تعامل پایدار را روشن می‌سازد.'
        };
      case 'goal_discovery':
      case 'goal_career':
      default:
        return {
          title: 'کشف فرصت‌ها (Discover Opportunities)',
          slug: 'discovery',
          badge: 'شناخت و غربالگری گزینه‌ها',
          desc: 'شما در مرحله شناخت جامع هستید؛ بررسی مسیر کشف فرصت‌ها شرایط و مدارک شما را با نیازمندی‌های روز تطبیق داده و مانع از انتخاب‌های هیجانی یا پرریسک می‌گردد.'
        };
    }
  };

  const rec = getRecommendation();

  // Final Action: Save assessment to Database and submit to experts
  const handleSubmitToExperts = () => {
    setIsSubmitting(true);

    const diagnosticData = assessmentQuestions.map(q => ({
      questionId: q.id,
      stageName: q.stageName,
      questionText: q.headline,
      selectedOption: selectedLabels[q.id] || 'انتخاب نشده'
    }));

    setTimeout(() => {
      const record = saveAssessment({
        salutation,
        fullName: fullName.trim(),
        preferredChannels: selectedChannels,
        phone: phone.trim(),
        mainObjective: mainObjective.trim() || 'بررسی شایستگی و سناریوهای اقدام',
        additionalNotes: additionalNotes.trim(),
        diagnosticAnswers: diagnosticData,
        recommendedJourney: {
          title: rec.title,
          slug: rec.slug,
          badge: rec.badge
        }
      });

      setSubmissionResult(record);
      setIsSubmitting(false);
      window.scrollTo({ top: 220, behavior: 'smooth' });
    }, 600);
  };

  return (
    <div className="bg-[#F8F6F1] min-h-screen">
      <Breadcrumbs items={[{ label: 'موتور ارزیابی و تصمیم مهام' }]} onNavigate={onNavigate} />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#081525] to-[#0C2340] text-white py-14 md:py-20 border-b border-white/10 text-right">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9FC9E8]">
            <Compass className="w-4 h-4" />
            <span>Mahaam Decision Engine</span>
            <span aria-hidden="true">·</span>
            <span>ارزیابی شایستگی و تطبیق شرایط</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            تصمیم‌های مهم، با شناخت بهتر شروع می‌شوند.
          </h1>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            وقتی چند مسیر مختلف پیش روی شما قرار دارد، انتخاب درست فقط با گردآوری اطلاعات بیشتر اتفاق نمی‌افتد؛ بلکه باید شرایط، اولویت‌ها و خواسته اصلی شما شفاف شود.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
            <span>مدت زمان تکمیل: حدود ۳ الی ۴ دقیقه</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setViewMatrix(!viewMatrix)}
              className="text-[#9FC9E8] hover:underline cursor-pointer"
            >
              {viewMatrix ? 'بستن ماتریس تطبیق' : 'مشاهده ماتریس تطبیق تصمیم (Decision Matrix)'}
            </button>
          </div>
        </div>
      </section>

      {/* Decision Matrix Modal / Panel */}
      {viewMatrix && (
        <section className="py-8 bg-white border-b border-[#BAC3CE]/40 text-right">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <h3 className="text-lg font-bold text-[#0C2340]">{decisionMatrixData.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{decisionMatrixData.description}</p>
            <div className="overflow-x-auto border border-[#BAC3CE]/40 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#EEF1F3] text-[#0C2340]">
                  <tr>
                    {decisionMatrixData.columns.map((c, idx) => (
                      <th key={idx} className="p-3 font-semibold">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BAC3CE]/30">
                  {decisionMatrixData.rows.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-[#0C2340]">{r.audience}</td>
                      <td className="p-3 text-slate-600">{r.goal}</td>
                      <td className="p-3 text-[#3658B6] font-semibold">{r.journey}</td>
                      <td className="p-3 text-slate-600">{r.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Assessment Body */}
      <section className="py-12 md:py-20 text-right">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* SCREEN 0: Intro */}
          {currentStep === 0 && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#BAC3CE]/40 shadow-sm space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF1F3] flex items-center justify-center text-[#3658B6]">
                <Compass className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#0C2340]">
                  ابتدا شرایط خود را بشناسید، سپس مسیر مناسب را بررسی کنید.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  هر فرد یا سازمان شرایط کاملاً متفاوتی دارد. برای اینکه بتوانیم سناریوهای قابل بررسی را بهتر مشخص کنیم، ۵ پرسش ساختارمند درباره وضعیت، تخصص، هدف و اولویت‌های شما مطرح می‌شود و در گام بعد، خواسته‌ها و مشخصات ارتباطی شما برای کارشناسان ثبت خواهد شد.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#EEF1F3] border border-[#BAC3CE]/40 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#6DA616] shrink-0" />
                  <span>بررسی ساختاریافته در ۵ محور تخصصی و یک مرحله تکمیلی</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#6DA616] shrink-0" />
                  <span>تطبیق هوشمند با سفرها و تجارب موفق مهام در اروپا</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#6DA616] shrink-0" />
                  <span>امکان ثبت رسمی پرونده و ارسال جهت بررسی اختصاصی توسط کارشناسان ارشد</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>شروع ارزیابی شرایط من</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 1..5: Diagnostic Questions */}
          {currentStep >= 1 && currentStep <= totalDiagnosticQuestions && (() => {
            const currentQ = assessmentQuestions[currentStep - 1];
            const currentAns = answers[currentQ.id];

            return (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#BAC3CE]/40 shadow-sm space-y-8">
                
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
                    <span className="font-semibold text-[#0D5A63]">{currentQ.stageName}</span>
                    <span>گام {currentStep} از ۶</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EEF1F3] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#3658B6] rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / 6) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Info */}
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0C2340]">
                    {currentQ.headline}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {currentQ.question}
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = currentAns === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, opt.id, opt.label)}
                        className={`w-full p-4 sm:p-5 rounded-2xl border text-right transition-all flex items-start gap-4 cursor-pointer ${
                          isSelected
                            ? 'bg-[#EEF1F3] border-[#3658B6] shadow-sm ring-1 ring-[#3658B6]'
                            : 'bg-white border-[#BAC3CE]/40 hover:bg-slate-50 hover:border-[#BAC3CE]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected 
                            ? 'border-[#3658B6] bg-[#3658B6] text-white' 
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <div className="space-y-1">
                          <span className={`block text-sm font-bold ${isSelected ? 'text-[#0C2340]' : 'text-slate-800'}`}>
                            {opt.label}
                          </span>
                          {opt.description && (
                            <span className="block text-xs text-slate-500 leading-relaxed">
                              {opt.description}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="pt-6 border-t border-[#EEF1F3] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0C2340] cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>مرحله قبل</span>
                  </button>

                  <button
                    type="button"
                    disabled={!currentAns}
                    onClick={handleNext}
                    className={`inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      currentAns
                        ? 'bg-[#3658B6] text-white hover:bg-[#2B4696] shadow-sm'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>مرحله بعد</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })()}

          {/* SCREEN 6: Specific Identification & Intent Questions */}
          {currentStep === 6 && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#BAC3CE]/40 shadow-sm space-y-8">
              
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-sans">
                  <span className="font-semibold text-[#0D5A63]">مرحله ششم: مشخصات و خواسته اصلی شما</span>
                  <span>گام ۶ از ۶</span>
                </div>
                <div className="w-full h-1.5 bg-[#EEF1F3] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#6DA616] rounded-full transition-all duration-300"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0C2340]">
                  تنظیم مشخصات ارتباطی و خواسته مشخص شما
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  این اطلاعات به کارشناسان ارشد مهام کمک می‌کند پاسخ را دقیقاً متناسب با عنوان حرفه‌ای، ترجیح ارتباطی و خواسته شما تنظیم کنند.
                </p>
              </div>

              <div className="space-y-6 pt-2">
                
                {/* 1. Salutation & Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#0C2340]">
                    به چه نامی با شما در ارتباط باشیم؟ <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Salutation selection chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pb-1">
                    <span className="text-[11px] text-slate-400 ml-1">عنوان شما:</span>
                    {salutationOptions.map(sal => (
                      <button
                        key={sal}
                        type="button"
                        onClick={() => setSalutation(sal)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          salutation === sal
                            ? 'bg-[#0C2340] text-white shadow-xs'
                            : 'bg-[#EEF1F3] text-slate-600 hover:bg-[#BAC3CE]/40'
                        }`}
                      >
                        {sal}
                      </button>
                    ))}
                  </div>

                  {/* Name Input */}
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={`مثال: ${salutation} مریم صادقی`}
                      className="w-full pl-4 pr-10 py-3 bg-[#F8F6F1] rounded-2xl border border-transparent focus:border-[#3658B6] focus:bg-white focus:outline-none text-xs sm:text-sm text-slate-800 transition-all text-right"
                    />
                  </div>
                </div>

                {/* 2. Preferred Communication Channels */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#0C2340]">
                    از چه طریقی ترجیح می‌دهید پاسخ خود را دریافت کنید؟ <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-400">می‌توانید یک یا چند گزینه را انتخاب فرمایید:</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {communicationChannelOptions.map(ch => {
                      const isChecked = selectedChannels.includes(ch.label);
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => toggleChannel(ch.label)}
                          className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-blue-50/70 border-[#3658B6] text-[#0C2340]'
                              : 'bg-white border-[#BAC3CE]/40 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xs font-medium">{ch.label}</span>
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked 
                              ? 'bg-[#3658B6] border-[#3658B6] text-white' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Phone input */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      شماره تماس شما (همراه یا خط مستقیم): <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="۰۹۱۲۰۰۰۰۰۰۰ یا خط ثابت"
                        className="w-full pl-4 pr-10 py-3 bg-[#F8F6F1] rounded-2xl border border-transparent focus:border-[#3658B6] focus:bg-white focus:outline-none text-xs sm:text-sm text-slate-800 transition-all text-right dir-ltr"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Main Objective */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0C2340]">
                    خواسته اصلی شما چیست؟
                  </label>
                  <p className="text-[11px] text-slate-400">مهم‌ترین سوال، هدف یا خروجی که به دنبال آن هستید را بنویسید:</p>
                  <textarea
                    rows={2}
                    value={mainObjective}
                    onChange={(e) => setMainObjective(e.target.value)}
                    placeholder="مثال: تطبیق دانشنامه و گذراندن دوره بالینی در آلمان / تأسیس شعبه تجاری در اروپا / شرکت در دوره‌های هیئت‌های تخصصی لاهه..."
                    className="w-full p-3.5 bg-[#F8F6F1] rounded-2xl border border-transparent focus:border-[#3658B6] focus:bg-white focus:outline-none text-xs sm:text-sm text-slate-800 transition-all text-right resize-none"
                  />
                </div>

                {/* 4. Additional Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0C2340]">
                    توضیحات بیشتری که به کارشناسان ما برای شناخت بهتر شرایط شما کمک کند:
                  </label>
                  <p className="text-[11px] text-slate-400">سوابق تحصیلی یا شغلی، سطح زبان، افق زمانی مدنظر یا شرایط خاص خانوادگی (اختیاری):</p>
                  <textarea
                    rows={3}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="هر نکته‌ای که در ارزیابی دقیق‌تر پرونده شما توسط مشاوران مهام نقش دارد..."
                    className="w-full p-3.5 bg-[#F8F6F1] rounded-2xl border border-transparent focus:border-[#3658B6] focus:bg-white focus:outline-none text-xs sm:text-sm text-slate-800 transition-all text-right resize-none"
                  />
                </div>

              </div>

              {/* Navigation Buttons */}
              <div className="pt-6 border-t border-[#EEF1F3] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0C2340] cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>مرحله قبل</span>
                </button>

                <button
                  type="button"
                  disabled={!fullName.trim() || !phone.trim() || selectedChannels.length === 0}
                  onClick={handleNext}
                  className={`inline-flex items-center gap-2 px-8 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    fullName.trim() && phone.trim() && selectedChannels.length > 0
                      ? 'bg-[#3658B6] text-white hover:bg-[#2B4696] shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>بازبینی</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* SCREEN 7: Assessment Result & Submit to Experts */}
          {currentStep === 7 && (
            <div className="space-y-6">
              
              {/* SUCCESS CONFIRMATION MODAL / BANNER (AFTER SUBMIT) */}
              {submissionResult && (
                <div className="bg-gradient-to-br from-[#0C2340] to-[#132E52] rounded-3xl p-7 sm:p-9 text-white shadow-2xl border border-white/20 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#6DA616] text-white flex items-center justify-center shrink-0 shadow-lg">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#9FC9E8]">ثبت نهایی و تخصیص کارشناس</span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        اطلاعات پرونده با موفقیت در دیتابیس ثبت و به کارشناس ارشد ارجاع گردید
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    با سپاس از اعتماد شما، {salutation} {fullName} گرامی. پاسخ‌های تشخیصی ۵ گانه شما به همراه خواسته اصلی ثبت‌شده، برای ممیزی در اختیار کارشناس مسئول دپارتمان تخصصی مهام قرار گرفت.
                  </p>

                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-slate-300 block text-[11px]">کد رهگیری اختصاصی پرونده شما:</span>
                      <span className="text-base font-bold font-mono text-[#9FC9E8]">{submissionResult.trackingCode}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-300 block text-[11px]">نحوه برقراری ارتباط:</span>
                      <span className="font-semibold text-white">از طریق {selectedChannels.join(' / ')}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex flex-col sm:flex-row items-center gap-3 text-xs">
                    <button
                      onClick={() => onNavigate(`/journeys/${rec.slug}`)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#3658B6] hover:bg-[#2B4696] text-white font-semibold transition-colors cursor-pointer text-center"
                    >
                      مطالعه تفصیلی مسیر {rec.title}
                    </button>
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer text-center"
                    >
                      شروع مجدد ارزیابی
                    </button>
                  </div>
                </div>
              )}

              {/* TOP BOX 1: اطلاعات هویتی و پاسخ‌های ثبت‌شده + دکمه ثبت و ارسال */}
              <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#BAC3CE]/40 shadow-sm space-y-5">
                
                <div className="flex items-center justify-between border-b border-[#EEF1F3] pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-[#0C2340] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#3658B6]" />
                    <span>اطلاعات هویتی و پاسخ‌های ثبت‌شده:</span>
                  </h3>

                  <button
                    onClick={() => setCurrentStep(6)}
                    className="text-xs text-[#3658B6] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ویرایش مشخصات</span>
                  </button>
                </div>

                {/* Profile Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-700">
                  <div className="p-3 rounded-xl bg-[#F8F6F1] border border-[#BAC3CE]/30">
                    <span className="text-slate-400 block mb-0.5 text-[11px]">نام متقاضی:</span>
                    <span className="font-bold text-[#0C2340] text-sm">{salutation} {fullName}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8F6F1] border border-[#BAC3CE]/30">
                    <span className="text-slate-400 block mb-0.5 text-[11px]">شماره تماس مستقیم:</span>
                    <span className="font-bold text-[#0C2340] dir-ltr inline-block text-sm font-sans" dir="ltr">{phone}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8F6F1] border border-[#BAC3CE]/30">
                    <span className="text-slate-400 block mb-0.5 text-[11px]">کانال‌های ترجیحی پاسخ:</span>
                    <span className="font-semibold text-[#0D5A63]">{selectedChannels.join('، ')}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F8F6F1] border border-[#BAC3CE]/30">
                    <span className="text-slate-400 block mb-0.5 text-[11px]">گروه و حوزه حرفه‌ای:</span>
                    <span className="font-semibold text-[#0C2340]">{selectedLabels[1] || 'متخصص'} · {selectedLabels[2] || 'تخصصی'}</span>
                  </div>

                  <div className="sm:col-span-2 p-3 rounded-xl bg-[#F8F6F1] border border-[#BAC3CE]/30">
                    <span className="text-slate-400 block mb-0.5 text-[11px]">خواسته اصلی ثبت شده:</span>
                    <span className="font-medium text-slate-800 leading-relaxed block">
                      {mainObjective || 'بررسی شایستگی و سناریوهای اقدام'}
                    </span>
                  </div>

                  {additionalNotes && (
                    <div className="sm:col-span-2 p-3 rounded-xl bg-[#F8F6F1] border border-[#BAC3CE]/30">
                      <span className="text-slate-400 block mb-0.5 text-[11px]">توضیحات تکمیلی:</span>
                      <span className="text-slate-600 leading-relaxed block">
                        {additionalNotes}
                      </span>
                    </div>
                  )}
                </div>

                {/* SUBMIT BUTTON: ثبت و ارسال برای کارشناسان (Right below identity box) */}
                {!submissionResult && (
                  <div className="pt-4 border-t border-[#EEF1F3] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F8F6F1]/60 p-4 rounded-2xl">
                    <div className="space-y-0.5 text-right">
                      <span className="text-xs font-bold text-[#0C2340] block">
                        تأیید و ارسال نهایی جهت ممیزی کارشناسان ارشد مهام
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        اطلاعات شما در سامانه ثبت و کد رهگیری پرونده صادر خواهد شد.
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmitToExperts}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#0C2340] hover:bg-[#3658B6] rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4 rotate-180" />
                      <span>{isSubmitting ? 'در حال ثبت در دیتابیس...' : 'ثبت و ارسال برای کارشناسان'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* BOTTOM BOX 2: هم‌راستا با شرایط شما مطالعه این صفحه می‌تواند مفید باشد (Smaller font underneath) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#BAC3CE]/40 shadow-sm space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#3658B6] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 inline-block">
                      {rec.badge}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-[#0C2340] leading-snug">
                      هم‌راستا با شرایط شما مطالعه این صفحه می‌تواند مفید باشد:
                    </h4>
                  </div>

                  <button
                    onClick={() => onNavigate(`/journeys/${rec.slug}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#3658B6] hover:bg-[#2B4696] transition-colors shrink-0 cursor-pointer"
                  >
                    <span>مطالعه تفصیلی صفحه</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#BAC3CE]/30 space-y-1.5">
                  <h5 className="text-xs sm:text-sm font-bold text-[#0C2340]">
                    {rec.title}
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rec.desc}
                  </p>
                </div>
              </div>

              {/* Reassurance note */}
              <div className="flex items-center gap-2.5 text-xs text-slate-500 bg-[#EEF1F3] p-3.5 rounded-2xl border border-[#BAC3CE]/40">
                <ShieldCheck className="w-4 h-4 text-[#6DA616] shrink-0" />
                <span>گروه مهام هیچ‌گونه اطلاعات ثبت‌شده را در اختیار اشخاص ثالث قرار نمی‌دهد و کلیه ارزیابی‌ها مستند به ضوابط حاکمیتی و حقوقی انجام می‌پذیرد.</span>
              </div>

            </div>
          )}

        </div>
      </section>
    </div>
  );
};
