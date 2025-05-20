// troubleshooting-advice.ts
'use server';

/**
 * @fileOverview A troubleshooting advice AI agent.
 *
 * - getTroubleshootingAdvice - A function that provides troubleshooting steps for electrical problems.
 * - TroubleshootingAdviceInput - The input type for the getTroubleshootingAdvice function.
 * - TroubleshootingAdviceOutput - The return type for the getTroubleshootingAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TroubleshootingAdviceInputSchema = z.object({
  problemDescription: z
    .string()
    .describe('A detailed description of the electrical problem being experienced.'),
});
export type TroubleshootingAdviceInput = z.infer<typeof TroubleshootingAdviceInputSchema>;

const TroubleshootingAdviceOutputSchema = z.object({
  troubleshootingSteps: z
    .string()
    .describe('A list of troubleshooting steps to resolve the electrical problem, taking into account common issues in Nigeria.'),
  safetyPrecautions: z
    .string()
    .describe('Important safety precautions to take before, during, and after attempting the troubleshooting steps.'),
});
export type TroubleshootingAdviceOutput = z.infer<typeof TroubleshootingAdviceOutputSchema>;

export async function getTroubleshootingAdvice(
  input: TroubleshootingAdviceInput
): Promise<TroubleshootingAdviceOutput> {
  return troubleshootingAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'troubleshootingAdvicePrompt',
  input: {schema: TroubleshootingAdviceInputSchema},
  output: {schema: TroubleshootingAdviceOutputSchema},
  prompt: `You are an expert electrician familiar with common electrical issues in Nigeria.

  A user has described the following electrical problem:
  {{{problemDescription}}}

  Provide a list of troubleshooting steps to resolve the problem, taking into account common issues in Nigeria such as voltage fluctuations, power outages, and the availability of specific tools and parts.
  Also, provide important safety precautions to take before, during, and after attempting the troubleshooting steps. Consider common safety oversights of users.
  `,
});

const troubleshootingAdviceFlow = ai.defineFlow(
  {
    name: 'troubleshootingAdviceFlow',
    inputSchema: TroubleshootingAdviceInputSchema,
    outputSchema: TroubleshootingAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
