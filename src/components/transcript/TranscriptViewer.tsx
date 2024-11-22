import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TranscriptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const TranscriptViewer = ({ isOpen, onClose, title, content }: TranscriptViewerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white/10 backdrop-blur-sm border-none">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <pre className="whitespace-pre-wrap text-white font-sans">{content}</pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptViewer;