import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import GeminiSummaryButton from './GeminiSummaryButton';
import { useAuth } from '@/components/AuthProvider';

interface TranscriptDisplayProps {
  transcript: string;
  transcriptId: string;
  videoTitle: string;
  onDownload: () => void;
  isRTL: boolean;
}

const TranscriptDisplay = ({ 
  transcript, 
  transcriptId,
  videoTitle,
  onDownload, 
  isRTL 
}: TranscriptDisplayProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const { user } = useAuth();

  return (
    <div className="animate-fade-up space-y-4">
      <div className="bg-white/5 p-4 rounded-lg mb-4 max-h-60 overflow-y-auto">
        <p className="text-white whitespace-pre-wrap">{transcript}</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={onDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          {isRTL ? 'تحميل النص' : 'Download Transcript'}
        </Button>

        {user && (
          <GeminiSummaryButton
            transcriptId={transcriptId}
            content={transcript}
            videoTitle={videoTitle}
            onSummaryGenerated={setSummary}
            isRTL={isRTL}
          />
        )}
      </div>

      {summary && (
        <div className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-2">
            {isRTL ? 'الملخص:' : 'Summary:'}
          </h3>
          <p className="text-white whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay;