import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/components/AuthProvider';
import TranscriptSelect from './transcript/TranscriptSelect';
import TranscriptDisplay from './transcript/TranscriptDisplay';
import TranscriptInput from './transcript/TranscriptInput';
import TranscriptError from './transcript/TranscriptError';
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
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleError = (error: any) => {
    console.error('Error:', error);
    let errorMessage = error;
    
    // Try to parse the error message if it's a string
    if (typeof error === 'string') {
      try {
        const parsedError = JSON.parse(error);
        if (parsedError.message) {
          errorMessage = parsedError;
        }
      } catch (e) {
        // If parsing fails, use the original error message
      }
    }
    
    // Handle database error messages
    if (error.code === 'P0001' && error.message?.includes('Daily limit')) {
      toast({
        title: isRTL ? 'تم الوصول للحد اليومي' : 'Daily Limit Reached',
        description: isRTL 
          ? 'لقد وصلت إلى الحد الأقصى اليومي (10 نصوص). حاول مرة أخرى غداً.'
          : 'You have reached your daily limit (10 transcripts). Try again tomorrow.',
        variant: 'destructive',
      });
      setError(new Error('Daily limit reached'));
    } else {
      // For other errors, create an Error object with the message
      const errorObj = error instanceof Error ? error : new Error(JSON.stringify(error));
      setError(errorObj);
    }
    setLoading(false);
  };

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
      const { error: saveError } = await supabase
        .from('transcripts')
        .insert({
          user_id: user.id,
          video_id: videoId,
          video_url: url,
          content,
          language,
          video_title: videoTitle,
        });

      if (saveError) {
        handleError(saveError);
        return;
      }

      toast({
        title: isRTL ? 'تم الحفظ!' : 'Saved!',
        description: isRTL 
          ? 'تم حفظ النص بنجاح'
          : 'Transcript saved successfully',
      });
    } catch (error) {
      handleError(error);
    }
  };

  const generateTranscript = async () => {
    setError(null);
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
      const { data: existingTranscripts, error: fetchError } = await supabase
        .from('transcripts')
        .select('content, video_title')
        .eq('video_id', videoId)
        .eq('language', 'en');

      if (fetchError) {
        handleError(fetchError);
        return;
      }

      if (existingTranscripts && existingTranscripts.length > 0) {
        setTranscript(existingTranscripts[0].content);
        setVideoTitle(existingTranscripts[0].video_title || '');
        setLoading(false);
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
            try {
              await saveTranscript(videoId, transcriptText, englishSubtitle.languageCode);
            } catch (error: any) {
              if (error?.message?.includes('Daily limit')) {
                handleError(error);
                return;
              }
              throw error;
            }
          }
        } else if (data.subtitles.length > 0) {
          setSelectedLanguage(data.subtitles[0].languageCode);
          const transcriptText = await fetchTranscript(data.subtitles[0].url);
          if (transcriptText) {
            try {
              await saveTranscript(videoId, transcriptText, data.subtitles[0].languageCode);
            } catch (error: any) {
              if (error?.message?.includes('Daily limit')) {
                handleError(error);
                return;
              }
              throw error;
            }
          }
        }
      } else {
        throw new Error('No subtitles found in the response');
      }
    } catch (error) {
      handleError(error);
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
      if (error instanceof Error) {
        setError(error);
      }
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

  return (
    <section className="max-w-2xl mx-auto">
      <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
        <TranscriptInput
          url={url}
          onUrlChange={setUrl}
          onGenerate={generateTranscript}
          loading={loading}
          isRTL={isRTL}
        />

        {error && (
          <div className="mb-6">
            <TranscriptError error={error} isRTL={isRTL} />
          </div>
        )}

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
            transcriptId={extractVideoId(url) || ''}
            videoTitle={videoTitle}
            isRTL={isRTL}
          />
        )}
      </div>
    </section>
  );
};

export default TranscriptGenerator;