/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Asset {
  id: string;
  type: 'logo' | 'product';
  name: string;
  data: string; // Base64
  mimeType: string;
}

export interface PlacedLayer {
  uid: string; // unique instance id
  assetId: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale: number; // 1 = 100%
  rotation: number;
  opacity?: number;
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';
  isLocked?: boolean;
  groupId?: string;
}

export interface GeneratedMockup {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: number;
  layers?: PlacedLayer[]; // Store layout used
  productId?: string;
}

export type AppView = 'landing' | 'dashboard' | 'assets' | 'studio' | 'gallery' | 'try-on';

export interface LoadingState {
  isGenerating: boolean;
  message: string;
}
