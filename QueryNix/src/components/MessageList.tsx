
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/hooks/useChat';
import { SlideUp } from './Transitions';
import { Button } from './ui/button';
import { Download, Copy, Play, Video } from 'lucide-react';
import { toast } from 'sonner';
import { downloadVideo } from '@/services/runway-service';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    }).format(date);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Text copied to clipboard');
  };

  const handleDownloadContent = (url: string, type: string) => {
    if (!url) return;
    
    if (type === 'video') {
      downloadVideo(url);
      return;
    }
    
    const link = document.createElement('a');
    link.href = url;
    link.download = type === 'image' ? 'generated-image.png' : 'generated-audio.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} downloaded successfully`);
  };

  const renderMessageContent = (message: Message) => {
    if (message.role === 'user') {
      return message.content.split('\n').map((text, i) => (
        <p key={i} className={i > 0 ? 'mt-2' : ''}>{text}</p>
      ));
    }

    // Process content for assistant messages
    const parts = [];
    let currentIndex = 0;

    // Check for images
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    let imageMatch;
    
    while ((imageMatch = imageRegex.exec(message.content)) !== null) {
      // Add text before the image
      if (imageMatch.index > currentIndex) {
        const textBefore = message.content.substring(currentIndex, imageMatch.index);
        parts.push(
          <div key={`text-${currentIndex}`}>
            {textBefore.split('\n').map((text, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>{text}</p>
            ))}
          </div>
        );
      }

      // Add the image with download button
      const imageUrl = imageMatch[1];
      parts.push(
        <div key={`image-${imageMatch.index}`} className="my-2">
          <img src={imageUrl} alt="Generated" className="max-w-full rounded-md my-2" />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleDownloadContent(imageUrl, 'image')}>
              <Download className="mr-1 h-4 w-4" /> Download Image
            </Button>
          </div>
        </div>
      );

      currentIndex = imageMatch.index + imageMatch[0].length;
    }

    // Check for code blocks
    const codeRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
    let codeMatch;
    let tempContent = message.content;
    let codeBlocks = [];

    while ((codeMatch = codeRegex.exec(tempContent)) !== null) {
      const language = codeMatch[1] || 'plaintext';
      const code = codeMatch[2];
      
      codeBlocks.push({
        index: codeMatch.index,
        length: codeMatch[0].length,
        language,
        code
      });
    }

    // Process any remaining text from the last special element to the end
    if (codeBlocks.length === 0 && !parts.length) {
      // No special elements, just render the text
      return message.content.split('\n').map((text, i) => (
        <p key={i} className={i > 0 ? 'mt-2' : ''}>{text}</p>
      ));
    } else if (codeBlocks.length > 0) {
      // We have code blocks
      let lastIndex = 0;
      const codeParts = [];

      codeBlocks.forEach((block, i) => {
        // Add text before the code block
        if (block.index > lastIndex) {
          const textBefore = tempContent.substring(lastIndex, block.index);
          codeParts.push(
            <div key={`text-before-${i}`}>
              {textBefore.split('\n').map((text, j) => (
                <p key={j} className={j > 0 ? 'mt-2' : ''}>{text}</p>
              ))}
            </div>
          );
        }

        // Add the code block with copy button
        codeParts.push(
          <div key={`code-${i}`} className="my-2 rounded-md bg-muted p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">{block.language}</span>
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 w-7 p-0" 
                  onClick={() => handleCopyCode(block.code)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <pre className="overflow-x-auto text-sm">
              <code>{block.code}</code>
            </pre>
          </div>
        );

        lastIndex = block.index + block.length;
      });

      // Add any remaining text
      if (lastIndex < tempContent.length) {
        const textAfter = tempContent.substring(lastIndex);
        codeParts.push(
          <div key="text-after">
            {textAfter.split('\n').map((text, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>{text}</p>
            ))}
          </div>
        );
      }

      return codeParts;
    }

    // Add any remaining text
    if (currentIndex < message.content.length) {
      const textAfter = message.content.substring(currentIndex);
      parts.push(
        <div key={`text-after-${currentIndex}`}>
          {textAfter.split('\n').map((text, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>{text}</p>
          ))}
        </div>
      );
    }

    return parts.length ? parts : message.content.split('\n').map((text, i) => (
      <p key={i} className={i > 0 ? 'mt-2' : ''}>{text}</p>
    ));
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="space-y-6">
        {messages.map((message, index) => (
          <SlideUp 
            key={message.id} 
            delay={index === messages.length - 1 ? 0.1 : 0}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[85%] rounded-2xl p-4 shadow-subtle 
                ${message.role === 'user' 
                  ? 'bg-querynix-500/10 text-foreground' 
                  : message.role === 'system'
                    ? 'bg-muted/50 text-muted-foreground italic'
                    : 'glass-panel'
                }
              `}
            >
              <div className="text-sm">
                {renderMessageContent(message)}
              </div>
              
              {message.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={message.imageUrl} 
                    alt="Generated content" 
                    className="w-full rounded-md" 
                  />
                  <div className="mt-2 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownloadContent(message.imageUrl!, 'image')}
                    >
                      <Download className="mr-1 h-4 w-4" /> Download Image
                    </Button>
                  </div>
                </div>
              )}
              
              {message.videoUrl && (
                <div className="mt-2">
                  <video 
                    controls 
                    className="w-full rounded-md"
                    poster="/placeholder.svg"
                  >
                    <source src={message.videoUrl} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                  <div className="mt-2 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDownloadContent(message.videoUrl!, 'video')}
                    >
                      <Download className="mr-1 h-4 w-4" /> Download Video
                    </Button>
                  </div>
                </div>
              )}
              
              {message.audioUrl && (
                <div className="mt-2">
                  <audio controls className="w-full">
                    <source src={message.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-1" 
                    onClick={() => handleDownloadContent(message.audioUrl!, 'audio')}
                  >
                    <Download className="mr-1 h-4 w-4" /> Download Audio
                  </Button>
                </div>
              )}
              
              {message.role === 'assistant' && (
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={() => handleCopyText(message.content)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div className="mt-1 text-right text-xs text-muted-foreground">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </SlideUp>
        ))}
        
        {isLoading && (
          <SlideUp delay={0.1} className="flex justify-start">
            <div className="glass-panel max-w-[85%] rounded-2xl p-4">
              <div className="flex space-x-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-querynix-300"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-querynix-400" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-querynix-500" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </SlideUp>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;