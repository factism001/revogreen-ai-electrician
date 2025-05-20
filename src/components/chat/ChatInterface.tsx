'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import { fetchElectricalAdvice, fetchTroubleshootingAdvice, fetchAccessoryRecommendation } from '@/lib/aiActions';
import type { ElectricalAdviceOutput } from '@/ai/flows/electrical-advice';
import type { TroubleshootingAdviceOutput } from '@/ai/flows/troubleshooting-advice';
import type { AccessoryRecommendationOutput } from '@/ai/flows/accessory-recommendation';
import { Send, Loader2, Zap, Wrench, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string | ElectricalAdviceOutput | TroubleshootingAdviceOutput | AccessoryRecommendationOutput;
  type?: 'text' | 'loading' | 'error' | 'advice' | 'troubleshooting' | 'recommendation';
}

type AiMode = "advice" | "troubleshooting" | "recommendation";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState<AiMode>("advice");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      type: 'text',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      content: 'Thinking...',
      type: 'loading',
    };
    setMessages((prevMessages) => [...prevMessages, loadingMessage]);
    
    try {
      let aiResponseContent: ElectricalAdviceOutput | TroubleshootingAdviceOutput | AccessoryRecommendationOutput;
      let responseType: Message['type'];

      switch (aiMode) {
        case "troubleshooting":
          aiResponseContent = await fetchTroubleshootingAdvice({ problemDescription: userMessage.content as string });
          responseType = 'troubleshooting';
          break;
        case "recommendation":
          aiResponseContent = await fetchAccessoryRecommendation({ needs: userMessage.content as string });
          responseType = 'recommendation';
          break;
        case "advice":
        default:
          aiResponseContent = await fetchElectricalAdvice({ question: userMessage.content as string });
          responseType = 'advice';
          break;
      }
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: aiResponseContent,
        type: responseType,
      };
      setMessages((prevMessages) => prevMessages.filter(msg => msg.type !== 'loading'));
      setMessages((prevMessages) => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: 'Sorry, something went wrong. Please try again.',
        type: 'error',
      };
      setMessages((prevMessages) => prevMessages.filter(msg => msg.type !== 'loading'));
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholderText = () => {
    switch (aiMode) {
      case "advice": return "Ask a general electrical question...";
      case "troubleshooting": return "Describe your electrical problem...";
      case "recommendation": return "What electrical accessories do you need?";
      default: return "Type your message...";
    }
  };

  return (
    <Card className="w-full h-[calc(100vh-20rem)] shadow-xl flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-base sm:text-lg flex items-center">
          <Zap className="mr-2 h-5 w-5 text-primary" /> Revogreen AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t bg-muted/30">
        <div className="flex flex-col gap-2">
          <Select value={aiMode} onValueChange={(value) => setAiMode(value as AiMode)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="advice"><Lightbulb className="inline-block mr-2 h-4 w-4" />Advice</SelectItem>
              <SelectItem value="troubleshooting"><Wrench className="inline-block mr-2 h-4 w-4" />Troubleshoot</SelectItem>
              <SelectItem value="recommendation"><Zap className="inline-block mr-2 h-4 w-4" />Accessories</SelectItem>
            </SelectContent>
          </Select>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getPlaceholderText()}
              disabled={isLoading}
              className="flex-grow bg-background focus-visible:ring-primary"
              aria-label="Chat input"
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="bg-primary hover:bg-primary/90">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
}
