/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Box, Image as ImageIcon, Wand2, Layers, Plus, Trash2, Download, History, Sparkles, Shirt, Move, Maximize, RotateCcw, Zap, Cpu, ArrowRight, Globe, Scan, Camera, Aperture, Repeat, SprayCan, Triangle, Package, Menu, X, Check, MousePointer2, AlignLeft, AlignRight, AlignCenterHorizontal, AlignStartVertical, AlignEndVertical, AlignCenterVertical, Undo, Redo, Settings2, Lock, Unlock, GripVertical, Type, Save, FileDown, Pipette, Upload, Group, Copy, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './components/Button';
import { FileUploader } from './components/FileUploader';
import { generateMockup, generateAsset, generateRealtimeComposite } from './services/geminiService';
import { Asset, GeneratedMockup, AppView, LoadingState, PlacedLayer, Template, CustomFont } from './types';
import { toPng } from 'html-to-image';
import { get, set } from 'idb-keyval';

// --- Intro Animation Component ---

const IntroSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'enter' | 'wait' | 'spray' | 'admire' | 'exit' | 'prism' | 'explode'>('enter');

  useEffect(() => {
    // Cinematic Timeline
    const schedule = [
      { t: 100, fn: () => setPhase('enter') },      // Bot walks in
      { t: 1800, fn: () => setPhase('wait') },      // Stops, looks around
      { t: 2400, fn: () => setPhase('spray') },     // Spray can enters & sprays
      { t: 4000, fn: () => setPhase('admire') },    // Spray done, bot looks at self
      { t: 5000, fn: () => setPhase('exit') },      // Bot runs away
      { t: 5600, fn: () => setPhase('prism') },     // Logo forms
      { t: 7800, fn: () => setPhase('explode') },   // Boom
      { t: 8500, fn: () => onComplete() }           // Done
    ];

    const timers = schedule.map(s => setTimeout(s.fn, s.t));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden font-sans select-none
      ${phase === 'explode' ? 'animate-[fadeOut_1s_ease-out_forwards] pointer-events-none' : ''}
    `}>
      {/* Flash Overlay for Explosion */}
      <div className={`absolute inset-0 bg-white pointer-events-none z-50 transition-opacity duration-300 ease-out ${phase === 'explode' ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"></div>

      {/* STAGE AREA - Scaled for mobile */}
      <div className="relative w-full max-w-4xl h-96 flex items-center justify-center scale-[0.6] md:scale-100">

        {/* --- CHARACTER: THE BOX BOT --- */}
        {(phase !== 'prism' && phase !== 'explode') && (
          <div className={`relative z-10 flex flex-col items-center transition-transform will-change-transform
             ${phase === 'enter' ? 'animate-[hopIn_1.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards]' : ''}
             ${phase === 'exit' ? 'animate-[anticipateSprint_0.8s_ease-in_forwards]' : ''}
          `}>
             {/* Body */}
             <div className={`w-32 h-36 bg-zinc-100 rounded-xl relative overflow-hidden shadow-2xl transition-all duration-300 border-4
                ${phase === 'spray' || phase === 'admire' || phase === 'exit' 
                  ? 'border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.5)]' 
                  : 'border-zinc-300'}
             `}>
                
                {/* Blank Package Tape (Hidden after spray) */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-zinc-200/50 border-x border-zinc-300/50 transition-opacity duration-200 ${phase === 'spray' || phase === 'admire' || phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}></div>

                {/* Face Screen */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-10 bg-zinc-800 rounded-md flex items-center justify-center gap-4 overflow-hidden border border-zinc-700 shadow-inner z-20">
                   {/* Eyes */}
                   <div className={`w-2 h-2 bg-cyan-400 rounded-full transition-all duration-300 ${phase === 'spray' ? 'scale-y-10 bg-yellow-400' : 'animate-pulse'}`}></div>
                   <div className={`w-2 h-2 bg-cyan-400 rounded-full transition-all duration-300 ${phase === 'spray' ? 'scale-y-10 bg-yellow-400' : 'animate-pulse'}`}></div>
                </div>

                {/* BRAND REVEAL: Logo & Color Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 transition-opacity duration-500 ${phase === 'spray' || phase === 'admire' || phase === 'exit' ? 'opacity-100' : 'opacity-0'}`}></div>
                
                {/* White Flash on Transform */}
                <div className={`absolute inset-0 bg-white mix-blend-overlay pointer-events-none ${phase === 'spray' ? 'animate-[flash_0.2s_ease-out]' : 'opacity-0'}`}></div>

                {/* Logo Icon */}
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 transform z-20
                   ${phase === 'spray' || phase === 'admire' || phase === 'exit' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}
                `}>
                   <div className="w-10 h-10 bg-white text-indigo-600 rounded flex items-center justify-center shadow-lg">
                      <Package size={24} strokeWidth={3} />
                   </div>
                </div>
             </div>

             {/* Legs */}
             <div className="flex gap-10 -mt-1 z-0">
                <div className={`w-3 h-8 bg-zinc-800 rounded-b-full origin-top ${phase === 'enter' ? 'animate-[legMove_0.2s_infinite_alternate]' : ''} ${phase === 'exit' ? 'animate-[legMove_0.1s_infinite_alternate]' : ''}`}></div>
                <div className={`w-3 h-8 bg-zinc-800 rounded-b-full origin-top ${phase === 'enter' ? 'animate-[legMove_0.2s_infinite_alternate-reverse]' : ''} ${phase === 'exit' ? 'animate-[legMove_0.1s_infinite_alternate-reverse]' : ''}`}></div>
             </div>
          </div>
        )}

        {/* --- SPRAY CAN ACTOR --- */}
        {phase === 'spray' && (
          <div className="absolute z-20 animate-[swoopIn_0.4s_cubic-bezier(0.17,0.67,0.83,0.67)_forwards]" style={{ right: '22%', top: '5%' }}>
             <div className="relative animate-[shake_0.15s_infinite]">
                <SprayCan size={80} className="text-zinc-300 fill-zinc-800 rotate-[-15deg] drop-shadow-2xl" />
                
                {/* Spray Nozzle Mist */}
                <div className="absolute top-0 -left-4 w-6 h-6 bg-white rounded-full blur-md animate-ping"></div>
                
                {/* Particle Stream */}
                <div className="absolute top-4 -left-8 w-40 h-40 pointer-events-none overflow-visible">
                   {[...Array(20)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-[sprayParticle_0.4s_linear_forwards]"
                        style={{ 
                           top: Math.random() * 20, 
                           left: 0,
                           animationDelay: `${Math.random() * 0.3}s`,
                        }}
                      />
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- FINALE --- */}
        {(phase === 'prism' || phase === 'explode') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
             {/* Logo Icon */}
             <div className={`relative w-32 h-32 animate-[spinAppear_1.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards]`}>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_50px_rgba(99,102,241,0.5)]">
                   <defs>
                      <linearGradient id="prismStroke" x1="0" y1="0" x2="1" y2="1">
                         <stop offset="0%" stopColor="#6366f1" />
                         <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                   </defs>
                   <path 
                      d="M50 10 L90 85 L10 85 Z" 
                      fill="none" 
                      stroke="url(#prismStroke)" 
                      strokeWidth="4" 
                      strokeLinejoin="round"
                      className="animate-[drawStroke_1s_ease-out_forwards]"
                   />
                   <path 
                      d="M50 10 L50 85 M50 50 L90 85 M50 50 L10 85" 
                      stroke="url(#prismStroke)" 
                      strokeWidth="1.5" 
                      className="opacity-40"
                   />
                </svg>
             </div>
             
             {/* Text Reveal */}
             <div className="text-center animate-[popIn_0.8s_cubic-bezier(0.17,0.67,0.83,0.67)_0.5s_forwards] opacity-0">
                <h1 className="text-5xl font-black text-white tracking-tighter mb-2">SKU FOUNDRY</h1>
                <p className="text-sm text-indigo-400 font-mono tracking-[0.3em] uppercase">AI Product Visualization</p>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

const LandingPage = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 overflow-hidden relative flex flex-col font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <motion.div initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <Package className="text-indigo-500 w-8 h-8" />
          </motion.div>
          <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="font-bold text-xl tracking-tight">Mockora Studio</motion.span>
        </div>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Button variant="outline" onClick={onEnter} className="border-zinc-700 hover:bg-zinc-800 text-sm">
             Enter Studio
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-7xl mx-auto px-6 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
           className="mb-8 p-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md inline-flex items-center"
        >
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide uppercase">Premium Engine</span>
          <span className="text-zinc-400 text-sm ml-3 mr-4">AI-powered compositing & visualization</span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-8 max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Design Premium Products <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">At The Speed Of Thought</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Mockora Studio is an advanced AI design platform. Upload transparent graphics, seamlessly map them onto products, and generate hyper-realistic, studio-quality mockups instantly.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <button 
             onClick={onEnter} 
             className="px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:bg-zinc-200 transition-colors flex items-center gap-2 group"
          >
             Start Creating
             <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
             onClick={onEnter} 
             className="px-8 py-4 rounded-full bg-zinc-900 border border-zinc-700 text-white font-semibold text-lg hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
             <Sparkles className="w-5 h-5 text-indigo-400" />
             Explore Studio
          </button>
        </motion.div>
      </main>
    </div>
  );
};

// --- UI Components ---

const NavButton = ({ icon, label, active, onClick, number }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, number?: number }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
      ${active ? 'bg-indigo-500/10 text-white border-l-2 border-indigo-500' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'}`}
  >
    <span className={`${active ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'} transition-colors`}>
      {icon}
    </span>
    <span className="font-medium text-sm tracking-wide flex-1 text-left">{label}</span>
    {number && (
      <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded min-w-[1.5rem] text-center transition-colors ${active ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
        {number}
      </span>
    )}
  </button>
);

const WorkflowStepper = ({ currentView, onViewChange }: { currentView: AppView, onViewChange: (view: AppView) => void }) => {
  const steps = [
    { id: 'assets', label: 'Upload Assets', number: 1 },
    { id: 'studio', label: 'Design Mockup', number: 2 },
    { id: 'gallery', label: 'Download Result', number: 3 },
  ];

  const viewOrder = ['assets', 'studio', 'gallery'];
  const currentIndex = viewOrder.indexOf(currentView);
  const progress = Math.max(0, (currentIndex / (steps.length - 1)) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 hidden md:block animate-fade-in px-4">
      <div className="relative">
         {/* Background Track */}
         <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-800 -translate-y-1/2 rounded-full"></div>
         
         {/* Active Progress Bar */}
         <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
         ></div>

         <div className="relative flex justify-between w-full">
            {steps.map((step, index) => {
               const isCompleted = currentIndex > index;
               const isCurrent = currentIndex === index;
               
               return (
                  <button 
                    key={step.id}
                    onClick={() => onViewChange(step.id as AppView)}
                    className={`group flex flex-col items-center focus:outline-none relative z-10 cursor-pointer`}
                  >
                     <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 bg-zinc-950
                        ${isCurrent 
                           ? 'border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110' 
                           : isCompleted 
                              ? 'border-indigo-600 bg-indigo-600 text-white' 
                              : 'border-zinc-800 text-zinc-600 group-hover:border-zinc-600 group-hover:text-zinc-400'}
                     `}>
                        {isCompleted ? (
                           <Check size={18} strokeWidth={3} />
                        ) : (
                           <span className="text-sm font-bold font-mono">{step.number}</span>
                        )}
                     </div>
                     <span className={`
                        absolute top-14 text-xs font-medium tracking-wider transition-all duration-300 whitespace-nowrap
                        ${isCurrent ? 'text-indigo-400 opacity-100 transform translate-y-0' : isCompleted ? 'text-zinc-400 opacity-80' : 'text-zinc-600 opacity-60 group-hover:opacity-100'}
                     `}>
                        {step.label}
                     </span>
                  </button>
               )
            })}
         </div>
      </div>
    </div>
  )
};

// Helper component for Asset Sections
const AssetSection = ({ 
  title, 
  icon, 
  type, 
  assets, 
  onAdd, 
  onRemove,
  validateApiKey,
  onApiError
}: { 
  title: string, 
  icon: React.ReactNode, 
  type: 'logo' | 'product', 
  assets: Asset[], 
  onAdd: (a: Asset) => void, 
  onRemove: (id: string) => void,
  validateApiKey: () => Promise<boolean>,
  onApiError: (e: any) => void
}) => {
  const [mode, setMode] = useState<'upload' | 'generate'>('upload');
  const [genPrompt, setGenPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!genPrompt) return;
    
    // Validate API key first
    if (!(await validateApiKey())) return;

    setIsGenerating(true);
    try {
      const b64 = await generateAsset(genPrompt, type);
      onAdd({
        id: Math.random().toString(36).substring(7),
        type,
        name: `AI Generated ${type}`,
        data: b64,
        mimeType: 'image/png'
      });
      setGenPrompt('');
    } catch (e: any) {
      console.error(e);
      onApiError(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">{icon} {title}</h2>
          <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">{assets.length} items</span>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 overflow-y-auto max-h-[400px] pr-2">
          {assets.map(asset => (
            <div key={asset.id} className="relative group aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700">
                <img src={asset.data} className="w-full h-full object-contain p-2" alt={asset.name} />
                <button onClick={() => onRemove(asset.id)} className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={12} />
                </button>
            </div>
          ))}
          {assets.length === 0 && (
            <div className="col-span-2 sm:col-span-3 flex flex-col items-center justify-center h-32 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
              <p className="text-sm">No {type}s yet</p>
            </div>
          )}
      </div>

      {/* Creation Area */}
      <div className="mt-auto pt-4 border-t border-zinc-800">
        <div className="flex gap-4 mb-4">
           <button 
             onClick={() => setMode('upload')}
             className={`text-sm font-medium pb-1 border-b-2 transition-colors ${mode === 'upload' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
           >
             Upload
           </button>
           <button 
             onClick={() => setMode('generate')}
             className={`text-sm font-medium pb-1 border-b-2 transition-colors ${mode === 'generate' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
           >
             Generate with AI
           </button>
        </div>

        {mode === 'upload' ? (
           <FileUploader label={`Upload ${type}`} onFileSelect={(f) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                onAdd({
                  id: Math.random().toString(36).substring(7),
                  type,
                  name: f.name,
                  data: e.target?.result as string,
                  mimeType: f.type
                });
              };
              reader.readAsDataURL(f);
           }} />
        ) : (
           <div className="space-y-3">
              <textarea 
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                placeholder={`Describe the ${type} you want to create...`}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-base text-white focus:ring-2 focus:ring-indigo-500 resize-none h-24 placeholder:text-zinc-600"
              />
              <Button 
                onClick={handleGenerate} 
                isLoading={isGenerating} 
                disabled={!genPrompt}
                className="w-full"
                icon={<Sparkles size={16} />}
              >
                Generate {type}
              </Button>
           </div>
        )}
      </div>
    </div>
  );
};


// --- App Component ---

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [generatedMockups, setGeneratedMockups] = useState<GeneratedMockup[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState<GeneratedMockup | null>(null); // State for lightbox

  // Form states for generation
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [productColor, setProductColor] = useState<string>('#ffffff'); // Default white
  const [productGradientEnabled, setProductGradientEnabled] = useState<boolean>(false);
  const [productGradientType, setProductGradientType] = useState<'linear' | 'radial'>('linear');
  const [productGradientColor1, setProductGradientColor1] = useState<string>('#ffffff');
  const [productGradientColor2, setProductGradientColor2] = useState<string>('#e0e0e0');
  const [productGradientAngle, setProductGradientAngle] = useState<number>(45);
  const [bgPrompt, setBgPrompt] = useState<string>(''); // AI Background prompt
  const [templates, setTemplates] = useState<Template[]>([]);
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isGenerating: false, message: '' });

  // --- STUDIO HISTORY & STATE ---
  const [layersHistory, setLayersHistory] = useState<PlacedLayer[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [draftLogos, setDraftLogos] = useState<PlacedLayer[] | null>(null);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  
  const placedLogos = draftLogos !== null ? draftLogos : (layersHistory[historyIndex] || []);
  
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from DB
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedAssets = await get('mockora_assets');
        const storedMockups = await get('mockora_mockups');
        const storedHistory = await get('mockora_history');
        const storedIndex = await get('mockora_index');
        const storedFonts = await get('mockora_fonts');

        if (storedAssets) setAssets(storedAssets);
        if (storedMockups) setGeneratedMockups(storedMockups);
        if (storedHistory) setLayersHistory(storedHistory);
        if (storedIndex !== undefined) setHistoryIndex(storedIndex);
        if (storedFonts) setCustomFonts(storedFonts);
      } catch (e) {
        console.error('Failed to load state from indexedDB', e);
      } finally {
        setIsInitialized(true);
      }
    };
    loadState();
  }, []);

  // Save state to DB
  useEffect(() => {
    if (!isInitialized) return;
    set('mockora_assets', assets).catch(console.error);
  }, [assets, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    set('mockora_mockups', generatedMockups).catch(console.error);
  }, [generatedMockups, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    set('mockora_history', layersHistory).catch(console.error);
    set('mockora_index', historyIndex).catch(console.error);
  }, [layersHistory, historyIndex, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    set('mockora_fonts', customFonts).catch(console.error);
  }, [customFonts, isInitialized]);

  // Export Project JSON
  const handleExportProject = async () => {
    setLoading({ isGenerating: true, message: 'Exporting Project...' });
    try {
      const projectData = {
        assets,
        generatedMockups,
        layersHistory,
        historyIndex,
        customFonts,
        version: "1.0.0"
      };
      const blob = new Blob([JSON.stringify(projectData)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Mockora-Project-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Failed to export project');
    } finally {
      setLoading({ isGenerating: false, message: '' });
    }
  };

  // Import Project JSON
  const handleImportProject = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        setLoading({ isGenerating: true, message: 'Importing Project...' });
        const text = await file.text();
        const data = JSON.parse(text);
        if (data && data.assets && data.layersHistory) {
          setAssets(data.assets || []);
          setGeneratedMockups(data.generatedMockups || []);
          setLayersHistory(data.layersHistory || [[]]);
          setHistoryIndex(data.historyIndex || 0);
          setCustomFonts(data.customFonts || []);
          setSelectedLayerIds([]);
        } else {
           alert('Invalid project file format');
        }
      } catch (e) {
        console.error(e);
        alert('Failed to import project');
      } finally {
        setLoading({ isGenerating: false, message: '' });
      }
    };
    input.click();
  };

  // Prevent accidental data loss
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (placedLogos.length > 0 || assets.length > 0) {
          e.returnValue = 'You have unsaved changes that will be lost.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [placedLogos.length, assets.length]);

  const pushHistory = (newLogos: PlacedLayer[]) => {
    const nextHistory = layersHistory.slice(0, historyIndex + 1);
    nextHistory.push(newLogos);
    setLayersHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedLayerIds([]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < layersHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedLayerIds([]);
    }
  };

  const updateSelectedLayerProperties = (updates: Partial<PlacedLayer>) => {
    if (selectedLayerIds.length === 0) return;
    const newLogos = (layersHistory[historyIndex] || []).map(l => 
        selectedLayerIds.includes(l.uid) ? { ...l, ...updates } : l
    );
    pushHistory(newLogos);
  };

  const applyGroupTransform = (newTransform: { scale: number, rotation: number, opacity: number }) => {
     if (selectedLayerIds.length === 0) return;
     const currentLogos = layersHistory[historyIndex] || [];
     const selectedLogos = currentLogos.filter(l => selectedLayerIds.includes(l.uid));
     
     const scaleRatio = newTransform.scale / groupTransform.scale;
     const rotationDelta = newTransform.rotation - groupTransform.rotation;
     const opacityDelta = newTransform.opacity - groupTransform.opacity;
     
     setGroupTransform(newTransform);

     let minX = 100, maxX = 0, minY = 100, maxY = 0;
     selectedLogos.forEach(l => {
        if (l.x < minX) minX = l.x;
        if (l.x > maxX) maxX = l.x;
        if (l.y < minY) minY = l.y;
        if (l.y > maxY) maxY = l.y;
     });
     const pivotX = (minX + maxX) / 2;
     const pivotY = (minY + maxY) / 2;

     const newLogos = currentLogos.map(l => {
        if (!selectedLayerIds.includes(l.uid) || l.isLocked) return l;
        let newX = l.x;
        let newY = l.y;
        let newScale = Math.max(0.01, l.scale * scaleRatio);
        let newRot = l.rotation + rotationDelta;
        let newOp = Math.max(0, Math.min(1, (l.opacity ?? 1) + opacityDelta));

        if (scaleRatio !== 1) {
            newX = pivotX + (newX - pivotX) * scaleRatio;
            newY = pivotY + (newY - pivotY) * scaleRatio;
        }

        if (rotationDelta !== 0) {
            const angle = rotationDelta * Math.PI / 180;
            const cx = newX - pivotX;
            const cy = newY - pivotY;
            newX = pivotX + (cx * Math.cos(angle) - cy * Math.sin(angle));
            newY = pivotY + (cx * Math.sin(angle) + cy * Math.cos(angle));
        }
        
        return { ...l, x: newX, y: newY, scale: newScale, rotation: newRot, opacity: newOp };
     });
     
     setDraftLogos(newLogos);
  };

  const commitGroupTransform = () => {
    setDraftLogos(prev => {
        if (prev) pushHistory(prev);
        return null; // Will trigger re-render with new history
    });
  };

  const alignSelected = (alignType: 'left' | 'right' | 'top' | 'bottom' | 'center-x' | 'center-y') => {
    if (selectedLayerIds.length === 0) return;
    const newLogos = (layersHistory[historyIndex] || []).map(l => {
        if (!selectedLayerIds.includes(l.uid) || l.isLocked) return l;
        let newX = l.x;
        let newY = l.y;
        if (alignType === 'left') newX = 10;
        if (alignType === 'right') newX = 90;
        if (alignType === 'center-x') newX = 50;
        if (alignType === 'top') newY = 10;
        if (alignType === 'bottom') newY = 90;
        if (alignType === 'center-y') newY = 50;
        return { ...l, x: newX, y: newY };
    });
    pushHistory(newLogos);
  };

  const changeLayerOrder = (direction: 'front' | 'back' | 'forward' | 'backward') => {
    if (selectedLayerIds.length === 0) return;
    const currentLogos = [...(layersHistory[historyIndex] || [])];
    
    let indices = currentLogos
      .map((l, i) => selectedLayerIds.includes(l.uid) ? i : -1)
      .filter(i => i !== -1);
      
    if (indices.length === 0) return;

    if (direction === 'front') {
        const toMove = indices.map(i => currentLogos[i]);
        for (let i = indices.length - 1; i >= 0; i--) currentLogos.splice(indices[i], 1);
        currentLogos.push(...toMove);
    } else if (direction === 'back') {
        const toMove = indices.map(i => currentLogos[i]);
        for (let i = indices.length - 1; i >= 0; i--) currentLogos.splice(indices[i], 1);
        currentLogos.unshift(...toMove);
    } else if (direction === 'forward') {
        indices.sort((a,b)=> b-a);
        for (let idx of indices) {
            if (idx < currentLogos.length - 1 && !selectedLayerIds.includes(currentLogos[idx+1].uid)) {
                [currentLogos[idx], currentLogos[idx+1]] = [currentLogos[idx+1], currentLogos[idx]];
            }
        }
    } else if (direction === 'backward') {
         indices.sort((a,b)=> a-b);
         for (let idx of indices) {
            if (idx > 0 && !selectedLayerIds.includes(currentLogos[idx-1].uid)) {
                [currentLogos[idx], currentLogos[idx-1]] = [currentLogos[idx-1], currentLogos[idx]];
            }
        }
    }
    
    pushHistory(currentLogos);
  };

  // Make api key validation pass automatically since it's hardcoded on the backend
  const validateApiKey = async () => true;
  const showApiKeyDialog = false;
  const setShowApiKeyDialog = () => {};
  const handleApiKeyDialogContinue = () => {};

  // API Error Handling Logic
  const handleApiError = (error: any) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    let shouldOpenDialog = false;

    // Check for specific Server-side Error Signatures
    if (errorMessage.includes('Requested entity was not found')) {
      console.warn('Model not found - likely a billing/key issue');
      shouldOpenDialog = true;
    } else if (
      errorMessage.includes('API_KEY_INVALID') ||
      errorMessage.includes('API key not valid') ||
      errorMessage.includes('PERMISSION_DENIED') || 
      errorMessage.includes('403')
    ) {
      console.warn('Invalid API Key or Permissions');
      shouldOpenDialog = true;
    }

    if (shouldOpenDialog) {
      setShowApiKeyDialog(true);
    } else {
      alert(`Operation failed: ${errorMessage}`);
    }
  };

  // State for Dragging
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedItem, setDraggedItem] = useState<{ uid: string, startX: number, startY: number, initX: number, initY: number } | null>(null);
  const [guides, setGuides] = useState<{ x?: number, y?: number } | null>(null);
  const [draggedLayerIdx, setDraggedLayerIdx] = useState<number | null>(null);
  const [groupTransform, setGroupTransform] = useState({ scale: 1, rotation: 0, opacity: 1 });

  // Reset group transform when selection changes
  useEffect(() => {
     setGroupTransform({ scale: 1, rotation: 0, opacity: 1 });
  }, [selectedLayerIds]);


  // Demo assets on load
  useEffect(() => {
    // Initial load logic here if needed
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    if (view !== 'studio') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedLayerIds.length > 0) {
           const layersToRemove = (layersHistory[historyIndex] || []).filter(l => selectedLayerIds.includes(l.uid) && !l.isLocked);
           if (layersToRemove.length > 0) {
              const uidsToRemove = layersToRemove.map(l => l.uid);
              pushHistory(placedLogos.filter(l => !uidsToRemove.includes(l.uid)));
              setSelectedLayerIds(prev => prev.filter(id => !uidsToRemove.includes(id)));
           }
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        if (selectedLayerIds.length > 0) {
           e.preventDefault();
           const layersToDup = (layersHistory[historyIndex] || []).filter(l => selectedLayerIds.includes(l.uid));
           if (layersToDup.length > 0) {
              const oldToNewGroupIds = new Map<string, string>();
              const newLayers = layersToDup.map(l => {
                 let newGroupId = undefined;
                 if (l.groupId) {
                    if (!oldToNewGroupIds.has(l.groupId)) {
                       oldToNewGroupIds.set(l.groupId, Math.random().toString(36).substr(2, 9));
                    }
                    newGroupId = oldToNewGroupIds.get(l.groupId);
                 }
                 return { ...l, uid: Math.random().toString(36).substr(2, 9), groupId: newGroupId, x: Math.min(100, l.x + 5), y: Math.min(100, l.y + 5) };
              });
              pushHistory([...(layersHistory[historyIndex] || []), ...newLayers]);
              setSelectedLayerIds(newLayers.map(l => l.uid));
           }
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') {
        if (selectedLayerIds.length > 0) {
           e.preventDefault();
           const layersToLock = (layersHistory[historyIndex] || []).filter(l => selectedLayerIds.includes(l.uid));
           if (layersToLock.length > 0) {
              // If all selected are locked, unlock them. Otherwise, lock all.
              const allLocked = layersToLock.every(l => l.isLocked);
              updateSelectedLayerProperties({ isLocked: !allLocked });
           }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, historyIndex, layersHistory, selectedLayerIds]);

  // -- LOGO PLACEMENT HANDLERS --
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addLogoToCanvas = (assetId: string) => {
    const newLayer: PlacedLayer = {
      uid: Math.random().toString(36).substr(2, 9),
      assetId,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
      opacity: 1
    };
    pushHistory([...placedLogos, newLayer]);
    setSelectedLayerIds([newLayer.uid]);
  };

  const removeLogoFromCanvas = (uid: string, e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    pushHistory(placedLogos.filter(l => l.uid !== uid));
    if (selectedLayerIds.includes(uid)) setSelectedLayerIds(prev => prev.filter(id => id !== uid));
  };

  const handleDropLayer = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedLayerIdx === null || draggedLayerIdx === targetIndex) return;
    
    const newLogos = [...placedLogos];
    const [draggedItem] = newLogos.splice(draggedLayerIdx, 1);
    newLogos.splice(targetIndex, 0, draggedItem);
    
    pushHistory(newLogos);
    setDraggedLayerIdx(null);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent, clientX: number, clientY: number, layer: PlacedLayer) => {
    let newSelectedIds = [...selectedLayerIds];

    const layerGroupIds = layer.groupId 
        ? (draftLogos !== null ? draftLogos : (layersHistory[historyIndex] || [])).filter(l => l.groupId === layer.groupId).map(l => l.uid)
        : [layer.uid];

    if ('shiftKey' in e && e.shiftKey) {
        if (newSelectedIds.includes(layer.uid)) {
            newSelectedIds = newSelectedIds.filter(id => !layerGroupIds.includes(id));
        } else {
            newSelectedIds.push(...layerGroupIds);
        }
    } else {
        if (!newSelectedIds.includes(layer.uid)) {
            newSelectedIds = layerGroupIds;
        }
    }
    
    setSelectedLayerIds(newSelectedIds);
    if (layer.isLocked) return;

    setDraggedItem({
      uid: layer.uid,
      startX: clientX,
      startY: clientY,
      initX: layer.x,
      initY: layer.y
    });
  };

  const handleMouseDown = (e: React.MouseEvent, layer: PlacedLayer) => {
    e.preventDefault();
    e.stopPropagation();
    handleStart(e, e.clientX, e.clientY, layer);
  };

  const handleTouchStart = (e: React.TouchEvent, layer: PlacedLayer) => {
    e.stopPropagation(); // Prevent scrolling initiation if possible
    const touch = e.touches[0];
    handleStart(e, touch.clientX, touch.clientY, layer);
  };

  const handleWheel = (e: React.WheelEvent, layerId: string) => {
     e.stopPropagation();
     const currentLogos = layersHistory[historyIndex] || [];
     const layer = currentLogos.find(l => l.uid === layerId);
     if (layer?.isLocked) return;

     const delta = e.deltaY > 0 ? -0.1 : 0.1;
     
     setDraftLogos(prev => {
        const current = prev || placedLogos;
        const targetIds = selectedLayerIds.includes(layerId) ? selectedLayerIds : [layerId];
        return current.map(l => {
           if (!targetIds.includes(l.uid)) return l;
           if (l.isLocked) return l;
           const newScale = Math.max(0.1, Math.min(4.0, (l.scale || 1) + delta));
           return { ...l, scale: newScale };
        });
     });

     if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
     wheelTimeoutRef.current = setTimeout(() => {
        setDraftLogos(prev => {
           if (prev) pushHistory(prev);
           return null;
        });
     }, 300);
  };

  // Global mouse/touch move for dragging
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!draggedItem || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = clientX - draggedItem.startX;
      const deltaY = clientY - draggedItem.startY;

      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;

      let snappedX = Math.max(0, Math.min(100, draggedItem.initX + deltaXPercent));
      let snappedY = Math.max(0, Math.min(100, draggedItem.initY + deltaYPercent));

      const newGuides: { x?: number, y?: number } = {};
      const SNAP_THRESHOLD = 2; // Tighter snap

      // Collect all snap targets: edges, center, and other layers' centers
      const currentLogos = layersHistory[historyIndex] || [];
      const snapPointsX = [0, 50, 100];
      const snapPointsY = [0, 50, 100];

      currentLogos.forEach(l => {
         if (l.uid !== draggedItem.uid && !selectedLayerIds.includes(l.uid)) {
             snapPointsX.push(l.x);
             snapPointsY.push(l.y);
         }
      });

      // Find closest snap points
      for (const p of snapPointsX) {
          if (Math.abs(snappedX - p) < SNAP_THRESHOLD) {
             snappedX = p;
             newGuides.x = p;
             break;
          }
      }
      for (const p of snapPointsY) {
          if (Math.abs(snappedY - p) < SNAP_THRESHOLD) {
             snappedY = p;
             newGuides.y = p;
             break;
          }
      }

      setGuides(Object.keys(newGuides).length > 0 ? newGuides : null);

      const actualDeltaXPercent = snappedX - draggedItem.initX;
      const actualDeltaYPercent = snappedY - draggedItem.initY;

      const newLogos = currentLogos.map(l => {
        if (!selectedLayerIds.includes(l.uid)) return l;
        if (l.isLocked) return l; // Do not move locked items
        
        if (l.uid === draggedItem.uid) {
            return {
              ...l,
              x: snappedX,
              y: snappedY
            };
        } else {
            // Because l.x and l.y in currentLogos are the initial state when drag started 
            // (since we read from layersHistory), we can just add actualDelta*Percent
            return {
              ...l,
              x: Math.max(0, Math.min(100, l.x + actualDeltaXPercent)),
              y: Math.max(0, Math.min(100, l.y + actualDeltaYPercent))
            };
        }
      });
      setDraftLogos(newLogos);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      if (draggedItem) {
         setDraftLogos(prev => {
            if (prev) pushHistory(prev);
            return null;
         });
         setDraggedItem(null);
         setGuides(null);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (draggedItem) {
         e.preventDefault();
         handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      if (draggedItem) {
         setDraftLogos(prev => {
            if (prev) pushHistory(prev);
            return null;
         });
         setDraggedItem(null);
         setGuides(null);
      }
    };

    if (draggedItem) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false }); // passive: false needed for preventDefault
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [draggedItem]);


  const handleGenerate = async () => {
    // We don't return early for empty selections here so we can give better user feedback
    if (!selectedProductId && placedLogos.length === 0) {
        // Although button is disabled, safety check
        return;
    }
    
    const product = assets.find(a => a.id === selectedProductId);
    if (!product) {
        alert("Selected product not found. Please select a product.");
        // Deselect the invalid ID so the UI updates
        setSelectedProductId(null);
        return;
    }

    // Prepare all layers
    const layers = placedLogos.map(layer => {
        const asset = assets.find(a => a.id === layer.assetId);
        return asset ? { asset, placement: layer } : null;
    }).filter(Boolean) as { asset: Asset, placement: PlacedLayer }[];

    if (layers.length === 0) {
         alert("No valid logos found on canvas. Please add a logo.");
         return;
    }

    // Check API Key before proceeding
    if (!(await validateApiKey())) {
      return;
    }

    const currentPrompt = `${prompt}${bgPrompt ? `\n\nBackground Context: ${bgPrompt}` : ''}${productColor && productColor !== '#ffffff' ? `\n\nProduct Base Color: ${productColor} (Please tint the base product accordingly)` : ''}`;

    setLoading({ isGenerating: true, message: 'Analyzing composite geometry...' });
    try {
      const resultImage = await generateMockup(product, layers, currentPrompt);
      
      const newMockup: GeneratedMockup = {
        id: Math.random().toString(36).substring(7),
        imageUrl: resultImage,
        prompt: currentPrompt,
        createdAt: Date.now(),
        layers: placedLogos, // Save the layout
        productId: selectedProductId
      };
      
      setGeneratedMockups(prev => [newMockup, ...prev]);
      setView('gallery');
    } catch (e: any) {
      console.error(e);
      handleApiError(e);
    } finally {
      setLoading({ isGenerating: false, message: '' });
    }
  };

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans flex overflow-hidden relative">
      
      {/* Inject Custom Fonts into Page */}
      {customFonts.length > 0 && (
         <style>
            {customFonts.map(f => `
               @font-face {
                 font-family: '${f.name}';
                 src: url('${f.url}');
               }
            `).join('\n')}
         </style>
      )}

      {/* API Key Dialog */}
      {showApiKeyDialog && (
        <ApiKeyDialog onContinue={handleApiKeyDialogContinue} />
      )}

      {/* Sidebar Navigation (Desktop) */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex flex-col">
        <div className="h-16 border-b border-zinc-800 flex items-center px-6">
          <Package className="text-indigo-500 mr-2" />
          <span className="font-bold text-lg tracking-tight">Mockora Studio</span>
        </div>

        <div className="p-4 space-y-2 flex-1">
          <NavButton 
            icon={<Layout size={18} />} 
            label="Dashboard" 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')} 
          />
          <NavButton 
            icon={<Box size={18} />} 
            label="Assets" 
            active={view === 'assets'} 
            number={1}
            onClick={() => setView('assets')} 
          />
          <NavButton 
            icon={<Wand2 size={18} />} 
            label="Studio" 
            active={view === 'studio'} 
            number={2}
            onClick={() => setView('studio')} 
          />
          <NavButton 
            icon={<ImageIcon size={18} />} 
            label="Gallery" 
            active={view === 'gallery'} 
            number={3}
            onClick={() => setView('gallery')} 
          />
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-center">
             <Button size="sm" variant="outline" className="w-full text-xs">Documentation</Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center">
          <Package className="text-indigo-500 mr-2" />
          <span className="font-bold text-lg">Mockora Studio</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-400 hover:text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-black/95 backdrop-blur-xl p-4 animate-fade-in flex flex-col">
          <div className="space-y-2">
            <NavButton 
              icon={<Layout size={18} />} 
              label="Dashboard" 
              active={view === 'dashboard'} 
              onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} 
            />
            <NavButton 
              icon={<Box size={18} />} 
              label="Assets" 
              active={view === 'assets'} 
              number={1}
              onClick={() => { setView('assets'); setIsMobileMenuOpen(false); }} 
            />
            <NavButton 
              icon={<Wand2 size={18} />} 
              label="Studio" 
              active={view === 'studio'} 
              number={2}
              onClick={() => { setView('studio'); setIsMobileMenuOpen(false); }} 
            />
            <NavButton 
              icon={<ImageIcon size={18} />} 
              label="Gallery" 
              active={view === 'gallery'} 
              number={3}
              onClick={() => { setView('gallery'); setIsMobileMenuOpen(false); }} 
            />
          </div>
          
          <div className="mt-auto pb-8 border-t border-zinc-800 pt-6">
              <p className="text-xs text-zinc-500 text-center mb-4">Mockora Studio Mobile v1.0</p>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedMockup && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setSelectedMockup(null)}
        >
          <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMockup(null)}
              className="absolute top-4 right-4 md:top-0 md:-right-12 p-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 transition-colors z-50 border border-zinc-700"
            >
              <X size={24} />
            </button>

            {/* Image Container */}
            <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-lg">
              <img 
                src={selectedMockup.imageUrl} 
                alt="Full size preview" 
                className="max-w-full max-h-[85vh] object-contain shadow-2xl" 
              />
            </div>

            {/* Caption / Actions */}
            <div className="mt-4 bg-zinc-900/90 backdrop-blur border border-zinc-700 px-6 py-3 rounded-full flex items-center gap-4">
               <p className="text-sm text-zinc-300 max-w-[200px] md:max-w-md truncate">
                 {selectedMockup.prompt || "Generated Mockup"}
               </p>
               <div className="h-4 w-px bg-zinc-700"></div>
               <a 
                 href={selectedMockup.imageUrl} 
                 download={`mockup-${selectedMockup.id}.png`}
                 className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-2"
               >
                 <Download size={16} />
                 Download
               </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pt-16 md:pt-0">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 h-16 bg-black/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-8">
           <div className="text-sm text-zinc-400 breadcrumbs">
              <span className="opacity-50">App</span> 
              <span className="mx-2">/</span> 
              <span className="text-white capitalize">{view}</span>
           </div>
           <div className="flex items-center gap-4">
              <Button size="sm" variant="ghost" icon={<Sparkles size={16}/>}>Credits: ∞</Button>
           </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 md:p-12">
           
           {/* --- DASHBOARD VIEW --- */}
           {view === 'dashboard' && (
              <div className="animate-fade-in space-y-8">
                 <div className="text-center py-12">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-white">
                       Create Realistic <br/>
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">Merchandise Mockups</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10">
                       Upload your logos and products, and let our AI composite them perfectly with realistic lighting, shadows, and warping.
                    </p>
                    <div className="flex gap-4 justify-center">
                       <Button size="lg" onClick={() => setView('assets')} icon={<ArrowRight size={20} />}>
                          Start Creating
                       </Button>
                       <Button size="lg" variant="secondary" onClick={handleExportProject} icon={<Save size={20} />}>
                          Export Project
                       </Button>
                       <Button size="lg" variant="secondary" onClick={handleImportProject} icon={<Upload size={20} />}>
                          Import Project
                       </Button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                       { icon: <Box className="text-indigo-400" />, title: 'Asset Management', desc: 'Organize logos and product bases.' },
                       { icon: <Wand2 className="text-purple-400" />, title: 'AI Compositing', desc: 'Smart blending and surface mapping.' },
                       { icon: <Download className="text-pink-400" />, title: 'High-Res Export', desc: 'Production-ready visuals.' }
                    ].map((feat, i) => (
                       <div key={i} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/30 transition-colors">
                          <div className="mb-4 p-3 bg-zinc-900 w-fit rounded-lg">{feat.icon}</div>
                          <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                          <p className="text-zinc-500">{feat.desc}</p>
                       </div>
                    ))}
                 </div>
                 
                 <footer className="mt-20 pt-8 border-t border-zinc-900 text-center">
                    <p className="text-white text-sm max-w-2xl mx-auto leading-relaxed">
                       "By using this app, you confirm that you have the necessary rights to any content that you upload. Do not generate content that infringes on others’ intellectual property or privacy rights. Your use of this generative AI service is subject to our Prohibited Use Policy.
                       <br className="hidden md:block" />
                       Please note that uploads from Google Workspace may be used to develop and improve Google products and services in accordance with our terms."
                    </p>
                 </footer>
              </div>
           )}

           {/* --- ASSETS VIEW --- */}
           {view === 'assets' && (
              <div className="animate-fade-in">
                <WorkflowStepper currentView="assets" onViewChange={setView} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Products Section */}
                  <AssetSection 
                    title="Products" 
                    icon={<Box size={20} />}
                    type="product"
                    assets={assets.filter(a => a.type === 'product')}
                    onAdd={(a) => setAssets(prev => [...prev, a])}
                    onRemove={(id) => setAssets(prev => prev.filter(a => a.id !== id))}
                    validateApiKey={validateApiKey}
                    onApiError={handleApiError}
                  />

                  {/* Logos Section */}
                  <AssetSection 
                    title="Logos & Graphics" 
                    icon={<Layers size={20} />}
                    type="logo"
                    assets={assets.filter(a => a.type === 'logo')}
                    onAdd={(a) => setAssets(prev => [...prev, a])}
                    onRemove={(id) => setAssets(prev => prev.filter(a => a.id !== id))}
                    validateApiKey={validateApiKey}
                    onApiError={handleApiError}
                  />
                </div>

                <div className="mt-8 flex justify-end">
                   <Button onClick={() => setView('studio')} disabled={assets.length < 2} icon={<ArrowRight size={16} />}>
                      Continue to Studio
                   </Button>
                </div>
              </div>
           )}

           {/* --- STUDIO VIEW --- */}
           {view === 'studio' && (
             <div className="animate-fade-in h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">
                {/* Left Controls (Bottom on Mobile) */}
                <div className="w-full lg:w-80 flex flex-col gap-6 glass-panel p-6 rounded-2xl overflow-y-auto flex-1 lg:flex-none">
                   <div>
                      <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">1. Select Product</h3>
                      <div className="grid grid-cols-3 gap-2">
                         {assets.filter(a => a.type === 'product').map(a => (
                            <div 
                               key={a.id} 
                               onClick={() => setSelectedProductId(selectedProductId === a.id ? null : a.id)}
                               className={`aspect-square rounded-lg border-2 cursor-pointer p-1 transition-all ${selectedProductId === a.id ? 'border-indigo-500 bg-indigo-500/20' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900'}`}
                            >
                               <img src={a.data} className="w-full h-full object-contain" alt={a.name} />
                            </div>
                         ))}
                         {assets.filter(a => a.type === 'product').length === 0 && <p className="text-xs text-zinc-400 col-span-3">No products uploaded</p>}
                      </div>
                      
                      {/* Product Color Picker */}
                      <div className="mt-4 flex flex-col gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-700/50">
                          <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-zinc-300">Base Color / Gradient</p>
                              <div className="flex items-center gap-2">
                                 <label className="text-xs text-zinc-400 flex items-center gap-1 cursor-pointer">
                                     <input type="checkbox" checked={productGradientEnabled} onChange={(e) => setProductGradientEnabled(e.target.checked)} className="rounded bg-zinc-800 border-zinc-700 w-3 h-3 accent-indigo-500" />
                                     Gradient
                                 </label>
                              </div>
                          </div>
                          
                          {!productGradientEnabled ? (
                              <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-zinc-500">Solid Color</span>
                                  <div className="flex items-center gap-2">
                                      <Pipette size={14} className="text-zinc-500" />
                                      <input 
                                         type="color" 
                                         value={productColor} 
                                         onChange={(e) => setProductColor(e.target.value)} 
                                         className="w-[24px] h-[24px] rounded cursor-pointer border-0 p-0"
                                         title="Change Product Base Color"
                                      />
                                  </div>
                              </div>
                          ) : (
                              <div className="space-y-2">
                                  <div className="flex gap-2">
                                      <select value={productGradientType} onChange={(e) => setProductGradientType(e.target.value as 'linear'|'radial')} className="flex-1 bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 rounded-lg px-2 h-[28px] focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                          <option value="linear">Linear</option>
                                          <option value="radial">Radial</option>
                                      </select>
                                      {productGradientType === 'linear' && (
                                          <input type="number" min="0" max="360" value={productGradientAngle} onChange={(e) => setProductGradientAngle(Number(e.target.value))} className="w-16 bg-zinc-800 text-xs text-zinc-300 border border-zinc-700 rounded-lg px-2 h-[28px] focus:outline-none focus:ring-1 focus:ring-indigo-500" title="Angle (deg)" />
                                      )}
                                  </div>
                                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/50">
                                      <span className="text-[10px] text-zinc-500">Colors</span>
                                      <div className="flex items-center gap-2">
                                          <input 
                                             type="color" 
                                             value={productGradientColor1} 
                                             onChange={(e) => setProductGradientColor1(e.target.value)} 
                                             className="w-[24px] h-[24px] rounded cursor-pointer border-0 p-0"
                                          />
                                          <input 
                                             type="color" 
                                             value={productGradientColor2} 
                                             onChange={(e) => setProductGradientColor2(e.target.value)} 
                                             className="w-[24px] h-[24px] rounded cursor-pointer border-0 p-0"
                                          />
                                      </div>
                                  </div>
                              </div>
                          )}
                      </div>
                   </div>

                   <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">2. Add Logos</h3>
                        {placedLogos.length > 0 && (
                            <span className="text-xs text-indigo-400">{placedLogos.length} on canvas</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mb-2">Click to add. Drag on canvas to move. Scroll to resize.</p>
                      <div className="grid grid-cols-3 gap-2">
                         {assets.filter(a => a.type === 'logo').map(a => (
                            <div 
                               key={a.id} 
                               onClick={() => addLogoToCanvas(a.id)}
                               className={`relative aspect-square rounded-lg border-2 cursor-pointer p-1 transition-all border-zinc-700 hover:border-zinc-500 bg-zinc-900`}
                            >
                               <img src={a.data} className="w-full h-full object-contain" alt={a.name} />
                               {/* Count badge */}
                               {placedLogos.filter(l => l.assetId === a.id).length > 0 && (
                                   <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-zinc-900">
                                       {placedLogos.filter(l => l.assetId === a.id).length}
                                   </div>
                               )}
                            </div>
                         ))}
                         <div 
                             onClick={() => {
                               const newLayer: PlacedLayer = {
                                 uid: Math.random().toString(36).substr(2, 9),
                                 type: 'text',
                                 text: 'New Text',
                                 fontFamily: 'Inter',
                                 fill: '#ffffff',
                                 textAlign: 'center',
                                 curve: 0,
                                 x: 50,
                                 y: 50,
                                 scale: 1,
                                 rotation: 0,
                                 opacity: 1,
                                 blendMode: 'normal'
                               };
                               pushHistory([...placedLogos, newLayer]);
                               setSelectedLayerIds([newLayer.uid]);
                             }}
                             className={`relative aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer p-1 transition-all border-zinc-700 hover:border-zinc-500 bg-zinc-900 text-zinc-400 hover:text-white`}
                          >
                             <Type size={24} className="mb-1" />
                             <span className="text-[10px] font-medium">Add Text</span>
                          </div>
                      </div>
                      {assets.filter(a => a.type === 'logo').length === 0 && <p className="text-xs text-zinc-400 mt-2">No logos uploaded</p>}
                   </div>

                   {/* Layer Properties */}
                   {selectedLayerIds.length > 0 && (
                      <div className="bg-zinc-900/50 p-4 border border-zinc-700/50 rounded-xl relative">
                         <div className="flex items-center justify-between mb-3">
                             <h4 className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-1"><Settings2 size={12}/> {selectedLayerIds.length > 1 ? 'Multiple Selected' : 'Properties'}</h4>
                             <button onClick={() => setSelectedLayerIds([])} className="text-zinc-500 hover:text-white"><X size={14}/></button>
                         </div>
                         {(() => {
                            // If multiple selected, we show average or just the first layer's props, but applying edits affects all selected.
                            const layer = placedLogos.find(l => l.uid === selectedLayerIds[0]);
                            if (!layer) return null;
                            const allLocked = selectedLayerIds.every(id => placedLogos.find(l => l.uid === id)?.isLocked);
                            const someLocked = selectedLayerIds.some(id => placedLogos.find(l => l.uid === id)?.isLocked);

                            return (
                               <div className="space-y-4">
                                  {someLocked && (
                                     <div className="text-xs text-red-400 bg-red-400/10 p-2 rounded flex items-center gap-2">
                                        <Lock size={12} /> {selectedLayerIds.length > 1 ? 'Some layers are locked' : 'Layer is locked'}
                                     </div>
                                  )}
                                  {selectedLayerIds.length > 1 ? (
                                     <>
                                        <div>
                                           <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Scale (Rel)</span><span>{Math.round(groupTransform.scale * 100)}%</span></div>
                                           <input type="range" min="0.1" max="3" step="0.05" value={groupTransform.scale} disabled={allLocked} onChange={(e) => applyGroupTransform({ ...groupTransform, scale: parseFloat(e.target.value) })} onMouseUp={commitGroupTransform} onTouchEnd={commitGroupTransform} className="w-full accent-indigo-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50" />
                                        </div>
                                        <div>
                                           <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Rotation (Rel)</span><span>{Math.round(groupTransform.rotation)}°</span></div>
                                           <input type="range" min="-180" max="180" step="1" value={groupTransform.rotation} disabled={allLocked} onChange={(e) => applyGroupTransform({ ...groupTransform, rotation: parseFloat(e.target.value) })} onMouseUp={commitGroupTransform} onTouchEnd={commitGroupTransform} className="w-full accent-indigo-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50" />
                                        </div>
                                        <div>
                                           <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Opacity (Rel)</span><span>{Math.round(groupTransform.opacity * 100)}%</span></div>
                                           <input type="range" min="-1" max="1" step="0.05" value={groupTransform.opacity} disabled={allLocked} onChange={(e) => applyGroupTransform({ ...groupTransform, opacity: parseFloat(e.target.value) })} onMouseUp={commitGroupTransform} onTouchEnd={commitGroupTransform} className="w-full accent-indigo-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50" />
                                        </div>
                                     </>
                                  ) : (
                                     <>
                                        <div>
                                           <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Scale</span><span>{Math.round(layer.scale * 100)}%</span></div>
                                           <input type="range" min="0.1" max="4" step="0.05" value={layer.scale} disabled={allLocked} onChange={(e) => updateSelectedLayerProperties({ scale: parseFloat(e.target.value) })} className="w-full accent-indigo-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50" />
                                        </div>
                                        <div>
                                           <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Rotation</span><span>{Math.round(layer.rotation)}°</span></div>
                                           <input type="range" min="-180" max="180" step="1" value={layer.rotation} disabled={allLocked} onChange={(e) => updateSelectedLayerProperties({ rotation: parseFloat(e.target.value) })} className="w-full accent-indigo-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50" />
                                        </div>
                                        <div>
                                           <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Opacity</span><span>{Math.round((layer.opacity ?? 1) * 100)}%</span></div>
                                           <input type="range" min="0" max="1" step="0.05" value={layer.opacity ?? 1} disabled={allLocked} onChange={(e) => updateSelectedLayerProperties({ opacity: parseFloat(e.target.value) })} className="w-full accent-indigo-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50" />
                                        </div>
                                        <div>
                                           <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Blend Mode</span></div>
                                           <select 
                                              value={layer.blendMode || 'normal'}
                                              disabled={allLocked}
                                              onChange={(e) => updateSelectedLayerProperties({ blendMode: e.target.value as any })}
                                              className="w-full bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                                           >
                                              <option value="normal">Normal</option>
                                              <option value="multiply">Multiply</option>
                                              <option value="screen">Screen</option>
                                              <option value="overlay">Overlay</option>
                                              <option value="darken">Darken</option>
                                              <option value="lighten">Lighten</option>
                                              <option value="color-dodge">Color Dodge</option>
                                              <option value="color-burn">Color Burn</option>
                                              <option value="hard-light">Hard Light</option>
                                              <option value="soft-light">Soft Light</option>
                                              <option value="difference">Difference</option>
                                              <option value="exclusion">Exclusion</option>
                                              <option value="hue">Hue</option>
                                              <option value="saturation">Saturation</option>
                                              <option value="color">Color</option>
                                              <option value="luminosity">Luminosity</option>
                                           </select>
                                        </div>
                                        {layer.type === 'text' && (
                                           <div className="pt-3 border-t border-zinc-800 space-y-4 mt-4">
                                              <div>
                                                 <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Text Content</span></div>
                                                 <input type="text" value={layer.text || ''} disabled={allLocked} onChange={(e) => updateSelectedLayerProperties({ text: e.target.value })} className="w-full bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50" />
                                              </div>
                                              
                                              <div className="flex gap-2">
                                                 <div className="flex-[1]">
                                                    <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Color</span></div>
                                                       <input type="color" value={layer.fill || '#ffffff'} disabled={allLocked} onChange={(e) => updateSelectedLayerProperties({ fill: e.target.value })} className="w-full h-[28px] rounded cursor-pointer disabled:opacity-50 p-0" />
                                                 </div>
                                                 <div className="flex-[2] relative">
                                                    <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Font</span></div>
                                                    <div className="flex gap-1">
                                                       <select value={layer.fontFamily || 'Inter'} disabled={allLocked} onChange={(e) => updateSelectedLayerProperties({ fontFamily: e.target.value })} className="flex-1 w-full h-[28px] bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50">
                                                          <option value="Inter">Inter</option>
                                                          <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                                                          <option value="'Playfair Display', serif">Playfair Display</option>
                                                          <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
                                                          {customFonts.map(cf => (
                                                              <option key={cf.name} value={`'${cf.name}'`}>{cf.name}</option>
                                                          ))}
                                                       </select>
                                                       <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg h-[28px] w-[28px] flex items-center justify-center text-zinc-400 hover:text-white transition-colors" title="Import Font (.ttf, .otf, .woff)">
                                                           <Upload size={14} />
                                                           <input type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={(e) => {
                                                              const file = e.target.files?.[0];
                                                              if (file) {
                                                                  const url = URL.createObjectURL(file);
                                                                  const name = file.name.split('.')[0];
                                                                  setCustomFonts(prev => [...prev, { name, url }]);
                                                                  updateSelectedLayerProperties({ fontFamily: `'${name}'` });
                                                              }
                                                              e.target.value = '';
                                                           }} />
                                                       </label>
                                                    </div>
                                                 </div>
                                              </div>

                                              {/* Stroke & Stroke Width */}
                                              <div className="flex gap-2">
                                                 <div className="flex-[1]">
                                                    <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Stroke</span></div>
                                                    <div className="flex gap-1">
                                                       <input type="color" value={layer.strokeColor || '#000000'} disabled={allLocked} onChange={(e) => updateSelectedLayerProperties({ strokeColor: e.target.value })} className="w-full h-[28px] rounded cursor-pointer disabled:opacity-50 p-0" />
                                                    </div>
                                                 </div>
                                                 <div className="flex-[2]">
                                                    <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Stroke Width ({layer.strokeWidth || 0}px)</span></div>
                                                    <input type="range" min="0" max="20" step="1" value={layer.strokeWidth || 0} disabled={allLocked} onChange={(e) => updateSelectedLayerProperties({ strokeWidth: parseFloat(e.target.value) })} className="w-full accent-indigo-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 mt-2" />
                                                 </div>
                                              </div>

                                              {/* Shadow */}
                                              <div className="space-y-2">
                                                 <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Shadow</span></div>
                                                 <div className="flex gap-2 items-center">
                                                    <input type="color" value={layer.shadowColor || '#ffffff'} disabled={allLocked} onChange={(e) => updateSelectedLayerProperties({ shadowColor: e.target.value })} className="w-[28px] h-[28px] rounded cursor-pointer disabled:opacity-50 p-0 flex-shrink-0" />
                                                    <div className="flex-1 text-[10px] text-zinc-500 flex items-center gap-1">
                                                       B:<input type="number" min="0" max="50" step="1" value={layer.shadowBlur || 0} onChange={(e) => updateSelectedLayerProperties({ shadowBlur: parseFloat(e.target.value) || 0 })} disabled={allLocked} className="w-10 bg-zinc-800 border border-zinc-700 p-1 rounded" />
                                                       X:<input type="number" min="-50" max="50" step="1" value={layer.shadowOffsetX || 0} onChange={(e) => updateSelectedLayerProperties({ shadowOffsetX: parseFloat(e.target.value) || 0 })} disabled={allLocked} className="w-10 bg-zinc-800 border border-zinc-700 p-1 rounded" />
                                                       Y:<input type="number" min="-50" max="50" step="1" value={layer.shadowOffsetY || 0} onChange={(e) => updateSelectedLayerProperties({ shadowOffsetY: parseFloat(e.target.value) || 0 })} disabled={allLocked} className="w-10 bg-zinc-800 border border-zinc-700 p-1 rounded" />
                                                    </div>
                                                 </div>
                                                 <div className="flex items-center gap-2 mt-1">
                                                     <button onClick={() => updateSelectedLayerProperties({ shadowColor: undefined, shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0 })} className="text-xs text-red-400 hover:text-red-300">Remove Shadow</button>
                                                 </div>
                                              </div>

                                              {/* Background / Shape */}
                                              <div className="space-y-2">
                                                 <div className="flex justify-between text-xs mb-1"><span className="text-zinc-400">Background</span></div>
                                                 <div className="flex gap-2 items-center">
                                                    <input type="color" value={layer.textBgColor || '#000000'} disabled={allLocked} onChange={(e) => updateSelectedLayerProperties({ textBgColor: e.target.value })} className="w-[28px] h-[28px] rounded cursor-pointer disabled:opacity-50 p-0 flex-shrink-0" />
                                                    <div className="flex-1 text-[10px] text-zinc-500 flex items-center gap-1">
                                                       Pad:<input type="number" min="0" max="100" step="1" value={layer.textBgPadding || 0} onChange={(e) => updateSelectedLayerProperties({ textBgPadding: parseFloat(e.target.value) || 0 })} disabled={allLocked} className="w-10 bg-zinc-800 border border-zinc-700 p-1 rounded" />
                                                       Rad:<input type="number" min="0" max="100" step="1" value={layer.textBgRadius || 0} onChange={(e) => updateSelectedLayerProperties({ textBgRadius: parseFloat(e.target.value) || 0 })} disabled={allLocked} className="w-10 bg-zinc-800 border border-zinc-700 p-1 rounded" />
                                                    </div>
                                                 </div>
                                                 <div className="flex items-center gap-2 mt-1">
                                                     <button onClick={() => updateSelectedLayerProperties({ textBgColor: undefined, textBgPadding: 0, textBgRadius: 0 })} className="text-xs text-red-400 hover:text-red-300">Remove Bg</button>
                                                 </div>
                                              </div>
                                           </div>
                                        )}
                                     </>
                                  )}
                                  <div className="pt-2 border-t border-zinc-800 flex gap-2">
                                     <button 
                                        onClick={(e) => {
                                            const keyboardEvent = new KeyboardEvent('keydown', { key: 'd', ctrlKey: true });
                                            window.dispatchEvent(keyboardEvent);
                                        }}
                                        className="flex-1 py-1.5 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                                     >
                                        <Repeat size={14} /> Duplicate
                                     </button>
                                     <button 
                                        onClick={(e) => {
                                            const keyboardEvent = new KeyboardEvent('keydown', { key: 'Delete' });
                                            window.dispatchEvent(keyboardEvent);
                                        }}
                                        className="flex-1 py-1.5 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                     >
                                        <Trash2 size={14} /> Delete
                                     </button>
                                  </div>
                                  <div className="pt-2 border-t border-zinc-800">
                                     <button 
                                        onClick={() => updateSelectedLayerProperties({ isLocked: !allLocked })}
                                        className="w-full py-1.5 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                                     >
                                        {allLocked ? <Unlock size={14} /> : <Lock size={14} />}
                                        {allLocked ? 'Unlock Selected' : 'Lock Selected'}
                                     </button>
                                  </div>
                                  {selectedLayerIds.length > 1 && (!layer.groupId || !selectedLayerIds.every(id => placedLogos.find(x => x.uid === id)?.groupId === layer.groupId)) && (
                                     <div className="pt-2 border-t border-zinc-800">
                                        <button 
                                           onClick={() => {
                                              const newGroupId = Math.random().toString(36).substr(2, 9);
                                              updateSelectedLayerProperties({ groupId: newGroupId });
                                           }}
                                           className="w-full py-1.5 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors"
                                        >
                                           <GripVertical size={14} /> Group Selected
                                        </button>
                                     </div>
                                  )}
                                  {selectedLayerIds.length > 0 && selectedLayerIds.every(id => {
                                      const l = placedLogos.find(x => x.uid === id);
                                      return l?.groupId === layer.groupId;
                                  }) && layer.groupId && (
                                     <div className="pt-2 border-t border-zinc-800">
                                        <button 
                                           onClick={() => {
                                              const newLogos = (layersHistory[historyIndex] || []).map(l => {
                                                  if (l.groupId === layer.groupId) {
                                                      return { ...l, groupId: undefined };
                                                  }
                                                  return l;
                                              });
                                              pushHistory(newLogos);
                                           }}
                                           className="w-full py-1.5 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors"
                                        >
                                           <Unlock size={14} /> Ungroup
                                        </button>
                                     </div>
                                  )}
                                  <div className="pt-2 border-t border-zinc-800">
                                      <button 
                                          onClick={() => {
                                              const currentLogos = layersHistory[historyIndex] || [];
                                              const selectedLogos = currentLogos.filter(l => selectedLayerIds.includes(l.uid));
                                              const oldToNewGroupIds = new Map<string, string>();
                                              const newLogos = selectedLogos.map(l => {
                                                  let newGroupId = undefined;
                                                  if (l.groupId) {
                                                      if (!oldToNewGroupIds.has(l.groupId)) {
                                                          oldToNewGroupIds.set(l.groupId, Math.random().toString(36).substr(2, 9));
                                                      }
                                                      newGroupId = oldToNewGroupIds.get(l.groupId);
                                                  }
                                                  return {
                                                      ...l,
                                                      uid: Math.random().toString(36).substr(2, 9),
                                                      groupId: newGroupId,
                                                      x: Math.min(100, l.x + 5),
                                                      y: Math.min(100, l.y + 5),
                                                  };
                                              });
                                              pushHistory([...currentLogos, ...newLogos]);
                                              setSelectedLayerIds(newLogos.map(l => l.uid));
                                          }}
                                          className="w-full py-1.5 flex items-center justify-center gap-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                                      >
                                          <Copy size={14} /> Duplicate Selected
                                      </button>
                                  </div>
                               </div>
                            )
                         })()}
                      </div>
                   )}

                   {/* Layers List */}
                   {placedLogos.length > 0 && (
                      <div>
                         <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">3. Layers</h3>
                         <div className="space-y-1">
                            {[...placedLogos].reverse().map((layer, indexRev) => {
                               const actualIndex = placedLogos.length - 1 - indexRev;
                               const lgAsset = layer.type === 'text' ? null : assets.find(a => a.id === layer.assetId);
                               const isSelected = selectedLayerIds.includes(layer.uid);
                               return (
                                  <div 
                                     key={layer.uid}
                                     draggable
                                     onDragStart={(e) => {
                                        setDraggedLayerIdx(actualIndex);
                                        e.dataTransfer.effectAllowed = 'move';
                                        // Slight delay to prevent the dragged element from snapping back immediately on some browsers
                                     }}
                                     onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                                     onDrop={(e) => handleDropLayer(e, actualIndex)}
                                     onClick={(e) => {
                                         if (e.shiftKey) {
                                             if (isSelected) setSelectedLayerIds(prev => prev.filter(id => id !== layer.uid));
                                             else setSelectedLayerIds(prev => [...prev, layer.uid]);
                                         } else {
                                             // If grouped, select the whole group
                                             if (layer.groupId) {
                                                 const groupLayers = placedLogos.filter(l => l.groupId === layer.groupId).map(l => l.uid);
                                                 setSelectedLayerIds(groupLayers);
                                             } else {
                                                 setSelectedLayerIds([layer.uid]);
                                             }
                                         }
                                     }}
                                     className={`flex items-center justify-between p-2 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'}`}
                                  >
                                     <div className="flex items-center gap-3">
                                        <div className="cursor-grab text-zinc-500 hover:text-zinc-300 active:cursor-grabbing"><GripVertical size={16} /></div>
                                        <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center p-1">
                                           {layer.type === 'text' ? <Type size={16} className="text-zinc-400" /> : (lgAsset && <img src={lgAsset.data} className="max-w-full max-h-full object-contain" alt="" />)}
                                        </div>
                                        <span className="text-sm font-medium text-zinc-300 max-w-[100px] truncate">{layer.type === 'text' ? `Text: ${layer.text}` : lgAsset?.name || 'Logo'}</span>
                                     </div>
                                     <div className="flex items-center gap-2">
                                        {layer.isLocked && <Lock size={12} className="text-red-400" />}
                                     </div>
                                  </div>
                               );
                            })}
                         </div>
                      </div>
                   )}

                   {templates.length > 0 && (
                      <div>
                         <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Saved Templates</h3>
                         <div className="grid grid-cols-2 gap-2">
                            {templates.map(t => (
                               <div key={t.id} onClick={() => {
                                  pushHistory(t.layers);
                                  if (t.productId) setSelectedProductId(t.productId);
                                  setSelectedLayerIds([]);
                               }} className="rounded-lg border-2 cursor-pointer p-2 transition-all border-zinc-700 hover:border-indigo-500 bg-zinc-900 group flex items-center justify-between text-zinc-300 hover:text-white">
                                 <span className="truncate text-sm">{t.name}</span> 
                                 <FileDown size={14} className="text-zinc-500 group-hover:text-indigo-400 opacity-50 group-hover:opacity-100 flex-shrink-0"/>
                               </div>
                            ))}
                         </div>
                      </div>
                   )}

                   <div>
                      <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">4. Instructions & Environment</h3>
                      <div className="space-y-3">
                         <textarea 
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-20"
                            placeholder="AI Instructions e.g. Embed the logos naturally into the fabric texture."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                         />
                         <input 
                            type="text"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="Background e.g. on a wooden table, worn by model outside..."
                            value={bgPrompt}
                            onChange={(e) => setBgPrompt(e.target.value)}
                         />
                      </div>
                   </div>

                   <Button 
                      onClick={handleGenerate} 
                      isLoading={loading.isGenerating} 
                      disabled={!selectedProductId || placedLogos.length === 0} 
                      size="lg" 
                      className="mt-auto"
                      icon={<Wand2 size={18} />}
                   >
                      Generate Mockup
                   </Button>
                </div>

                {/* Right Preview - Canvas (Top on Mobile) */}
                <div className="h-[45vh] lg:h-auto lg:flex-1 glass-panel rounded-2xl flex items-center justify-center bg-zinc-900 relative overflow-hidden select-none flex-shrink-0">
                   {/* Canvas Toolbar */}
                   <div className="absolute top-4 left-4 right-4 z-40 flex justify-between items-start pointer-events-none">
                       <div className="flex gap-2 pointer-events-auto">
                           <button onClick={handleUndo} disabled={historyIndex === 0} className={`p-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors shadow-lg ${historyIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'text-white'}`} title="Undo">
                               <Undo size={16} />
                           </button>
                           <button onClick={handleRedo} disabled={historyIndex === layersHistory.length - 1} className={`p-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors shadow-lg ${historyIndex === layersHistory.length - 1 ? 'opacity-50 cursor-not-allowed' : 'text-white'}`} title="Redo">
                               <Redo size={16} />
                           </button>
                           <div className="w-px bg-zinc-700 mx-1"></div>
                           <button onClick={() => { if(confirm('Clear all layers?')) { pushHistory([]); setSelectedLayerIds([]); } }} disabled={placedLogos.length === 0} className={`p-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-red-500/20 text-red-500 transition-colors shadow-lg ${placedLogos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} title="Clear Canvas">
                               <Trash2 size={16} />
                           </button>
                           <div className="w-px bg-zinc-700 mx-1"></div>
                           <button onClick={() => { 
                               const name = prompt('Enter a name for this template:');
                               if(name) {
                                   setTemplates(prev => [...prev, {
                                       id: Math.random().toString(36).substr(2, 9),
                                       name,
                                       layers: placedLogos,
                                       productId: selectedProductId || undefined
                                   }]);
                               }
                           }} disabled={placedLogos.length === 0} className={`p-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-indigo-500/20 text-indigo-400 transition-colors shadow-lg flex items-center gap-2 text-sm font-semibold ${placedLogos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} title="Save as Template">
                               <Save size={16} /> <span className="hidden sm:inline">Save</span>
                           </button>
                       </div>
                       
                       <div className="flex gap-2 pointer-events-auto ml-auto">
                           {selectedLayerIds.length > 0 && (
                           <>
                           <div className="flex rounded-lg overflow-hidden border border-zinc-700 shadow-lg bg-zinc-800 mr-2">
                               <button onClick={() => alignSelected('top')} className="p-2 hover:bg-zinc-700 text-zinc-300 hover:text-white border-r border-zinc-700 transition-colors" title="Align Top"><AlignStartVertical size={16} /></button>
                               <button onClick={() => alignSelected('center-y')} className="p-2 hover:bg-zinc-700 text-zinc-300 hover:text-white border-r border-zinc-700 transition-colors" title="Align Middle Vertically"><AlignCenterVertical size={16} /></button>
                               <button onClick={() => alignSelected('bottom')} className="p-2 hover:bg-zinc-700 text-zinc-300 hover:text-white border-r border-zinc-700 transition-colors" title="Align Bottom"><AlignEndVertical size={16} /></button>
                               <button onClick={() => alignSelected('left')} className="p-2 hover:bg-zinc-700 text-zinc-300 hover:text-white border-r border-zinc-700 transition-colors" title="Align Left"><AlignLeft size={16} /></button>
                               <button onClick={() => alignSelected('center-x')} className="p-2 hover:bg-zinc-700 text-zinc-300 hover:text-white border-r border-zinc-700 transition-colors" title="Align Center Horizontally"><AlignCenterHorizontal size={16} /></button>
                               <button onClick={() => alignSelected('right')} className="p-2 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors" title="Align Right"><AlignRight size={16} /></button>
                           </div>
                           <div className="flex rounded-lg overflow-hidden border border-zinc-700 shadow-lg bg-zinc-800 mr-2">
                              <button onClick={() => changeLayerOrder('front')} className="p-2 hover:bg-zinc-700 text-zinc-300 hover:text-white border-r border-zinc-700 transition-colors" title="Bring to Front"><ChevronsDown size={16} /></button>
                              <button onClick={() => changeLayerOrder('forward')} className="p-2 hover:bg-zinc-700 text-zinc-300 hover:text-white border-r border-zinc-700 transition-colors" title="Bring Forward"><ChevronDown size={16} /></button>
                              <button onClick={() => changeLayerOrder('backward')} className="p-2 hover:bg-zinc-700 text-zinc-300 hover:text-white border-r border-zinc-700 transition-colors" title="Send Backward"><ChevronUp size={16} /></button>
                              <button onClick={() => changeLayerOrder('back')} className="p-2 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors" title="Send to Back"><ChevronsUp size={16} /></button>
                           </div>
                           </>
                           )}

                           <button onClick={async () => {
                               const printArea = document.getElementById('print-area');
                               if (!printArea) return;
                               try {
                                   setLoading({ isGenerating: true, message: 'Exporting transparent PNG...' });
                                   // briefly hide export-hide elements using a class
                                   const hides = printArea.querySelectorAll('.export-hide');
                                   hides.forEach(el => (el as HTMLElement).style.display = 'none');
                                   
                                   const dataUrl = await toPng(printArea, { cacheBust: true, pixelRatio: 2 });
                                   
                                   hides.forEach(el => (el as HTMLElement).style.display = '');
                                   
                                   const link = document.createElement('a');
                                   link.download = `print-export-${Date.now()}.png`;
                                   link.href = dataUrl;
                                   link.click();
                               } catch (err) {
                                   console.error('Export failed', err);
                                   alert('Export failed. Check console.');
                               } finally {
                                   setLoading({ isGenerating: false, message: '' });
                               }
                           }} disabled={placedLogos.length === 0} className={`p-2 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-indigo-500/20 text-indigo-400 transition-colors shadow-lg flex items-center gap-2 text-sm font-semibold ${placedLogos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} title="Export Print File (Transparent PNG)">
                               <Download size={16} /> <span className="hidden sm:inline">Export PNG</span>
                           </button>
                       </div>
                   </div>

                   {loading.isGenerating && (
                      <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                         <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                         <p className="text-indigo-400 font-mono animate-pulse">{loading.message}</p>
                      </div>
                   )}
                   
                   {selectedProductId ? (
                      <div 
                         ref={canvasRef}
                         className="relative w-full h-full max-h-[600px] p-4"
                      >
                         {/* Product Base and design container combined for export if needed, 
                             but we will export only the overlay part. Wait, they need the design area. 
                             Usually a print export is just the logos but bounded safely. 
                             We'll wrap the overlays in their own ref. */}
                         <div className="absolute inset-4 rounded-xl overflow-hidden" style={{ 
                             background: productGradientEnabled 
                                 ? (productGradientType === 'linear' ? `linear-gradient(${productGradientAngle}deg, ${productGradientColor1}, ${productGradientColor2})` : `radial-gradient(circle, ${productGradientColor1}, ${productGradientColor2})`) 
                                 : (productColor === '#ffffff' ? 'transparent' : productColor) 
                         }}>
                            <img 
                               src={assets.find(a => a.id === selectedProductId)?.data} 
                               className="w-full h-full object-contain pointer-events-none select-none"
                               style={{ mixBlendMode: (productColor === '#ffffff' && !productGradientEnabled) ? 'normal' : 'multiply' }}
                               alt="Preview Base" 
                               draggable={false}
                            />
                         </div>

                         {/* Guides */}
                         {guides?.x !== undefined && (
                             <div className="absolute top-0 bottom-0 border-l-2 border-dashed border-pink-500 z-30 pointer-events-none" style={{ left: `${guides.x}%` }} />
                         )}
                         {guides?.y !== undefined && (
                             <div className="absolute left-0 right-0 border-t-2 border-dashed border-pink-500 z-30 pointer-events-none" style={{ top: `${guides.y}%` }} />
                         )}

                         {/* Overlay Layers */}
                         <div className="absolute inset-4 pointer-events-none" id="print-area">
                            {placedLogos.map((layer) => {
                               const logoAsset = layer.type === 'text' ? null : assets.find(a => a.id === layer.assetId);
                               if (!logoAsset && layer.type !== 'text') return null;
                               
                               const isDraggingThis = draggedItem?.uid === layer.uid;
                               const isSelected = selectedLayerIds.includes(layer.uid);

                               return (
                                  <div
                                     key={layer.uid}
                                     className={`absolute cursor-move group pointer-events-auto ${isDraggingThis ? 'z-50 opacity-60 drop-shadow-2xl scale-105' : 'z-10 transition-transform'} ${isSelected ? 'z-20' : ''}`}
                                     style={{
                                        left: `${layer.x}%`,
                                        top: `${layer.y}%`,
                                        transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                                        width: layer.type === 'text' ? 'auto' : '15%',
                                        aspectRatio: layer.type === 'text' ? 'auto' : '1/1',
                                        opacity: layer.opacity ?? 1,
                                        mixBlendMode: (layer.blendMode as any) || 'normal'
                                     }}
                                     onMouseDown={(e) => handleMouseDown(e, layer)}
                                     onTouchStart={(e) => handleTouchStart(e, layer)}
                                     onWheel={(e) => handleWheel(e, layer.uid)}
                                  >
                                     {/* Selection Border */}
                                     <div className={`absolute -inset-2 border-2 rounded-lg transition-all pointer-events-none export-hide ${isSelected ? (layer.isLocked ? 'border-red-500/50 bg-red-500/5' : 'border-indigo-500 bg-indigo-500/10') : 'border-indigo-500/0 group-hover:border-indigo-500/30'}`}>
                                        {isSelected && !layer.isLocked && (
                                            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full"></div>
                                        )}
                                        {isSelected && !layer.isLocked && (
                                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full"></div>
                                        )}
                                        {isSelected && !layer.isLocked && (
                                            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full"></div>
                                        )}
                                        {isSelected && !layer.isLocked && (
                                            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-indigo-500 rounded-full"></div>
                                        )}
                                     </div>
                                     
                                     {/* Remove Button (Hide if locked) */}
                                     {!layer.isLocked && (
                                       <button 
                                         onClick={(e) => removeLogoFromCanvas(layer.uid, e)}
                                         onTouchEnd={(e) => removeLogoFromCanvas(layer.uid, e)}
                                         className={`absolute -top-6 -right-6 bg-red-500 text-white rounded-full p-1.5 transition-opacity hover:scale-110 shadow-lg z-50 export-hide ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                         title="Remove"
                                       >
                                         <X size={14} />
                                       </button>
                                     )}

                                     {/* Locked Icon Indicator */}
                                     {layer.isLocked && (
                                        <div className="absolute -top-6 -right-6 bg-red-500 text-white rounded-full p-1.5 shadow-lg z-50 export-hide">
                                            <Lock size={14} />
                                        </div>
                                     )}

                                     {layer.type === 'text' ? (
                                        <div 
                                           className="whitespace-nowrap select-none"
                                           style={{ 
                                              fontFamily: layer.fontFamily, 
                                              color: layer.fill, 
                                              fontSize: 'clamp(1rem, 5vw, 4rem)',
                                              textAlign: layer.textAlign || 'center',
                                              transform: layer.curve ? `skewX(${layer.curve / 10}deg)` /* Fallback curve styling */ : 'none',
                                              WebkitTextStroke: layer.strokeWidth ? `${layer.strokeWidth}px ${layer.strokeColor || '#000000'}` : undefined,
                                              backgroundColor: layer.textBgColor,
                                              padding: layer.textBgPadding !== undefined ? `${layer.textBgPadding}px` : (layer.textBgColor ? '8px 16px' : '0px'),
                                              borderRadius: layer.textBgRadius !== undefined ? `${layer.textBgRadius}px` : '0px',
                                              textShadow: layer.shadowColor ? `${layer.shadowOffsetX || 0}px ${layer.shadowOffsetY || 0}px ${layer.shadowBlur || 0}px ${layer.shadowColor}` : undefined
                                           }}
                                        >
                                           {layer.text || 'Add Text'}
                                        </div>
                                     ) : (
                                        <img 
                                           src={logoAsset?.data} 
                                           className="w-full h-full object-contain drop-shadow-lg pointer-events-none"
                                           draggable={false}
                                           alt="layer"
                                        />
                                     )}
                                  </div>
                               );
                            })}
                         </div>
                      </div>
                   ) : (
                      <div className="text-center text-zinc-600">
                         <Shirt size={64} className="mx-auto mb-4 opacity-20" />
                         <p>Select a product to start designing</p>
                      </div>
                   )}
                </div>
             </div>
           )}

           {/* --- GALLERY VIEW --- */}
           {view === 'gallery' && (
              <div className="animate-fade-in">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Generated Mockups</h2>
                    <Button variant="outline" onClick={() => setView('studio')} icon={<Plus size={16}/>}>New Mockup</Button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generatedMockups.map(mockup => (
                       <div key={mockup.id} className="group glass-panel rounded-xl overflow-hidden">
                          <div className="aspect-square bg-zinc-900 relative overflow-hidden">
                             <img src={mockup.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Mockup" />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="secondary" 
                                  icon={<Maximize size={16}/>}
                                  onClick={() => setSelectedMockup(mockup)}
                                >
                                  View
                                </Button>
                                <a href={mockup.imageUrl} download={`mockup-${mockup.id}.png`}>
                                  <Button size="sm" variant="primary" icon={<Download size={16}/>}>Save</Button>
                                </a>
                             </div>
                          </div>
                          <div className="p-4">
                             <p className="text-xs text-zinc-500 mb-1">{new Date(mockup.createdAt).toLocaleDateString()}</p>
                             <p className="text-sm text-zinc-300 line-clamp-2">{mockup.prompt || "Auto-generated mockup"}</p>
                             {mockup.layers && mockup.layers.length > 0 && (
                                 <div className="mt-2 flex gap-1">
                                     <span className="text-xs px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">{mockup.layers.length} logos</span>
                                 </div>
                             )}
                          </div>
                       </div>
                    ))}
                    {generatedMockups.length === 0 && (
                       <div className="col-span-full py-20 text-center glass-panel rounded-xl">
                          <ImageIcon size={48} className="mx-auto mb-4 text-zinc-700" />
                          <h3 className="text-lg font-medium text-zinc-300">No mockups yet</h3>
                          <p className="text-zinc-500 mb-6">Create your first design in the Studio</p>
                          <Button onClick={() => setView('studio')}>Go to Studio</Button>
                       </div>
                    )}
                 </div>
              </div>
           )}
        </div>
      </main>
    </div>
  );
}