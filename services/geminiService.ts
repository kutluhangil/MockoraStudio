/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Asset, PlacedLayer } from "../types";

export const generateMockup = async (
  product: Asset,
  layers: { asset: Asset; placement: PlacedLayer }[],
  instruction: string
): Promise<string> => {
  try {
    const response = await fetch("/api/generate-mockup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, layers, instruction })
    });
    if (!response.ok) {
       const err = await response.json();
       throw new Error(err.error || 'Failed to generate mockup');
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Mockup generation failed:", error);
    throw error;
  }
};

export const generateAsset = async (prompt: string, type: 'logo' | 'product'): Promise<string> => {
   try {
    const response = await fetch("/api/generate-asset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, type })
    });
    if (!response.ok) {
       const err = await response.json();
       throw new Error(err.error || 'Failed to generate asset');
    }
    const data = await response.json();
    return data.result;
   } catch (error) {
       console.error("Asset generation failed:", error);
       throw error;
   }
}

export const generateRealtimeComposite = async (
    compositeImageBase64: string,
    prompt: string = "Make this look like a real photo"
  ): Promise<string> => {
    try {
      const response = await fetch("/api/generate-realtime-composite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compositeImageBase64, prompt })
      });
      if (!response.ok) {
         const err = await response.json();
         throw new Error(err.error || 'Failed to generate realtime composite');
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error("AR Composite generation failed:", error);
      throw error;
    }
  };