import { Transcript } from "@/types/database.types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface TranscriptCardProps {
  transcript: Transcript;
}

const TranscriptCard = ({ transcript }: TranscriptCardProps) => {
  const copyTranscript = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Transcript copied to clipboard",
    });
  };

  const downloadTranscript = (content: string, videoTitle: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoTitle || 'transcript'}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast({
      title: "Downloaded!",
      description: "Transcript downloaded successfully",
    });
  };

  return (
    <Card className="p-4 bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{transcript.video_title || 'Untitled Video'}</h2>
        <ScrollArea className="h-32 rounded-md border border-gray-700 p-2">
          <p className="text-gray-300">{transcript.content}</p>
        </ScrollArea>
        {transcript.summary && (
          <ScrollArea className="h-24 rounded-md border border-gray-700 p-2 mt-2">
            <p className="text-gray-300">{transcript.summary}</p>
          </ScrollArea>
        )}
        <div className="flex gap-2 mt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => copyTranscript(transcript.content)}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => downloadTranscript(transcript.content, transcript.video_title || '')}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TranscriptCard;