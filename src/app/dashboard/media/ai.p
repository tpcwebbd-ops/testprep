Look at the route.ts
```
import connectDB from '@/app/api/utils/mongoose';
import { NextResponse } from 'next/server';
import Media from './mediaModel'; 

// GET all media
export async function GET() {
  try { 
    await connectDB();
    const mediaItems = await Media.find({}).sort({ updatedAt: -1, createdAt: -1 });
    return NextResponse.json({ data: mediaItems, message: 'Media loaded successfully' });
  } catch {
    // Removed unused 'error' variable
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

// CREATE media
export async function POST(req: Request) {
  try { 
    await connectDB();
    const mediaData = await req.json();
    const newMedia = await Media.create(mediaData);
    return NextResponse.json({ data: newMedia, message: 'Media created successfully' }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
}

// UPDATE media
export async function PUT(req: Request) {
  try { 
    await connectDB();
    const { id, ...updateData } = await req.json();
    const updatedMedia = await Media.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedMedia) {
      return NextResponse.json({ message: 'Media not found' }, { status: 404 });
    }
    return NextResponse.json({ data: updatedMedia, message: 'Media updated successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
}

// DELETE media
export async function DELETE(req: Request) {
  try { 
    await connectDB();
    const { id } = await req.json();
    const deletedMedia = await Media.findByIdAndDelete(id);

    if (!deletedMedia) {
      return NextResponse.json({ message: 'Media not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: errorMessage }, { status: 400 });
  }
}

```

mediaModel.ts
```
import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    delete_url: {
      type: String,
      trim: true,
    },
    display_url: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    author_email: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'trash'],
      default: 'active',
    },
    mediaType: {
      type: String,
      enum: ['video', 'image', 'pdf', 'docx'],
      default: 'image',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.models.Media || mongoose.model('Media', mediaSchema);

``` 

ImageUploadManager.tsx
```
// ImageUploadManager.tsx

'use client';

import Image from 'next/image';
import { Plus, X, UploadCloud } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEffect, useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';

interface InternalImageDialogProps {
  onImageSelect: (newImage: string) => void;
  selectedImages: string[];
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

const InternalImageDialog = ({ onImageSelect, selectedImages, maxSizeMB = 1, maxWidthOrHeight = 1920 }: InternalImageDialogProps) => {
  const [allAvailableImages, setAllAvailableImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      const imageUrls: string[] = data.data.map((i: { url: string }) => i.url);
      setAllAvailableImages(imageUrls);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not fetch images.');
      setAllAvailableImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const options = {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
        fileType: 'image/jpeg' as const,
      };

      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append('image', compressedFile);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const newImageUrl = data.data.url;
        await fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            delete_url: data.data.delete_url,
            url: newImageUrl,
            display_url: data.data.display_url,
          }),
        });
        toast.success('Image uploaded successfully!');
        onImageSelect(newImageUrl);
        setAllAvailableImages(prev => [newImageUrl, ...prev]);
      } else {
        throw new Error(data.error.message || 'Image upload failed.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cannot upload the image.');
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  return (
    <ScrollArea className="w-full h-[60vh] p-4 bg-white/5 backdrop-blur-md rounded-xl">
      <header className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
        <h2 className="text-white/90 font-semibold">Select an Image</h2>
        <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition mr-8">
          <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 text-white/90">
            <UploadCloud className="w-4 h-4" />
            Upload
          </label>
        </Button>
        <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isLoading} />
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-48 text-white/70">Loading images...</div>
      ) : allAvailableImages.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {allAvailableImages.map(imageUrl => {
            const isSelected = selectedImages.includes(imageUrl);
            return (
              <DialogClose asChild key={imageUrl}>
                <div
                  onClick={() => !isSelected && onImageSelect(imageUrl)}
                  className={`
                    relative w-full aspect-square rounded-xl overflow-hidden
                    bg-white/10 backdrop-blur-sm
                    border border-white/10 shadow
                    transition-all duration-300
                    ${isSelected ? 'opacity-50 cursor-not-allowed ring-2 ring-emerald-400/70' : 'cursor-pointer hover:scale-[1.05] hover:shadow-xl'}
                  `}
                >
                  <Image src={imageUrl} fill alt="Media" className="object-cover" />
                </div>
              </DialogClose>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-white/60 py-10">No images found.</div>
      )}
    </ScrollArea>
  );
};

interface ImageUploadManagerProps {
  value: string[];
  onChange: (newValues: string[]) => void;
  label?: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

export default function ImageUploadManager({ value, onChange, label = 'Images', maxSizeMB = 1, maxWidthOrHeight = 1920 }: ImageUploadManagerProps) {
  const handleAddImage = (newImageUrl: string) => {
    if (!value.includes(newImageUrl)) {
      onChange([newImageUrl, ...value]);
    } else toast.info('Image already selected!');
  };

  const handleRemoveImage = (imageToRemove: string) => {
    onChange(value.filter(imageUrl => imageUrl !== imageToRemove));
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white/90 font-semibold drop-shadow">{label}</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outlineWater" size="sm" className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition text-white/90">
              <Plus className="w-4 h-4" /> Add Image
            </Button>
          </DialogTrigger>

          <DialogContent
            className="
              max-w-3xl p-0 rounded-2xl
              bg-white/10 backdrop-blur-lg
              border border-white/20 shadow-2xl
              transition-all duration-300
            "
          >
            <InternalImageDialog onImageSelect={handleAddImage} selectedImages={value} maxSizeMB={maxSizeMB} maxWidthOrHeight={maxWidthOrHeight} />
          </DialogContent>
        </Dialog>
      </div>

      <div
        className="
          w-full min-h-[120px] rounded-xl p-4
          bg-white/5 backdrop-blur-md
          border border-white/20 shadow-inner
          flex items-center justify-center
          transition-all duration-300
        "
      >
        {value.length > 0 ? (
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {value.map(imageUrl => (
              <div
                key={imageUrl}
                className="
                  relative w-full aspect-square rounded-xl overflow-hidden
                  bg-white/10 border border-white/10 backdrop-blur-sm
                  shadow-lg hover:scale-[1.03] hover:shadow-2xl
                  transition-all duration-300 group
                "
              >
                <Image src={imageUrl} alt="Selected media" fill className="object-cover" />

                <button
                  onClick={() => handleRemoveImage(imageUrl)}
                  className="
                    absolute top-1 right-1 bg-red-600 text-white w-6 h-6
                    rounded-full flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity
                  "
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/60">
            <p>No images selected.</p>
            <p className="text-sm">Click &quot;Add Image&quot; to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

```
ImageUploadManagerSingle.tsx
```
'use client';

import Image from 'next/image';
import { Plus, X, UploadCloud, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEffect, useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface InternalImageDialogProps {
  onImageSelect: (newImage: string) => void;
  selectedImage: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

const InternalImageDialog = ({ onImageSelect, selectedImage, maxSizeMB = 1, maxWidthOrHeight = 1920 }: InternalImageDialogProps) => {
  const [allAvailableImages, setAllAvailableImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      const imageUrls: string[] = data.data.map((i: { url: string }) => i.url);
      setAllAvailableImages(imageUrls);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not fetch images.');
      setAllAvailableImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const options = {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
        fileType: 'image/jpeg' as const,
      };

      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append('image', compressedFile);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const newImageUrl = data.data.url;
        await fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            delete_url: data.data.delete_url,
            url: newImageUrl,
            display_url: data.data.display_url,
          }),
        });
        toast.success('Image uploaded successfully!');
        onImageSelect(newImageUrl);
        setAllAvailableImages(prev => [newImageUrl, ...prev]);
      } else {
        throw new Error(data.error.message || 'Image upload failed.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cannot upload the image.');
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  return (
    <ScrollArea className="w-full h-[60vh] p-4 bg-white/5 backdrop-blur-md rounded-xl">
      <header className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
        <h2 className="text-white/90 font-semibold">Select an Image</h2>
        <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition mr-8 text-white/90">
          <label htmlFor="single-image-upload" className="cursor-pointer flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            Upload
          </label>
        </Button>
        <Input id="single-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isLoading} />
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-48 text-white/70">Loading images...</div>
      ) : allAvailableImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allAvailableImages.map(imageUrl => {
            const isSelected = selectedImage === imageUrl;
            return (
              <div
                key={imageUrl}
                onClick={() => onImageSelect(imageUrl)}
                className={`
                  relative w-full aspect-square rounded-xl overflow-hidden
                  bg-white/10 backdrop-blur-sm
                  border border-white/10 shadow
                  transition-all duration-300
                  ${isSelected ? 'ring-2 ring-emerald-400/70 scale-[0.98]' : 'cursor-pointer hover:scale-[1.05] hover:shadow-xl'}
                `}
              >
                <Image src={imageUrl} fill alt="Media" className="object-cover" />
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <div className="bg-emerald-500 text-white rounded-full p-1 shadow-lg">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-white/60 py-10">No images found.</div>
      )}
    </ScrollArea>
  );
};

interface ImageUploadManagerProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

export default function ImageUploadManagerSingle({ value, onChange, label = 'Image', maxSizeMB = 1, maxWidthOrHeight = 1920 }: ImageUploadManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageSelect = (newImageUrl: string) => {
    onChange(newImageUrl);
    setIsOpen(false);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white/90 font-semibold drop-shadow">{label}</h2>

        {value && (
          <Button variant="ghost" size="sm" onClick={() => onChange('')} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 transition h-8">
            Clear Selection
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div
            className={`
              group relative w-full min-h-[220px] rounded-xl overflow-hidden
              bg-white/5 backdrop-blur-md
              border border-white/20 shadow-inner
              flex items-center justify-center
              transition-all duration-300 cursor-pointer
              ${!value ? 'hover:bg-white/10 hover:border-white/30' : ''}
            `}
          >
            {value ? (
              <>
                {value && (
                  <div
                    className="
              relative w-full max-w-sm aspect-square rounded-xl overflow-hidden
              bg-white/10 border border-white/10 backdrop-blur-sm
              shadow-lg
              transition-all duration-300 group
            "
                  >
                    <Image src={value} alt="Selected image" fill className="object-cover" />

                    <button
                      onClick={handleRemoveImage}
                      className="
                absolute top-2 right-2 bg-red-600 text-white w-8 h-8
                rounded-full flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity
                shadow-lg hover:bg-red-700
              "
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="bg-white/90 text-black hover:bg-white">
                      <RefreshCw className="w-4 h-4 mr-2" /> Change
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleRemoveImage}>
                      <X className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-white/50 group-hover:text-white/80 transition-colors">
                <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Click to select an image</p>
                  <p className="text-xs opacity-70">Supports JPG, PNG, WEBP</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent
          className="
            max-w-3xl p-0 rounded-2xl
            bg-white/10 backdrop-blur-lg
            border border-white/20 shadow-2xl
            transition-all duration-300
          "
        >
          <InternalImageDialog onImageSelect={handleImageSelect} selectedImage={value} maxSizeMB={maxSizeMB} maxWidthOrHeight={maxWidthOrHeight} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

VideoUploadManager.tsx
```
// VideoUploadManager.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Plus, Clapperboard, Film } from 'lucide-react';
import { toast } from 'sonner';
import { UploadButton } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';

interface VideoUploadManagerProps {
  value: string[];
  onChange: (newValues: string[]) => void;
  label?: string;
}

export default function VideoUploadManager({ value, onChange, label = 'Video Library' }: VideoUploadManagerProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter(url => url !== urlToRemove));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-white text-xl font-black tracking-tight flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-400" /> {label}
          </h2>
          <p className="text-white/30 text-xs font-medium uppercase tracking-widest">{value.length} Assets Selected</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outlineGlassy" className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 transition-all gap-2 group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Production</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl p-0 bg-white/5 backdrop-blur-[120px] border-white/10 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-black text-white italic tracking-tighter uppercase">Media Intake</DialogTitle>
                <p className="text-white/40 text-sm">Deploy new cinematic assets to your production library.</p>
              </div>

              <div className="relative group min-h-[300px] border-2 border-dashed border-white/10 rounded-[2rem] bg-white/5 flex flex-col items-center justify-center transition-all duration-500 hover:border-indigo-500/40">
                <AnimatePresence mode="wait">
                  {isUploading ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                      <p className="text-indigo-400 font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing</p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 p-10 text-center">
                      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <UploadButton
                          endpoint="videoUploader"
                          appearance={{
                            button: 'bg-white text-black font-black px-8 h-12 rounded-xl active:scale-95 transition-all',
                            allowedContent: 'text-white/20 text-[10px] uppercase font-bold mt-3',
                          }}
                          onUploadBegin={() => setIsUploading(true)}
                          onClientUploadComplete={res => {
                            if (res) {
                              const urls = res.map(f => f.url);
                              onChange([...urls, ...value]);
                              setIsUploading(false);
                              toast.success('Assets encoded successfully');
                            }
                          }}
                          onUploadError={err => {
                            setIsUploading(false);
                            toast.error(err.message);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-bold">Cloud Deployment</p>
                        <p className="text-white/30 text-xs max-w-[200px]">Drag and drop MP4 or WebM files directly into the studio.</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="min-h-[160px] rounded-[2rem] p-6 bg-white/5 border border-white/10 backdrop-blur-md">
        <ScrollArea className="w-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              <AnimatePresence initial={false}>
                {value.map((url, index) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10"
                  >
                    <video src={url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg">
                            <Play className="w-3 h-3 text-white fill-white" />
                          </div>
                          <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Preview</span>
                        </div>
                        <button
                          onClick={() => handleRemove(url)}
                          className="p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 opacity-20">
              <Clapperboard className="w-12 h-12 mb-4" />
              <p className="font-bold uppercase tracking-widest text-sm">No Content Allocated</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

```
VideoUploadManagerSingle.tsx
```
// VideoUploadManagerSingle.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, RefreshCw, ShieldCheck, UploadCloud, MonitorPlay } from 'lucide-react';
import { toast } from 'sonner';
import { UploadButton } from '@/lib/uploadthing';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';

interface VideoUploadManagerSingleProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
}

export default function VideoUploadManagerSingle({ value, onChange, label = 'Feature Video' }: VideoUploadManagerSingleProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-white/90 text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <MonitorPlay className="w-4 h-4 text-indigo-400" /> {label}
        </h2>
        {value && (
          <button onClick={() => onChange('')} className="text-red-400/50 hover:text-red-400 text-[10px] font-bold uppercase transition-colors">
            Clear Source
          </button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative group w-full aspect-video rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden cursor-pointer transition-all duration-500 hover:border-white/20">
            {value ? (
              <div className="relative w-full h-full">
                <video src={value} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} whileHover={{ scale: 1, opacity: 1 }} className="flex gap-3">
                    <div className="p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                      <RefreshCw className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div className="px-4 py-2 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded-full flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-300 uppercase italic">Verified Source</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                  <Video className="w-8 h-8 text-white/20 group-hover:text-white/60" />
                </div>
                <div className="text-center">
                  <p className="text-white/40 font-bold text-sm">Initialize Media Asset</p>
                  <p className="text-white/20 text-[10px] uppercase font-medium mt-1">Select from library or upload</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-xl p-0 bg-[#020617]/80 backdrop-blur-[120px] border-white/10 rounded-[3rem] overflow-hidden">
          <div className="p-10 space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
                <UploadCloud className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-black text-white italic tracking-tighter uppercase">Source Selection</DialogTitle>
                <p className="text-white/40 text-xs font-medium">Connect your high-resolution production master.</p>
              </div>
            </div>

            <div className="relative min-h-[280px] border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5 flex flex-col items-center justify-center transition-all duration-500 hover:border-indigo-500/40">
              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-indigo-400 font-black tracking-[0.2em] text-[10px] uppercase italic">Encoding Streams</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-8 text-center p-8">
                    <UploadButton
                      endpoint="videoUploader"
                      appearance={{
                        button: 'bg-white text-black font-black px-12 h-14 rounded-2xl shadow-2xl hover:bg-white/90 transition-all',
                        allowedContent: 'text-white/20 text-[10px] font-bold uppercase tracking-widest mt-4',
                      }}
                      onUploadBegin={() => setIsUploading(true)}
                      onClientUploadComplete={res => {
                        if (res && res[0]) {
                          onChange(res[0].url);
                          setIsUploading(false);
                          setIsOpen(false);
                          toast.success('Production source updated');
                        }
                      }}
                      onUploadError={err => {
                        setIsUploading(false);
                        toast.error(err.message);
                      }}
                    />
                    <div className="space-y-2">
                      <p className="text-white font-black uppercase text-xs italic tracking-widest">Master File Interface</p>
                      <p className="text-white/20 text-[10px] max-w-[200px] leading-relaxed">Ensure bitrate compliance before deployment.</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```




Now Your task is implementwith those features in page.tsx. 
    i. At the Top there are Parent tabs. All Media, Videos, Images, Pdf, Documents
    ii. each tabs have two sub tabs.
        - Active, - Trash. 
    iii. at the right side there is a button named Add Media 
    iv. If there are more then 10 items then show with paginations. 
    v. make them resposive for mobile, tablet, desktop. 
    vi. if there are no items then render empty div with Not found text. 
    vii. make error handle. 
    viii. make it eye-catching view and stunning animation. 
    ix. do not use black color in the background. You can use backdrop filter blue 120px. 
    x. When All Media is selected then Upload media is disabled. 
    xi. if Video is selected then only Video is uploaded. same for Images, pdf, and Documents (doc, docx)


Now Please Generate page.tsx 


 