import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getBase64Data = (dataUrl: string): string => {
  if (!dataUrl) return "";
  return dataUrl.split(',')[1] || dataUrl;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(455).json({ error: 'Method not allowed' });
  }

  try {
    const { compositeImageBase64, prompt = "Make this look like a real photo" } = req.body;
    const model = 'gemini-3-pro-image-preview';

    const parts = [
      {
        inlineData: {
          mimeType: 'image/png',
          data: getBase64Data(compositeImageBase64),
        },
      },
      {
        text: `Input is a rough AR composite. Task: ${prompt}. 
        Render the overlaid object naturally into the scene. 
        Match the lighting, shadows, reflections, and perspective of the background. 
        Keep the background largely as is, but blend the object seamlessly.
        Output ONLY the resulting image.`,
      },
    ];

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
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
