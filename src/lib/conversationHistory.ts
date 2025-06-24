import { Message } from '@/components/chat/ChatInterface';
import { ModelChatHistory, ModelChatMessage, GoogleAIPart } from '@/lib/types';

export function convertMessagesToHistory(messages: Message[]): ModelChatHistory {
  // Filter out loading, error, and intro messages, keep only actual conversation
  const conversationMessages = messages.filter(msg => 
    msg.type !== 'loading' && 
    msg.type !== 'error' && 
    !msg.id.includes('-intro-')
  );

  const history: ModelChatHistory = [];

  for (const message of conversationMessages) {
    const parts: GoogleAIPart[] = [];

    if (message.sender === 'user') {
      // User message
      if (typeof message.content === 'string') {
        parts.push({ text: message.content });
      }

      // Add image if present
      if (message.image) {
        const mimeType = message.image.split(';')[0].split(':')[1];
        const base64Data = message.image.split(',')[1];
        parts.push({
          inlineData: {
            mimeType,
            data: base64Data
          }
        });
      }

      history.push({
        role: 'user',
        parts
      });
    } else if (message.sender === 'ai') {
      // AI message
      let responseText = '';
      
      if (typeof message.content === 'string') {
        responseText = message.content;
      } else if (message.content && typeof message.content === 'object') {
        // Handle structured AI responses
        if ('answer' in message.content) {
          responseText = message.content.answer;
        } else if ('troubleshootingSteps' in message.content) {
          responseText = `${message.content.troubleshootingSteps}\n\nSafety Precautions: ${message.content.safetyPrecautions || 'Follow standard safety guidelines.'}`;
        } else if ('accessories' in message.content) {
          const accessories = message.content.accessories?.map(acc => acc).join(', ') || '';
          responseText = `Recommended accessories: ${accessories}\n\n${message.content.justification}`;
        }
      }

      if (responseText) {
        history.push({
          role: 'model',
          parts: [{ text: responseText }]
        });
      }
    }
  }

  return history;
}

export function getRecentHistory(history: ModelChatHistory, maxMessages: number = 10): ModelChatHistory {
  // Keep the most recent messages, but ensure we don't exceed token limits
  return history.slice(-maxMessages);
}
