import { motion } from 'framer-motion';
import { Cloud, Download, Clipboard } from 'lucide-react';

interface HeroProps {
  isRTL: boolean;
}

const Hero = ({ isRTL }: HeroProps) => {
  return (
    <section className="text-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          {isRTL ? 'حول مقاطع يوتيوب إلى نصوص' : 'Transform YouTube Videos into Text'}
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          {isRTL 
            ? 'احصل على نصوص دقيقة لمقاطع اليوتيوب بنقرة واحدة'
            : 'Get accurate transcripts of YouTube videos with just one click'}
        </p>
        <p className="text-sm text-gray-400 mb-8">
          {isRTL
            ? 'تم تطويره بواسطة م. حسام الدين حسن - خبير في التعليم الإلكتروني وصناعة المحتوى'
            : 'Developed by Hossamudin Hassan - E-learning and Content Creation Expert'}
        </p>
      </motion.div>

      <div className="flex justify-center gap-8">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-primary"
        >
          <Cloud size={40} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="text-primary"
        >
          <Download size={40} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          className="text-primary"
        >
          <Clipboard size={40} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;