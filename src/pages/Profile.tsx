import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/10 text-white border-none">
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