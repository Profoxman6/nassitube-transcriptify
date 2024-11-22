import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Cloud, Download, Clipboard, User, Search } from "lucide-react";
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import TranscriptGenerator from '@/components/TranscriptGenerator';

const Index = () => {
  const [isRTL, setIsRTL] = useState(false);
  const { toast } = useToast();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-900 to-teal-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">نصي تيوب - Nassi Tube</h1>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="text-white"
            onClick={() => setIsRTL(!isRTL)}
          >
            {isRTL ? 'English' : 'العربية'}
          </Button>
          <Button variant="outline" className="text-white">
            <User className="mr-2 h-4 w-4" />
            {isRTL ? 'تسجيل الدخول' : 'Login'}
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Hero isRTL={isRTL} />
        <Features isRTL={isRTL} />
        <TranscriptGenerator isRTL={isRTL} />
      </main>
    </div>
  );
};

export default Index;