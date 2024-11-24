import { Sparkles, Languages, Edit3, Download, Share2, Bot } from 'lucide-react';

interface FeaturesProps {
  isRTL: boolean;
}

const Features = ({ isRTL }: FeaturesProps) => {
  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-yellow-300" />,
      titleEn: "Smart Transcript Generation",
      titleAr: "إنشاء نصوص ذكي",
      descEn: "Extract accurate transcripts from YouTube videos with support for multiple languages.",
      descAr: "استخرج نصوصًا دقيقة من مقاطع يوتيوب مع دعم للغات متعددة"
    },
    {
      icon: <Languages className="h-6 w-6 text-yellow-300" />,
      titleEn: "Multilingual Support",
      titleAr: "دعم متعدد اللغات",
      descEn: "Generate transcripts in various languages with our advanced language detection.",
      descAr: "إنشاء نصوص بلغات متعددة مع نظام ذكي للكشف عن اللغات"
    },
    {
      icon: <Bot className="h-6 w-6 text-yellow-300" />,
      titleEn: "AI-Powered Summaries",
      titleAr: "ملخصات بالذكاء الاصطناعي",
      descEn: "Get smart summaries of your transcripts using Google's Gemini AI, with custom instructions support.",
      descAr: "احصل على ملخصات ذكية لنصوصك باستخدام Gemini AI مع دعم للتعليمات المخصصة"
    },
    {
      icon: <Edit3 className="h-6 w-6 text-yellow-300" />,
      titleEn: "Advanced Editor",
      titleAr: "محرر متقدم",
      descEn: "Edit your transcripts with our powerful markdown editor featuring highlighting and formatting options.",
      descAr: "حرر نصوصك باستخدام محرر متقدم يدعم التنسيق وإبراز النصوص"
    },
    {
      icon: <Download className="h-6 w-6 text-yellow-300" />,
      titleEn: "Easy Export",
      titleAr: "تصدير سهل",
      descEn: "Download your transcripts and summaries in various formats for offline use.",
      descAr: "قم بتحميل النصوص والملخصات بصيغ مختلفة للاستخدام دون اتصال"
    },
    {
      icon: <Share2 className="h-6 w-6 text-yellow-300" />,
      titleEn: "Share & Collaborate",
      titleAr: "المشاركة والتعاون",
      descEn: "Share your transcripts easily with others and collaborate on content.",
      descAr: "شارك نصوصك بسهولة مع الآخرين وتعاون على المحتوى"
    }
  ];

  return (
    <section className="py-16 px-4" id="features">
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-3xl font-bold text-white mb-12 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? 'مميزات نصي تيوب' : 'Nassi Tube Features'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                {feature.icon}
                <h3 className="text-xl font-semibold text-white">
                  {isRTL ? feature.titleAr : feature.titleEn}
                </h3>
              </div>
              <p className="text-gray-300">
                {isRTL ? feature.descAr : feature.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;