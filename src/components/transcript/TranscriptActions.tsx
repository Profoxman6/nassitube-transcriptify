import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Copy, FileText } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

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
  const [summary, setSummary] = useState(transcript.summary || '');
  const { toast } = useToast();

  const handleView = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${transcript.video_title || 'Transcript'}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
              h1 { color: #333; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${transcript.video_title || 'Transcript'}</h1>
            <pre>${transcript.content}</pre>
          </body>
        </html>
      `);
    }
  };

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

  const handleSaveSummary = async () => {
    try {
      const { error } = await supabase
        .from('transcripts')
        .update({ summary })
        .eq('id', transcript.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Saved!",
        description: "Summary saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save summary",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleView}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        {!transcript.summary && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenInChatGPT}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Summarize in ChatGPT
          </Button>
        )}
      </div>
      
      {isOwner && (
        <div className="space-y-2">
          {isEditing ? (
            <>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="min-h-[100px] bg-white/10 text-white"
                placeholder="Enter summary..."
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveSummary}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </>
          ) : transcript.summary ? (
            <div className="space-y-2">
              <div className="bg-white/10 p-4 rounded-lg">
                <p className="text-white whitespace-pre-wrap">{transcript.summary}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                Edit Summary
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Add Summary
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TranscriptActions;