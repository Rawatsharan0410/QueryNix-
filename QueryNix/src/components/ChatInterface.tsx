
import { useChat } from '@/hooks/useChat';
import { useState } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { FadeIn, SlideIn } from './Transitions';
import { Code, Image, MoreHorizontal, Search, Trash2, Type, MessageSquare, Video, Mic, FileText, Globe, BookOpen } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { motion } from 'framer-motion';

const ChatInterface = () => {
  const { messages, isLoading, sendMessage, clearMessages, switchMode, chatMode } = useChat();
  const [showModeBar, setShowModeBar] = useState(true);

  const handleModeSwitch = (mode: 'general' | 'code' | 'writing' | 'image' | 'search' | 'video' | 'voice' | 'productivity' | 'translator' | 'recommendations') => {
    switchMode(mode);
  };

  return (
    <FadeIn delay={0.2} className="flex h-full flex-col overflow-hidden rounded-2xl border shadow-subtle bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between border-b bg-secondary/30 px-6 py-3">
        <div className="flex items-center space-x-2">
          <h2 className="font-display text-lg font-medium">QueryNix Chat</h2>
          <div className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            chatMode === 'general' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
            chatMode === 'code' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
            chatMode === 'writing' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
            chatMode === 'image' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
            chatMode === 'search' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' :
            chatMode === 'video' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' :
            chatMode === 'voice' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300' :
            chatMode === 'productivity' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
            chatMode === 'translator' ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300' :
            'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
          }`}>
            {chatMode.charAt(0).toUpperCase() + chatMode.slice(1)} Mode
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500 ring-2 ring-green-500/20"></span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => clearMessages()}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowModeBar(!showModeBar)}>
                {showModeBar ? 'Hide' : 'Show'} mode bar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {showModeBar && (
        <SlideIn className="border-b px-4 py-2">
          <div className="flex flex-wrap gap-1 overflow-x-auto">
            {[
              { icon: <MessageSquare className="h-4 w-4" />, mode: 'general', label: 'Assistant', color: 'bg-blue-500' },
              { icon: <Code className="h-4 w-4" />, mode: 'code', label: 'Code', color: 'bg-purple-500' },
              { icon: <Type className="h-4 w-4" />, mode: 'writing', label: 'Writing', color: 'bg-emerald-500' },
              { icon: <Image className="h-4 w-4" />, mode: 'image', label: 'Image', color: 'bg-amber-500' },
              { icon: <Search className="h-4 w-4" />, mode: 'search', label: 'Search', color: 'bg-rose-500' },
              { icon: <Video className="h-4 w-4" />, mode: 'video', label: 'Video', color: 'bg-indigo-500' },
              { icon: <Mic className="h-4 w-4" />, mode: 'voice', label: 'Voice', color: 'bg-cyan-500' },
              { icon: <FileText className="h-4 w-4" />, mode: 'productivity', label: 'Tasks', color: 'bg-orange-500' },
              { icon: <Globe className="h-4 w-4" />, mode: 'translator', label: 'Translate', color: 'bg-violet-500' },
              { icon: <BookOpen className="h-4 w-4" />, mode: 'recommendations', label: 'Recommend', color: 'bg-teal-500' },
            ].map((item) => (
              <motion.button
                key={item.mode}
                className={`mb-1 flex items-center space-x-1 rounded-full px-3 py-1.5 text-xs font-medium ${
                  chatMode === item.mode 
                    ? `${item.color} text-white` 
                    : 'bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
                onClick={() => handleModeSwitch(item.mode as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </SlideIn>
      )}
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
        <InputArea 
          onSendMessage={sendMessage} 
          isLoading={isLoading} 
          onModeSwitch={handleModeSwitch}
          currentMode={chatMode}
        />
      </div>
    </FadeIn>
  );
};

export default ChatInterface;