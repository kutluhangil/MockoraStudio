import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Modality } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const getBase64Data = (dataUrl: string): string => {
    if (!dataUrl) return "";
    return dataUrl.split(',')[1] || dataUrl;
  };

  app.post("/api/generate-mockup", async (req, res) => {
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
  });

  app.post("/api/generate-asset", async (req, res) => {
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
  });

  app.post("/api/generate-realtime-composite", async (req, res) => {
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
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
