
'use server';
/**
 * @fileOverview An AI agent that estimates energy savings based on household appliances.
 *
 * - getEnergySavingEstimate - A function that provides energy saving advice.
 * - EnergySavingInput - The input type for the getEnergySavingEstimate function.
 * - EnergySavingOutput - The return type for the getEnergySavingEstimate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnergySavingInputSchema = z.object({
  appliancesDescription: z.string().describe('A description of household appliances and their usage (e.g., "2 fans 10hrs/day, 1 TV 5hrs/day, 5 old bulbs 6hrs/day, 1 small fridge 24hrs/day").'),
});
export type EnergySavingInput = z.infer<typeof EnergySavingInputSchema>;

const SavingSuggestionSchema = z.object({
  applianceMatch: z.string().describe('The appliance or group of appliances identified from the user input that this suggestion pertains to.'),
  suggestion: z.string().describe('The energy-saving suggestion (e.g., "Switch to LED bulbs").'),
  details: z.string().describe('Details about the potential savings or benefits, mentioning Revogreen products where appropriate in the Nigerian context.'),
});

const EnergySavingOutputSchema = z.object({
  overallAssessment: z.string().describe('A brief overall assessment of potential energy usage based on the described appliances (e.g., "Your appliance list suggests moderate energy consumption.").'),
  suggestions: z.array(SavingSuggestionSchema).describe('A list of personalized energy-saving suggestions.'),
  generalTips: z.array(z.string()).describe('General energy-saving tips relevant to Nigerian households. Include a tip about contacting Revogreen Energy Hub for consultations or product purchases.'),
});
export type EnergySavingOutput = z.infer<typeof EnergySavingOutputSchema>;

export async function getEnergySavingEstimate(input: EnergySavingInput): Promise<EnergySavingOutput> {
  return energySavingEstimateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'energySavingEstimatePrompt',
  input: {schema: EnergySavingInputSchema},
  output: {schema: EnergySavingOutputSchema},
  prompt: `You are Revodev, an AI assistant for Revogreen Energy Hub, specializing in electrical advice for the Nigerian market.
Your goal is to help users estimate potential energy savings by analyzing their household appliances.
Your analysis and suggestions must focus on energy savings related to electrical appliances and usage. If the user's description is unrelated to household appliances or energy use (e.g., asks about saving money on groceries), you MUST politely decline and state your purpose. For example: "I can help estimate energy savings for household appliances. Please tell me about the appliances you use."
IMPORTANT: You MUST respond in English only, regardless of the language used in the user's query. If the user asks a question in another language, still provide your answer in English.

About Revogreen Energy Hub:
Revogreen Energy Hub is a professional retail and service business focused on providing reliable and affordable household electrical accessories to homes, contractors, and small businesses across Nigeria. Our mission is to make access to genuine electrical products easy, while promoting safe, energy-efficient installations tailored to the Nigerian environment. We specialize in the sales of quality electrical accessories such as switches, sockets, lampholders, copper wires, PVC pipes, energy-saving bulbs, ceramic fuses, distribution boards, and more. We also offer basic electrical consultation to help customers choose the right products for their needs. Revogreen Energy Hub stands out for its commitment to SON-certified and trusted products, energy efficiency, and affordability. Visit our showroom at Akobo, Ibadan or call us on 07067844630.

User's Appliance Description:
"{{{appliancesDescription}}}"

Instructions:
1.  Provide an 'overallAssessment' of the user's likely energy consumption (e.g., low, moderate, high) based on their appliance list.
2.  Generate specific 'suggestions'. For each suggestion:
    *   Identify the 'applianceMatch' from the user's input.
    *   Provide a concise 'suggestion' for saving energy (e.g., "Switch 60W incandescent bulbs to 9W LED bulbs").
    *   Offer 'details' explaining the benefit, mentioning that Revogreen Energy Hub stocks relevant quality products (like SON-certified LED bulbs or energy-efficient fans).
3.  Provide a list of 'generalTips' for energy saving in Nigerian households. One of these tips should encourage the user to contact Revogreen Energy Hub for energy-saving products or further consultation.

Example common appliance wattages in Nigeria for your reference (use these as a general guide, the user might have different types):
*   Incandescent bulb: 60-100W
*   LED bulb: 5-15W
*   Fan (ceiling/standing): 50-80W
*   Refrigerator (medium): 100-200W (runs intermittently, but averages out)
*   TV (LED/LCD 32-42 inch): 50-100W
*   Air Conditioner (1hp): ~750-1000W
*   Electric Iron: 1000-1500W
*   Water Pump (0.5-1hp): 370-750W

Focus on actionable advice and clearly link suggestions to Revogreen's offerings where appropriate. Respond directly with the JSON.
Keep your language simple, friendly, and helpful.
`,
});

const energySavingEstimateFlow = ai.defineFlow(
  {
    name: 'energySavingEstimateFlow',
    inputSchema: EnergySavingInputSchema,
    outputSchema: EnergySavingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

