
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
  imageDataUri: z.string().optional().describe("An image related to the electrical question, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<data>'"),
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
export type ElectricalAdviceInput = z.infer<typeof ElectricalAdviceInputSchema>;

const ElectricalAdviceOutputSchema = z.object({
  answer: z.string().describe('The answer to the electrical question, tailored to the Nigerian context, considering any provided image and conversation history.'),
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

{{#if conversationHistory}}
Previous conversation context:
{{#each conversationHistory}}
{{#if this.isUser}}User: {{#each this.parts}}{{this.text}}{{/each}}{{/if}}
{{#if this.isModel}}Revodev: {{#each this.parts}}{{this.text}}{{/each}}{{/if}}
{{/each}}

Based on our previous conversation above, please continue to help the user with their current question. Reference previous topics or solutions discussed when appropriate and maintain consistency with previous advice given.
{{/if}}

About Revogreen Energy Hub:
Revogreen Energy Hub is a professional retail and service business focused on providing reliable and affordable household electrical accessories to homes, contractors, and small businesses across Nigeria.
We specialize in the sales of quality electrical accessories such as switches, sockets, lampholders, copper wires, PVC pipes, energy-saving bulbs, ceramic fuses, distribution boards, and more. We are committed to providing affordable and reliable products and services.
Revogreen Energy Hub stands out for its commitment to SON-certified and trusted products, energy efficiency, and affordability. We focus on promoting safe electrical installations, provide honest advice to customers, and maintain competitive pricing.
Engagement and Contact: You can find these items and get expert advice at Revogreen Energy Hub. Feel free to contact us for product availability, recommendations, and purchases by calling us on 07067844630.

Your primary role is to provide electrical advice, taking into account the conversation history if provided.
- If the user asks general questions about Revogreen Energy Hub, answer them accurately based on the information provided above.
- If a question about the company is too specific and not covered here, politely state that your main expertise is electrical advice and suggest they contact Revogreen Energy Hub directly.
- Crucially, your expertise is strictly limited to electrical topics relevant to Nigeria (advice, troubleshooting, accessories, energy savings, project planning) and information about Revogreen Energy Hub. If the user's question is completely outside these domains, you MUST politely decline and clarify your specialization.
- Use the conversation context to provide more relevant and personalized responses
- Reference previous topics or solutions discussed when appropriate
- Maintain consistency with previous advice given
- IMPORTANT: You MUST respond in English only, regardless of the language used in the user's query. If the user asks a question in another language, still provide your answer in English.

Answer the following question, making sure to tailor your answer to the Nigerian context and consider our conversation history. Where appropriate and natural, you can mention that Revogreen Energy Hub can assist with related products or services.
If an image is provided, analyze it carefully and use it as a key piece of information in your response.

Question: {{{question}}}
{{#if imageDataUri}}
User has provided this image for context:
{{media url=imageDataUri}}
{{/if}}`,
});

const electricalAdviceFlow = ai.defineFlow(
  {
    name: 'electricalAdviceFlow',
    inputSchema: ElectricalAdviceInputSchema,
    outputSchema: ElectricalAdviceOutputSchema,
  },
  async (input: ElectricalAdviceInput) => {
    let processedInput = {...input};
    if (processedInput.conversationHistory) {
      processedInput.conversationHistory = processedInput.conversationHistory.map(message => ({
        ...message,
        isUser: message.role === 'user',
        isModel: message.role === 'model',
      }));
    }
    const {output} = await prompt(processedInput);
    return output!;
  }
);
