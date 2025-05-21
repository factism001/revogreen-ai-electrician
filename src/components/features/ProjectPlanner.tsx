
'use client';

import { useState, type FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ListChecks, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { ProjectPlannerOutput } from '@/ai/flows/project-planner';
import { fetchProjectPlan } from '@/lib/aiActions';

export default function ProjectPlanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [plan, setPlan] = useState<ProjectPlannerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Please describe your project.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const result = await fetchProjectPlan({ projectDescription: description });
      setPlan(result);
    } catch (err) {
      console.error("Error fetching project plan:", err);
      setError("Sorry, something went wrong while generating your project plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderFormattedText = (text: string) => {
    if (typeof text !== 'string') return { __html: '' };
    let html = text;
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>').replace(/\*(.*?)\*/g, '<em>$1</em>');
    return { __html: html };
  };


  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl flex items-center">
          <ListChecks className="mr-3 h-6 w-6 sm:h-7 sm:w-7 text-primary" />
          Mini Project Planner
        </CardTitle>
        <CardDescription>
          Describe a small electrical task you're planning (e.g., "I want to install an extra socket" or "replace a light switch"). Revodev will help list materials, tools, and safety tips for Nigeria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Enter your project description here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="bg-background focus-visible:ring-primary"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !description.trim()} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ListChecks className="mr-2 h-5 w-5" />}
            Get Project Plan
          </Button>
        </form>

        {error && (
           <Card className="mt-6 border-destructive bg-destructive/10">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <CardTitle className="text-lg text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {plan && (
          <ScrollArea className="mt-6 h-[400px] p-1">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg" dangerouslySetInnerHTML={renderFormattedText(plan.projectName)} />
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.isComplexProject && (
                  <Card className="border-amber-500 bg-amber-500/10">
                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                      <AlertTriangle className="h-6 w-6 text-amber-600" />
                      <CardTitle className="text-md text-amber-700">Professional Help Recommended</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-amber-700">This project appears to be complex or potentially dangerous for DIY. It's strongly recommended to hire a qualified electrician. Revogreen Energy Hub can assist you with professional services.</p>
                    </CardContent>
                  </Card>
                )}

                {plan.materialsNeeded && plan.materialsNeeded.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-md mb-1">Materials Needed:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {plan.materialsNeeded.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={renderFormattedText(item)} />
                      ))}
                    </ul>
                  </div>
                )}

                {plan.toolsTypicallyRequired && plan.toolsTypicallyRequired.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-md mt-3 mb-1">Tools Typically Required:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {plan.toolsTypicallyRequired.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={renderFormattedText(item)} />
                      ))}
                    </ul>
                  </div>
                )}
                
                {plan.safetyPrecautions && plan.safetyPrecautions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-md mt-3 mb-1 flex items-center text-destructive">
                      <ShieldAlert className="mr-2 h-5 w-5" />Safety Precautions:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-destructive/90">
                      {plan.safetyPrecautions.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={renderFormattedText(item)} />
                      ))}
                    </ul>
                  </div>
                )}

                {plan.additionalAdvice && (
                  <div>
                    <h3 className="font-semibold text-md mt-3 mb-1">Additional Advice:</h3>
                    <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={renderFormattedText(plan.additionalAdvice)} />
                  </div>
                )}
              </CardContent>
            </Card>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
