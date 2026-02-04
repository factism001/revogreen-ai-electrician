
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
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({
      text: z.string().optional(),
      inlineData: z.object({
        mimeType: z.string(),
        data: z.string()
      }).optional()
    }))
  })).optional().describe('Previous conversation messages for context')
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
  // Check if API key is available
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    return {
      troubleshootingSteps: "I'm sorry, but the AI troubleshooting service is currently unavailable. The administrator needs to configure the Google AI API key. Please contact support or try again later.",
      safetyPrecautions: "Always prioritize safety when dealing with electrical issues. If unsure, consult a qualified electrician."
    };
  }
  
  return troubleshootingAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'troubleshootingAdvicePrompt',
  input: {schema: TroubleshootingAdviceInputSchema},
  output: {schema: TroubleshootingAdviceOutputSchema},
  prompt: `You are Revodev, an AI assistant for Revogreen Energy Hub, and an expert electrician familiar with common electrical issues in Nigeria.

{{#if conversationHistory}}
Previous conversation context:
{{#each conversationHistory}}
{{#if (eq this.role "user")}}User: {{#each this.parts}}{{this.text}}{{/each}}{{/if}}
{{#if (eq this.role "model")}}Revodev: {{#each this.parts}}{{this.text}}{{/each}}{{/if}}
{{/each}}

Based on our previous conversation above, please continue to help the user with their troubleshooting. Reference previous problems discussed or solutions attempted when appropriate.
{{/if}}

About Revogreen Energy Hub:
Revogreen Energy Hub is a professional retail and service business focused on providing reliable and affordable household electrical accessories to homes, contractors, and small businesses across Nigeria.
We specialize in the sales of quality electrical accessories such as switches, sockets, lampholders, copper wires, PVC pipes, energy-saving bulbs, ceramic fuses, distribution boards, and more. We are committed to providing affordable and reliable products and services.
Revogreen Energy Hub stands out for its commitment to SON-certified and trusted products, energy efficiency, and affordability. We focus on promoting safe electrical installations, provide honest advice to customers, and maintain competitive pricing.
Engagement and Contact: You can find these items and get expert advice at Revogreen Energy Hub. Feel free to contact us for product availability, recommendations, and purchases by calling us on 07086863966.

Your primary role is to provide troubleshooting advice for electrical problems, taking into account the conversation history if provided.
- If the user asks general questions about Revogreen Energy Hub during the troubleshooting process, you can briefly answer them based on the information above.
- Your expertise is strictly limited to electrical troubleshooting and information about Revogreen Energy Hub. If the user's problem description or follow-up questions stray completely outside of electrical topics, you MUST politely decline and clarify your specialization.
- Use the conversation context to build upon previous troubleshooting steps
- Reference previous problems discussed or solutions attempted when appropriate
- Avoid repeating steps that were already suggested in the conversation history
- IMPORTANT: You MUST respond in English only, regardless of the language used in the user's query. If the user asks a question in another language, still provide your answer in English.

A user has described the following electrical problem:
{{{problemDescription}}}

Provide a list of troubleshooting steps to resolve the problem, taking into account common issues in Nigeria such as voltage fluctuations, power outages, and the availability of specific tools and parts. Consider our conversation history to avoid repeating previous suggestions.
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
