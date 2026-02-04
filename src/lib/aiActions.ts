// Simplified AI actions without Genkit dependencies
'use server';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://helpful-panda-b18eac.netlify.app'
  : 'http://localhost:3000';

export async function fetchElectricalAdvice(input: {
  question: string;
  imageDataUri?: string;
  conversationHistory?: any[];
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/electrical-advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting electrical advice:', error);
    return {
      answer: "Service temporarily unavailable. Please contact Revogreen Energy Hub at 07067844630 for immediate electrical assistance."
    };
  }
}

export async function fetchTroubleshootingAdvice(input: {
  problemDescription: string;
  conversationHistory?: any[];
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/troubleshooting-advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting troubleshooting advice:', error);
    return {
      troubleshootingSteps: "Service temporarily unavailable. Contact Revogreen Energy Hub at 07067844630 for troubleshooting assistance.",
      safetyPrecautions: "Always prioritize safety when dealing with electrical issues."
    };
  }
}

export async function fetchAccessoryRecommendation(input: {
  needs: string;
  conversationHistory?: any[];
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/accessory-recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting accessory recommendations:', error);
    return {
      accessories: [],
      justification: "Service temporarily unavailable. Contact Revogreen Energy Hub at 07067844630 for accessory recommendations."
    };
  }
}

export async function fetchEnergySavingEstimate(input: any) {
  // Simple fallback for energy estimation
  return {
    estimatedSavings: "Service temporarily unavailable. Contact Revogreen Energy Hub at 07067844630 for energy efficiency consultation and quality electrical accessories."
  };
}

export async function fetchProjectPlan(input: any) {
  // Simple fallback for project planning
  return {
    plan: "Our project planning AI is being configured. For professional electrical project planning and consultation, please contact Revogreen Energy Hub at 07067844630. Our experienced team can help plan your electrical project safely and efficiently.",
    safetyConsiderations: "Always consult with qualified electricians for any electrical project. Safety first!"
  };
}