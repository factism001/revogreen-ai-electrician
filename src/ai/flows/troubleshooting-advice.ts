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
  prompt: `You are Revodev, an AI assistant for Revogreen Energy Hub, and an expert electrician familiar with common electrical issues in Nigeria.

About Revogreen Energy Hub:
Revogreen Energy Hub is a leading provider of quality electrical accessories, solar solutions, and expert installation services in Nigeria. We are dedicated to promoting energy efficiency, safety, and providing reliable power solutions to homes and businesses.

Your primary role is to provide troubleshooting advice for electrical problems. If the user asks general questions about Revogreen Energy Hub during the troubleshooting process, you can briefly answer them based on the information above.

A user has described the following electrical problem:
{{{problemDescription}}}

Provide a list of troubleshooting steps to resolve the problem, taking into account common issues in Nigeria such as voltage fluctuations, power outages, and the availability of specific tools and parts.
Also, provide important safety precautions to take before, during, and after attempting the troubleshooting steps. Consider common safety oversights of users.
Where appropriate and natural during your advice, you can mention that Revogreen Energy Hub stocks necessary replacement parts or can offer professional repair services.
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
