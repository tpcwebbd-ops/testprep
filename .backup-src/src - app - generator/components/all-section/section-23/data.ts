export interface ParagraphProps {
  data?: IParagraphData | string;
}

export type ParaSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
export type ParaAlign = 'left' | 'center' | 'right' | 'justify';
export type ParaPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ParaWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

export interface IParagraphData {
  text: string;
  textSize: ParaSize;
  textAlign: ParaAlign;
  textWeight: ParaWeight;
  isUnderline: boolean;
  padding: ParaPadding;
  opacity: number; // 0 to 100
}

export const defaultDataSection23: IParagraphData = {
  text: 'This is a standard paragraph component. It respects line breaks\nand simple text formatting.\n\nPerfect for standard content blocks.',
  textSize: 'base',
  textAlign: 'left',
  textWeight: 'normal',
  isUnderline: false,
  padding: 'md',
  opacity: 90,
};

export interface ParagraphFormProps {
  data?: IParagraphData;
  onSubmit: (values: IParagraphData) => void;
}

export const SIZE_MAP: Record<ParaSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

export const WEIGHT_MAP: Record<ParaWeight, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const PADDING_MAP: Record<ParaPadding, string> = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
  '2xl': 'p-16',
};

// 1. Map Size
export const sizeMap: Record<string, string> = {
  xs: 'text-xs leading-relaxed',
  sm: 'text-sm leading-relaxed',
  base: 'text-base leading-relaxed',
  lg: 'text-lg leading-relaxed',
  xl: 'text-xl leading-snug',
  '2xl': 'text-2xl leading-snug',
  '3xl': 'text-3xl leading-tight',
};

// 2. Map Weight
export const weightMap: Record<string, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

// 3. Map Padding
export const paddingMap: Record<string, string> = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
  '2xl': 'p-16',
};

// 4. Map Alignment
export const alignMap: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};
