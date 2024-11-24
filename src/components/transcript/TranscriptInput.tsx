import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface TranscriptInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  onGenerate: () => void;
  loading: boolean;
  isRTL: boolean;
}

const TranscriptInput = ({ url, onUrlChange, onGenerate, loading, isRTL }: TranscriptInputProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <Input
        type="text"
        placeholder={isRTL ? 'أدخل رابط اليوتيوب' : 'Enter YouTube URL'}
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        className="flex-1 bg-white/20 text-white placeholder:text-gray-400"
      />
      <Button 
        onClick={onGenerate}
        disabled={loading}
        className="bg-primary hover:bg-primary/90"
      >
        {loading ? (
          <div className="animate-spin">⌛</div>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            {isRTL ? 'إنشاء' : 'Generate'}
          </>
        )}
      </Button>
    </div>
  );
};

export default TranscriptInput;