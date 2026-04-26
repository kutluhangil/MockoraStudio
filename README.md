<div align="center">

<br />

<img src="https://img.shields.io/badge/Mockora-v1.0-000000?style=for-the-badge&logoColor=white" alt="version" />
<img src="https://img.shields.io/badge/Built_with-TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="react" />
<img src="https://img.shields.io/badge/TailwindCSS-v3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="tailwind" />
<img src="https://img.shields.io/badge/Gemini_API-AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="gemini" />
<img src="https://img.shields.io/badge/Framer_Motion-Animated-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="framer" />

<br /><br />

```text
 ███╗   ███╗ ██████╗  ██████╗██╗  ██╗ ██████╗ ██████╗  █████╗ 
 ████╗ ████║██╔═══██╗██╔════╝██║ ██╔╝██╔═══██╗██╔══██╗██╔══██╗
 ██╔████╔██║██║   ██║██║     █████╔╝ ██║   ██║██████╔╝███████║
 ██║╚██╔╝██║██║   ██║██║     ██╔═██╗ ██║   ██║██╔══██╗██╔══██║
 ██║ ╚═╝ ██║╚██████╔╝╚██████╗██║  ██╗╚██████╔╝██║  ██║██║  ██║
 ╚═╝     ╚═╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
```

### **Premium Mockups. Blazing Fast.** — Generate studio-quality product visuals instantly.

[Live App](https://mockora.studio) · [Report Bug](https://github.com/kutluhangil/Mockora/issues) · [Request Feature](https://github.com/kutluhangil/Mockora/issues)

</div>

---

## ✦ What is Mockora Studio?

**Mockora Studio** is an advanced AI design platform tailored for creators, print-on-demand businesses, and fashion brands. 

Stop wrestling with complex Photoshop templates. Upload your transparent graphics, visually map them onto products using our intuitive Studio canvas, and let AI generate hyper-realistic, studio-quality mockups instantly. Built for speed, precision, and an immersive **"Dark Luxury"** creative experience.

---

<details>
<summary><strong>🇹🇷 Türkçe Açıklama</strong></summary>

<br />

**Mockora Studio**, içerik üreticileri, isteğe bağlı baskı (print-on-demand) işletmeleri ve moda markaları için tasarlanmış gelişmiş bir yapay zeka tasarım platformudur.

Karmaşık Photoshop şablonlarıyla uğraşmayı bırakın. Şeffaf grafiklerinizi yükleyin, sezgisel Stüdyo tuvalimizi kullanarak bunları ürünlerin üzerine görsel olarak yerleştirin ve yapay zekanın anında hiper-gerçekçi, stüdyo kalitesinde mockup'lar oluşturmasına izin verin. Hız, hassasiyet ve sürükleyici bir **"Karanlık Lüks"** yaratıcı deneyim için inşa edildi.

</details>

---

## ⚡ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Interactive Studio** | Drag-and-drop canvas for perfect logo placement, scaling, and rotation. |
| 🤖 **AI Compositing** | Uses the Gemini API to perfectly blend your designs with realistic lighting, shadows, and surface warping. |
| 📦 **Asset Management** | Easily upload and manage your product bases and design layers in one place. |
| 🛡️ **Advanced Canvas Controls** | Layer history, undo/redo, precise alignment tools, and opacity controls. |
| 🖼️ **High-Res Gallery** | View, manage, and download your generated production-ready mockups. |
| ⚡ **Realtime Feedback** | Fast AI generation with informative loading states and visual cues. |
| 🔒 **Private & Secure** | BYOK (Bring Your Own Key) architecture ensures your AI usage is secure and private. |

---

## 🖼️ Screenshots

> *(Coming soon — High-quality mockups of the Mockora Studio interface)*

---

## 🛠️ Tech Stack

```
Frontend        →  React 19 · TypeScript (strict) · Vite · Tailwind CSS v3 · Framer Motion
UI Components   →  Custom design system (Lucide Icons, Glassmorphism panels, interactive canvas)
AI Engine       →  Google Gemini API (@google/genai SDK)
Fonts           →  Inter (UI) · JetBrains Mono (technical)
State Management→  React Hooks (useState, useEffect, custom hooks like useApiKey)
Styling         →  Tailwind CSS utility classes + custom animations in tailwind config
```

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        MOCKORA CLIENT                          │
│                                                                │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────────┐│
│  │ Interactive   │  │   React 19    │  │   Framer Motion     ││
│  │ Canvas Editor │  │   Vite SPA    │  │   Fluid Animations  ││
│  └───────────────┘  └───────────────┘  └─────────────────────┘│
└───────────────────────────┬────────────────────────────────────┘
                            │ (Client-side API calls)
         ┌──────────────────┼──────────────────┐
         │                                     │
┌────────────────┐                    ┌───────────────────┐
│  Gemini API    │                    │ Browser Storage   │
│ (Image Gen ·   │                    │ (API Key ·        │
│  Prompting)    │                    │  Local Assets)    │
└────────────────┘                    └───────────────────┘
```

---

## 📐 Project Structure

```text
MockoraStudio/
├── index.html                 # Main entry point
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Vite bundler configuration
├── src/
│   ├── index.tsx              # React DOM rendering
│   ├── App.tsx                # Main Application Shell & Views (Landing, Studio, Gallery)
│   ├── index.css              # Global styles, Tailwind imports, custom fonts
│   ├── types.ts               # Global TypeScript definitions (AppView, PlacedLayer, etc.)
│   ├── components/            # Reusable UI Components
│   │   ├── Button.tsx         # Custom Button with loading states
│   │   ├── FileUploader.tsx   # Drag and drop asset uploader
│   │   └── ApiKeyDialog.tsx   # Secure API Key input modal
│   ├── hooks/                 # Custom React Hooks
│   │   └── useApiKey.ts       # Manages Gemini API key in local storage
│   └── services/              # External integrations
│       └── geminiService.ts   # AI logic, prompt engineering, and Gemini SDK usage
└── .env.example               # Environment variable templates
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- Google Gemini API Key

### Local Development

```bash
# Clone the repository
git clone https://github.com/kutluhangil/Mockora.git
cd Mockora

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Fill in your Gemini API Key in .env.local (or enter it in the app UI)

# Start the dev server
npm run dev
```

App runs at `http://localhost:3000`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (port 3000) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |

### Environment Variables

| Variable | Description | Required |
|----------|-------------|:--------:|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | Optional (can use UI) |

---

## 🔒 Security & Data Privacy

| Layer | Implementation |
|-------|----------------|
| **API Keys** | Bring Your Own Key (BYOK); keys are stored locally in the browser and never sent to our servers |
| **Assets** | Image assets are processed client-side and only sent directly to Google's Gemini API for generation |
| **No Database**| Completely serverless architecture with no centralized data storage |

---

## 🗺️ Roadmap

- [x] Phase 1 — Core UI and Landing Page (React, Tailwind, Framer Motion)
- [x] Phase 2 — Interactive Studio Canvas, Drag/Drop, Scaling, Opacity
- [x] Phase 3 — Gemini API Integration & Image Generation Logic
- [x] Phase 4 — Layer Alignment, Undo/Redo mechanisms
- [ ] Phase 5 — Layer grouping and locking
- [ ] Phase 6 — Advanced prompt editing and style presets
- [ ] Phase 7 — Background removal integration
- [ ] Phase 8 — Multi-angle mockup generation
- [ ] Phase 9 — Export as PDF/PSD options

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">

Built with precision by [kutluhangil](https://github.com/kutluhangil)

<br />

**[mockora.studio](https://mockora.studio)**

<br />

*If you find this useful, consider giving it a ⭐*

</div>
