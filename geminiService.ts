
import { GoogleGenAI } from "@google/genai";

export const getAIInventoryAnalysis = async (data: any) => {
  if (!navigator.onLine) {
    return "AI insights are unavailable offline.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Analyze this inventory data for "Star Club" and provide a professional business summary.
      Focus on stock levels, shortages, and purchase patterns. 
      Limit to 3 concise bullet points.
      
      Data: ${JSON.stringify(data)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "Unable to load AI insights at this time.";
  }
};
