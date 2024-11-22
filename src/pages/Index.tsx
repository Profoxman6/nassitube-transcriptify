import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import TranscriptGenerator from '@/components/TranscriptGenerator';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

const Index = () => {
  const [isRTL, setIsRTL] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAuthClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-900 to-teal-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">نصي تيوب - Nassi Tube</h1>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="text-white hover:text-white"
            onClick={() => setIsRTL(!isRTL)}
          >
            {isRTL ? 'English' : 'العربية'}
          </Button>
          <Button 
            variant="outline" 
            className="text-yellow-300 border-yellow-300 hover:bg-yellow-300 hover:text-yellow-900"
            onClick={handleAuthClick}
          >
            <User className="mr-2 h-4 w-4" />
            {isRTL ? 'تسجيل الدخول' : user ? 'Profile' : 'Login'}
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Hero isRTL={isRTL} />
        <Features isRTL={isRTL} />
        <TranscriptGenerator isRTL={isRTL} />
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
};

export default Index;