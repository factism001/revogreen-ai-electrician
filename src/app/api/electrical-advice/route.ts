import { NextRequest, NextResponse } from 'next/server';
import { getElectricalAdvice, type ElectricalAdviceInput } from '@/ai/flows/electrical-advice';
import { checkInMemoryRateLimit } from '@/lib/inMemoryRateLimiter';
import { convertMessagesToHistory, getRecentHistory } from '@/lib/conversationHistory';

function getClientIp(request: NextRequest): string | null {
  const FALLBACK_IP_ADDRESS = '0.0.0.0'
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  if (realIp) {
    return realIp.trim();
  }
  // For development environments
  if (process.env.NODE_ENV === 'development') {
    return '127.0.0.1';
  }
  return FALLBACK_IP_ADDRESS;
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
  });
  
  return `Sorry, we encountered an issue while trying to get ${context}. Please try again. If the problem persists, you can try refreshing the page or contact support.`;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitResult = checkInMemoryRateLimit(clientIp);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ answer: rateLimitResult.message }, { status: 429 });
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_GENAI_API_KEY) {
      return NextResponse.json({ 
        answer: "AI service is currently unavailable. Please contact support or try again later. (API key not configured)" 
      }, { status: 503 });
    }

    const body = await request.json();
    const { question, imageDataUri, conversationHistory } = body as ElectricalAdviceInput;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ answer: 'Please provide a valid question.' }, { status: 400 });
    }

    // Process conversation history if provided
    const processedHistory = conversationHistory ? getRecentHistory(conversationHistory, 8) : undefined;

    const input: ElectricalAdviceInput = {
      question,
      imageDataUri,
      conversationHistory: processedHistory
    };

    const result = await getElectricalAdvice(input);
    return NextResponse.json(result);

  } catch (error) {
    const errorMessage = handleError(error, 'electrical advice');
    return NextResponse.json({ answer: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Electrical Advice API is running. Use POST to submit questions.' 
  });
}