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
        accessories: [],
        justification: rateLimitResult.message
      }, { status: 429 });
    }

    const body = await request.json();
    const { needs } = body;

    if (!needs || typeof needs !== 'string') {
      return NextResponse.json({ 
        accessories: [],
        justification: 'Please describe your electrical accessory needs.'
      }, { status: 400 });
    }

    // Check if API key is available
    if (!process.env.GOOGLE_GENAI_API_KEY) {
      return NextResponse.json({
        accessories: [
          "SON-certified switches and sockets",
          "Quality copper wires",
          "Energy-saving LED bulbs",
          "Distribution boards and breakers"
        ],
        justification: "AI recommendation service is currently unavailable. For personalized recommendations, contact Revogreen Energy Hub at 07067844630. We stock complete range of SON-certified electrical accessories."
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an electrical expert recommending accessories for Nigerian market.

User needs: ${needs}

Recommend specific electrical accessories available in Nigeria, considering SON certification and local availability.

Format as JSON with:
- "accessories": array of specific product names
- "justification": explanation mentioning Revogreen Energy Hub (07067844630) for purchase

Focus on practical, available products.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse as JSON, fallback to structured response
      try {
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({
          accessories: [
            "SON-certified switches and sockets",
            "Quality copper wires (appropriate gauge)",
            "Energy-saving LED bulbs",
            "Distribution boards and breakers"
          ],
          justification: `${text} Contact Revogreen Energy Hub at 07067844630 for these quality accessories in Ibadan and nationwide shipping.`
        });
      }

    } catch (aiError) {
      console.error('AI Error:', aiError);
      return NextResponse.json({
        accessories: [
          "SON-certified electrical accessories",
          "Quality wiring materials",
          "Energy-efficient components"
        ],
        justification: "I'm experiencing technical issues. Contact Revogreen Energy Hub at 07067844630 for expert accessory recommendations and quality supplies."
      });
    }

  } catch (error) {
    console.error('General Error:', error);
    return NextResponse.json({ 
      accessories: [],
      justification: "Service unavailable. Contact Revogreen Energy Hub at 07067844630 for expert accessory recommendations."
    }, { status: 500 });
  }
}