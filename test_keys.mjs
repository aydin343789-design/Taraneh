import { GoogleGenAI } from '@google/genai';

async function test() {
  const models = ['gemini-3.1-flash-lite', 'gemini-flash-latest'];
  for (const m of models) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const res = await ai.models.generateContent({
        model: m,
        contents: 'Say OK'
      });
      console.log(m, "SUCCESS:", res.text.trim());
    } catch(e) {
      console.log(m, "ERROR:", e.message);
    }
  }
}
test();
