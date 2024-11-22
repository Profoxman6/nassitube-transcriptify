import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import debounce from 'lodash/debounce';

interface SummaryEditorProps {
  transcriptId: string;
  initialSummary: string;
  onSave: () => void;
  onCancel: () => void;
}

const SummaryEditor = ({ transcriptId, initialSummary, onSave, onCancel }: SummaryEditorProps) => {
  const [summary, setSummary] = useState(initialSummary);
  const { toast } = useToast();

  // Debounced save function to improve performance
  const debouncedSave = useCallback(
    debounce(async (newSummary: string) => {
      try {
        const { error } = await supabase
          .from('transcripts')
          .update({ summary: newSummary })
          .eq('id', transcriptId);

        if (error) throw error;
      } catch (error) {
        console.error('Error saving summary:', error);
        toast({
          title: "Error",
          description: "Failed to save summary",
          variant: "destructive",
        });
      }
    }, 500),
    [transcriptId]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newSummary = e.target.value;
    setSummary(newSummary);
    debouncedSave(newSummary);
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={summary}
        onChange={handleChange}
        className="min-h-[100px] bg-white/10 text-white resize-vertical"
        placeholder="Enter summary..."
      />
      <div className="flex gap-2">
        <Button 
          size="sm" 
          onClick={onSave}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Save
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onCancel}
          className="text-white hover:text-white hover:bg-white/20"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SummaryEditor;