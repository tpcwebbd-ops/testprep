// BooleanInputField.tsx - Glassmorphism Enhanced

import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export function BooleanInputField({ id, checked, onCheckedChange }: { id: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <div id={id} className={cn('flex items-center justify-end gap-3 px-4 py-2', 'transition-all duration-300')}>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-white/50" />
    </div>
  );
}
