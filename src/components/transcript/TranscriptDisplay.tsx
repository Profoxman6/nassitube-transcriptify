import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface TranscriptDisplayProps {
  transcript: string;
  onDownload: () => void;
  isRTL: boolean;
}

const TranscriptDisplay = ({ transcript, onDownload, isRTL }: TranscriptDisplayProps) => (
  <div className="animate-fade-up">
    <div className="bg-white/5 p-4 rounded-lg mb-4 max-h-60 overflow-y-auto">
      <p className="text-white whitespace-pre-wrap">{transcript}</p>
    </div>
    <Button 
      variant="outline" 
      className="w-full"
      onClick={onDownload}
    >
      <Download className="mr-2 h-4 w-4" />
      {isRTL ? 'تحميل النص' : 'Download Transcript'}
    </Button>
  </div>
);

export default TranscriptDisplay;