import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Download, 
  Share2, 
  Layers, 
  Check, 
  AlertCircle, 
  Maximize2, 
  Palette,
  Camera
} from 'lucide-react';
import { SocialPost } from '../types';

interface AIFestiveStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareToFeed: (post: SocialPost) => void;
}

export const AIFestiveStudioModal: React.FC<AIFestiveStudioModalProps> = ({
  isOpen,
  onClose,
  onShareToFeed,
}) => {
  const [prompt, setPrompt] = useState('Traditional Kutchi mirror work Chaniya Choli dancer spinning in synchronized Dodhiya Garba circle at GMDC Ground Ahmedabad, illuminated by thousand golden earthen diyas and festival spotlights');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const PRESET_STYLES = [
    {
      title: 'Kutchi Mirror Work Glamour',
      desc: 'Heavy embroidered Gamthi & mirror reflection',
      prompt: 'A vibrant Gujarati woman in authentic Kutch handmade Chaniya Choli with heavy mirror work, oxidized silver jewelry, spinning at Karnavati Club Ahmedabad garba ground at midnight with bokeh festival lights',
    },
    {
      title: 'Heritage Pol Sheri Garba',
      desc: 'Old Ahmedabad Mandvi Ni Pol vintage acoustic raas',
      prompt: 'Traditional sheri garba dancers in Mandvi ni Pol Old Ahmedabad, carved wooden heritage pol houses, glowing terracotta lamps, live dhol players, cinematic festival lighting',
    },
    {
      title: 'Rabari Royal Kedia Couple',
      desc: 'Dandiya couple in royal velvet & paghdi',
      prompt: 'Traditional Gujarati couple in flared Rabari kedia, colorful dhoti, bandhani paghdi, holding carved wooden dandiyas, smiling under golden fairy lights at Rajpath Club Ahmedabad',
    },
    {
      title: 'Vibrant SG Highway Raas Arena',
      desc: 'Grand 50,000 player synchronized Dodhiya step',
      prompt: 'Aerial panoramic festival view of 50,000 synchronized Garba dancers in concentric circles at GMDC Ground Ahmedabad, colorful festive attire, giant folk stage with laser beams and midnight celebration',
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageSize, // Affordance for 1K, 2K, 4K
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error || data.details || 'Failed to generate image');
      }

      setGeneratedImage(data.imageUrl);
    } catch (err: any) {
      console.error('Image gen failed:', err);
      setErrorMsg(err?.message || 'Error generating image. Please check API quota or try a different prompt.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareToLiveFeed = () => {
    if (!generatedImage) return;

    const newPost: SocialPost = {
      id: 'ai-post-' + Date.now(),
      userName: 'AI Festive Studio User',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      venueName: 'Ahmedabad Navratri Studio (Gemini 3 Pro)',
      image: generatedImage,
      caption: `Created with Gemini 3 Pro Image Preview (${imageSize} Resolution): "${prompt.slice(0, 80)}..." ✨🪔 #NavratriArt #AmdavadGarba #AIStudio`,
      tags: ['#GeminiAI', '#NavratriAhmedabad', '#MirrorWork', '#RaasArt'],
      likes: 1,
      commentsCount: 0,
      timestamp: 'Just now',
      isLive: true,
    };

    onShareToFeed(newPost);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
      onClose();
    }, 1200);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `navratri-amd-${imageSize}-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-amber-300">
              <Camera className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  AI Festive Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  gemini-3-pro-image-preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate high-definition traditional Garba artwork & Chaniya Choli designs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Quick Style Presets */}
          <div>
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5" /> Ahmedabad Navratri Inspiration Styles
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_STYLES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(preset.prompt)}
                  className="p-2.5 rounded-xl text-left bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 transition-all cursor-pointer group"
                >
                  <div className="font-semibold text-xs text-slate-200 group-hover:text-amber-300">
                    {preset.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {preset.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-1.5 block">
              Describe your festive creation prompt:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="e.g. Traditional Gujarati dancer with mirror-work Chaniya Choli and golden dandiyas under festive lights..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
            />
          </div>

          {/* Config Controls: Image Size (MANDATORY REQUIREMENT: 1K, 2K, 4K) & Aspect Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            
            {/* MANDATORY AFFORDANCE: Image Size Selection (1K, 2K, 4K) */}
            <div>
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1 mb-2">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                Image Resolution (User Affordance):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setImageSize(size)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center border ${
                      imageSize === size
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <span>{size}</span>
                    <span className="text-[9px] opacity-80 font-normal">
                      {size === '1K' ? '1024px' : size === '2K' ? '2048px' : '4096px Ultra'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1 mb-2">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Aspect Ratio:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                      aspectRatio === ratio
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Generation Notice:</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer active:scale-[0.99]"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                <span>Crafting in {imageSize} resolution with gemini-3-pro-image-preview...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Generate High-Quality Image ({imageSize})</span>
              </>
            )}
          </button>

          {/* Generated Result Preview */}
          {generatedImage && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Image Created Successfully ({imageSize})
                </span>
                <span className="text-[10px] text-slate-400">
                  Model: gemini-3-pro-image-preview
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center max-h-[380px]">
                <img
                  src={generatedImage}
                  alt="Generated Navratri Artwork"
                  className="w-full h-full object-contain max-h-[360px]"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                <button
                  onClick={handleDownload}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" /> Download {imageSize} PNG
                </button>

                <button
                  onClick={handleShareToLiveFeed}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" /> Shared to Live Feed!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-slate-950" /> Post to Amdavad Live Feed
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
