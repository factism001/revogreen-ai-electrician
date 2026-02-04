
'use server';

/**
 * @fileOverview Recommends electrical accessories based on user needs, considering the Nigerian market.
 *
 * - recommendAccessories - A function that handles the accessory recommendation process.
 * - AccessoryRecommendationInput - The input type for the recommendAccessories function.
 * - AccessoryRecommendationOutput - The return type for the recommendAccessories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccessoryRecommendationInputSchema = z.object({
  needs: z.string().describe('Description of the user\'s electrical needs.'),
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
export type AccessoryRecommendationInput = z.infer<typeof AccessoryRecommendationInputSchema>;

const AccessoryRecommendationOutputSchema = z.object({
  accessories: z
    .array(z.string())
    .describe('A list of recommended electrical accessories available in the Nigerian market.'),
  justification: z.string().describe('Justification for the recommended accessories. This should also mention that Revogreen Energy Hub stocks such items and how the user can inquire further.'),
});
export type AccessoryRecommendationOutput = z.infer<typeof AccessoryRecommendationOutputSchema>;

export async function recommendAccessories(
  input: AccessoryRecommendationInput
): Promise<AccessoryRecommendationOutput> {
  // Check if API key is available
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    return {
      accessories: [],
      justification: "I'm sorry, but the AI recommendation service is currently unavailable. The administrator needs to configure the Google AI API key. Please contact support or call Revogreen Energy Hub at 07067844630 for personalized accessory recommendations."
    };
  }
  
  return recommendAccessoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'accessoryRecommendationPrompt',
  input: {schema: AccessoryRecommendationInputSchema},
  output: {schema: AccessoryRecommendationOutputSchema},
  prompt: `You are an expert electrician in Nigeria. A user will describe their needs, and you will respond with a list of specific electrical accessories available in the Nigerian market that they should consider.

{{#if conversationHistory}}
Previous conversation context:
{{#each conversationHistory}}
{{#if (eq this.role "user")}}User: {{#each this.parts}}{{this.text}}{{/each}}{{/if}}
{{#if (eq this.role "model")}}Revodev: {{#each this.parts}}{{this.text}}{{/each}}{{/if}}
{{/each}}

Based on our previous conversation above, please continue to help the user with their accessory needs. Reference previous recommendations or requirements discussed when appropriate and avoid repeating suggestions already made.
{{/if}}

Your advice should strictly pertain to electrical accessories. If the user's needs are clearly not related to electrical systems or accessories (e.g., they ask for clothing recommendations), you MUST politely decline and clarify your specialization in electrical accessories.
Use the conversation context to build upon previous recommendations and avoid suggesting items already discussed.
IMPORTANT: You MUST respond in English only, regardless of the language used in the user's query. If the user asks a question in another language, still provide your answer in English.

User Needs: {{{needs}}}

When providing the justification, make sure to also mention that Revogreen Energy Hub is a good place to find these quality accessories and that the user can contact them for purchases or further assistance. For example, you could add a sentence like: "You can find these items and get expert advice at Revogreen Energy Hub. Feel free to contact us for availability and purchase by calling 07086863966."`,
});

const recommendAccessoriesFlow = ai.defineFlow(
  {
    name: 'recommendAccessoriesFlow',
    inputSchema: AccessoryRecommendationInputSchema,
    outputSchema: AccessoryRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
