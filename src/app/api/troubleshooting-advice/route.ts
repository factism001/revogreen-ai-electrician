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
        troubleshootingSteps: rateLimitResult.message,
        safetyPrecautions: "Always prioritize safety when dealing with electrical issues."
      }, { status: 429 });
    }

    const body = await request.json();
    const { problemDescription } = body;

    if (!problemDescription || typeof problemDescription !== 'string') {
      return NextResponse.json({ 
        troubleshootingSteps: 'Please describe your electrical problem.',
        safetyPrecautions: 'Always prioritize safety when dealing with electrical issues.'
      }, { status: 400 });
    }

    // Check if API key is available
    if (!process.env.GOOGLE_GENAI_API_KEY) {
      return NextResponse.json({
        troubleshootingSteps: "AI troubleshooting service is currently unavailable. Contact Revogreen Energy Hub at 07067844630 for expert troubleshooting assistance.",
        safetyPrecautions: "Always turn OFF main power before working on electrical systems. If unsure, contact a qualified electrician immediately."
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });

      const prompt = `You are an expert electrician in Nigeria helping with troubleshooting. 

Problem: ${problemDescription}

Provide:
1. Step-by-step troubleshooting instructions considering Nigerian electrical conditions (voltage fluctuations, power outages)
2. Important safety precautions

Format your response as JSON with "troubleshootingSteps" and "safetyPrecautions" fields.
Mention Revogreen Energy Hub (07067844630) for parts or professional help when appropriate.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse as JSON, fallback to plain text
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({
          troubleshootingSteps: text,
          safetyPrecautions: "Always ensure power is OFF before working. Contact Revogreen Energy Hub at 07067844630 for professional assistance if needed."
        });
      }

    } catch (aiError) {
      console.error('AI Error:', aiError);
      return NextResponse.json({
        troubleshootingSteps: "I'm experiencing technical issues. For immediate troubleshooting help, contact Revogreen Energy Hub at 07067844630.",
        safetyPrecautions: "Always prioritize electrical safety. Turn off power before any work."
      });
    }

  } catch (error) {
    console.error('General Error:', error);
    return NextResponse.json({ 
      troubleshootingSteps: "Service unavailable. Contact Revogreen Energy Hub at 07067844630 for troubleshooting assistance.",
      safetyPrecautions: 'Always ensure standard safety precautions when dealing with electricity.'
    }, { status: 500 });
  }
}