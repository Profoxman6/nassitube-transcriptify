import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Copy, FileText } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import TranscriptViewer from './TranscriptViewer';
import SummaryEditor from './SummaryEditor';

interface TranscriptActionsProps {
  transcript: {
    id: string;
    video_url: string;
    video_title: string;
    content: string;
    summary: string | null;
  };
  isOwner?: boolean;
}

const TranscriptActions = ({ transcript, isOwner = false }: TranscriptActionsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript.content);
      toast({
        title: "Copied!",
        description: "Transcript copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy transcript",
        variant: "destructive",
      });
    }
  };

  const handleOpenInChatGPT = () => {
    const prompt = `This is a video (${transcript.video_url}), titled (${transcript.video_title || 'Untitled'}). Summarize it in detail for me;\n\nVideo transcript:\n${transcript.content}`;
    const encodedPrompt = encodeURIComponent(prompt);
    window.open(`https://chat.openai.com/chat?prompt=${encodedPrompt}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsViewerOpen(true)}
          className="flex items-center gap-2 bg-secondary/90 text-secondary-foreground hover:bg-secondary"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-2 bg-secondary/90 text-secondary-foreground hover:bg-secondary"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        {!transcript.summary && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpenInChatGPT}
            className="flex items-center gap-2 bg-secondary/90 text-secondary-foreground hover:bg-secondary"
          >
            <FileText className="h-4 w-4" />
            Summarize in ChatGPT
          </Button>
        )}
      </div>
      
      {isOwner && (
        <div className="space-y-2">
          {isEditing ? (
            <SummaryEditor
              transcriptId={transcript.id}
              initialSummary={transcript.summary || ''}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          ) : transcript.summary ? (
            <div className="space-y-2">
              <div className="bg-white/10 p-4 rounded-lg">
                <p className="text-white whitespace-pre-wrap">{transcript.summary}</p>
              </div>
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => setIsEditing(true)}
                className="bg-secondary/90 text-secondary-foreground hover:bg-secondary"
              >
                Edit Summary
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className="bg-secondary/90 text-secondary-foreground hover:bg-secondary"
            >
              Add Summary
            </Button>
          )}
        </div>
      )}

      <TranscriptViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        title={transcript.video_title || 'Transcript'}
        content={transcript.content}
      />
    </div>
  );
};

export default TranscriptActions;