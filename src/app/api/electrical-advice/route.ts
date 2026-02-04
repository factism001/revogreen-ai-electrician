import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ 
        answer: 'Please provide a valid question.' 
      }, { status: 400 });
    }

    // Simple fallback response
    return NextResponse.json({
      answer: "Thank you for your electrical question! Our AI assistant is currently being configured. For immediate expert electrical advice and quality accessories, please contact Revogreen Energy Hub directly at 07067844630. We're your trusted electrical supply partner in Ibadan, serving all of Nigeria with SON-certified products and professional guidance!"
    });

  } catch (error) {
    return NextResponse.json({ 
      answer: "Service temporarily unavailable. Please contact Revogreen Energy Hub at 07067844630 for immediate assistance with electrical supplies and advice." 
    }, { status: 500 });
  }
}