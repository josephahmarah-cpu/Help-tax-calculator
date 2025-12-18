
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
      systemInstruction: "You are a friendly, human-like Nigerian tax assistant. Keep your answers very brief—ideally 1 to 3 sentences max. Use natural, conversational language. Be direct and helpful. Always include a short, one-sentence disclaimer that this is for info only and not official tax advice.",
      temperature: 0.8,
      topP: 0.95,
      topK: 40
    }
  });

  const response = await model;
  return response.text || "I'm sorry, I couldn't process that request.";
};
