import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import TranscriptSelect from './transcript/TranscriptSelect';
import TranscriptDisplay from './transcript/TranscriptDisplay';
import { extractVideoId } from './transcript/utils';
import { supabase } from '@/integrations/supabase/client';
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
  const [videoTitle, setVideoTitle] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const saveTranscript = async (videoId: string, content: string, language: string) => {
    if (!user) {
      toast({
        title: isRTL ? 'تسجيل الدخول مطلوب' : 'Login Required',
        description: isRTL 
          ? 'يرجى تسجيل الدخول لحفظ النصوص'
          : 'Please login to save transcripts',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('transcripts')
        .insert({
          user_id: user.id,
          video_id: videoId,
          video_url: url,
          content,
          language,
          video_title: videoTitle,
        });

      if (error) {
        if (error.message.includes('Daily limit')) {
          toast({
            title: isRTL ? 'تم الوصول للحد اليومي' : 'Daily Limit Reached',
            description: isRTL 
              ? 'لقد وصلت إلى الحد الأقصى اليومي (10 نصوص)'
              : 'You have reached your daily limit (10 transcripts)',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: isRTL ? 'تم الحفظ!' : 'Saved!',
          description: isRTL 
            ? 'تم حفظ النص بنجاح'
            : 'Transcript saved successfully',
        });
      }
    } catch (error) {
      console.error('Error saving transcript:', error);
      toast({
        title: isRTL ? 'خطأ في الحفظ' : 'Save Error',
        description: error instanceof Error ? error.message : 'Failed to save transcript',
        variant: 'destructive',
      });
    }
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
      // First check if we already have this transcript
      const { data: existingTranscript } = await supabase
        .from('transcripts')
        .select('content, video_title')
        .eq('video_id', videoId)
        .eq('language', 'en')
        .single();

      if (existingTranscript) {
        setTranscript(existingTranscript.content);
        setVideoTitle(existingTranscript.video_title || '');
        return;
      }

      const response = await fetch(`https://yt-api.p.rapidapi.com/subtitles?id=${videoId}`, {
        headers: {
          'X-RapidAPI-Key': '7cbc1fe90emshb480565372d1785p1cc5f4jsn92a4dc44058f',
          'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.subtitles && Array.isArray(data.subtitles)) {
        setSubtitles(data.subtitles);
        setVideoTitle(data.title || '');
        
        const englishSubtitle = data.subtitles.find(
          (sub: Subtitle) => sub.languageCode === 'en' || sub.languageCode.startsWith('en-')
        );
        
        if (englishSubtitle) {
          setSelectedLanguage(englishSubtitle.languageCode);
          const transcriptText = await fetchTranscript(englishSubtitle.url);
          if (transcriptText) {
            await saveTranscript(videoId, transcriptText, englishSubtitle.languageCode);
          }
        } else if (data.subtitles.length > 0) {
          setSelectedLanguage(data.subtitles[0].languageCode);
          const transcriptText = await fetchTranscript(data.subtitles[0].url);
          if (transcriptText) {
            await saveTranscript(videoId, transcriptText, data.subtitles[0].languageCode);
          }
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

  const fetchTranscript = async (subtitleUrl: string): Promise<string | null> => {
    try {
      const response = await fetch(subtitleUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transcript: ${response.status}`);
      }
      
      const xmlText = await response.text();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const textElements = xmlDoc.getElementsByTagName("text");
      
      const transcriptText = Array.from(textElements)
        .map(element => element.textContent)
        .filter(text => text !== null)
        .join('\n');
      
      if (!transcriptText) {
        throw new Error('Failed to parse transcript XML');
      }
      
      setTranscript(transcriptText);
      return transcriptText;
    } catch (error) {
      console.error('Error fetching transcript:', error);
      setTranscript('Failed to load transcript');
      toast({
        title: isRTL ? 'حدث خطأ' : 'Error',
        description: error instanceof Error ? error.message : 'Failed to load the transcript',
        variant: 'destructive',
      });
      return null;
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

        {videoTitle && (
          <div className="mb-4 text-white">
            <h3 className="text-lg font-semibold">
              {isRTL ? 'عنوان الفيديو:' : 'Video Title:'} {videoTitle}
            </h3>
          </div>
        )}

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
