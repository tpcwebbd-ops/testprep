'use client';

import * as React from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl group/calendar p-3 [--cell-size:--spacing(8)]',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: date => date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('flex gap-4 flex-col md:flex-row relative', defaultClassNames.months),
        month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
        nav: cn('flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between', defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'h-5 w-5 !p-0 min-w-0 rounded-md',
          'text-white bg-white/10 border border-white/20 backdrop-blur-md',
          'hover:bg-white/20 transition-all',
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'h-5 w-5 !p-0 min-w-0 rounded-md',
          'text-white bg-white/10 border border-white/20 backdrop-blur-md',
          'hover:bg-white/20 transition-all',
        ),
        month_caption: cn('flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)', defaultClassNames.month_caption),
        dropdowns: cn('w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5 text-black', defaultClassNames.dropdowns),
        dropdown_root: cn(
          'relative has-focus:border-white/40 border border-white/20 backdrop-blur-md bg-white/10 dark:bg-black/20 shadow-lg has-focus:ring-white/30 has-focus:ring-[3px] rounded-md',
          defaultClassNames.dropdown_root,
          'text-white px-2',
        ),
        dropdown: cn('absolute inset-0 opacity-0', 'appearance-none cursor-pointer focus:outline-none border-left-none text-black', defaultClassNames.dropdown),
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label' ? 'text-sm' : 'rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5',
          defaultClassNames.caption_label,
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn('text-foreground/70 rounded-md flex-1 font-normal text-[0.8rem] select-none', defaultClassNames.weekday),
        week: cn('flex w-full mt-2 gap-0.5', defaultClassNames.week),
        week_number_header: cn('select-none w-(--cell-size)', defaultClassNames.week_number_header),
        week_number: cn('text-[0.8rem] select-none text-foreground/60', defaultClassNames.week_number),
        day: cn(
          'relative w-full h-full p-0.5 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none',
          defaultClassNames.day,
        ),
        range_start: cn('rounded-l-md backdrop-blur-md bg-white/20 dark:bg-white/10', defaultClassNames.range_start),
        range_middle: cn('rounded-none backdrop-blur-sm bg-white/5 dark:bg-white/5', defaultClassNames.range_middle),
        range_end: cn('rounded-r-md backdrop-blur-md bg-white/20 dark:bg-white/10', defaultClassNames.range_end),
        today: cn('backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 rounded-md data-[selected=true]:rounded-none', defaultClassNames.today),
        outside: cn('text-foreground/40 aria-selected:text-foreground/40', defaultClassNames.outside),
        disabled: cn('text-foreground/30 opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return <ChevronLeftIcon className={cn('size-3.5', className)} {...props} />;
          }

          if (orientation === 'right') {
            return <ChevronRightIcon className={cn('size-3.5', className)} {...props} />;
          }

          return <ChevronDownIcon className={cn('size-4', className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">{children}</div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'backdrop-blur-md hover:backdrop-blur-lg transition-all',
        'data-[selected-single=true]:bg-white/30 data-[selected-single=true]:border data-[selected-single=true]:border-white/40 data-[selected-single=true]:shadow-lg',
        'data-[range-middle=true]:bg-white/10 data-[range-middle=true]:border-transparent',
        'data-[range-start=true]:bg-white/30 data-[range-start=true]:border data-[range-start=true]:border-white/40 data-[range-start=true]:shadow-lg',
        'data-[range-end=true]:bg-white/30 data-[range-end=true]:border data-[range-end=true]:border-white/40 data-[range-end=true]:shadow-lg',
        'hover:bg-white/15 dark:hover:bg-white/10',
        'group-data-[focused=true]/day:border-white/50 group-data-[focused=true]/day:ring-white/30',
        'flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal',
        'group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px]',
        'data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md',
        'data-[range-middle=true]:rounded-none',
        'data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md',
        '[&>span]:text-xs [&>span]:opacity-70',
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
