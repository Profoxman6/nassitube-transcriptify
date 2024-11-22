import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const History = () => {
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTranscripts();
  }, [user, navigate]);

  const fetchTranscripts = async () => {
    try {
      const { data, error } = await supabase
        .from('transcripts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTranscripts(data || []);
    } catch (error) {
      console.error('Error fetching transcripts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transcripts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTranscript = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transcripts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTranscripts(transcripts.filter(t => t.id !== id));
      toast({
        title: 'Success',
        description: 'Transcript deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting transcript:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete transcript',
        variant: 'destructive',
      });
    }
  };

  const filteredTranscripts = transcripts.filter(transcript => 
    transcript.video_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transcript.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Transcript History</h1>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search transcripts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md bg-white/20 text-white placeholder:text-gray-400"
        />
      </div>

      <div className="bg-white/10 rounded-lg backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Video Title</TableHead>
              <TableHead className="text-white">Language</TableHead>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTranscripts.map((transcript) => (
              <TableRow key={transcript.id}>
                <TableCell className="text-white">
                  <a href={transcript.video_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {transcript.video_title || 'Untitled'}
                  </a>
                </TableCell>
                <TableCell className="text-white">{transcript.language}</TableCell>
                <TableCell className="text-white">
                  {new Date(transcript.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteTranscript(transcript.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default History;