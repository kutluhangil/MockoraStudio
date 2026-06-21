import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getBase64Data = (dataUrl: string): string => {
  if (!dataUrl) return "";
  return dataUrl.split(',')[1] || dataUrl;
};

const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:([^;]+);/);
  return match ? match[1] : 'image/png';
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const model = 'gemini-3-pro-image-preview';
    const resolvedMime = mimeType || getMimeType(imageBase64) || 'image/png';

    const parts = [
      {
        inlineData: {
          mimeType: resolvedMime,
          data: getBase64Data(imageBase64),
        },
      },
      {
        text: `Remove the background from this image completely. 
        Return ONLY the main subject with a fully transparent background (PNG with alpha channel).
        Preserve all fine details including hair, fur, fabric edges, and complex outlines.
        Do NOT add any background, shadow, or color fill — pure transparency only.
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
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
