
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
import { Send, Loader2, Zap, Wrench, Lightbulb, ArrowDownCircle, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
const DISCLAIMER_LOCAL_STORAGE_KEY = 'revogreenAiDisclaimerAcknowledged_v1';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState<AiMode>("advice");
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null); 

  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  const [isDisclaimerDialogOpen, setIsDisclaimerDialogOpen] = useState(false);
  const [pendingInputValue, setPendingInputValue] = useState<string | null>(null);

  useEffect(() => {
    const acknowledged = localStorage.getItem(DISCLAIMER_LOCAL_STORAGE_KEY) === 'true';
    if (acknowledged) {
      setDisclaimerAcknowledged(true);
    }
  }, []);

  const getViewport = () => {
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
        if (prevMessages.length > 0 && prevMessages[prevMessages.length -1].id.includes(`-intro-${aiMode}`)) {
          return prevMessages;
        }
        return [...prevMessages, introMessage];
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiMode]); 

  const processAndSendMessage = async (messageContent: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: messageContent,
      type: 'text',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
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
      const errorMessageText = error instanceof Error ? error.message : 'Sorry, something went wrong. Please try again.';
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: errorMessageText,
        type: 'error',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentInput = inputValue.trim();
    if (!currentInput || isLoading) return;

    if (!disclaimerAcknowledged) {
      setPendingInputValue(currentInput);
      setIsDisclaimerDialogOpen(true);
      setInputValue(''); // Clear the input field
      return;
    }
    await processAndSendMessage(currentInput);
    setInputValue('');
  };

  const handleDisclaimerAccept = async () => {
    setDisclaimerAcknowledged(true);
    localStorage.setItem(DISCLAIMER_LOCAL_STORAGE_KEY, 'true');
    setIsDisclaimerDialogOpen(false);
    if (pendingInputValue) {
      await processAndSendMessage(pendingInputValue);
      setPendingInputValue(null);
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
    const target = event.currentTarget; 
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
    <>
      <Card className="w-full h-[calc(100vh-20rem)] shadow-xl flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary" /> Revogreen AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden relative">
          <ScrollArea 
            className="h-full p-4" 
            ref={scrollAreaRef} 
            onScroll={handleScroll} 
          >
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
                disabled={isLoading || isDisclaimerDialogOpen}
                className="flex-grow bg-background focus-visible:ring-primary"
                aria-label="Chat input"
              />
              <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim() || isDisclaimerDialogOpen} className="bg-primary hover:bg-primary/90">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </div>
      </Card>

      <AlertDialog open={isDisclaimerDialogOpen} onOpenChange={setIsDisclaimerDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <ShieldAlert className="h-6 w-6 mr-2 text-amber-500" />
              Important Disclaimer
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left max-h-[60vh] overflow-y-auto py-2">
              Revodev AI provides general electrical advice and suggestions. Information may not be exhaustive or cover all specific situations, and AI can make mistakes. 
              <br/><br/>
              <strong>Always consult a qualified and licensed electrician</strong> before making any decisions or performing any electrical work. Revogreen Energy Hub is not liable for any actions taken based on the AI's suggestions.
              <br/><br/>
              By clicking 'I Understand & Agree', you acknowledge these terms.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDisclaimerAccept} className="bg-primary hover:bg-primary/90">
              I Understand & Agree
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
