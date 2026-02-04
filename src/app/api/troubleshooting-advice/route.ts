import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problemDescription } = body;

    if (!problemDescription || typeof problemDescription !== 'string') {
      return NextResponse.json({ 
        troubleshootingSteps: 'Please describe your electrical problem.',
        safetyPrecautions: 'Always prioritize safety when dealing with electrical issues.'
      }, { status: 400 });
    }

    return NextResponse.json({
      troubleshootingSteps: "Our AI troubleshooting assistant is being set up. For immediate electrical problem solving and expert guidance, please contact Revogreen Energy Hub at 07067844630. Our experienced team can help diagnose and solve your electrical issues safely.",
      safetyPrecautions: "IMPORTANT SAFETY: Always turn OFF main power before working on electrical systems. Never work on live wires. If unsure about any electrical work, contact a qualified electrician immediately. Revogreen Energy Hub: 07067844630"
    });

  } catch (error) {
    return NextResponse.json({ 
      troubleshootingSteps: "Service temporarily unavailable. Contact Revogreen Energy Hub at 07067844630 for electrical troubleshooting assistance.",
      safetyPrecautions: 'Please ensure standard safety precautions are always followed when dealing with electricity.'
    }, { status: 500 });
  }
}