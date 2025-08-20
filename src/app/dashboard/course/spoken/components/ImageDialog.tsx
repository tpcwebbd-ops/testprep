/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import Image from 'next/image';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const ImageDialog = ({ handleAddImages }: { handleAddImages: (newImage: string) => void }) => {
  const [allImages, setAllImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectImg, setSelectImg] = useState('');
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
        // mode: 'no-cors',
        // headers: {
        //   'Content-Type': 'application/image',
        // },
      });

      const data = await response.json();
      if (data.success) {
        // Save image data to our server
        const saveResponse = await fetch('/api/media', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            delete_url: data.data.delete_url,
            url: data.data.url,
            display_url: data.data.display_url,
          }),
        });

        if (!saveResponse.ok) {
          throw new Error('Error! Cannot save the image.');
        }
        setAllImages([data?.data?.url, ...allImages]);
        toast.success('Image uploaded successfully!');
        setShowUploadModal(false);
      } else {
        toast.error('Error! Cannot upload the image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error! Cannot upload the image');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch('/api/media');
      const data = await response.json();

      const lstImage: string[] = data?.data.map((i: { url: string }) => i.url);
      setAllImages(lstImage);
    };
    fetchImages();
  }, []);
  const handleSelect = (id: string) => {
    if (selectImg === id) {
      setSelectImg('');
    } else {
      handleAddImages(id);
      setSelectImg(id);
    }
  };
  return (
    <ScrollArea className="w-full h-[60vh] p-1 pr-2 border-1 border-slate-500">
      <main className="w-full min-h-[60vh] flex flex-col">
        <div className="flex justify-between items-center border-b border-slate-200 mb-2">
          <h1 className="text-xl w-full">Not here! Upload a new one</h1>
          <Button className="border-slate-500 hover:border-slate-600 border-1 cursor-pointer" onClick={() => setShowUploadModal(true)}>
            Upload
          </Button>
        </div>
        {showUploadModal ? (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Upload</h3>
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={loading} />
              {loading && <p className="mt-2">Uploading...</p>}
              <div className="flex justify-end gap-2 mt-4">
                <Button className="cursor-pointer" variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {allImages.length > 0 ? (
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1">
                {allImages.map((i, index) => (
                  <div
                    onClick={() => handleSelect(i)}
                    key={index + i}
                    className={`relative w-full h-[150px] border-1 border-slate-300 shadow-xl hover:shadow-2xl cursor-pointer hover:border-slate-600 flex items-center justify-center rounded-lg overflow-hidden`}
                  >
                    <Image src={i} fill alt="Media" objectFit="cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col w-full items-center justify-center mt-3">
                <p>Ops! there is no Image</p>
              </div>
            )}
          </div>
        )}
      </main>
    </ScrollArea>
  );
};
export default ImageDialog;
