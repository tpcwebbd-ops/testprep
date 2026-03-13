import Image from 'next/image';
import { alignClass, aspectClass, defaultDataSection24, gapClass, gridClass, IImagesData, ImagesProps, radiusClass, widthClass } from './data';
import { cn } from '@/lib/utils';

const QuerySection24 = ({ data }: ImagesProps) => {
  let imageData = defaultDataSection24;

  if (data && typeof data === 'string') {
    imageData = JSON.parse(data) as IImagesData;
  } else if (data) {
    imageData = data as IImagesData;
  }

  const validImages = imageData.images.filter(url => url && url.trim().length > 0);

  if (validImages.length === 0) return null;

  return (
    <div className={cn('w-full flex', alignClass, 'p-4')}>
      <div
        className={cn(
          'grid',
          widthClass,
          gapClass,
          // Only apply grid cols if we actually have enough images to warrant a grid
          // otherwise it might look weird if width is fixed
          validImages.length > 1 ? gridClass : 'grid-cols-1',
        )}
      >
        {validImages.map((url, idx) => (
          <div
            key={idx}
            className={cn(
              'relative overflow-hidden bg-gray-100/5',
              aspectClass,
              radiusClass,
              imageData.shadow && 'shadow-lg shadow-black/10',
              // If it's 'auto' aspect ratio, we let the image define height, else we force relative wrapper
              imageData.aspectRatio !== 'auto' ? 'h-full w-full' : '',
            )}
          >
            <Image
              width={200}
              height={200}
              src={url}
              alt={`Gallery item ${idx + 1}`}
              className={cn(
                'w-full h-full transition-transform duration-500 hover:scale-105',
                imageData.aspectRatio !== 'auto' ? 'absolute inset-0' : 'relative',
                imageData.objectFit === 'cover' ? 'object-cover' : imageData.objectFit === 'contain' ? 'object-contain' : 'object-fill',
              )}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuerySection24;
