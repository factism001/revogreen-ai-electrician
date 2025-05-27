
'use client';

import { useState, useEffect } from 'react'; // Added useEffect for isMobile pattern
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatInterface from '@/components/chat/ChatInterface';
import FAQSection from '@/components/faq/FAQSection';
import SafetyTipsSection from '@/components/safety/SafetyTipsSection';
import EnergyEstimator from '@/components/features/EnergyEstimator';
import ProjectPlanner from '@/components/features/ProjectPlanner';
import EnergyConsumptionCalculator from '@/components/features/EnergyConsumptionCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageCircle, HelpCircle, ShieldAlert, Bot, Menu, BarChart3, ListChecks, Calculator } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile'; // Import the hook

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("chat");
  const isMobile = useIsMobile(); // Use the hook

  const getTabName = (tabValue: string) => {
    if (tabValue === 'faq') return 'FAQ';
    if (tabValue === 'safety') return 'Safety Tips';
    if (tabValue === 'estimator') return 'Energy Estimator';
    if (tabValue === 'planner') return 'Project Planner';
    if (tabValue === 'calculator') return 'Energy Calculator';
    return 'AI Chat';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-6 sm:py-8 flex flex-col">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-3xl font-bold text-primary flex items-center justify-center">
            <Bot className="mr-1 h-5 w-5 sm:mr-3 sm:h-8 sm:w-8" />
            Revogreen AI Electrician
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground mt-1 sm:mt-1.5">
            Your AI-powered guide for electrical advice in Nigeria.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-grow">
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
                <DropdownMenuItem onSelect={() => setActiveTab('estimator')}>
                  <BarChart3 className="mr-2 h-5 w-5" /> Energy Estimator
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setActiveTab('planner')}>
                  <ListChecks className="mr-2 h-5 w-5" /> Project Planner
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setActiveTab('calculator')}>
                  <Calculator className="mr-2 h-5 w-5" /> Energy Calculator
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
          <TabsList className="hidden sm:grid w-full grid-cols-3 md:grid-cols-6 mb-6 rounded-lg p-1 bg-muted relative z-10">
            <TabsTrigger value="chat" className="py-2.5 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">
              <MessageCircle className="mr-2 h-5 w-5" /> AI Chat
            </TabsTrigger>
            <TabsTrigger value="estimator" className="py-2.5 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">
              <BarChart3 className="mr-2 h-5 w-5" /> Energy Estimator
            </TabsTrigger>
            <TabsTrigger value="planner" className="py-2.5 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">
              <ListChecks className="mr-2 h-5 w-5" /> Project Planner
            </TabsTrigger>
            <TabsTrigger value="calculator" className="py-2.5 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">
              <Calculator className="mr-2 h-5 w-5" /> Energy Calculator
            </TabsTrigger>
            <TabsTrigger value="faq" className="py-2.5 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">
              <HelpCircle className="mr-2 h-5 w-5" /> FAQ
            </TabsTrigger>
            <TabsTrigger value="safety" className="py-2.5 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md">
              <ShieldAlert className="mr-2 h-5 w-5" /> Safety Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-4 flex-grow flex flex-col">
            <ChatInterface />
          </TabsContent>
          <TabsContent value="estimator" className="mt-4">
            <EnergyEstimator />
          </TabsContent>
          <TabsContent value="planner" className="mt-4">
            <ProjectPlanner />
          </TabsContent>
          <TabsContent value="calculator" className="mt-4">
            <EnergyConsumptionCalculator />
          </TabsContent>
          <TabsContent value="faq" className="mt-4">
            <FAQSection />
          </TabsContent>
          <TabsContent value="safety" className="mt-4">
            <SafetyTipsSection />
          </TabsContent>
        </Tabs>
      </main>
      {/* Conditionally render Footer */}
      {!(isMobile && activeTab === 'chat') && <Footer />}
    </div>
  );
}
