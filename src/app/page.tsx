
'use client'; // Add 'use client' for useState

import { useState } from 'react'; // Import useState
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatInterface from '@/components/chat/ChatInterface';
import FAQSection from '@/components/faq/FAQSection';
import SafetyTipsSection from '@/components/safety/SafetyTipsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button'; // Import Button
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Import DropdownMenu components
import { MessageCircle, HelpCircle, ShieldAlert, Bot, Menu } from 'lucide-react'; // Import Menu icon
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("chat");

  const getTabName = (tabValue: string) => {
    if (tabValue === 'faq') return 'FAQ';
    if (tabValue === 'safety') return 'Safety Tips';
    return 'AI Chat';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-primary flex items-center justify-center">
            <Bot className="mr-1 h-6 w-6 sm:mr-3 sm:h-8 sm:w-8" />
            Revogreen AI Electrician
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Your AI-powered guide for electrical advice in Nigeria.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile Dropdown Menu */}
          <div className="sm:hidden mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-between py-2.5 text-sm sm:text-base rounded-md">
                  <span>{getTabName(activeTab)}</span>
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuItem onSelect={() => setActiveTab('chat')}>
                  <MessageCircle className="mr-2 h-5 w-5" /> AI Chat
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setActiveTab('faq')}>
                  <HelpCircle className="mr-2 h-5 w-5" /> FAQ
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setActiveTab('safety')}>
                  <ShieldAlert className="mr-2 h-5 w-5" /> Safety Tips
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Tab List */}
          <TabsList className="hidden sm:grid w-full grid-cols-3 mb-6 rounded-lg p-1 bg-muted relative z-10">
            <TabsTrigger value="chat" className="py-2.5 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">
              <MessageCircle className="mr-2 h-5 w-5" /> AI Chat
            </TabsTrigger>
            <TabsTrigger value="faq" className="py-2.5 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">
              <HelpCircle className="mr-2 h-5 w-5" /> FAQ
            </TabsTrigger>
            <TabsTrigger value="safety" className="py-2.5 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">
              <ShieldAlert className="mr-2 h-5 w-5" /> Safety Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-4">
            <ChatInterface />
          </TabsContent>
          <TabsContent value="faq" className="mt-4">
            <FAQSection />
          </TabsContent>
          <TabsContent value="safety" className="mt-4">
            <SafetyTipsSection />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
