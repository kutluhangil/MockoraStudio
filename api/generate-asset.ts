import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, type } = req.body;
    const model = 'gemini-3-pro-image-preview';
    const enhancedPrompt = type === 'logo' 
      ? `A high-quality, professional vector-style logo design of a ${prompt}. Isolated on a pure white background. Minimalist and clean, single distinct logo.`
      : `Professional studio product photography of a single ${prompt}. Ghost mannequin style or flat lay. Front view, isolated on neutral background. High resolution, photorealistic. Single object only, no stacks, no duplicates.`;

    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: enhancedPrompt }] },
      config: { responseModalities: [Modality.IMAGE] },
    });

    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return res.json({ result: `data:image/png;base64,${part.inlineData.data}` });
        }
      }
    }
    throw new Error("No image data found in response");
  } catch(e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
