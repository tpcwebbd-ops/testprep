'use client';

import Image from 'next/image';
import { X, UploadCloud } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';
import imageCompression from 'browser-image-compression';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImageUploadManagerProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
}

type ViewState = 'image' | 'add-image';

const MAX_SIZE_KB = 600;
const MAX_SIZE_MB = MAX_SIZE_KB / 1024;

export default function ImageUploadManagerSingle({ value, onChange, label = 'Image' }: ImageUploadManagerProps) {
  const [viewState, setViewState] = useState<ViewState>('image');
  const [allAvailableImages, setAllAvailableImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const compressImageIfNeeded = async (file: File): Promise<File> => {
    const fileSizeKB = file.size / 1024;

    if (fileSizeKB <= MAX_SIZE_KB) {
      return file;
    }

    const options = {
      maxSizeMB: MAX_SIZE_MB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg',
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      throw new Error('Image compression failed');
    }
  };

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

  const handleAddImageClick = () => {
    setViewState('add-image');
    fetchImages();
  };

  const handleImageSelect = (newImageUrl: string) => {
    onChange(newImageUrl);
    setViewState('image');
    toast.success('Image selected successfully!');
  };

  const handleRemoveImage = () => {
    onChange('');
    toast.info('Image removed');
  };

  const handleCancel = () => {
    setViewState('image');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setIsLoading(true);
    try {
      const originalSizeKB = (file.size / 1024).toFixed(2);
      
      let fileToUpload = file;
      
      if (file.size / 1024 > MAX_SIZE_KB) {
        toast.info(`Compressing image... Original size: ${originalSizeKB}KB`);
        fileToUpload = await compressImageIfNeeded(file);
        const compressedSizeKB = (fileToUpload.size / 1024).toFixed(2);
        toast.success(`Image compressed from ${originalSizeKB}KB to ${compressedSizeKB}KB`);
      }

      const formData = new FormData();
      formData.append('image', fileToUpload);

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
        handleImageSelect(newImageUrl);
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

  if (viewState === 'add-image') {
    return (
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-white/90 font-semibold drop-shadow">{label}</h2>
          <button
            onClick={handleCancel}
            className="
              bg-red-600 text-white w-8 h-8
              rounded-full flex items-center justify-center
              shadow-lg hover:bg-red-700 transition-colors
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="
            w-full min-h-[400px] rounded-xl p-4
            bg-white/5 backdrop-blur-md
            border border-white/20 shadow-inner
            flex flex-col gap-4
            transition-all duration-300
          "
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="text-white/90 font-semibold">Select an Image</h3>
            <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition">
              <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 text-white/90">
                <UploadCloud className="w-4 h-4" />
                Upload
              </label>
            </Button>
            <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isLoading} />
          </div>

          <ScrollArea className="w-full h-[300px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-48 text-white/70">Loading images...</div>
            ) : allAvailableImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-4">
                {allAvailableImages.map(imageUrl => {
                  const isSelected = value === imageUrl;
                  return (
                    <div
                      key={imageUrl}
                      onClick={() => !isSelected && handleImageSelect(imageUrl)}
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
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-white/60 py-10">No images found.</div>
            )}
          </ScrollArea>

          <Button onClick={handleCancel} variant="outline" className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition text-white/90">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white/90 font-semibold drop-shadow">{label}</h2>
      </div>

      <div
        className="
          w-full min-h-[200px] rounded-xl p-4
          bg-white/5 backdrop-blur-md
          border border-white/20 shadow-inner
          flex flex-col items-center justify-center gap-4
          transition-all duration-300
        "
      >
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

        <Button
          onClick={handleAddImageClick}
          variant="outline"
          className="bg-white/10 border-white/40 backdrop-blur-sm hover:bg-white/20 transition text-white/90 hover:text-white/90"
        >
          Add Image
        </Button>
      </div>
    </div>
  );
}