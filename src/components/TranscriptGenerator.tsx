import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import TranscriptSelect from './transcript/TranscriptSelect';
import TranscriptDisplay from './transcript/TranscriptDisplay';
import TranscriptInput from './transcript/TranscriptInput';
import TranscriptError from './transcript/TranscriptError';
import { extractVideoId } from './transcript/utils';
import { handleTranscriptError } from './transcript/utils/errorHandling';
import { saveTranscript, fetchExistingTranscript, fetchSubtitles } from './transcript/services/transcriptService';
import { useToast } from "@/components/ui/use-toast";
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
      const existingTranscripts = await fetchExistingTranscript(videoId);

      if (existingTranscripts && existingTranscripts.length > 0) {
        setTranscript(existingTranscripts[0].content);
        setVideoTitle(existingTranscripts[0].video_title || '');
        setLoading(false);
        return;
      }

      const data = await fetchSubtitles(videoId);
      
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
              await saveTranscript(
                user?.id,
                videoId,
                url,
                transcriptText,
                englishSubtitle.languageCode,
                data.title || '',
                isRTL
              );
            } catch (error: any) {
              handleTranscriptError(error, isRTL, setError, setLoading);
              return;
            }
          }
        } else if (data.subtitles.length > 0) {
          setSelectedLanguage(data.subtitles[0].languageCode);
          const transcriptText = await fetchTranscript(data.subtitles[0].url);
          if (transcriptText) {
            try {
              await saveTranscript(
                user?.id,
                videoId,
                url,
                transcriptText,
                data.subtitles[0].languageCode,
                data.title || '',
                isRTL
              );
            } catch (error: any) {
              handleTranscriptError(error, isRTL, setError, setLoading);
              return;
            }
          }
        }
      } else {
        throw new Error('No subtitles found in the response');
      }
    } catch (error) {
      handleTranscriptError(error, isRTL, setError, setLoading);
    } finally {
      setLoading(false);
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