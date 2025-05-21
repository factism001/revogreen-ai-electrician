
'use server';

import { getElectricalAdvice, type ElectricalAdviceInput, type ElectricalAdviceOutput } from '@/ai/flows/electrical-advice';
import { getTroubleshootingAdvice, type TroubleshootingAdviceInput, type TroubleshootingAdviceOutput } from '@/ai/flows/troubleshooting-advice';
import { recommendAccessories, type AccessoryRecommendationInput, type AccessoryRecommendationOutput } from '@/ai/flows/accessory-recommendation';
import { getEnergySavingEstimate, type EnergySavingInput, type EnergySavingOutput } from '@/ai/flows/energy-savings-estimator';
import { getProjectPlan, type ProjectPlannerInput, type ProjectPlannerOutput } from '@/ai/flows/project-planner';

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

export async function fetchEnergySavingEstimate(input: EnergySavingInput): Promise<EnergySavingOutput> {
  try {
    const result = await getEnergySavingEstimate(input);
    return result;
  } catch (error) {
    console.error('Error fetching energy saving estimate:', error);
    // Fallback structure must match EnergySavingOutputSchema
    return { 
      overallAssessment: 'Sorry, I encountered an error trying to generate an estimate.',
      suggestions: [],
      generalTips: ['Please try again later. Always prioritize safety with electrical appliances.']
    };
  }
}

export async function fetchProjectPlan(input: ProjectPlannerInput): Promise<ProjectPlannerOutput> {
  try {
    const result = await getProjectPlan(input);
    return result;
  } catch (error) {
    console.error('Error fetching project plan:', error);
    // Fallback structure must match ProjectPlannerOutputSchema
    return { 
      projectName: 'Error in Planning',
      materialsNeeded: ['Could not generate material list due to an error.'],
      toolsTypicallyRequired: ['Please try again.'],
      safetyPrecautions: ['Always prioritize safety. If unsure, consult a professional.'],
      additionalAdvice: 'An error occurred while trying to generate the project plan.',
      isComplexProject: false 
    };
  }
}
