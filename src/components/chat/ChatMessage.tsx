
import type { Message } from './ChatInterface';
import { Avatar } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ElectricalAdviceOutput } from '@/ai/flows/electrical-advice';
import type { TroubleshootingAdviceOutput } from '@/ai/flows/troubleshooting-advice';
import type { AccessoryRecommendationOutput } from '@/ai/flows/accessory-recommendation';

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
          {message.type === 'loading' ? (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-current rounded-full animate-pulse"></div>
            </div>
          ) : typeof message.content === 'string' ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : message.type === 'advice' && message.content && typeof message.content === 'object' && 'answer' in message.content ? (
            <p className="text-sm whitespace-pre-wrap">{(message.content as ElectricalAdviceOutput).answer}</p>
          ) : message.type === 'troubleshooting' && message.content && typeof message.content === 'object' && 'troubleshootingSteps' in message.content ? (
            <div>
              <h4 className="font-semibold mb-1 text-sm">Troubleshooting Steps:</h4>
              <p className="text-sm whitespace-pre-wrap">{(message.content as TroubleshootingAdviceOutput).troubleshootingSteps}</p>
              {(message.content as TroubleshootingAdviceOutput).safetyPrecautions && (
                <>
                  <h4 className="font-semibold mt-3 mb-1 text-sm">Safety Precautions:</h4>
                  <p className="text-sm whitespace-pre-wrap">{(message.content as TroubleshootingAdviceOutput).safetyPrecautions}</p>
                </>
              )}
            </div>
          ) : message.type === 'recommendation' && message.content && typeof message.content === 'object' && 'accessories' in message.content ? (
            <div>
              <h4 className="font-semibold mb-1 text-sm">Recommended Accessories:</h4>
              <ul className="list-disc list-inside text-sm whitespace-pre-wrap">
                {(message.content as AccessoryRecommendationOutput).accessories.map((acc, index) => (
                  <li key={index}>{acc}</li>
                ))}
              </ul>
              {(message.content as AccessoryRecommendationOutput).justification && (
                <>
                  <h4 className="font-semibold mt-3 mb-1 text-sm">Justification:</h4>
                  <p className="text-sm whitespace-pre-wrap">{(message.content as AccessoryRecommendationOutput).justification}</p>
                </>
              )}
            </div>
          ) : (
             <p className="text-sm whitespace-pre-wrap italic">Received unhandled message format.</p>
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
