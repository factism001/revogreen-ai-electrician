
import type { Message } from './ChatInterface';
import { Avatar } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { RevogreenRLogo } from '@/components/icons/RevogreenRLogo'; // Import new logo
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ElectricalAdviceOutput } from '@/ai/flows/electrical-advice';
import type { TroubleshootingAdviceOutput } from '@/ai/flows/troubleshooting-advice';
import type { AccessoryRecommendationOutput } from '@/ai/flows/accessory-recommendation';

interface ChatMessageProps {
  message: Message;
}

// Helper function to render text with simple Markdown (bold, italics)
const renderFormattedText = (text: string) => {
  if (typeof text !== 'string') {
    // Fallback for non-string content, though typically we expect strings here.
    return { __html: '' };
  }
  let html = text;
  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italics: *text* or _text_
  html = html.replace(/_(.*?)_/g, '<em>$1</em>'); 
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');   
  
  return { __html: html };
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  const renderContent = () => {
    if (message.type === 'loading') {
      return (
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-current rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-current rounded-full animate-pulse"></div>
        </div>
      );
    }

    if (typeof message.content === 'string') {
      if (isUser) {
        return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
      }
      return <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={renderFormattedText(message.content)} />;
    }
    
    if (message.type === 'advice' && message.content && typeof message.content === 'object' && 'answer' in message.content) {
      return <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={renderFormattedText((message.content as ElectricalAdviceOutput).answer)} />;
    }
    
    if (message.type === 'troubleshooting' && message.content && typeof message.content === 'object' && 'troubleshootingSteps' in message.content) {
      const content = message.content as TroubleshootingAdviceOutput;
      return (
        <div>
          <h4 className="font-semibold mb-1 text-sm">Troubleshooting Steps:</h4>
          <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={renderFormattedText(content.troubleshootingSteps)} />
          {content.safetyPrecautions && (
            <>
              <h4 className="font-semibold mt-3 mb-1 text-sm">Safety Precautions:</h4>
              <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={renderFormattedText(content.safetyPrecautions)} />
            </>
          )}
        </div>
      );
    }
    
    if (message.type === 'recommendation' && message.content && typeof message.content === 'object' && 'accessories' in message.content) {
      const content = message.content as AccessoryRecommendationOutput;
      return (
        <div>
          <h4 className="font-semibold mb-1 text-sm">Recommended Accessories:</h4>
          <ul className="list-disc list-inside text-sm">
            {content.accessories.map((acc, index) => (
              <li key={index} className="whitespace-pre-wrap" dangerouslySetInnerHTML={renderFormattedText(acc)} />
            ))}
          </ul>
          {content.justification && (
            <>
              <h4 className="font-semibold mt-3 mb-1 text-sm">Justification:</h4>
              <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={renderFormattedText(content.justification)} />
            </>
          )}
        </div>
      );
    }

    return <p className="text-sm whitespace-pre-wrap italic">Received unhandled message format.</p>;
  };

  return (
    <div className={cn('flex items-end gap-2 mb-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-card border border-primary/30 text-primary-foreground flex items-center justify-center overflow-hidden">
          {/* The RevogreenRLogo will be scaled by its own width/height attributes or by CSS if needed */}
          <RevogreenRLogo className="h-5 w-5" /> 
        </Avatar>
      )}
      <Card className={cn(
        'max-w-[75%] rounded-xl shadow-md',
        isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none'
      )}>
        <CardContent className="p-3">
          {renderContent()}
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
