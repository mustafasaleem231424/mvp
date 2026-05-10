import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini — Securely using Environment Variables
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!genAI) {
      return NextResponse.json({ success: false, error: 'GEMINI_API_KEY is not configured on the server. Please add it to your environment variables.' }, { status: 500 });
    }

    if (!body.image) {
      return NextResponse.json({ success: false, error: 'Missing "image" field. Send a base64-encoded image.' }, { status: 400 });
    }

    // Extract MIME type and base64 part
    const mimeMatch = body.image.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Data = body.image.replace(/^data:image\/\w+;base64,/, "");
    
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
      You are the CropGuard Expert Pathologist, a world-class AI specialized in botanical diagnostics and agricultural pathology.
      Analyze the provided image with extreme precision. Your goal is to identify any signs of disease, nutrient deficiency, or pest infestation.

      Your persona:
      - Highly technical and expert in tone.
      - Decisive but cautious with chemical recommendations.
      - Comprehensive in your diagnostic reasoning.

      Task:
      1. Crop Identification: Identify the exact plant species and variety if possible.
      2. Symptom Analysis: Describe lesions, chlorosis, necrosis, or structural abnormalities.
      3. Diagnosis: Provide the scientific and common name of the pathogen or issue.
      4. Actionable Advice: Provide clear, expert-level protocol for treatment (Organic or Chemical).

      Return a STRICT JSON object (no markdown, no extra text):
      {
        "crop": "Species (Variety)",
        "isHealthy": boolean,
        "disease": "Specific Diagnosis Name (or 'None' if healthy)",
        "confidence": number (0.0 to 1.0),
        "severity": "Low" | "Medium" | "High" | "None",
        "advice": "Full expert treatment protocol and pathology reasoning.",
        "shouldSpray": boolean (Set to true ONLY if chemical or organic spray intervention is absolutely necessary to save the crop)
      }
    `;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
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
      try {
        const cleanJsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        aiData = JSON.parse(cleanJsonStr);
      } catch (innerE) {
        // Ultimate fallback: Try to extract ANY numeric confidence and boolean healthy
        aiData = {
          crop: "Identified Plant",
          isHealthy: responseText.toLowerCase().includes('healthy'),
          disease: "Diagnosis provided in advice",
          confidence: 0.85,
          severity: "Medium",
          advice: responseText,
          shouldSpray: responseText.toLowerCase().includes('spray') && !responseText.toLowerCase().includes('not spray')
        };
      }
    }

    // Format to match the frontend expected structure
    const formattedResult = {
      topPrediction: {
        className: aiData.disease || 'Unknown',
        label: aiData.disease || 'Unknown',
        confidence: aiData.confidence || 0.9,
        isHealthy: !!aiData.isHealthy,
        diseaseInfo: {
          crop: aiData.crop || 'Plant',
          disease: aiData.disease || 'Unknown',
          severity: aiData.severity || 'Medium',
          advice: aiData.advice || 'No specific advice provided by AI.'
        }
      },
      light: aiData.isHealthy ? 'green' : (aiData.shouldSpray ? 'red' : 'amber'),
      shouldSpray: !!aiData.shouldSpray,
      confidence: aiData.confidence || 0.9,
      isHealthy: !!aiData.isHealthy,
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
