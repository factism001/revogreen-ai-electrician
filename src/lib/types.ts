// Simple type definitions for the UI components
export interface ElectricalAdviceInput {
  question: string;
  imageDataUri?: string;
  conversationHistory?: any[];
}

export interface ElectricalAdviceOutput {
  answer: string;
}

export interface TroubleshootingAdviceInput {
  problemDescription: string;
  conversationHistory?: any[];
}

export interface TroubleshootingAdviceOutput {
  troubleshootingSteps: string;
  safetyPrecautions: string;
}

export interface AccessoryRecommendationInput {
  needs: string;
  conversationHistory?: any[];
}

export interface AccessoryRecommendationOutput {
  accessories: string[];
  justification: string;
}

export interface EnergySavingEstimateInput {
  [key: string]: any;
}

export interface EnergySavingEstimateOutput {
  estimatedSavings: string;
}

export interface ProjectPlannerInput {
  description: string;
  conversationHistory?: any[];
}

export interface ProjectPlannerOutput {
  plan: string;
  safetyConsiderations: string;
}