import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Copy, FileText, ExternalLink, Share2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import TranscriptViewer from './TranscriptViewer';
import TranscriptSummary from './TranscriptSummary';

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
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript.content);
      toast({
        title: "Copied!",
        description: "Transcript copied to clipboard",
        duration: 7000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy transcript",
        variant: "destructive",
        duration: 7000,
      });
    }
  };

  const handleOpenInChatGPT = () => {
    const shortPrompt = `Please summarize this YouTube video transcript:\n\n${transcript.content.slice(0, 2000)}...`;
    const encodedPrompt = encodeURIComponent(shortPrompt);
    window.open(`https://chat.openai.com/chat?prompt=${encodedPrompt}`, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: transcript.video_title,
      text: `Check out this transcript of "${transcript.video_title}"`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Shared!",
          description: "Content shared successfully",
          duration: 7000,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Share link copied to clipboard",
          duration: 7000,
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Error",
          description: "Failed to share content",
          variant: "destructive",
          duration: 7000,
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
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
        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.open(transcript.video_url, '_blank')}
          className="flex items-center gap-2 bg-secondary/90 text-secondary-foreground hover:bg-secondary"
        >
          <ExternalLink className="h-4 w-4" />
          View Video
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2 bg-secondary/90 text-secondary-foreground hover:bg-secondary"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        {!transcript.summary && isOwner && (
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
      
      <TranscriptSummary
        transcriptId={transcript.id}
        summary={transcript.summary}
        isOwner={isOwner}
      />

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