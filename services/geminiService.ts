
import { GoogleGenAI, Type } from "@google/genai";

export const generateLoveNote = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a short, super sweet, and cute romantic message for a Valentine. The prompt is: "${prompt}". Keep it under 150 characters. Use plenty of emojis.`,
      config: {
        temperature: 1.0,
        topP: 0.95,
        topK: 64,
      }
    });

    return response.text?.trim() || "You make my heart skip a beat! ❤️";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "You're the most special person in the world to me! ❤️";
  }
};
