"use client";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen w-screen overflow-x-hidden bg-[#EFE8F7] relative flex items-center justify-center p-4 lg:p-6" dir="ltr">
      
      {/* التموجات اللونية الخلفية الناعمة */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-300/25 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-0 left-10 w-[350px] h-[350px] bg-purple-300/20 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* الحاوية الرئيسية للمنصة */}
      <section className="relative z-10 w-full max-w-[1180px] py-6 lg:py-8 rounded-[40px] bg-[#F6F3FB]/90 backdrop-blur-md shadow-2xl border border-white/80 flex items-center overflow-hidden">
        
        {/* توزيع مرن يمنع القص ويحافظ على المسافة بالمنتصف */}
        <div className="flex flex-col lg:flex-row w-full items-center justify-between px-6 lg:px-16 gap-8 lg:gap-4">
          
          {/* الجانب الأيسر: كارد الفورم الأبيض (حجم ملموم وقصير ينتهي مع عناصر الـ Form تلقائياً) */}
          <div className="w-full max-w-[400px] bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.01)] border border-gray-100/60 px-6 py-8 flex flex-col justify-center shrink-0 order-2 lg:order-1">
            
            {/* العناوين الممررة للمربع */}
            <div className="text-center mb-5" dir="rtl">
              <h1 className="text-2xl lg:text-[26px] font-black text-[#1F194C] tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1.5 text-xs font-medium text-[#7A749A]">
                  {subtitle}
                </p>
              )}
            </div>

            {/* الحقول والبريد والزر القادمة من الـ LoginForm تظهر هنا مباشرة */}
            <div className="w-full">
              {children}
            </div>

            {/* الفوتر الإضافي إن وجد */}
            {footer && (
              <div className="mt-4 w-full text-center text-xs text-gray-500">
                {footer}
              </div>
            )}
          </div>

          {/* مسافة أمان فاصلة بالمنتصف */}
          <div className="hidden lg:block lg:w-8 order-2"></div>

          {/* الجانب الأيمن: قسم النصوص والشعار والمميزات الملمومة */}
          <div className="w-full max-w-[460px] flex flex-col justify-center text-right order-1 lg:order-2" dir="rtl">
            
            {/* العنوان الإنجليزي الرئيسي الكبير */}
            <div className="mb-4" dir="ltr">
              <h2 className="text-4xl lg:text-[54px] font-black text-[#21166A] leading-[1.1] tracking-tight text-left">
                .Move Fast<br />Break Nothing.
              </h2>
            </div>

            {/* وصف المنصة تحت العنوان */}
            <p className="text-[13.5px] text-[#59528A] font-medium leading-relaxed mb-6 pr-1">
              منصة ذكية تدعم الأندية الجامعية بالتحديات والتحليلات الذكية لتطوير الأعضاء وصناعة أثر أكبر.
            </p>

            {/* شعار لفيف المتوازن */}
            <div className="flex items-center gap-3.5 mb-8 justify-start pr-1">
              <h3 className="text-5xl font-black text-[#21166A] tracking-tight select-none">
                لفيف
              </h3>
              <div className="flex gap-1.5 items-end h-10">
                <div className="w-3 h-6 rounded-full bg-[#8354E1]" />
                <div className="w-3 h-10 rounded-full bg-[#4E2ED5]" />
                <div className="w-3 h-4 rounded-full bg-[#B393F6]" />
              </div>
            </div>

            {/* قائمة الخصائص والمميزات الجانبية */}
            <div className="space-y-4 pr-1">
              
              {/* الميزة الأولى */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBE4F9] flex items-center justify-center shrink-0 shadow-sm">
                  <div className="flex gap-0.5 items-end">
                    <div className="w-0.5 h-2.5 rounded-sm bg-[#4E2ED5]"></div>
                    <div className="w-0.5 h-4.5 rounded-sm bg-[#4E2ED5]"></div>
                    <div className="w-0.5 h-3.5 rounded-sm bg-[#4E2ED5]"></div>
                  </div>
                </div>
                <div className="w-full">
                  <h4 className="text-[14px] font-bold text-[#21166A] mb-0.5 text-right w-full" dir="ltr">
                    Remove Bottlenecks
                  </h4>
                  <p className="text-[11.5px] text-[#6E6898] leading-relaxed">
                    تحسين تجربة الأندية الجامعية باستخدام الذكاء الاصطناعي والتحليلات الذكية والتحديات التفاعلية.
                  </p>
                </div>
              </div>

              {/* الميزة الثانية */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E1F6ED] flex items-center justify-center shrink-0 shadow-sm">
                  <svg className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="text-[14px] font-bold text-[#21166A] mb-0.5 text-right w-full" dir="ltr">
                    Access Risk Analysis
                  </h4>
                  <p className="text-[11.5px] text-[#6E6898] leading-relaxed">
                    نقدم تحليلات دقيقة تساعد الأندية على معرفة نقاط الضعف وفرص التطوير بشكل واضح.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </main>
  );
}