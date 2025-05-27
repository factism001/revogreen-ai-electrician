
'use client';

import { useState, useRef, useEffect, type FormEvent, type UIEvent, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import { fetchElectricalAdvice, fetchTroubleshootingAdvice, fetchAccessoryRecommendation } from '@/lib/aiActions';
import type { ElectricalAdviceInput, ElectricalAdviceOutput } from '@/ai/flows/electrical-advice';
import type { TroubleshootingAdviceOutput } from '@/ai/flows/troubleshooting-advice';
import type { AccessoryRecommendationOutput } from '@/ai/flows/accessory-recommendation';
import { Send, Loader2, Zap, Wrench, Lightbulb, ArrowDownCircle, ShieldAlert, Paperclip, XCircle } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';


export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string | ElectricalAdviceOutput | TroubleshootingAdviceOutput | AccessoryRecommendationOutput;
  type?: 'text' | 'loading' | 'error' | 'advice' | 'troubleshooting' | 'recommendation';
  image?: string; // For displaying image preview in chat (data URI)
}

type AiMode = "advice" | "troubleshooting" | "recommendation";

const introductoryMessages: Record<AiMode, string> = {
  advice: "Hello! I'm Revodev, your AI Electrician. In Advice Mode, you can ask general electrical questions relevant to Nigeria. You can also upload an image for context. How can I assist?",
  troubleshooting: "Hi, I'm Revodev. Switched to Troubleshooting Mode! Please describe the electrical problem you're experiencing in detail. Image uploads are not supported in this mode yet. I'll provide potential steps and safety tips.",
  recommendation: "Welcome to Accessory Recommendation Mode! I'm Revodev. Tell me about your electrical needs, and I'll suggest suitable accessories. Image uploads are not supported here."
};

const SCROLL_THRESHOLD = 50; 
const DISCLAIMER_LOCAL_STORAGE_KEY = 'revogreenAiDisclaimerAcknowledged_v1';
const MAX_IMAGE_SIZE_MB = 5;

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState<AiMode>("advice");
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  const [isDisclaimerDialogOpen, setIsDisclaimerDialogOpen] = useState(false);
  const [pendingInputValue, setPendingInputValue] = useState<string | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);


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
    if (viewport && !showScrollToBottomButton) { // Only auto-scroll if user isn't scrolled up
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, showScrollToBottomButton]);


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

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processAndSendMessage = async (messageContent: string, imageFile?: File | null) => {
    let imageDataUriForBackend: string | undefined = undefined;
    let imagePreviewForUserMessage: string | undefined = imageFile ? await fileToDataUri(imageFile) : undefined;


    if (imageFile && aiMode === 'advice') {
       try {
        imageDataUriForBackend = await fileToDataUri(imageFile);
      } catch (error) {
        console.error("Error converting image to Data URI:", error);
        toast({ variant: "destructive", title: "Image Error", description: "Could not process the image." });
        setIsLoading(false);
        return;
      }
    }


    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: messageContent,
      type: 'text',
      image: imagePreviewForUserMessage,
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
      
      // clientIp is managed by aiActions.ts now
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
          const adviceInput: ElectricalAdviceInput = { question: userMessage.content as string };
          if (imageDataUriForBackend) {
            adviceInput.imageDataUri = imageDataUriForBackend;
          }
          aiResponseContent = await fetchElectricalAdvice(adviceInput);
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
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentInput = inputValue.trim();
    if ((!currentInput && !selectedImageFile) || isLoading) return;
     if (aiMode !== 'advice' && selectedImageFile) {
        toast({
            variant: "destructive",
            title: "Image Upload Not Supported",
            description: `Image uploads are only supported in "Advice" mode. Please switch modes or remove the image.`,
        });
        return;
    }


    if (!disclaimerAcknowledged) {
      setPendingInputValue(currentInput);
      setPendingImageFile(selectedImageFile); 
      setIsDisclaimerDialogOpen(true);
      setInputValue(''); 
      return;
    }
    await processAndSendMessage(currentInput, selectedImageFile);
    setInputValue('');
  };

  const handleDisclaimerAccept = async () => {
    setDisclaimerAcknowledged(true);
    localStorage.setItem(DISCLAIMER_LOCAL_STORAGE_KEY, 'true');
    setIsDisclaimerDialogOpen(false);
    if (pendingInputValue !== null || pendingImageFile !== null) { 
      await processAndSendMessage(pendingInputValue || '', pendingImageFile); 
      setPendingInputValue(null);
      setPendingImageFile(null); 
    }
  };
  
  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Image Too Large",
          description: `Please select an image smaller than ${MAX_IMAGE_SIZE_MB}MB.`,
        });
        if (fileInputRef.current) fileInputRef.current.value = ""; 
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please select an image file (e.g., JPG, PNG, WEBP).",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setSelectedImageFile(file);
      try {
        const dataUri = await fileToDataUri(file);
        setImagePreviewUrl(dataUri);
      } catch (error) {
        console.error("Error creating image preview:", error);
        toast({ variant: "destructive", title: "Image Preview Error", description: "Could not display image preview." });
        setSelectedImageFile(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };


  const getPlaceholderText = () => {
    switch (aiMode) {
      case "advice": return "Ask an electrical question or describe an image...";
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
      <Card className="w-full flex flex-col flex-grow bg-background text-foreground border-0 shadow-none rounded-none">
        <CardHeader className="pb-2 pt-3 px-2 sm:px-4">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary" /> Revogreen AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden relative">
          <ScrollArea 
            className="h-full px-2 sm:px-4 pt-2 pb-1" 
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
              className="absolute bottom-4 right-4 z-10 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
              onClick={handleScrollToBottomClick}
              aria-label="Scroll to bottom"
            >
              <ArrowDownCircle className="h-6 w-6 text-primary" />
            </Button>
          )}
        </CardContent>
        <div className="px-2 sm:px-4 py-2 border-t border-border">
           {imagePreviewUrl && (
            <div className="mb-2 p-2 border rounded-md bg-muted/50 relative max-w-xs mx-auto">
              <Image src={imagePreviewUrl} alt="Selected preview" width={100} height={100} className="rounded-md object-contain max-h-24 w-auto" />
              <Button variant="ghost" size="icon" onClick={removeSelectedImage} className="absolute top-1 right-1 h-6 w-6 bg-destructive/20 hover:bg-destructive/40 rounded-full">
                <XCircle className="h-4 w-4 text-destructive-foreground" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Select value={aiMode} onValueChange={(value) => setAiMode(value as AiMode)} disabled={isLoading}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="advice"><Lightbulb className="inline-block mr-2 h-4 w-4" />Advice (with Image)</SelectItem>
                <SelectItem value="troubleshooting"><Wrench className="inline-block mr-2 h-4 w-4" />Troubleshoot</SelectItem>
                <SelectItem value="recommendation"><Zap className="inline-block mr-2 h-4 w-4" />Accessories</SelectItem>
              </SelectContent>
            </Select>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              {aiMode === 'advice' && (
                <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading || isDisclaimerDialogOpen} className="shrink-0">
                  <Paperclip className="h-5 w-5" />
                  <span className="sr-only">Attach image</span>
                </Button>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={getPlaceholderText()}
                disabled={isLoading || isDisclaimerDialogOpen}
                className="flex-grow bg-background focus-visible:ring-primary"
                aria-label="Chat input"
              />
              <Button type="submit" size="icon" disabled={isLoading || (!inputValue.trim() && !selectedImageFile) || isDisclaimerDialogOpen} className="bg-primary hover:bg-primary/90">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </div>
      </Card>

      <AlertDialog open={isDisclaimerDialogOpen} onOpenChange={(open) => {
          if (!open) { 
              setPendingInputValue(null);
              setPendingImageFile(null);
          }
          setIsDisclaimerDialogOpen(open);
      }}>
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
