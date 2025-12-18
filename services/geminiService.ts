
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

export const getGeminiResponse = async (history: ChatMessage[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: "You are a Nigerian tax expert. Answer questions about Nigeria Personal Income Tax (PAYE), tax laws, and financial planning in Nigeria. Keep answers concise, helpful, and professional. Always include a disclaimer that this is for informational purposes and not official tax advice.",
      temperature: 0.7,
      topP: 0.95,
      topK: 40
    }
  });

  const response = await model;
  return response.text || "I'm sorry, I couldn't process that request.";
};
