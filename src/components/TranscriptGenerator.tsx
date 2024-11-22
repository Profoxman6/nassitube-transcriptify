import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TranscriptGeneratorProps {
  isRTL: boolean;
}

interface Subtitle {
  languageName: string;
  languageCode: string;
  isTranslatable: boolean;
  url: string;
}

const TranscriptGenerator = ({ isRTL }: TranscriptGeneratorProps) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const generateTranscript = async () => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      toast({
        title: isRTL ? 'رابط غير صالح' : 'Invalid URL',
        description: isRTL 
          ? 'يرجى إدخال رابط يوتيوب صالح'
          : 'Please enter a valid YouTube URL',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://yt-api.p.rapidapi.com/subtitles?idear=${videoId}`, {
        headers: {
          'X-RapidAPI-Key': '7cbc1fe90emshb480565372d1785p1cc5f4jsn92a4dc44058f',
          'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
        }
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      
      // Parse the response string if it's a string
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (parsedData.subtitles && Array.isArray(parsedData.subtitles)) {
        setSubtitles(parsedData.subtitles);
        
        // Auto-select English if available
        const englishSubtitle = parsedData.subtitles.find(
          (sub: Subtitle) => sub.languageCode === 'en' || sub.languageCode.startsWith('en-')
        );
        if (englishSubtitle) {
          setSelectedLanguage(englishSubtitle.languageCode);
          await fetchTranscript(englishSubtitle.url);
        } else if (parsedData.subtitles.length > 0) {
          setSelectedLanguage(parsedData.subtitles[0].languageCode);
          await fetchTranscript(parsedData.subtitles[0].url);
        }
      } else {
        setTranscript('No transcripts available');
        toast({
          title: isRTL ? 'لا توجد نصوص' : 'No Transcripts',
          description: isRTL 
            ? 'لا تتوفر نصوص لهذا الفيديو'
            : 'No transcripts available for this video',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: isRTL ? 'حدث خطأ' : 'Error',
        description: isRTL 
          ? 'حدث خطأ أثناء إنشاء النص'
          : 'An error occurred while generating the transcript',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTranscript = async (subtitleUrl: string) => {
    try {
      const response = await fetch(subtitleUrl);
      if (!response.ok) throw new Error('Failed to fetch transcript');
      const data = await response.text();
      setTranscript(data);
    } catch (error) {
      setTranscript('Failed to load transcript');
      toast({
        title: isRTL ? 'حدث خطأ' : 'Error',
        description: isRTL 
          ? 'فشل في تحميل النص'
          : 'Failed to load the transcript',
        variant: 'destructive',
      });
    }
  };

  const handleLanguageChange = async (langCode: string) => {
    setSelectedLanguage(langCode);
    const subtitle = subtitles.find(sub => sub.languageCode === langCode);
    if (subtitle) {
      await fetchTranscript(subtitle.url);
    }
  };

  const handleDownload = () => {
    if (!transcript) return;
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: isRTL ? 'تم التحميل!' : 'Downloaded!',
      description: isRTL 
        ? 'تم تحميل النص بنجاح'
        : 'Transcript downloaded successfully',
    });
  };

  return (
    <section className="max-w-2xl mx-auto">
      <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            placeholder={isRTL ? 'أدخل رابط اليوتيوب' : 'Enter YouTube URL'}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-white/20 text-white placeholder:text-gray-400"
          />
          <Button 
            onClick={generateTranscript}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <div className="animate-spin">⌛</div>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                {isRTL ? 'إنشاء' : 'Generate'}
              </>
            )}
          </Button>
        </div>

        {subtitles.length > 0 && (
          <div className="mb-4">
            <Select
              value={selectedLanguage}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-full bg-white/20 text-white">
                <SelectValue placeholder={isRTL ? "اختر اللغة" : "Select language"} />
              </SelectTrigger>
              <SelectContent>
                {subtitles.map((subtitle) => (
                  <SelectItem key={subtitle.languageCode} value={subtitle.languageCode}>
                    {subtitle.languageName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {transcript && (
          <div className="animate-fade-up">
            <div className="bg-white/5 p-4 rounded-lg mb-4 max-h-60 overflow-y-auto">
              <p className="text-white whitespace-pre-wrap">{transcript}</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              {isRTL ? 'تحميل النص' : 'Download Transcript'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TranscriptGenerator;