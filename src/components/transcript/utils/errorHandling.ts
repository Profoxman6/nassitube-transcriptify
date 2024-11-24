import { toast } from "@/components/ui/use-toast";

export const handleTranscriptError = (error: any, isRTL: boolean, setError: (error: Error | null) => void, setLoading: (loading: boolean) => void) => {
  console.error('Error:', error);
  
  // Parse error body if it exists
  let parsedBody;
  if (error.body) {
    try {
      parsedBody = JSON.parse(error.body);
    } catch (e) {
      // If parsing fails, continue with original error
    }
  }

  // Handle daily limit error
  if (
    (parsedBody?.code === 'P0001' && parsedBody?.message?.includes('Daily limit')) ||
    (error.code === 'P0001' && error.message?.includes('Daily limit'))
  ) {
    toast({
      title: isRTL ? 'تم الوصول للحد اليومي' : 'Daily Limit Reached',
      description: isRTL 
        ? 'لقد وصلت إلى الحد الأقصى اليومي (10 نصوص). حاول مرة أخرى غداً.'
        : 'You have reached your daily limit (10 transcripts). Try again tomorrow.',
      variant: 'destructive',
    });
    setError(new Error('Daily limit reached'));
  } else {
    // For other errors, create an Error object with the message
    const errorObj = error instanceof Error ? error : new Error(
      typeof error === 'string' ? error : JSON.stringify(error)
    );
    setError(errorObj);
  }
  
  setLoading(false);
};