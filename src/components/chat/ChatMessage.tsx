
import type { Message } from './ChatInterface';
import Image from 'next/image';
import { Avatar } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { RevogreenRLogo } from '@/components/icons/RevogreenRLogo';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ElectricalAdviceOutput, TroubleshootingAdviceOutput, AccessoryRecommendationOutput } from '@/lib/types';

interface ChatMessageProps {
  message: Message;
}

// Helper function to render text with simple Markdown (bold, italics)
const renderFormattedText = (text: string) => {
  if (typeof text !== 'string') {
    return { __html: '' };
  }
  let html = text;
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>'); 
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');   
  
  return { __html: html };
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  const renderContent = () => {
    let textContent: string | null = null;
    let adviceOutput: ElectricalAdviceOutput | null = null;
    let troubleshootingOutput: TroubleshootingAdviceOutput | null = null;
    let recommendationOutput: AccessoryRecommendationOutput | null = null;

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
      textContent = message.content;
    } else if (message.type === 'advice' && message.content && 'answer' in message.content) {
      adviceOutput = message.content as ElectricalAdviceOutput;
    } else if (message.type === 'troubleshooting' && message.content && 'troubleshootingSteps' in message.content) {
      troubleshootingOutput = message.content as TroubleshootingAdviceOutput;
    } else if (message.type === 'recommendation' && message.content && 'accessories' in message.content) {
      recommendationOutput = message.content as AccessoryRecommendationOutput;
    } else {
      textContent = "Received unhandled message format.";
    }

    return (
      <>
        {message.image && (
          <div className="my-2">
            <Image 
              src={message.image} 
              alt="User uploaded image" 
              width={200} // Adjust as needed
              height={200} // Adjust as needed
              className="rounded-md object-contain max-h-48 w-auto"
              data-ai-hint="electrical component"
            />
          </div>
        )}
        {textContent && (
          <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={isUser ? {__html: textContent} : renderFormattedText(textContent)} />
        )}
        {adviceOutput && (
          <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={renderFormattedText(adviceOutput.answer)} />
        )}
        {troubleshootingOutput && (
          <div>
            <h4 className="font-semibold mb-1 text-sm">Troubleshooting Steps:</h4>
            <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={renderFormattedText(troubleshootingOutput.troubleshootingSteps)} />
            {troubleshootingOutput.safetyPrecautions && (
              <>
                <h4 className="font-semibold mt-3 mb-1 text-sm">Safety Precautions:</h4>
                <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={renderFormattedText(troubleshootingOutput.safetyPrecautions)} />
              </>
            )}
          </div>
        )}
        {recommendationOutput && (
           <div>
            <h4 className="font-semibold mb-1 text-sm">Recommended Accessories:</h4>
            <ul className="list-disc list-inside text-sm">
              {recommendationOutput.accessories.map((acc, index) => (
                <li key={index} className="whitespace-pre-wrap" dangerouslySetInnerHTML={renderFormattedText(acc)} />
              ))}
            </ul>
            {recommendationOutput.justification && (
              <>
                <h4 className="font-semibold mt-3 mb-1 text-sm">Justification:</h4>
                <p className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={renderFormattedText(recommendationOutput.justification)} />
              </>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={cn('flex items-end gap-2 mb-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-card border border-primary/30 text-primary-foreground flex items-center justify-center overflow-hidden self-start">
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
        <Avatar className="h-8 w-8 bg-accent text-accent-foreground flex items-center justify-center self-start">
          <User size={20} />
        </Avatar>
      )}
    </div>
  );
}
