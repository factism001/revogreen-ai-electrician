import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { needs } = body;

    if (!needs || typeof needs !== 'string') {
      return NextResponse.json({ 
        accessories: [],
        justification: 'Please describe your electrical accessory needs.'
      }, { status: 400 });
    }

    return NextResponse.json({
      accessories: [
        "SON-certified switches and sockets",
        "Quality copper wires (various gauges)",
        "Energy-saving LED bulbs",
        "Distribution boards and breakers",
        "Cable protection accessories"
      ],
      justification: "Our AI recommendation system is being configured. For personalized electrical accessory recommendations based on your specific needs, please contact Revogreen Energy Hub at 07067844630. We stock a complete range of SON-certified electrical accessories in Ibadan and ship nationwide. Our experts will help you choose the right products for your project!"
    });

  } catch (error) {
    return NextResponse.json({ 
      accessories: [],
      justification: "Service temporarily unavailable. Contact Revogreen Energy Hub at 07067844630 for expert accessory recommendations and quality electrical supplies."
    }, { status: 500 });
  }
}