import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomPromptInputProps {
  onPromptChange: (prompt: string) => void;
  isRTL: boolean;
}

const CustomPromptInput = ({ onPromptChange, isRTL }: CustomPromptInputProps) => {
  const [prompt, setPrompt] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    onPromptChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="custom-prompt" className="text-white">
        {isRTL ? 'تعليمات مخصصة للملخص' : 'Custom Summary Instructions'}
      </Label>
      <Input
        id="custom-prompt"
        placeholder={isRTL 
          ? 'مثال: قم بتلخيص النص باللغة العربية' 
          : 'Example: Summarize in Arabic'}
        value={prompt}
        onChange={handleChange}
        className="bg-white/10 text-white placeholder:text-gray-400"
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </div>
  );
};

export default CustomPromptInput;