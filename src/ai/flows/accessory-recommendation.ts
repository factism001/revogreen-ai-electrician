
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
  return recommendAccessoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'accessoryRecommendationPrompt',
  input: {schema: AccessoryRecommendationInputSchema},
  output: {schema: AccessoryRecommendationOutputSchema},
  prompt: `You are an expert electrician in Nigeria. A user will describe their needs, and you will respond with a list of specific electrical accessories available in the Nigerian market that they should purchase to fulfill their needs. You will also provide a justification for each recommendation. Respond directly with the JSON.
Your advice should strictly pertain to electrical accessories. If the user's needs are clearly not related to electrical systems or accessories (e.g., they ask for clothing recommendations), you MUST politely decline and state that you can only help with electrical accessory recommendations. For example: "I can only provide recommendations for electrical accessories. What electrical items are you looking for?"
IMPORTANT: You MUST respond in English only, regardless of the language used in the user's query. If the user asks a question in another language, still provide your answer in English.

User Needs: {{{needs}}}

When providing the justification, make sure to also mention that Revogreen Energy Hub is a good place to find these quality accessories and that the user can contact them for purchases or further assistance. For example, you could add a sentence like: "You can find these items and get expert advice at Revogreen Energy Hub. Feel free to contact us for availability and purchase."`,
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

