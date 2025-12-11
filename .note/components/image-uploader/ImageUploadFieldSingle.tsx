// ImageUploadFieldSingle.tsx (Glassmorphism Enhanced with Compression)

'use client';

import Image from 'next/image';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Loader, UploadCloud, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploadFieldSingleProps {
  value: string | null;
  onChange: (newImageUrl: string | null) => void;
  isProfile?: boolean;
  label?: string;
  className?: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

export default function ImageUploadFieldSingle({
  value,
  onChange,
  label = 'Profile Image',
  className,
  isProfile = false,
  maxSizeMB = 1,
  maxWidthOrHeight = 1920,
}: ImageUploadFieldSingleProps) {
  const [loading, setLoading] = useState(false);
  const uniqueId = `single-image-upload-${label.replace(/\s+/g, '-')}`;

  const shapeClass = isProfile ? 'rounded-full' : 'rounded-xl';

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
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
      if (!data.success) throw new Error(data.error?.message);

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
      onChange(newImageUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => onChange(null);

  return (
    <div className={cn('flex flex-col items-start gap-2', className)}>
      <Label htmlFor={uniqueId} className="text-white/90 drop-shadow-sm">
        {label}
      </Label>

      <div
        className={cn(
          'relative group w-36 h-36 overflow-hidden border border-white/20 shadow-lg',
          'bg-white/10 backdrop-blur-md transition-all duration-300 hover:shadow-2xl',
          shapeClass,
        )}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 text-white/70 h-full">
            <Loader className="h-8 w-8 animate-spin" />
            <span className="text-sm">Uploading...</span>
          </div>
        ) : value ? (
          <>
            <Image src={value} alt="Media" fill className="object-cover" />
            <div
              className="
                absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity
              "
            >
              <Button type="button" onClick={handleRemoveImage} className="bg-transparent min-w-[6px]" aria-label="Remove image">
                <X className="w-4 h-4" />
              </Button>

              <label htmlFor={uniqueId} className="p-2 bg-white text-gray-900 rounded-full cursor-pointer hover:bg-gray-200" aria-label="Change image">
                <UploadCloud className="w-4 h-4" />
              </label>
            </div>
          </>
        ) : (
          <label
            htmlFor={uniqueId}
            className="flex flex-col items-center justify-center gap-1 h-full text-white/60 cursor-pointer hover:text-emerald-300 transition-colors duration-200"
          >
            <UploadCloud className="w-7 h-7" />
            <span className="text-xs">Upload Image</span>
          </label>
        )}
      </div>

      <Input id={uniqueId} type="file" accept="image/*" onChange={handleImageUpload} disabled={loading} className="hidden" />
    </div>
  );
}
