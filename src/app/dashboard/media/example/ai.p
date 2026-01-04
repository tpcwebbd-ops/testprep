Look at the page.tsx 
```
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Image as ImageIcon, FileText, FileCode, Music, UploadCloud, Files } from 'lucide-react';

type TabType = 'video' | 'image' | 'pdf' | 'docx' | 'audio';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
  color: string;
}

const tabs: TabConfig[] = [
  { id: 'video', label: 'Video', icon: Video, color: 'from-blue-500 to-cyan-400' },
  { id: 'image', label: 'Image', icon: ImageIcon, color: 'from-rose-500 to-pink-400' },
  { id: 'pdf', label: 'PDF', icon: FileText, color: 'from-orange-500 to-amber-400' },
  { id: 'docx', label: 'DOCX', icon: FileCode, color: 'from-indigo-500 to-violet-400' },
  { id: 'audio', label: 'Audio', icon: Music, color: 'from-emerald-500 to-teal-400' },
];

const Page = () => {
  const [activeTab, setActiveTab] = useState<TabType>('video');

  return (
    <main className="min-h-screen bg-[#030712] text-white p-4 md:p-8 lg:p-12 font-sans selection:bg-white/20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-4"
          >
            Media Assets
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-400 text-lg">
            Select your file type and manage your uploads effortlessly.
          </motion.p>
        </header>

        <nav className="flex flex-wrap justify-center md:justify-start gap-2 mb-10 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${tab.color}`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`relative z-10 w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="relative z-10 font-medium tracking-wide uppercase text-xs md:text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <UploadCard
                type="Single"
                icon={UploadCloud}
                description={`Upload a single ${activeTab} file to your cloud storage.`}
                activeColor={tabs.find(t => t.id === activeTab)?.color}
              />
              <UploadCard
                type="Multiple"
                icon={Files}
                description={`Batch upload multiple ${activeTab} files simultaneously.`}
                activeColor={tabs.find(t => t.id === activeTab)?.color}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

interface UploadCardProps {
  type: string;
  icon: React.ElementType;
  description: string;
  activeColor?: string;
}

const UploadCard = ({ type, icon: Icon, description, activeColor }: UploadCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative h-[300px] md:h-[400px] flex flex-col items-center justify-center p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer overflow-hidden transition-colors hover:border-white/20"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${activeColor}`} />

      <div className={`mb-6 p-6 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-500 group-hover:rotate-6`}>
        <Icon className="w-12 h-12 text-white" />
      </div>

      <h3 className="text-2xl font-bold mb-3 tracking-tight">{type} Upload</h3>

      <p className="text-gray-400 text-center max-w-[240px] leading-relaxed">{description}</p>

      <div className="mt-8 px-6 py-2 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
        Get Started
      </div>

      <div
        className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${activeColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
      />
    </motion.div>
  );
};

export default Page;

```

and here is example of ImageUploadManagerSingle.tsx
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

and here is ImageUploadManager.tsx 
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

Now Your task is Update page.tsx so it use ImageUploadManagerSingle and ImageUploadManager. 
here is instruction of work in page.tsx. 
1. write two variable named singleImages, multipleImages. (You can use useState)
2. write two function for Update (useState) and save it to db. 
3. then use those variable and function in ImageUploadManagerSingle and ImageUploadManager components. 
