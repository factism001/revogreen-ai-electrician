import { NextRequest, NextResponse } from 'next/server';
import { getTroubleshootingAdvice, type TroubleshootingAdviceInput } from '@/ai/flows/troubleshooting-advice';
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
        troubleshootingSteps: rateLimitResult.message,
        safetyPrecautions: 'Please adhere to safety guidelines.' 
      }, { status: 429 });
    }

    const body = await request.json();
    const { problemDescription, conversationHistory } = body as TroubleshootingAdviceInput;

    if (!problemDescription || typeof problemDescription !== 'string') {
      return NextResponse.json({ 
        troubleshootingSteps: 'Please describe your electrical problem.',
        safetyPrecautions: 'Always prioritize safety when dealing with electrical issues.'
      }, { status: 400 });
    }

    const processedHistory = conversationHistory ? getRecentHistory(conversationHistory, 8) : undefined;

    const input: TroubleshootingAdviceInput = {
      problemDescription,
      conversationHistory: processedHistory
    };

    const result = await getTroubleshootingAdvice(input);
    return NextResponse.json(result);

  } catch (error) {
    const errorMessage = handleError(error, 'troubleshooting advice');
    return NextResponse.json({ 
      troubleshootingSteps: errorMessage,
      safetyPrecautions: 'Please ensure standard safety precautions are always followed.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Troubleshooting Advice API is running. Use POST to submit problems.' 
  });
}