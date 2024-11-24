import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CustomPromptInput from './CustomPromptInput';

interface GeminiSummaryButtonProps {
  transcriptId: string;
  content: string;
  videoTitle: string;
  onSummaryGenerated: (summary: string) => void;
  isRTL: boolean;
}

const GeminiSummaryButton = ({ 
  transcriptId, 
  content, 
  videoTitle,
  onSummaryGenerated,
  isRTL 
}: GeminiSummaryButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const { toast } = useToast();

  const generateSummary = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: { 
          transcript: content, 
          videoTitle,
          customPrompt 
        }
      });

      if (error) throw error;

      if (data.summary) {
        const { error: updateError } = await supabase
          .from('transcripts')
          .update({ summary: data.summary })
          .eq('video_id', transcriptId);

        if (updateError) throw updateError;

        onSummaryGenerated(data.summary);
        
        toast({
          title: isRTL ? 'تم إنشاء الملخص!' : 'Summary Generated!',
          description: isRTL 
            ? 'تم إنشاء ملخص للنص بنجاح'
            : 'Successfully generated a summary of the transcript',
        });
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate summary',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <CustomPromptInput onPromptChange={setCustomPrompt} isRTL={isRTL} />
      <Button
        variant="secondary"
        size="sm"
        onClick={generateSummary}
        disabled={loading}
        className="bg-secondary/90 text-secondary-foreground hover:bg-secondary"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {loading ? (
          isRTL ? 'جارٍ إنشاء الملخص...' : 'Generating...'
        ) : (
          isRTL ? 'تلخيص مع Gemini' : 'Summarize with Gemini'
        )}
      </Button>
    </div>
  );
};

export default GeminiSummaryButton;