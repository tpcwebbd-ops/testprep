import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer min-w-[80px]",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        garden: 'text-slate-700 hover:text-slate-800 bg-green-400 hover:bg-green-500 ',
        fire: 'text-slate-700 hover:text-slate-800 bg-rose-400 hover:bg-rose-500',
        water: 'text-slate-700 hover:text-slate-800 bg-blue-400 hover:bg-blue-500',
        outlineGarden:
          'border-1 border-green-400 text-green-500 hover:text-green-50 shadow-xl bg-green-300/20 shadow-xs hover:bg-green-400 transition-all duration-300',
        outlineFire:
          'border-1 border-rose-400 shadow-xl bg-rose-300/20 shadow-xs hover:bg-rose-400 transition-all duration-300 text-rose-500 hover:text-rose-50',
        outlineWater:
          'border-1 border-blue-400 shadow-xl bg-blue-300/20 shadow-xs hover:bg-blue-400 transition-all duration-300 text-blue-500 hover:text-blue-50',
        outlineDefault:
          'border-1 border-gray-400 shadow-xl bg-gray-300/20 shadow-xs hover:bg-gray-400 transition-all duration-300 text-gray-500 hover:text-gray-50',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
