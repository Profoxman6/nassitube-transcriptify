import { motion } from 'framer-motion';

interface FeaturesProps {
  isRTL: boolean;
}

const Features = ({ isRTL }: FeaturesProps) => {
  const features = [
    {
      title: isRTL ? 'نصوص دقيقة' : 'Accurate Transcripts',
      description: isRTL 
        ? 'احصل على نصوص عالية الدقة لمقاطع اليوتيوب'
        : 'Get high-accuracy transcripts for YouTube videos'
    },
    {
      title: isRTL ? 'تحميل سهل' : 'Easy Download',
      description: isRTL
        ? 'قم بتحميل النصوص بتنسيقات مختلفة'
        : 'Download transcripts in various formats'
    },
    {
      title: isRTL ? 'حفظ وتنظيم' : 'Save & Organize',
      description: isRTL
        ? 'احفظ النصوص المفضلة لديك ونظمها'
        : 'Save your favorite transcripts and organize them'
    }
  ];

  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white/10 p-6 rounded-lg backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;