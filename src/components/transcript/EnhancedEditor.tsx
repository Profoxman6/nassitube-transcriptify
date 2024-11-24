import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface EnhancedEditorProps {
  content: string;
  isRTL: boolean;
  className?: string;
}

const EnhancedEditor = ({ content, isRTL, className = '' }: EnhancedEditorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExpand = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExpand}
          className="text-white hover:bg-white/20"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      <div className={`bg-white/5 rounded-lg transition-all duration-300 max-h-[300px] overflow-auto`}>
        <div className="p-4">
          <ReactMarkdown 
            className={`prose prose-invert max-w-none ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-gradient-to-br from-emerald-900 to-teal-900">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-2 right-2 text-white hover:bg-white/20"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <div className="p-4 overflow-auto">
              <ReactMarkdown 
                className={`prose prose-invert max-w-none ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedEditor;