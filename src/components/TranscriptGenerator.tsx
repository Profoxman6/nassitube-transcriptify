import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, Download } from 'lucide-react';

interface TranscriptGeneratorProps {
  isRTL: boolean;
}

const TranscriptGenerator = ({ isRTL }: TranscriptGeneratorProps) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
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
      
      // Extract text from the response
      let transcriptText = '';
      if (data.data && Array.isArray(data.data)) {
        transcriptText = data.data.map((item: any) => item.text).join('\n');
      } else if (typeof data.text === 'string') {
        transcriptText = data.text;
      } else {
        transcriptText = 'No transcript available';
      }
      
      setTranscript(transcriptText);
      
      toast({
        title: isRTL ? 'تم بنجاح!' : 'Success!',
        description: isRTL 
          ? 'تم إنشاء النص بنجاح'
          : 'Transcript generated successfully',
      });
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