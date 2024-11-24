import { toast } from "@/components/ui/use-toast";

export const handleTranscriptError = (error: any, isRTL: boolean, setError: (error: Error | null) => void, setLoading: (loading: boolean) => void) => {
  console.error('Error:', error);
  
  // Check for daily limit error in the response body
  if (error.body) {
    try {
      const errorBody = JSON.parse(error.body);
      if (errorBody.message === "Daily limit of 10 transcripts reached") {
        const dailyLimitError = new Error('Daily limit reached');
        setError(dailyLimitError);
        toast({
          title: isRTL ? 'تم الوصول للحد اليومي' : 'Daily Limit Reached',
          description: isRTL 
            ? 'لقد وصلت إلى الحد الأقصى اليومي (10 نصوص). حاول مرة أخرى غداً.'
            : 'You have reached your daily limit (10 transcripts). Try again tomorrow.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
    } catch (e) {
      // Continue with general error handling if JSON parsing fails
    }
  }

  // For other errors, create an Error object with the message
  const errorObj = error instanceof Error ? error : new Error(
    typeof error === 'string' ? error : 'An unexpected error occurred'
  );
  setError(errorObj);
  setLoading(false);
};