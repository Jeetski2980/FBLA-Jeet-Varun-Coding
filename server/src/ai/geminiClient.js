import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export async function getRecommendations(bio, zip, businesses) {
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found. Using fallback recommendations.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const prompt = `
    You are a local recommendation assistant for "Local Pulse" app.
    User Bio: "${bio}"
    User ZIP Code: "${zip}"
    
    Eligible Businesses in this ZIP:
    ${JSON.stringify(businesses.map(b => ({
      id: b.id,
      name: b.name,
      category: b.category,
      description: b.description
    })))}

    Based on the user's bio and the list of businesses provided, recommend the top 5 businesses that best match their interests.
    Explain "why" each business is recommended in 1-2 short sentences using details from their bio.
    Also suggest 2-3 categories they might like.

    Return ONLY valid JSON. No markdown. No extra text.
    Schema:
    {
      "zip": "${zip}",
      "suggestedCategories": ["Category1", "Category2"],
      "recommendations": [
        {
          "businessId": "b1",
          "name": "Business Name",
          "category": "Category",
          "reason": "Reason why..."
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}
