
'use client';

import { useState, type FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Lightbulb, AlertTriangle } from 'lucide-react';
import type { EnergySavingEstimateOutput } from '@/lib/types';
import { fetchEnergySavingEstimate } from '@/lib/aiActions';

export default function EnergyEstimator() {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [estimate, setEstimate] = useState<EnergySavingOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Please describe your appliances.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setEstimate(null);

    try {
      const result = await fetchEnergySavingEstimate({ appliancesDescription: description });
      setEstimate(result);
    } catch (err) {
      console.error("Error fetching energy estimate:", err);
      setError("Sorry, something went wrong while generating your estimate. Please try again.");
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
          <Lightbulb className="mr-3 h-6 w-6 sm:h-7 sm:w-7 text-primary" />
          Energy Savings Estimator
        </CardTitle>
        <CardDescription>
          Describe your common household appliances and their typical daily usage (e.g., "2 fans 10hrs/day, 1 TV 5hrs/day, 5 old bulbs 6hrs/day, 1 small fridge always on"). Revodev will give you some savings tips!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Enter your appliance description here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="bg-background focus-visible:ring-primary"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !description.trim()} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lightbulb className="mr-2 h-5 w-5" />}
            Get Estimate
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

        {estimate && (
          <ScrollArea className="mt-6 h-[400px] p-1">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg">Your Energy Savings Estimate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-md mb-1">Overall Assessment:</h3>
                  <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={renderFormattedText(estimate.overallAssessment)} />
                </div>

                {estimate.suggestions && estimate.suggestions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-md mb-2">Specific Suggestions:</h3>
                    <div className="space-y-3">
                      {estimate.suggestions.map((suggestion, index) => (
                        <Card key={index} className="bg-card p-3">
                          <p className="text-sm font-medium text-primary" dangerouslySetInnerHTML={renderFormattedText(suggestion.applianceMatch)} />
                          <p className="text-sm mt-1" dangerouslySetInnerHTML={renderFormattedText(suggestion.suggestion)} />
                          <p className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={renderFormattedText(suggestion.details)} />
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {estimate.generalTips && estimate.generalTips.length > 0 && (
                   <div>
                    <h3 className="font-semibold text-md mb-2">General Tips:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {estimate.generalTips.map((tip, index) => (
                        <li key={index} dangerouslySetInnerHTML={renderFormattedText(tip)} />
                      ))}
                    </ul>
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
