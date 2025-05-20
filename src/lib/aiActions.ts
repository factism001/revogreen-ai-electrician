'use server';

import { getElectricalAdvice, type ElectricalAdviceInput, type ElectricalAdviceOutput } from '@/ai/flows/electrical-advice';
import { getTroubleshootingAdvice, type TroubleshootingAdviceInput, type TroubleshootingAdviceOutput } from '@/ai/flows/troubleshooting-advice';
import { recommendAccessories, type AccessoryRecommendationInput, type AccessoryRecommendationOutput } from '@/ai/flows/accessory-recommendation';

export async function fetchElectricalAdvice(input: ElectricalAdviceInput): Promise<ElectricalAdviceOutput> {
  try {
    const result = await getElectricalAdvice(input);
    return result;
  } catch (error) {
    console.error('Error fetching electrical advice:', error);
    return { answer: 'Sorry, I encountered an error trying to get advice. Please try again.' };
  }
}

export async function fetchTroubleshootingAdvice(input: TroubleshootingAdviceInput): Promise<TroubleshootingAdviceOutput> {
  try {
    const result = await getTroubleshootingAdvice(input);
    return result;
  } catch (error) {
    console.error('Error fetching troubleshooting advice:', error);
    return { 
      troubleshootingSteps: 'Sorry, I encountered an error trying to get troubleshooting steps. Please try again.',
      safetyPrecautions: 'Please ensure standard safety precautions are always followed.'
    };
  }
}

export async function fetchAccessoryRecommendation(input: AccessoryRecommendationInput): Promise<AccessoryRecommendationOutput> {
  try {
    const result = await recommendAccessories(input);
    return result;
  } catch (error) {
    console.error('Error fetching accessory recommendation:', error);
    return { 
      accessories: ['Could not fetch recommendations at this time.'],
      justification: 'An error occurred during the process.'
    };
  }
}
