import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Home, Trash2 } from 'lucide-react';
import TranscriptActions from '@/components/transcript/TranscriptActions';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Query for user's transcripts
  const { data: userTranscripts } = useQuery({
    queryKey: ['userTranscripts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transcripts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Query for all public transcripts
  const { data: publicTranscripts } = useQuery({
    queryKey: ['publicTranscripts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transcripts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Stats queries
  const { data: transcriptCount } = useQuery({
    queryKey: ['transcriptCount', user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('transcripts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: dailyUsage } = useQuery({
    queryKey: ['dailyUsage', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('daily_usage')
        .select('count')
        .eq('user_id', user?.id)
        .eq('date', new Date().toISOString().split('T')[0])
        .single();
      return data?.count || 0;
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transcripts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transcript deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transcript",
        variant: "destructive",
      });
    }
  };

  const filteredTranscripts = (transcripts: any[]) => 
    transcripts?.filter(transcript => 
      transcript.video_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transcript.content?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Card className="bg-white/10 text-white border-none flex-1 mr-4">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-yellow-300 text-yellow-900 text-xl">
                  {user.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.email}</CardTitle>
                <p className="text-yellow-300">Member since {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </CardHeader>
          </Card>
          <Button
            onClick={() => navigate('/')}
            className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
          >
            <Home className="mr-2 h-4 w-4" />
            Generate New Transcript
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/10 text-white border-none">
            <CardHeader>
              <CardTitle>Today's Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-yellow-300">{dailyUsage}/10</p>
              <p className="text-sm text-gray-300">transcripts generated today</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 text-white border-none">
            <CardHeader>
              <CardTitle>Total Transcripts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-yellow-300">{transcriptCount}</p>
              <p className="text-sm text-gray-300">transcripts generated in total</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/10 border-none">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Transcripts</CardTitle>
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
            <Tabs defaultValue="my-transcripts" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/20">
                <TabsTrigger value="my-transcripts" className="text-white data-[state=active]:bg-white/30">
                  My Transcripts
                </TabsTrigger>
                <TabsTrigger value="all-transcripts" className="text-white data-[state=active]:bg-white/30">
                  All Transcripts
                </TabsTrigger>
              </TabsList>
              <TabsContent value="my-transcripts">
                <div className="space-y-4">
                  {filteredTranscripts(userTranscripts)?.map((transcript: any) => (
                    <Card key={transcript.id} className="bg-white/5 text-white border-none">
                      <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{transcript.video_title || 'Untitled'}</CardTitle>
                          <p className="text-sm text-gray-300">
                            {new Date(transcript.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(transcript.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300 line-clamp-2 mb-4">{transcript.content}</p>
                        <TranscriptActions transcript={transcript} isOwner={true} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="all-transcripts">
                <div className="space-y-4">
                  {filteredTranscripts(publicTranscripts)?.map((transcript: any) => (
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
