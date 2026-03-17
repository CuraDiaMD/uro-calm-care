import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DateOfBirthPickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder: string;
}

const MIN_YEAR = 1900;
const ROW_HEIGHT_CLASS = 'h-11';
const WHEEL_PADDING_CLASS = 'py-[88px]';

const monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' });
const monthLabels = Array.from({ length: 12 }, (_, monthIndex) => monthFormatter.format(new Date(2024, monthIndex, 1)));

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

const clampDateParts = (year: number, month: number, day: number) => {
  const today = new Date();
  const maxYear = today.getFullYear();

  if (year > maxYear) {
    return {
      year: maxYear,
      month: today.getMonth(),
      day: today.getDate(),
    };
  }

  const maxMonth = year === maxYear ? today.getMonth() : 11;
  const safeMonth = Math.min(month, maxMonth);
  const monthMaxDay = getDaysInMonth(year, safeMonth);
  const maxDay = year === maxYear && safeMonth === today.getMonth() ? today.getDate() : monthMaxDay;

  return {
    year,
    month: safeMonth,
    day: Math.min(day, maxDay),
  };
};

const getInitialParts = (value: Date | null) => {
  const fallback = new Date(1990, 0, 1);
  const source = value ?? fallback;

  return clampDateParts(source.getFullYear(), source.getMonth(), source.getDate());
};

interface WheelColumnProps {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  label: string;
}

function WheelColumn({ items, selectedIndex, onSelect, label }: WheelColumnProps) {
  return (
    <div className="relative flex-1 overflow-hidden rounded-[1.25rem] border border-border bg-background/70">
      <div className="pointer-events-none absolute inset-x-3 top-1/2 z-10 -translate-y-1/2 rounded-xl border border-border bg-muted/80 shadow-sm">
        <div className={ROW_HEIGHT_CLASS} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background via-background/95 to-background/0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/95 to-background/0" />
      <ScrollArea className="h-72">
        <div className={cn('space-y-1 px-2', WHEEL_PADDING_CLASS)} aria-label={label} role="listbox">
          {items.map((item, index) => {
            const isSelected = index === selectedIndex;

            return (
              <button
                key={`${label}-${item}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelect(index)}
                className={cn(
                  'w-full rounded-xl px-3 text-center text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  ROW_HEIGHT_CLASS,
                  isSelected
                    ? 'bg-secondary text-secondary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export function DateOfBirthPicker({ value, onChange, placeholder }: DateOfBirthPickerProps) {
  const [open, setOpen] = useState(false);
  const [{ year, month, day }, setParts] = useState(() => getInitialParts(value));
  const today = useMemo(() => new Date(), []);
  const years = useMemo(() => {
    const currentYear = today.getFullYear();
    return Array.from({ length: currentYear - MIN_YEAR + 1 }, (_, index) => String(currentYear - index));
  }, [today]);

  useEffect(() => {
    if (!open) {
      setParts(getInitialParts(value));
    }
  }, [open, value]);

  const maxMonthIndex = year === today.getFullYear() ? today.getMonth() : 11;
  const monthOptions = monthLabels.slice(0, maxMonthIndex + 1);
  const safeMonth = Math.min(month, maxMonthIndex);
  const maxDay = year === today.getFullYear() && safeMonth === today.getMonth()
    ? today.getDate()
    : getDaysInMonth(year, safeMonth);
  const dayOptions = Array.from({ length: maxDay }, (_, index) => String(index + 1));
  const safeDay = Math.min(day, maxDay);
  const selectedYearIndex = years.indexOf(String(year));

  useEffect(() => {
    if (safeMonth !== month || safeDay !== day) {
      setParts((current) => ({ ...current, month: safeMonth, day: safeDay }));
    }
  }, [day, month, safeDay, safeMonth]);

  const commitSelection = () => {
    onChange(new Date(year, safeMonth, safeDay));
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-md rounded-t-[1.75rem] border-border bg-background px-0 pb-0">
        <DrawerHeader className="space-y-3 px-4 pb-2 pt-3 text-left">
          <DrawerTitle className="text-base font-semibold text-foreground">Date of Birth</DrawerTitle>
          <Select
            value={String(year)}
            onValueChange={(selectedYear) => {
              const next = clampDateParts(Number(selectedYear), month, day);
              setParts(next);
            }}
          >
            <SelectTrigger className="h-10 w-full rounded-xl border-border bg-background text-left text-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((yearOption) => (
                <SelectItem key={yearOption} value={yearOption}>
                  {yearOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DrawerHeader>

        <div className="grid grid-cols-3 gap-3 px-4 pb-4 pt-2">
          <WheelColumn
            label="Month"
            items={monthOptions}
            selectedIndex={safeMonth}
            onSelect={(nextMonth) => {
              const next = clampDateParts(year, nextMonth, day);
              setParts(next);
            }}
          />
          <WheelColumn
            label="Day"
            items={dayOptions}
            selectedIndex={safeDay - 1}
            onSelect={(nextDayIndex) => {
              setParts((current) => ({ ...current, day: nextDayIndex + 1 }));
            }}
          />
          <WheelColumn
            label="Year"
            items={years}
            selectedIndex={selectedYearIndex}
            onSelect={(nextYearIndex) => {
              const next = clampDateParts(Number(years[nextYearIndex]), month, day);
              setParts(next);
            }}
          />
        </div>

        <DrawerFooter className="border-t border-border bg-background/95 px-4 pb-6 pt-3 backdrop-blur-sm">
          <div className="flex gap-2">
            <DrawerClose asChild>
              <Button variant="ghost" className="flex-1 rounded-xl">Cancel</Button>
            </DrawerClose>
            <Button className="flex-1 rounded-xl" onClick={commitSelection}>Done</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
