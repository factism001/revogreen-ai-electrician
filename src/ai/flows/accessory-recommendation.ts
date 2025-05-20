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
  justification: z.string().describe('Justification for the recommended accessories.'),
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

User Needs: {{{needs}}}`,
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
