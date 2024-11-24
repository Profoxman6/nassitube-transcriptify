import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import GeminiSummaryButton from './GeminiSummaryButton';
import EnhancedEditor from './EnhancedEditor';
import { useAuth } from '@/components/AuthProvider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCopySummary = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      toast({
        title: isRTL ? 'تم النسخ!' : 'Copied!',
        description: isRTL 
          ? 'تم نسخ الملخص إلى الحافظة'
          : 'Summary copied to clipboard',
      });
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL 
          ? 'فشل نسخ الملخص'
          : 'Failed to copy summary',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadSummary = () => {
    if (!summary) return;
    
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoTitle || 'video'}-summary.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: isRTL ? 'تم التحميل!' : 'Downloaded!',
      description: isRTL 
        ? 'تم تحميل الملخص بنجاح'
        : 'Summary downloaded successfully',
    });
  };

  return (
    <div className="animate-fade-up space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
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

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">
            {isRTL ? 'النص المستخرج' : 'Generated Transcript'}
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <EnhancedEditor 
            content={transcript}
            isRTL={isRTL}
            className="mb-4"
          />
        </CollapsibleContent>
      </Collapsible>

      {summary && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            {isRTL ? 'الملخص' : 'Summary'}
          </h3>
          <EnhancedEditor 
            content={summary}
            isRTL={isRTL}
            className="mt-4"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
            >
              <Copy className="mr-2 h-4 w-4" />
              {isRTL ? 'نسخ الملخص' : 'Copy Summary'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSummary}
            >
              <Download className="mr-2 h-4 w-4" />
              {isRTL ? 'تحميل الملخص' : 'Download Summary'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptDisplay;