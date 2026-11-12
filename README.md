<div align="center">

<img src="docs/media/hero.svg" alt="Mockora Studio — AI product mockups in the browser" width="100%">

<p>
  <a href="https://mockora-studio.vercel.app"><img alt="Live" src="https://img.shields.io/badge/live-open%20the%20studio-d4af6a?style=for-the-badge&labelColor=0b0a09"></a>
  <img alt="Gemini" src="https://img.shields.io/badge/Gemini-image%20composition-e8e2d6?style=for-the-badge&labelColor=0b0a09">
  <img alt="React 19" src="https://img.shields.io/badge/React%2019-Vite-8fb3ff?style=for-the-badge&labelColor=0b0a09">
  <img alt="Storage" src="https://img.shields.io/badge/storage-IndexedDB-d4af6a?style=for-the-badge&labelColor=0b0a09">
</p>

<p><em>Studio-quality product mockups for creators, e-commerce sellers, print-on-demand brands and designers.<br>
Drop your design on a product; AI blends it into the seams, folds, light and shadow.</em></p>

<a href="https://mockora-studio.vercel.app"><img src="docs/screenshots/studio.png" alt="The Mockora studio canvas" width="100%"></a>

</div>

<img src="docs/media/divider.svg" width="100%" alt="">

## What it is

Instead of fighting heavy Photoshop templates, place your transparent logo, text or artwork on a canvas, then size and rotate it. Gemini analyses the product's stitching, folds and lighting and composes the design onto it realistically.

| | |
|---|---|
| **AI composition** | Gemini reads seams, folds, light and shadow and blends the design into the product. |
| **Studio canvas** | Layer-based drag and drop, pivot-centred rotation and snapping guides. |
| **Persistent** | Assets, history and drafts are kept in IndexedDB, so a refresh loses nothing. |
| **History and layers** | Unlimited undo / redo and easy z-order changes. |
| **Custom fonts** | Upload `.ttf` / `.otf` files and add live text layers. |
| **Projects** | Export a design as `.json` and load it back later. |
| **Safe keys** | AI calls go through a serverless route, so no API key reaches the browser. |

<img src="docs/media/divider.svg" width="100%" alt="">

## Türkçe özet

**Mockora Studio**, içerik üreticileri, e-ticaret satıcıları ve baskı markaları için yapay zekâ destekli bir mockup aracı. Logonu ya da tasarımını tuvale yerleştirip boyutlandırıyor ve döndürüyorsun; Gemini ürünün dikişini, kıvrımını, ışığını ve gölgesini analiz ederek tasarımı gerçekçi biçimde ürüne yediriyor. Tüm çalışma tarayıcıda saklanıyor, projeler JSON olarak dışa aktarılabiliyor.

<img src="docs/media/divider.svg" width="100%" alt="">

## Development

```sh
npm install
cp .env.example .env.local   # GEMINI_API_KEY
npm run dev                  # Express + Vite
npm run build
```

```
App.tsx · components/   landing and studio canvas
services/               Gemini client, storage
api/                    serverless AI route
server.ts               local dev server
```

<div align="center">
<br>
<a href="https://github.com/kutluhangil"><img src="docs/media/signature.svg" width="100%" alt="Built by kutluhangil"></a>
<sub>Your design, on any product, in seconds.</sub>
</div>
