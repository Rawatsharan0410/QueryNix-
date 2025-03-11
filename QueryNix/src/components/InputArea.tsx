
import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onModeSwitch?: (mode: 'general' | 'code' | 'writing' | 'image' | 'search' | 'video' | 'voice' | 'productivity' | 'translator' | 'recommendations') => void;
  currentMode?: string;
}

const InputArea = ({ onSendMessage, isLoading, currentMode = 'general' }: InputAreaProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div 
      className="border-t bg-background/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="relative rounded-2xl border bg-background shadow-subtle dark:bg-gray-900">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message QueryNix...`}
            rows={1}
            className="block w-full resize-none border-0 bg-transparent px-4 py-3 pr-16 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:ring-offset-0"
            style={{ minHeight: '48px', maxHeight: '200px' }}
            disabled={isLoading}
          />
          
          <motion.button
            type="submit"
            className={`
              absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-querynix-500 text-white transition-colors 
              ${isLoading || !input.trim() ? 'cursor-not-allowed opacity-50' : 'hover:bg-querynix-600'}
            `}
            disabled={isLoading || !input.trim()}
            whileHover={isLoading || !input.trim() ? {} : { scale: 1.05 }}
            whileTap={isLoading || !input.trim() ? {} : { scale: 0.95 }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
        
        <div className="mt-2 text-center text-xs text-muted-foreground">
          QueryNix is ready to answer your questions. Type your message above.
        </div>
      </form>
    </motion.div>
  );
};

export default InputArea;