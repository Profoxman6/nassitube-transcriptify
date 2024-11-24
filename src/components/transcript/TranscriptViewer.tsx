import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const TranscriptViewer = ({ isOpen, onClose, title, content }: TranscriptViewerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] bg-white/10 backdrop-blur-sm border-none">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-8rem)] mt-4">
          <div className="pr-4">
            <pre className="whitespace-pre-wrap text-white font-sans">{content}</pre>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptViewer;