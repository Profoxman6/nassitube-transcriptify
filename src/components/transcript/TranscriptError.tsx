import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TranscriptErrorProps {
  error: Error;
  isRTL: boolean;
}

const TranscriptError = ({ error, isRTL }: TranscriptErrorProps) => {
  const getErrorMessage = () => {
    if (!error) {
      return {
        title: isRTL ? 'خطأ غير معروف' : 'Unknown Error',
        description: isRTL 
          ? 'حدث خطأ غير متوقع'
          : 'An unexpected error occurred',
      };
    }

    if (error.message === 'Daily limit reached') {
      return {
        title: isRTL ? 'تم الوصول للحد اليومي' : 'Daily Limit Reached',
        description: isRTL 
          ? 'لقد وصلت إلى الحد الأقصى اليومي (10 نصوص). حاول مرة أخرى غداً.'
          : 'You have reached your daily limit (10 transcripts). Try again tomorrow.',
      };
    }

    return {
      title: isRTL ? 'خطأ' : 'Error',
      description: error.message,
    };
  };

  const { title, description } = getErrorMessage();

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default TranscriptError;