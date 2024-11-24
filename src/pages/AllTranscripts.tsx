import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transcript } from "@/types/database.types";
import Navigation from "@/components/Navigation";
import TranscriptCard from "@/components/TranscriptCard";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-900 text-white pb-24 md:pb-0">
      <Navigation />
      <main className="container mx-auto px-4 pt-20">
        <h1 className="text-3xl font-bold mb-6">Community Transcripts</h1>
        {isLoading ? (
          <p>Loading transcripts...</p>
        ) : (
          <div className="grid gap-4">
            {transcripts?.map((transcript) => (
              <TranscriptCard key={transcript.id} transcript={transcript} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllTranscripts;