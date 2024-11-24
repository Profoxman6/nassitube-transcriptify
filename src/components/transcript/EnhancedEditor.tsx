import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface EnhancedEditorProps {
  content: string;
  isRTL: boolean;
  className?: string;
}

const EnhancedEditor = ({ content, isRTL, className = '' }: EnhancedEditorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white hover:bg-white/20"
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div 
        className={`bg-white/5 rounded-lg transition-all duration-300 ${
          isExpanded ? 'fixed inset-4 z-50 overflow-auto' : 'relative'
        }`}
      >
        <div className="p-4">
          <ReactMarkdown 
            className={`prose prose-invert max-w-none ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default EnhancedEditor;