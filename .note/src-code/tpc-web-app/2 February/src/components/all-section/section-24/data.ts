export interface ImagesProps {
  data?: IImagesData | string;
}

export type ImageFit = 'cover' | 'contain' | 'fill';
export type ImageAspectRatio = 'auto' | '1/1' | '16/9' | '4/3' | '3/4' | '3/2';
export type ImageAlign = 'left' | 'center' | 'right';
export type ImageWidth = 'auto' | '50%' | '75%' | '100%' | 'fixed-sm' | 'fixed-md' | 'fixed-lg';
export type GridColumns = 1 | 2 | 3 | 4;

export interface IImagesData {
  images: string[]; // Array of image URLs

  // Positioning & Layout
  alignment: ImageAlign;
  gridColumns: GridColumns;
  gap: 'sm' | 'md' | 'lg' | 'none';

  // Sizing
  width: ImageWidth;
  aspectRatio: ImageAspectRatio;
  objectFit: ImageFit;

  // Styling
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow: boolean;
}

export const defaultDataSection24: IImagesData = {
  images: ['https://images.unsplash.com/photo-1682687220742-aba13b6e50ba', 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba'],
  alignment: 'center',
  gridColumns: 2,
  gap: 'md',
  width: '100%',
  aspectRatio: '16/9',
  objectFit: 'cover',
  borderRadius: 'md',
  shadow: true,
};

// --- Main Component ---

export interface ImagesFormProps {
  data?: IImagesData;
  onSubmit: (values: IImagesData) => void;
}

// 1. Map Alignment (Container)
export const alignClass = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}[defaultDataSection24.alignment];

// 2. Map Width (Container)
export const widthClass = {
  auto: 'w-auto',
  '100%': 'w-full',
  '75%': 'w-3/4',
  '50%': 'w-1/2',
  'fixed-sm': 'w-[200px]',
  'fixed-md': 'w-[400px]',
  'fixed-lg': 'w-[600px]',
}[defaultDataSection24.width];

// 3. Map Aspect Ratio (Image Wrapper)
export const aspectClass = {
  auto: 'aspect-auto',
  '1/1': 'aspect-square',
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/4': 'aspect-[3/4]',
  '3/2': 'aspect-[3/2]',
}[defaultDataSection24.aspectRatio];

// 4. Grid Configuration
export const gridClass = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
}[defaultDataSection24.gridColumns];

export const gapClass = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-8',
}[defaultDataSection24.gap];

// 5. Style Mapping
export const radiusClass = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
}[defaultDataSection24.borderRadius];
