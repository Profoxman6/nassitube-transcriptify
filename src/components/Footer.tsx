import { Github, Linkedin, Youtube, Facebook, ExternalLink } from 'lucide-react';

interface FooterProps {
  isRTL: boolean;
}

const Footer = ({ isRTL }: FooterProps) => {
  return (
    <footer className="mt-20 py-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-2">
              {isRTL ? 'تم التطوير بواسطة م. حسام الدين حسن' : 'Developed by Hossamudin Hassan'}
            </h3>
            <p className="text-gray-300 max-w-md">
              {isRTL 
                ? 'خريج جامعة زويل للعلوم والتكنولوجيا، مؤسس شركة Sparkling للتسويق والتقنية ومقدم محتوى تعليمي وتقني'
                : 'Alumnus of Zewail City of Science and Technology, Founder/CEO of Sparkling Business Solutions LLC FZ, and educational content creator'}
            </p>
          </div>
          <div className="flex gap-4">
            <a 
              href="https://epreneurs.link/vCard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors"
              title="Virtual Card"
            >
              <ExternalLink size={24} />
            </a>
            <a 
              href="https://www.youtube.com/@ePreneurs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors"
              title="YouTube"
            >
              <Youtube size={24} />
            </a>
            <a 
              href="https://www.linkedin.com/in/hossamudin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="https://www.facebook.com/KhabeerOnline/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors"
              title="Facebook"
            >
              <Facebook size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;