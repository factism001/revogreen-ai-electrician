import { NextRequest, NextResponse } from 'next/server';
import { recommendAccessories, type AccessoryRecommendationInput } from '@/ai/flows/accessory-recommendation';
import { checkInMemoryRateLimit } from '@/lib/inMemoryRateLimiter';
import { getRecentHistory } from '@/lib/conversationHistory';

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
  if (process.env.NODE_ENV === 'development') {
    return '127.0.0.1';
  }
  return FALLBACK_IP_ADDRESS;
}

function handleError(error: any, context: string): string {
  console.error(`Error in ${context}:`, error);
  return `Sorry, we encountered an issue while trying to get ${context}. Please try again. If the problem persists, you can try refreshing the page or contact support.`;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitResult = checkInMemoryRateLimit(clientIp);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ 
        accessories: [],
        justification: rateLimitResult.message
      }, { status: 429 });
    }

    const body = await request.json();
    const { needs, conversationHistory } = body as AccessoryRecommendationInput;

    if (!needs || typeof needs !== 'string') {
      return NextResponse.json({ 
        accessories: [],
        justification: 'Please describe your electrical accessory needs.'
      }, { status: 400 });
    }

    const processedHistory = conversationHistory ? getRecentHistory(conversationHistory, 8) : undefined;

    const input: AccessoryRecommendationInput = {
      needs,
      conversationHistory: processedHistory
    };

    const result = await recommendAccessories(input);
    return NextResponse.json(result);

  } catch (error) {
    const errorMessage = handleError(error, 'accessory recommendation');
    return NextResponse.json({ 
      accessories: [],
      justification: errorMessage
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Accessory Recommendation API is running. Use POST to submit needs.' 
  });
}