import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { handleTranscriptError } from '../utils/errorHandling';

export const saveTranscript = async (
  userId: string | undefined,
  videoId: string,
  url: string,
  content: string,
  language: string,
  videoTitle: string,
  isRTL: boolean
) => {
  if (!userId) {
    toast({
      title: isRTL ? 'تسجيل الدخول مطلوب' : 'Login Required',
      description: isRTL 
        ? 'يرجى تسجيل الدخول لحفظ النصوص'
        : 'Please login to save transcripts',
      variant: 'destructive',
    });
    return;
  }

  const { error: saveError } = await supabase
    .from('transcripts')
    .insert({
      user_id: userId,
      video_id: videoId,
      video_url: url,
      content,
      language,
      video_title: videoTitle,
    });

  if (saveError) {
    throw saveError;
  }

  toast({
    title: isRTL ? 'تم الحفظ!' : 'Saved!',
    description: isRTL 
      ? 'تم حفظ النص بنجاح'
      : 'Transcript saved successfully',
  });
};

export const fetchExistingTranscript = async (videoId: string) => {
  const { data, error } = await supabase
    .from('transcripts')
    .select('content, video_title')
    .eq('video_id', videoId)
    .eq('language', 'en');

  if (error) throw error;
  return data;
};

export const fetchSubtitles = async (videoId: string) => {
  const response = await fetch(`https://yt-api.p.rapidapi.com/subtitles?id=${videoId}`, {
    headers: {
      'X-RapidAPI-Key': '7cbc1fe90emshb480565372d1785p1cc5f4jsn92a4dc44058f',
      'X-RapidAPI-Host': 'yt-api.p.rapidapi.com'
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};