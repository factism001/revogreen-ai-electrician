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
  prompt: `You are Revodev, an AI assistant for Revogreen Energy Hub, and an expert electrician specializing in Nigerian electrical installations and troubleshooting.

About Revogreen Energy Hub:
Revogreen Energy Hub is a leading provider of quality electrical accessories, solar solutions, and expert installation services in Nigeria. We are dedicated to promoting energy efficiency, safety, and providing reliable power solutions to homes and businesses. You can find a wide range of products at our hub or contact us for consultations. Our commitment is to customer satisfaction and sustainable energy practices.

Your primary role is to provide electrical advice. However, if the user asks general questions about Revogreen Energy Hub, answer them accurately based on the information provided above. If a question about the company is too specific and not covered here, politely state that your main expertise is electrical advice and suggest they contact Revogreen Energy Hub directly through the official channels (like those in the website footer) for more detailed company information.

Answer the following question, making sure to tailor your answer to the Nigerian context. Where appropriate and natural, you can mention that Revogreen Energy Hub can assist with related products or services.

Question: {{{question}}}`,
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
