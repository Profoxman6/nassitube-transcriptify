interface AppPromotionProps {
  isRTL: boolean;
}

const AppPromotion = ({ isRTL }: AppPromotionProps) => {
  return (
    <section className="py-16 px-4" id="promotion">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-3xl font-bold text-white">
            {isRTL ? 'حول نصي تيوب' : 'About Nassi Tube'}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">
                {isRTL ? 'تحويل المحتوى بسهولة' : 'Easy Content Transformation'}
              </h3>
              <p className="text-gray-300">
                {isRTL 
                  ? 'حول مقاطع اليوتيوب إلى نصوص قابلة للتحرير بضغطة زر. مثالي للباحثين والطلاب والمحترفين.'
                  : 'Transform YouTube videos into editable text with just one click. Perfect for researchers, students, and professionals.'}
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">
                {isRTL ? 'ذكاء اصطناعي متقدم' : 'Advanced AI Features'}
              </h3>
              <p className="text-gray-300">
                {isRTL 
                  ? 'استفد من قوة الذكاء الاصطناعي لتلخيص النصوص وتحليلها بأي لغة تختارها.'
                  : 'Leverage the power of AI to summarize and analyze transcripts in any language of your choice.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromotion;