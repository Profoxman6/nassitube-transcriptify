import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transcript } from "@/types/database.types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AllTranscripts = () => {
  const { data: transcripts, isLoading } = useQuery({
    queryKey: ['all-transcripts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transcripts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Transcript[];
    }
  });

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pb-24 md:pb-0">
      <Navigation />
      <main className="container mx-auto px-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Community Transcripts</h1>
        {isLoading ? (
          <p>Loading transcripts...</p>
        ) : (
          <div className="grid gap-4">
            {transcripts?.map((transcript) => (
              <Card key={transcript.id} className="p-4 bg-gray-800 border-gray-700">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold">{transcript.video_title || 'Untitled Video'}</h2>
                  <ScrollArea className="h-32 rounded-md border p-2">
                    <p className="text-gray-300">{transcript.content}</p>
                  </ScrollArea>
                  {transcript.summary && (
                    <ScrollArea className="h-24 rounded-md border p-2 mt-2">
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllTranscripts;