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
      You are the CropGuard Expert Pathologist. 
      
      STRICT REQUIREMENT: YOUR FIRST TASK IS TO VERIFY IF THE IMAGE IS AN AGRICULTURAL SUBJECT.
      
      ACCEPTED SUBJECTS:
      - Plant leaves, stems, or roots
      - Vegetables (e.g. Tomato, Pepper, Potato)
      - Fruits (e.g. Apple, Grapes, Citrus)
      - Field Crops (e.g. Wheat, Rice, Corn)
      - Aerial or Wide-angle shots of "Huge Farms" / Fields
      
      IF THE IMAGE CONTAINS:
      - People, faces, or hands
      - Animals, pets
      - Vehicles, cars, bikes
      - Household electronics, furniture, computers
      
      YOU MUST RETURN: {"isNotPlant": true} and nothing else.
      
      IF (AND ONLY IF) IT IS A PLANT:
      Analyze for diseases and return:
      {
        "isNotPlant": false,
        "crop": "Species Name",
        "disease": "Common Disease Name",
        "scientificName": "Scientific Pathogen Name (e.g. Venturia inaequalis)",
        "pathogenType": "Fungal/Bacterial/Viral/Nutrient",
        "isHealthy": boolean,
        "confidence": number,
        "severity": "Low/Medium/High",
        "advice": "Treatment Protocol",
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
      topPrediction: {
        label: aiData.disease || 'Unknown',
        scientificName: aiData.scientificName || 'N/A',
        pathogenType: aiData.pathogenType || 'Unknown',
        confidence: aiData.confidence || 0.8,
        isHealthy: !!aiData.isHealthy,
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
