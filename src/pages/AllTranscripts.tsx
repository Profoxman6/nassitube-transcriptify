import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TranscriptActions from '@/components/transcript/TranscriptActions';

const AllTranscripts = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transcripts, isLoading } = useQuery({
    queryKey: ['allTranscripts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transcripts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const filteredTranscripts = transcripts?.filter(transcript => 
    transcript.video_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transcript.content?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <p className="text-white">Loading transcripts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-white/10 border-none">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">All Community Transcripts</CardTitle>
              <div className="w-64">
                <Input
                  type="text"
                  placeholder="Search transcripts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTranscripts.map((transcript) => (
                <Card key={transcript.id} className="bg-white/5 text-white border-none">
                  <CardHeader>
                    <CardTitle className="text-lg">{transcript.video_title || 'Untitled'}</CardTitle>
                    <p className="text-sm text-gray-300">
                      {new Date(transcript.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 line-clamp-2 mb-4">{transcript.content}</p>
                    <TranscriptActions transcript={transcript} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllTranscripts;