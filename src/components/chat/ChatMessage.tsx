import type { Message } from './ChatInterface'; // Assuming Message type is exported from ChatInterface
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn('flex items-end gap-2 mb-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
          <Bot size={20} />
        </Avatar>
      )}
      <Card className={cn(
        'max-w-[75%] rounded-xl shadow-md',
        isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none'
      )}>
        <CardContent className="p-3">
          {/* Basic text display. Can be expanded for structured data */}
          {typeof message.content === 'string' ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            // Example for structured troubleshooting advice
            message.content.troubleshootingSteps && (
              <div>
                <h4 className="font-semibold mb-1">Troubleshooting Steps:</h4>
                <p className="text-sm whitespace-pre-wrap">{message.content.troubleshootingSteps}</p>
                {message.content.safetyPrecautions && (
                  <>
                    <h4 className="font-semibold mt-3 mb-1">Safety Precautions:</h4>
                    <p className="text-sm whitespace-pre-wrap">{message.content.safetyPrecautions}</p>
                  </>
                )}
              </div>
            )
          )}
          {message.type === 'loading' && (
             <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-current rounded-full animate-pulse"></div>
            </div>
          )}
        </CardContent>
      </Card>
      {isUser && (
        <Avatar className="h-8 w-8 bg-accent text-accent-foreground flex items-center justify-center">
          <User size={20} />
        </Avatar>
      )}
    </div>
  );
}
