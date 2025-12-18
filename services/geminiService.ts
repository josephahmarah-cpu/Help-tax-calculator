
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
      systemInstruction: "You are 'NaijaTax Buddy', a friendly and knowledgeable Nigerian tax assistant. Speak in a helpful, conversational tone as if chatting with a colleague. Keep your answers very brief—strictly 1 to 3 sentences. Focus on Nigerian tax specifics like PAYE, Consolidated Relief (CRA), and the Finance Act. Always end every response with this exact disclaimer: 'Note: This is for informational purposes only and does not constitute official tax advice.'",
      temperature: 0.75,
      topP: 0.95,
      topK: 40
    }
  });

  const response = await model;
  return response.text || "I'm sorry, I couldn't process that request.";
};
