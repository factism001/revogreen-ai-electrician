import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ 
        answer: rateLimitResult.message 
      }, { status: 429 });
    }

    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ 
        answer: 'Please provide a valid question.' 
      }, { status: 400 });
    }

    // Check if API key is available
    if (!process.env.GOOGLE_GENAI_API_KEY) {
      return NextResponse.json({
        answer: "AI service is currently unavailable. Please contact Revogreen Energy Hub at 07067844630 for immediate electrical assistance."
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });

      const prompt = `You are Revodev, an AI assistant for Revogreen Energy Hub, and an expert electrician familiar with common electrical issues in Nigeria.

About Revogreen Energy Hub:
Revogreen Energy Hub is a professional retail and service business focused on providing reliable and affordable household electrical accessories to homes, contractors, and small businesses across Nigeria.
We specialize in the sales of quality electrical accessories such as switches, sockets, lampholders, copper wires, PVC pipes, energy-saving bulbs, ceramic fuses, distribution boards, and more.
Contact: 07067844630

User Question: ${question}

Provide helpful electrical advice while naturally mentioning Revogreen Energy Hub when appropriate. Keep responses concise and professional.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({
        answer: text
      });

    } catch (aiError) {
      console.error('AI Error:', aiError);
      return NextResponse.json({
        answer: "I'm experiencing some technical issues right now. For immediate electrical assistance, please contact Revogreen Energy Hub at 07067844630. Our expert team is ready to help!"
      });
    }

  } catch (error) {
    console.error('General Error:', error);
    return NextResponse.json({ 
      answer: "Service temporarily unavailable. Please contact Revogreen Energy Hub at 07067844630 for immediate electrical assistance." 
    }, { status: 500 });
  }
}