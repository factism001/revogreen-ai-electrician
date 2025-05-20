import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatInterface from '@/components/chat/ChatInterface';
import FAQSection from '@/components/faq/FAQSection';
import SafetyTipsSection from '@/components/safety/SafetyTipsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, HelpCircle, ShieldAlert, Bot } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary flex items-center justify-center">
            <Bot className="mr-2 h-7 w-7 sm:mr-3 sm:h-8 sm:w-8" />
            Revogreen AI Electrician
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Your AI-powered guide for electrical advice in Nigeria.
          </p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6 rounded-lg p-1 bg-muted">
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

          <TabsContent value="chat" className="mt-0">
            <ChatInterface />
          </TabsContent>
          <TabsContent value="faq" className="mt-0">
            <FAQSection />
          </TabsContent>
          <TabsContent value="safety" className="mt-0">
            <SafetyTipsSection />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
