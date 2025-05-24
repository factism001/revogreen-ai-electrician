
'use server';

import { getElectricalAdvice, type ElectricalAdviceInput, type ElectricalAdviceOutput } from '@/ai/flows/electrical-advice';
import { getTroubleshootingAdvice, type TroubleshootingAdviceInput, type TroubleshootingAdviceOutput } from '@/ai/flows/troubleshooting-advice';
import { recommendAccessories, type AccessoryRecommendationInput, type AccessoryRecommendationOutput } from '@/ai/flows/accessory-recommendation';
import { getEnergySavingEstimate, type EnergySavingInput, type EnergySavingOutput } from '@/ai/flows/energy-savings-estimator';
import { getProjectPlan, type ProjectPlannerInput, type ProjectPlannerOutput } from '@/ai/flows/project-planner';

function handleError(error: any, context: string): string {
  let detailedMessage = 'An unknown error occurred.';
  if (error instanceof Error) {
    detailedMessage = error.message;
  } else if (typeof error === 'string') {
    detailedMessage = error;
  } else if (error && typeof error.toString === 'function') {
    detailedMessage = error.toString();
  }

  console.error(`Error fetching ${context}:`, {
    message: detailedMessage,
    fullError: error, // Log the full error object for server-side debugging
  });
  
  // Truncate message for client-side display to avoid overly long or complex errors in UI
  const clientMessageSnippet = detailedMessage.length > 70 ? detailedMessage.substring(0, 67) + '...' : detailedMessage;
  return `Sorry, an error occurred (${context}). Details: "${clientMessageSnippet}". Please check server logs or try again.`;
}

export async function fetchElectricalAdvice(input: ElectricalAdviceInput): Promise<ElectricalAdviceOutput> {
  try {
    const result = await getElectricalAdvice(input);
    return result;
  } catch (error) {
    return { answer: handleError(error, 'electrical advice') };
  }
}

export async function fetchTroubleshootingAdvice(input: TroubleshootingAdviceInput): Promise<TroubleshootingAdviceOutput> {
  try {
    const result = await getTroubleshootingAdvice(input);
    return result;
  } catch (error) {
    const errorMessage = handleError(error, 'troubleshooting advice');
    return { 
      troubleshootingSteps: errorMessage,
      safetyPrecautions: 'Please ensure standard safety precautions are always followed.'
    };
  }
}

export async function fetchAccessoryRecommendation(input: AccessoryRecommendationInput): Promise<AccessoryRecommendationOutput> {
  try {
    const result = await recommendAccessories(input);
    return result;
  } catch (error) {
    const errorMessage = handleError(error, 'accessory recommendation');
    return { 
      accessories: ['Could not fetch recommendations at this time.'],
      justification: errorMessage
    };
  }
}

export async function fetchEnergySavingEstimate(input: EnergySavingInput): Promise<EnergySavingOutput> {
  try {
    const result = await getEnergySavingEstimate(input);
    return result;
  } catch (error) {
    const errorMessage = handleError(error, 'energy saving estimate');
    return { 
      overallAssessment: errorMessage,
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
    const errorMessage = handleError(error, 'project plan');
    return { 
      projectName: 'Error in Planning',
      materialsNeeded: ['Could not generate material list due to an error.'],
      toolsTypicallyRequired: [errorMessage],
      safetyPrecautions: ['Always prioritize safety. If unsure, consult a professional.'],
      additionalAdvice: 'An error occurred while trying to generate the project plan.',
      isComplexProject: false 
    };
  }
}
