'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Type, Layout, Loader2, UploadCloud, RefreshCw, Image as ImageIcon, Crop as CropIcon, Check, Maximize2, Info, Palette } from 'lucide-react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import imageCompression from 'browser-image-compression';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop';

// Assuming these components exist in your project based on previous context
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// --- Types ---
type BrandFontSize = 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
type BrandFontFamily = 'font-sans' | 'font-serif' | 'font-mono';

export interface BrandConfiguration {
  brandName: string;
  logoUrl: string | null;
  textColor: string;
  fontSize: BrandFontSize;
  fontFamily: BrandFontFamily;
}

// API Response Interface
interface BrandSettingsResponse extends BrandConfiguration {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const defaultBrandConfig: BrandConfiguration = {
  brandName: 'AppGenerator',
  logoUrl: null,
  textColor: '#38bdf8',
  fontSize: 'text-2xl',
  fontFamily: 'font-sans',
};

const fontOptions = [
  { label: 'Sans Serif', value: 'font-sans' },
  { label: 'Serif', value: 'font-serif' },
  { label: 'Monospace', value: 'font-mono' },
];

const sizeOptions = [
  { label: 'Small', value: 'text-lg' },
  { label: 'Medium', value: 'text-xl' },
  { label: 'Large', value: 'text-2xl' },
  { label: 'Extra Large', value: 'text-3xl' },
];

// --- Crop Utilities ---

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area, rotation = 0): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  const rotRad = getRadianAngle(rotation);

  const { width: bBoxWidth, height: bBoxHeight } = {
    width: Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
    height: Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
  };

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0, 0);

  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
  });
}

// --- Media Components ---

interface InternalImageDialogProps {
  onImageSelect: (newImage: string) => void;
  selectedImage: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

const InternalImageDialog = ({ onImageSelect, selectedImage, maxSizeMB = 1, maxWidthOrHeight = 1920 }: InternalImageDialogProps) => {
  const [allAvailableImages, setAllAvailableImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Crop State
  const [isCropping, setIsCropping] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/media');
      if (!response.ok) throw new Error('Failed to fetch images.');
      const data = await response.json();
      if (!data?.data || !Array.isArray(data.data)) {
        setAllAvailableImages([]);
        return;
      }
      setAllAvailableImages(data.data.map((i: { url: string }) => i.url));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Could not load library.');
      setAllAvailableImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const startCrop = (src: string) => {
    setTempImageSrc(src);
    setIsCropping(true);
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => startCrop(reader.result?.toString() || ''));
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleLibrarySelect = async (url: string) => {
    startCrop(url);
  };

  const saveCroppedImage = async () => {
    if (!tempImageSrc || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(tempImageSrc, croppedAreaPixels, rotation);
      if (!croppedBlob) throw new Error('Crop failed');

      const file = new File([croppedBlob], 'cropped-brand-logo.jpg', { type: 'image/jpeg' });
      const compressedFile = await imageCompression(file, {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
        fileType: 'image/jpeg',
      });

      const formData = new FormData();
      formData.append('image', compressedFile);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const newUrl = data.data.url;
        await fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            delete_url: data.data.delete_url,
            url: newUrl,
            display_url: data.data.display_url,
          }),
        });

        toast.success('Image processed & saved!');
        setAllAvailableImages(prev => [newUrl, ...prev]);
        onImageSelect(newUrl);
        setIsCropping(false);
      } else {
        throw new Error('Upload failed');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to process image. Try a different file.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCropping && tempImageSrc) {
    return (
      <div className="flex flex-col h-[75vh] w-full bg-[#0a0a0a] text-white">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#121212]">
          <div className="flex items-center gap-2">
            <CropIcon className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-lg">Crop Studio</h3>
          </div>
        </div>

        <div className="relative flex-1 bg-[#050505] overflow-hidden">
          <Cropper
            image={tempImageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            classes={{ containerClassName: 'bg-[url("https://grainy-gradients.vercel.app/noise.svg")] opacity-90' }}
          />
        </div>

        <div className="p-6 bg-[#121212] border-t border-white/10 space-y-6">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
              <span className="text-xs font-medium text-white/50 w-16">Zoom</span>
              <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={v => setZoom(v[0])} className="cursor-pointer" />
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
              <span className="text-xs font-medium text-white/50 w-16">Rotate</span>
              <Slider value={[rotation]} min={0} max={360} step={1} onValueChange={v => setRotation(v[0])} className="cursor-pointer" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5">
              {[
                { label: 'Square', r: 1 },
                { label: '16:9', r: 16 / 9 },
                { label: 'Free', r: undefined },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setAspect(opt.r)}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                    aspect === opt.r ? 'bg-blue-600 text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/5" onClick={() => setIsCropping(false)}>
                Cancel
              </Button>
              <Button onClick={saveCroppedImage} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                Save Crop
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[75vh] bg-[#0a0a0a] text-white">
      <div className="p-6 md:p-8 space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Media Library</h2>
            <p className="text-sm text-white/40 mt-1">Select an image to crop and use.</p>
          </div>

          <Button asChild className="bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
            <label className="cursor-pointer flex items-center gap-2">
              <UploadCloud className="w-4 h-4" />
              Upload New
              <Input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </Button>
        </header>

        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-white/30 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span>Loading media...</span>
          </div>
        ) : allAvailableImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4   gap-4">
            {allAvailableImages.map(url => (
              <div
                key={url}
                onClick={() => handleLibrarySelect(url)}
                className={`
                    group relative aspect-square rounded-xl overflow-hidden cursor-pointer
                    border border-white/10 bg-white/5
                    transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/20 hover:border-blue-500/30
                    ${selectedImage === url ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <Image src={url} alt="asset" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full text-white">
                    <CropIcon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-white/30 gap-4 border border-dashed border-white/10 rounded-xl bg-white/5">
            <ImageIcon className="w-12 h-12 opacity-50" />
            <p>No images found. Upload one to get started.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

interface ImageUploadManagerProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
}

const ImageUploadManagerSingle = ({ value, onChange, label = 'Image' }: ImageUploadManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-white/80 flex items-center gap-2">
          <ImageIcon size={16} className="text-blue-400" /> {label}
        </h2>
        {value && (
          <Button variant="ghost" size="sm" onClick={() => onChange('')} className="text-red-400 hover:text-red-300 h-6 text-xs px-2">
            Remove
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div
            className={`
              group relative w-full h-[240px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
              ${value ? 'bg-black/40' : 'bg-white/5 hover:bg-white/10 border-dashed border-2 border-white/10 hover:border-blue-500/30'}
          `}
          >
            {value ? (
              <>
                <Image src={value} alt="Selected" fill className="object-contain p-4 z-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-10">
                  <Button variant="secondary" size="sm" className="shadow-xl font-medium bg-white text-black hover:bg-blue-50">
                    <RefreshCw className="w-3.5 h-3.5 mr-2" /> Change Image
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-white/40 group-hover:text-blue-200 transition-colors">
                <div className="p-4 rounded-full bg-white/5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Click to upload logo</p>
                  <p className="text-xs opacity-50 mt-1">Supports crop & resize</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-5xl p-0 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-3xl shadow-2xl overflow-hidden text-white">
          <DialogHeader className="sr-only">
            <DialogTitle>Media Manager</DialogTitle>
          </DialogHeader>
          <InternalImageDialog
            onImageSelect={url => {
              onChange(url);
              setIsOpen(false);
            }}
            selectedImage={value}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- Main Page ---

const BrandSettingsEditor = () => {
  const [config, setConfig] = useState<BrandConfiguration>(defaultBrandConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // 1. Get request on render
  useEffect(() => {
    const fetchBrandSettings = async () => {
      try {
        const response = await fetch('/api/brand-settings');
        if (response.ok) {
          const data: BrandSettingsResponse = await response.json();
          // Validation: Check if we actually got a brandName
          if (data && data.brandName) {
            setConfig({
              brandName: data.brandName,
              logoUrl: data.logoUrl || null,
              textColor: data.textColor || defaultBrandConfig.textColor,
              fontSize: data.fontSize || defaultBrandConfig.fontSize,
              fontFamily: data.fontFamily || defaultBrandConfig.fontFamily,
            });
          }
        }
      } catch (error) {
        console.error('Failed to load brand settings:', error);
        // On error, we silently fail and keep defaults (or previous state)
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBrandSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/brand-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      // Also update local storage as a fallback/cache if needed
      localStorage.setItem('site_brand_config', JSON.stringify(config));

      window.dispatchEvent(new Event('brand-settings-updated'));
      toast.success('Settings updated successfully!');
    } catch {
      toast.error('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TooltipProvider>
      <main className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#050505] overflow-hidden text-white selection:bg-blue-500/30">
        {/* Ambient Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

        <ToastContainer position="bottom-right" theme="dark" />

        {initialLoading ? (
          // --- Loading Skeleton ---
          <div className="relative w-full max-w-6xl h-[80vh] rounded-3xl border border-white/10 bg-[#121212]/60 backdrop-blur-xl shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
            <div className="flex flex-col items-center gap-4 text-white/30 z-10">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <p className="font-mono text-sm tracking-widest uppercase">Fetching Identity...</p>
            </div>
          </div>
        ) : (
          // --- Main Content ---
          <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-0 rounded-3xl border border-white/10 bg-[#121212]/60 backdrop-blur-xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-500">
            {/* Sidebar */}
            <div className="bg-gradient-to-b from-[#1a1c22] to-[#0f1014] p-8 border-r border-white/5 flex flex-col relative h-full">
              <div className="relative z-10 space-y-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <Layout className="w-7 h-7 text-blue-400" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Brand Identity</h1>
                  <p className="text-white/40 mt-3 text-sm leading-relaxed">
                    Customize visual elements. The logo you set here will appear on the navbar and system emails.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-xs font-mono text-blue-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Maximize2 className="w-3 h-3" /> Live Preview
                  </h3>
                  <div className="p-5 rounded-xl bg-black/40 border border-white/10 shadow-inner group">
                    <div className="flex items-center gap-3">
                      {config.logoUrl ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden relative border border-white/10 bg-white/5">
                          <Image src={config.logoUrl} alt="logo" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                          <Layout className="w-5 h-5 text-white/20" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span
                          style={{ color: config.textColor, fontFamily: config.fontFamily.replace('font-', '') }}
                          className={`font-bold text-lg leading-tight transition-all duration-300 ${config.fontFamily}`}
                        >
                          {config.brandName}
                        </span>
                        <span className="text-[10px] text-white/30 font-medium">Administrator</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="h-full max-h-[calc(100vh-4rem)] lg:max-h-auto bg-[#0a0a0a]/50">
              <div className="p-8 lg:p-12">
                <div className="max-w-2xl mx-auto space-y-10">
                  {/* Logo Uploader */}
                  <div className="space-y-4">
                    <ImageUploadManagerSingle
                      value={config.logoUrl || ''}
                      onChange={url => setConfig(prev => ({ ...prev, logoUrl: url }))}
                      label="Brand Logo"
                    />
                  </div>

                  <div className="w-full h-px bg-white/5" />

                  {/* Typography Form */}
                  <div className="grid gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                        <Type size={16} className="text-blue-400" /> Brand Name
                      </label>
                      <Input
                        value={config.brandName}
                        onChange={e => setConfig(prev => ({ ...prev, brandName: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus-visible:ring-blue-500/50 transition-all focus:bg-white/10"
                        placeholder="Enter brand name..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                          <Palette size={16} className="text-blue-400" /> Accent Color
                        </label>
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2 pr-4 transition-all hover:bg-white/10 group focus-within:ring-1 focus-within:ring-blue-500/50">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shadow-inner cursor-pointer">
                            <input
                              type="color"
                              value={config.textColor}
                              onChange={e => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
                              className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer p-0 m-0 opacity-0"
                            />
                            <div className="w-full h-full" style={{ backgroundColor: config.textColor }} />
                          </div>
                          <span className="text-sm font-mono text-white/80 group-hover:text-white transition-colors uppercase">{config.textColor}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-white/80">Base Font Size</label>
                        <div className="relative group">
                          <select
                            value={config.fontSize}
                            onChange={e => setConfig(prev => ({ ...prev, fontSize: e.target.value as BrandFontSize }))}
                            className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all h-12 cursor-pointer hover:bg-white/10"
                          >
                            {sizeOptions.map(opt => (
                              <option key={opt.value} value={opt.value} className="bg-[#121212] text-white">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <Type
                            size={14}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none group-hover:text-blue-400 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-white/80">Font Family</label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-white/30 hover:text-white transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent>Choose a font that matches your brand tone.</TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {fontOptions.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => setConfig(prev => ({ ...prev, fontFamily: opt.value as BrandFontFamily }))}
                            className={`
                                    px-2 py-4 rounded-xl border text-sm transition-all relative overflow-hidden group flex flex-col items-center justify-center gap-3
                                    ${
                                      config.fontFamily === opt.value
                                        ? 'bg-blue-600/10 border-blue-500/50 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20 hover:text-white'
                                    }
                                    `}
                          >
                            <span
                              className={`text-xl font-bold ${opt.value === 'font-serif' ? 'font-serif' : opt.value === 'font-mono' ? 'font-mono' : 'font-sans'}`}
                            >
                              Aa
                            </span>
                            <span className="text-[10px] uppercase tracking-wider opacity-70">{opt.label}</span>

                            {config.fontFamily === opt.value && <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end gap-4 border-t border-white/5">
                    <Button onClick={() => setConfig(defaultBrandConfig)} variant="ghost" className="text-white/40 hover:text-white hover:bg-white/5">
                      Reset Defaults
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-500 text-white min-w-[140px] shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </main>
    </TooltipProvider>
  );
};

export default BrandSettingsEditor;
