
'use server';

import { headers } from 'next/headers';
import { getElectricalAdvice, type ElectricalAdviceInput, type ElectricalAdviceOutput } from '@/ai/flows/electrical-advice';
import { getTroubleshootingAdvice, type TroubleshootingAdviceInput, type TroubleshootingAdviceOutput } from '@/ai/flows/troubleshooting-advice';
import { recommendAccessories, type AccessoryRecommendationInput, type AccessoryRecommendationOutput } from '@/ai/flows/accessory-recommendation';
import { getEnergySavingEstimate, type EnergySavingInput, type EnergySavingOutput } from '@/ai/flows/energy-savings-estimator';
import { getProjectPlan, type ProjectPlannerInput, type ProjectPlannerOutput } from '@/ai/flows/project-planner';
import { checkInMemoryRateLimit } from './inMemoryRateLimiter';

function getClientIp(): string | null {
  const FALLBACK_IP_ADDRESS = '0.0.0.0'
  const forwardedFor = headers().get('x-forwarded-for');
  const realIp = headers().get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  if (realIp) {
    return realIp.trim();
  }
  // For development environments where x-forwarded-for might not be set
  if (process.env.NODE_ENV === 'development') {
    // You might want to return a specific IP for testing or null
    return '127.0.0.1'; // Example for local development
  }
  return FALLBACK_IP_ADDRESS; // Fallback if no IP is found
}


function handleError(error: any, context: string): string {
  let detailedMessage = 'An unknown error occurred.';
  if (error instanceof Error) {
    detailedMessage = error.message;
  } else if (typeof error === 'string') {
    detailedMessage = error;
  } else if (error && typeof error.toString === 'function') {
    detailedMessage = error.toString();
  }

  console.error(`Error in ${context}:`, {
    message: detailedMessage,
    // Optionally log the full error object if it's not too verbose or sensitive
    // fullError: error, 
  });
  
  // User-friendly message
  return `Sorry, we encountered an issue while trying to get ${context}. Please try again. If the problem persists, you can try refreshing the page or contact support.`;
}

export async function fetchElectricalAdvice(input: ElectricalAdviceInput): Promise<ElectricalAdviceOutput> {
  const clientIp = getClientIp();
  const rateLimitResult = checkInMemoryRateLimit(clientIp);
  if (!rateLimitResult.allowed) {
    return { answer: rateLimitResult.message };
  }

  try {
    const result = await getElectricalAdvice(input);
    return result;
  } catch (error) {
    return { answer: handleError(error, 'electrical advice') };
  }
}

export async function fetchTroubleshootingAdvice(input: TroubleshootingAdviceInput): Promise<TroubleshootingAdviceOutput> {
  const clientIp = getClientIp();
  const rateLimitResult = checkInMemoryRateLimit(clientIp);
  if (!rateLimitResult.allowed) {
    return { 
      troubleshootingSteps: rateLimitResult.message,
      safetyPrecautions: 'Please adhere to safety guidelines.' 
    };
  }

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
  const clientIp = getClientIp();
  const rateLimitResult = checkInMemoryRateLimit(clientIp);
  if (!rateLimitResult.allowed) {
    return { 
      accessories: [],
      justification: rateLimitResult.message
    };
  }
  
  try {
    const result = await recommendAccessories(input);
    return result;
  } catch (error) {
    const errorMessage = handleError(error, 'accessory recommendation');
    return { 
      accessories: [], // Return empty array for accessories on error
      justification: errorMessage
    };
  }
}

export async function fetchEnergySavingEstimate(input: EnergySavingInput): Promise<EnergySavingOutput> {
  const clientIp = getClientIp();
  const rateLimitResult = checkInMemoryRateLimit(clientIp);
  if (!rateLimitResult.allowed) {
    return { 
      overallAssessment: rateLimitResult.message,
      suggestions: [],
      generalTips: []
    };
  }

  try {
    const result = await getEnergySavingEstimate(input);
    return result;
  } catch (error) {
    const errorMessage = handleError(error, 'energy saving estimate');
    return { 
      overallAssessment: errorMessage,
      suggestions: [],
      generalTips: [] // Return empty array for tips on error
    };
  }
}

export async function fetchProjectPlan(input: ProjectPlannerInput): Promise<ProjectPlannerOutput> {
  const clientIp = getClientIp();
  const rateLimitResult = checkInMemoryRateLimit(clientIp);
  if (!rateLimitResult.allowed) {
    return { 
      projectName: 'Rate Limit Exceeded',
      materialsNeeded: [],
      toolsTypicallyRequired: [],
      safetyPrecautions: [rateLimitResult.message],
      additionalAdvice: 'Please wait before making new requests.',
      isComplexProject: false 
    };
  }

  try {
    const result = await getProjectPlan(input);
    return result;
  } catch (error) {
    const errorMessage = handleError(error, 'project plan');
    return { 
      projectName: 'Error in Planning',
      materialsNeeded: [], // Return empty array for materials on error
      toolsTypicallyRequired: [],
      safetyPrecautions: ['Always prioritize safety. If unsure, consult a professional.'],
      additionalAdvice: errorMessage,
      isComplexProject: false 
    };
  }
}
