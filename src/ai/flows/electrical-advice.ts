'use server';
/**
 * @fileOverview An AI agent that provides electrical advice specific to the Nigerian context.
 *
 * - getElectricalAdvice - A function that handles the electrical advice process.
 * - ElectricalAdviceInput - The input type for the getElectricalAdvice function.
 * - ElectricalAdviceOutput - The return type for the getElectricalAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ElectricalAdviceInputSchema = z.object({
  question: z.string().describe('The electrical question to be answered.'),
});
export type ElectricalAdviceInput = z.infer<typeof ElectricalAdviceInputSchema>;

const ElectricalAdviceOutputSchema = z.object({
  answer: z.string().describe('The answer to the electrical question, tailored to the Nigerian context.'),
});
export type ElectricalAdviceOutput = z.infer<typeof ElectricalAdviceOutputSchema>;

export async function getElectricalAdvice(input: ElectricalAdviceInput): Promise<ElectricalAdviceOutput> {
  return electricalAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'electricalAdvicePrompt',
  input: {schema: ElectricalAdviceInputSchema},
  output: {schema: ElectricalAdviceOutputSchema},
  prompt: `You are an expert electrician specializing in Nigerian electrical installations and troubleshooting.  Answer the following question, making sure to tailor your answer to the Nigerian context.\n\nQuestion: {{{question}}}`,
});

const electricalAdviceFlow = ai.defineFlow(
  {
    name: 'electricalAdviceFlow',
    inputSchema: ElectricalAdviceInputSchema,
    outputSchema: ElectricalAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
