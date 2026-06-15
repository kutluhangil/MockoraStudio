import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getBase64Data = (dataUrl: string): string => {
  if (!dataUrl) return "";
  return dataUrl.split(',')[1] || dataUrl;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { product, layers, instruction } = req.body;
    const model = 'gemini-3-pro-image-preview';

    const parts: any[] = [{
      inlineData: {
        mimeType: product.mimeType,
        data: getBase64Data(product.data),
      },
    }];

    let layoutHints = "";
    layers.forEach((layer: any, index: number) => {
      parts.push({
        inlineData: {
          mimeType: layer.asset.mimeType,
          data: getBase64Data(layer.asset.data),
        },
      });
      const vPos = layer.placement.y < 33 ? "top" : layer.placement.y > 66 ? "bottom" : "center";
      const hPos = layer.placement.x < 33 ? "left" : layer.placement.x > 66 ? "right" : "center";
      layoutHints += `\n- Logo ${index + 1}: Place at ${vPos}-${hPos} area (approx coords: ${Math.round(layer.placement.x)}% x, ${Math.round(layer.placement.y)}% y). Scale: ${layer.placement.scale}.`;
    });

    const finalPrompt = `
    User Instructions: ${instruction}
    
    Layout Guidance based on user's rough placement on canvas:
    ${layoutHints}

    System Task: Composite the provided logo images (images 2-${layers.length + 1}) onto the first image (the product) to create a realistic product mockup. 
    Follow the Layout Guidance for positioning if provided, but prioritize realistic surface warping, lighting, and perspective blending.
    Output ONLY the resulting image.
    `;

    parts.push({ text: finalPrompt });

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
