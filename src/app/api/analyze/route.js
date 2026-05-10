import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini — Securely using Environment Variables
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!genAI) {
      return NextResponse.json({ success: false, error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
    }

    if (!body.image) {
      return NextResponse.json({ success: false, error: 'Missing "image" field.' }, { status: 400 });
    }

    const base64Data = body.image.includes(',') ? body.image.split(',')[1] : body.image;
    const mimeMatch = body.image.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      ]
    });

    const prompt = `
      You are a Senior Agronomist and expert Plant Pathologist.
      Provide an elite-level botanical diagnostic report.
      
      STEP 1: Verify if the image is an agricultural subject (crops, leaves, fruits, vegetables, farms).
      If not agricultural (e.g. people, cars, pets), return {"isNotPlant": true}.
      
      STEP 2: Identify the species and pathogen with extreme technical precision.
      Return JSON:
      {
        "isNotPlant": false,
        "crop": "Exact Species & Variety",
        "disease": "Specific Pathogen/Condition",
        "scientificName": "Latin Classification",
        "pathogenType": "Biological Category",
        "isHealthy": boolean,
        "isRuined": boolean,
        "confidence": number,
        "severity": "Low/Medium/High/Critical",
        "advice": "Elite treatment protocol including active chemical/biological agents",
        "shouldSpray": boolean
      }
    `;

    const imageParts = [{ inlineData: { data: base64Data, mimeType } }];
    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();

    let aiData;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      aiData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
      console.error("Parse error", e);
    }

    if (!aiData) {
      aiData = {
        isNotPlant: responseText.toLowerCase().includes('not a plant'),
        crop: "Plant",
        disease: "Unknown",
        isHealthy: false,
        confidence: 0.5,
        severity: "Medium",
        advice: responseText,
        shouldSpray: false
      };
    }

    const formattedResult = {
      isNotPlant: !!aiData.isNotPlant,
      isRuined: !!aiData.isRuined,
      topPrediction: {
        label: aiData.disease || 'Unknown',
        scientificName: aiData.scientificName || 'N/A',
        pathogenType: aiData.pathogenType || 'Unknown',
        confidence: aiData.confidence || 0.8,
        isHealthy: !!aiData.isHealthy,
        isRuined: !!aiData.isRuined,
        diseaseInfo: {
          crop: aiData.crop || 'Plant',
          disease: aiData.disease || 'Unknown',
          scientificName: aiData.scientificName || 'N/A',
          severity: aiData.severity || 'Medium',
          advice: aiData.advice || 'Standard monitoring protocol.'
        }
      },
      shouldSpray: !!aiData.shouldSpray,
      confidence: aiData.confidence || 0.8,
      isHealthy: !!aiData.isHealthy,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({ success: true, result: formattedResult });

  } catch (err) {
    console.error("Gemini API Error:", err);
    return NextResponse.json({ success: false, error: 'AI Engine Fault: ' + err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', engine: 'Gemini 1.5 Flash' });
}
