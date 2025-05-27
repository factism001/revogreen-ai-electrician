
'use client';

import { useState, useRef, useEffect, type FormEvent, type UIEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import { fetchElectricalAdvice, fetchTroubleshootingAdvice, fetchAccessoryRecommendation } from '@/lib/aiActions';
import type { ElectricalAdviceOutput } from '@/ai/flows/electrical-advice';
import type { TroubleshootingAdviceOutput } from '@/ai/flows/troubleshooting-advice';
import type { AccessoryRecommendationOutput } from '@/ai/flows/accessory-recommendation';
import { Send, Loader2, Zap, Wrench, Lightbulb, ArrowDownCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string | ElectricalAdviceOutput | TroubleshootingAdviceOutput | AccessoryRecommendationOutput;
  type?: 'text' | 'loading' | 'error' | 'advice' | 'troubleshooting' | 'recommendation';
}

type AiMode = "advice" | "troubleshooting" | "recommendation";

const introductoryMessages: Record<AiMode, string> = {
  advice: "Hello! I'm Revodev, your AI Electrician. In Advice Mode, you can ask me general electrical questions relevant to Nigeria. How can I assist you today?",
  troubleshooting: "Hi, I'm Revodev. Switched to Troubleshooting Mode! Please describe the electrical problem you're experiencing in detail, and I'll provide potential steps and safety tips for the Nigerian context.",
  recommendation: "Welcome to Accessory Recommendation Mode! I'm Revodev. Tell me about your electrical needs, and I'll suggest suitable accessories available in Nigeria and tell you a bit about them."
};

const SCROLL_THRESHOLD = 50; // Pixels from bottom to hide the scroll button

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState<AiMode>("advice");
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null); // Ref for the ScrollArea's root
  const viewportRef = useRef<HTMLDivElement>(null); // Ref for the ScrollArea's viewport

  // Function to get the viewport element
  const getViewport = () => {
    // In ShadCN ScrollArea, the viewport is typically the first direct child of the ScrollArea root with specific attributes
    // Or, if we explicitly put a ref on the ScrollAreaPrimitive.Viewport if we were building ScrollArea ourselves.
    // For now, let's assume it's the first child of the element scrollAreaRef is attached to.
    // A more robust way if Radix exports it, or by querySelector based on Radix attributes.
    // For this implementation, let's assume viewportRef is correctly assigned to the Viewport element.
    // The ScrollArea component needs to forward a ref to its Viewport for this to be clean.
    // However, `scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]')` is a more robust way.
    return scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport=""]') as HTMLElement | null;
  };
  
  useEffect(() => {
    const viewport = getViewport();
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);


  useEffect(() => {
    const introContent = introductoryMessages[aiMode];
    if (introContent) {
      const introMessage: Message = {
        id: `${Date.now().toString()}-intro-${aiMode}`,
        sender: 'ai',
        content: introContent,
        type: 'text',
      };
      setMessages((prevMessages) => {
        // Avoid adding duplicate intro messages if mode is selected quickly
        if (prevMessages.length > 0 && prevMessages[prevMessages.length -1].id.includes(`-intro-${aiMode}`)) {
          return prevMessages;
        }
        return [...prevMessages, introMessage];
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiMode]); 

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
      
      setMessages((prevMessages) => prevMessages.filter(msg => msg.type !== 'loading'));
      const aiMessage: Message = {
        id: Date.now().toString(), 
        sender: 'ai',
        content: aiResponseContent,
        type: responseType,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages((prevMessages) => prevMessages.filter(msg => msg.type !== 'loading'));
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: 'Sorry, something went wrong. Please try again.',
        type: 'error',
      };
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

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget; // This is the ScrollArea's Viewport
    if (target) {
      const { scrollTop, scrollHeight, clientHeight } = target;
      if (scrollHeight - scrollTop - clientHeight > SCROLL_THRESHOLD) {
        setShowScrollToBottomButton(true);
      } else {
        setShowScrollToBottomButton(false);
      }
    }
  };

  const handleScrollToBottomClick = () => {
    const viewport = getViewport();
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <Card className="w-full h-[calc(100vh-20rem)] shadow-xl flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-base sm:text-lg flex items-center">
          <Zap className="mr-2 h-5 w-5 text-primary" /> Revogreen AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden relative"> {/* Added relative positioning */}
        <ScrollArea 
          className="h-full p-4" 
          ref={scrollAreaRef} // Ref to the root
          onScroll={handleScroll} // Attach scroll handler to the ScrollArea component (Radix should bubble this from viewport)
          // The actual viewport that scrolls will be a child, so we need to use querySelector or pass ref down.
          // For simplicity, if ScrollArea component allows onScroll, it often means it's from the viewport or bubbled.
          // If not, we would attach onScroll directly to the viewport element using another ref.
          // Let's assume onScroll on ScrollArea works as expected from Radix UI.
        >
          {/* The viewport ref is tricky with ShadCN's ScrollArea. We might need to modify ScrollArea or use querySelector. */}
          {/* For this example, assuming getViewport() in useEffect and handleScrollToBottomClick works. */}
          {/* And that onScroll handler on ScrollArea gives us the viewport scroll event. */}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </ScrollArea>
        {showScrollToBottomButton && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-6 right-6 z-10 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
            onClick={handleScrollToBottomClick}
            aria-label="Scroll to bottom"
          >
            <ArrowDownCircle className="h-6 w-6 text-primary" />
          </Button>
        )}
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
