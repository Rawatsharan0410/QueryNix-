
import { useState } from 'react';
import { Copy, Check, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CodeDisplayProps {
  code: string;
  language?: string;
  onEdit?: (code: string) => void;
}

const CodeDisplay = ({ code, language = '', onEdit }: CodeDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(code);

  // Extract language from markdown code block if present
  const extractLanguage = () => {
    if (language) return language;
    
    const match = code.match(/```(\w+)/);
    if (match && match[1]) {
      return match[1];
    }
    return '';
  };

  // Clean code from markdown formatting if present
  const cleanCode = () => {
    let cleanedCode = code;
    // Remove markdown code block syntax if present
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/;
    const match = code.match(codeBlockRegex);
    
    if (match) {
      cleanedCode = match[2];
    }
    
    return cleanedCode;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanCode());
    setCopied(true);
    toast.success('Code copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onEdit) {
      onEdit(editedCode);
    }
  };

  const displayedLanguage = extractLanguage();
  const displayedCode = cleanCode();

  return (
    <div className="my-4 rounded-lg border bg-muted/50 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b bg-muted/80 px-4 py-2 dark:bg-gray-800">
        <div className="text-sm font-medium">
          {displayedLanguage ? `${displayedLanguage.toUpperCase()} Code` : 'Code'}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={isEditing ? handleSave : handleEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <textarea
          value={editedCode}
          onChange={(e) => setEditedCode(e.target.value)}
          className="w-full bg-background p-4 font-mono text-sm focus:outline-none"
          rows={displayedCode.split('\n').length + 2}
        />
      ) : (
        <pre className="overflow-x-auto p-4">
          <code className="font-mono text-sm">{displayedCode}</code>
        </pre>
      )}
    </div>
  );
};

export default CodeDisplay;