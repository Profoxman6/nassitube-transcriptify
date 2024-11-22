import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Subtitle } from "./types";

interface TranscriptSelectProps {
  subtitles: Subtitle[];
  selectedLanguage: string;
  onLanguageChange: (langCode: string) => void;
  isRTL: boolean;
}

const TranscriptSelect = ({ subtitles, selectedLanguage, onLanguageChange, isRTL }: TranscriptSelectProps) => (
  <div className="mb-4">
    <Select
      value={selectedLanguage}
      onValueChange={onLanguageChange}
    >
      <SelectTrigger className="w-full bg-white/20 text-white">
        <SelectValue placeholder={isRTL ? "اختر اللغة" : "Select language"} />
      </SelectTrigger>
      <SelectContent>
        {subtitles.map((subtitle) => (
          <SelectItem key={subtitle.languageCode} value={subtitle.languageCode}>
            {subtitle.languageName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default TranscriptSelect;