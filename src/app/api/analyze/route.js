import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini — Securely using Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.image) {
      return NextResponse.json({ success: false, error: 'Missing "image" field. Send a base64-encoded image.' }, { status: 400 });
    }

    // Extract base64 part
    const base64Data = body.image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert plant pathologist AI for the CropGuard platform.
      Analyze the provided image of a crop or plant.
      Determine if the plant is healthy or diseased.
      Return a STRICT JSON object with the following structure, and NO markdown formatting or extra text:
      {
        "crop": "Name of the crop/plant (or Unknown)",
        "isHealthy": boolean,
        "disease": "Name of the disease or issue (or 'None' if healthy)",
        "confidence": number between 0 and 1 representing your certainty,
        "severity": "Low", "Medium", or "High" (or "None"),
        "advice": "Detailed reasoning and specific treatment advice. Be explicit about whether pesticide/fungicide is needed.",
        "shouldSpray": boolean
      }
    `;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Robust JSON extraction
    let aiData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      aiData = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Parsing failed, trying fallback:", responseText);
      const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      aiData = JSON.parse(cleanJsonStr);
    }

    // Format to match the frontend expected structure
    const formattedResult = {
      topPrediction: {
        className: aiData.disease,
        label: aiData.disease,
        confidence: aiData.confidence,
        isHealthy: aiData.isHealthy,
        diseaseInfo: {
          crop: aiData.crop,
          disease: aiData.disease,
          severity: aiData.severity,
          advice: aiData.advice
        }
      },
      light: aiData.isHealthy ? 'green' : (aiData.shouldSpray ? 'red' : 'amber'),
      shouldSpray: aiData.shouldSpray,
      confidence: aiData.confidence,
      isHealthy: aiData.isHealthy,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      result: formattedResult
    });

  } catch (err) {
    console.error("Gemini API Error:", err);
    return NextResponse.json(
      { success: false, error: 'AI Analysis failed: ' + err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', engine: 'Gemini 1.5 Flash' });
}
