import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import SummaryEditor from './SummaryEditor';

interface TranscriptSummaryProps {
  transcriptId: string;
  summary: string | null;
  isOwner?: boolean;
}

const TranscriptSummary = ({ transcriptId, summary, isOwner = false }: TranscriptSummaryProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleCopySummary = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      toast({
        title: "Copied!",
        description: "Summary copied to clipboard",
        duration: 7000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy summary",
        variant: "destructive",
        duration: 7000,
      });
    }
  };

  const displaySummary = isExpanded ? summary : summary?.slice(0, 250) + (summary && summary.length > 250 ? '...' : '');

  return (
    <div className="space-y-2">
      {isEditing && isOwner ? (
        <SummaryEditor
          transcriptId={transcriptId}
          initialSummary={summary || ''}
          onSave={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      ) : summary ? (
        <div className="space-y-2">
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-white whitespace-pre-wrap">{displaySummary}</p>
            {summary.length > 250 && (
              <Button
                variant="link"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-secondary-foreground mt-2"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {isOwner && (
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => setIsEditing(true)}
                className="bg-secondary/90 text-secondary-foreground hover:bg-secondary"
              >
                Edit Summary
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopySummary}
              className="bg-secondary/90 text-secondary-foreground hover:bg-secondary"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Summary
            </Button>
          </div>
        </div>
      ) : isOwner ? (
        <Button 
          size="sm" 
          variant="secondary"
          onClick={() => setIsEditing(true)}
          className="bg-secondary/90 text-secondary-foreground hover:bg-secondary"
        >
          Add Summary
        </Button>
      ) : null}
    </div>
  );
};

export default TranscriptSummary;