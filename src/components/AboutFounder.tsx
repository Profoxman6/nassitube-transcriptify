import { ExternalLink } from 'lucide-react';

interface AboutFounderProps {
  isRTL: boolean;
}

const AboutFounder = ({ isRTL }: AboutFounderProps) => {
  return (
    <section className="py-16 px-4 bg-white/5" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h2 className="text-3xl font-bold text-white">
              {isRTL ? 'حسام الدين حسن' : 'Hossamudin Hassan'}
            </h2>
            <p className="text-gray-300 text-lg">
              {isRTL 
                ? 'خبير في التحول الرقمي والذكاء الاصطناعي، مؤسس شركة Sparkling للتسويق والتقنية، ومقدم محتوى تعليمي على منصة Epreneurs.'
                : 'Digital Transformation & AI Expert, Founder of Sparkling Business Solutions, and Educational Content Creator at Epreneurs.'}
            </p>
            <div className="flex gap-4">
              <a 
                href="https://epreneurs.link/vCard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink size={20} />
                {isRTL ? 'بطاقة التواصل' : 'Contact Card'}
              </a>
            </div>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/8V4rwtF-3kQ"
              title="Top AI Tools for Startups"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutFounder;