import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search } from 'lucide-react';
import TranscriptSelect from './transcript/TranscriptSelect';
import TranscriptDisplay from './transcript/TranscriptDisplay';
import { extractVideoId, parseTranscriptXML } from './transcript/utils';
import type { Subtitle } from './transcript/types';

interface TranscriptGeneratorProps {
  isRTL: boolean;
}

const TranscriptGenerator = ({ isRTL }: TranscriptGeneratorProps) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const { toast } = useToast();

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
      console.log('Fetching subtitles for video:', videoId);
      const response = await fetch(`https://yt-api.p.rapidapi.com/subtitles?idear=${videoId}`, {
        headers: {
          'X-RapidAPI-Key': '7cbc1fe90emshb480565372d1785p1cc5f4jsn92a4dc44058f',
          'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const rawData = await response.text();
      console.log('Raw API response:', rawData);
      
      const data = JSON.parse(rawData);
      console.log('Parsed data:', data);
      
      if (data.subtitles && Array.isArray(data.subtitles)) {
        setSubtitles(data.subtitles);
        
        const englishSubtitle = data.subtitles.find(
          (sub: Subtitle) => sub.languageCode === 'en' || sub.languageCode.startsWith('en-')
        );
        
        if (englishSubtitle) {
          setSelectedLanguage(englishSubtitle.languageCode);
          await fetchTranscript(englishSubtitle.url);
        } else if (data.subtitles.length > 0) {
          setSelectedLanguage(data.subtitles[0].languageCode);
          await fetchTranscript(data.subtitles[0].url);
        }
      } else {
        throw new Error('No subtitles found in the response');
      }
    } catch (error) {
      console.error('Error generating transcript:', error);
      setTranscript('');
      toast({
        title: isRTL ? 'حدث خطأ' : 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTranscript = async (subtitleUrl: string) => {
    try {
      console.log('Fetching transcript from URL:', subtitleUrl);
      const response = await fetch(subtitleUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transcript: ${response.status}`);
      }
      
      const xmlText = await response.text();
      console.log('Raw transcript response:', xmlText);
      
      const parsedTranscript = parseTranscriptXML(xmlText);
      console.log('Parsed transcript:', parsedTranscript);
      
      if (!parsedTranscript) {
        throw new Error('Failed to parse transcript XML');
      }
      
      setTranscript(parsedTranscript);
    } catch (error) {
      console.error('Error fetching transcript:', error);
      setTranscript('Failed to load transcript');
      toast({
        title: isRTL ? 'حدث خطأ' : 'Error',
        description: error instanceof Error ? error.message : 'Failed to load the transcript',
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
          <TranscriptSelect
            subtitles={subtitles}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            isRTL={isRTL}
          />
        )}

        {transcript && (
          <TranscriptDisplay
            transcript={transcript}
            onDownload={handleDownload}
            isRTL={isRTL}
          />
        )}
      </div>
    </section>
  );
};

export default TranscriptGenerator;