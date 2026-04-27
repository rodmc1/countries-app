import { memo, useRef, useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import type { Country } from '@/types/country';
import ErrorView from '@/components/shared/ErrorView';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem } from '@/components/ui/combobox';
import { InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SearchInputProps {
  items: Country[];
  isFetching?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onInputChange: (query: string) => void;
  onSelect: (country: Country) => void;
  onRetry?: () => void;
}

const ROW_HEIGHT = 50;

export default function SearchInput({
  items,
  isFetching,
  isError,
  errorMessage,
  onInputChange,
  onSelect,
  onRetry
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const ignoreNextInputEvent = useRef(false);
  const lastUserValue = useRef('');
  const displayCountResults = !isFetching && isOpen && items.length > 0;

  const handleInputChange = (value: string) => {
    // skips event - base-ui fires synthetic onInputValueChange after selection
    if (ignoreNextInputEvent.current) {
      ignoreNextInputEvent.current = false;
      return;
    }
    lastUserValue.current = value;
    setInputValue(value);
    onInputChange(value);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      ignoreNextInputEvent.current = true;
      setInputValue(lastUserValue.current);
    }
  };

  const handleValueChange = (value: string | null) => {
    const country = value ? items.find(c => c.name.common === value) : null;
    if (!country) return;
    ignoreNextInputEvent.current = true;
    lastUserValue.current = country.name.common;
    setInputValue(country.name.common);
    onSelect(country);
  };

  const handleClear = () => {
    lastUserValue.current = '';
    setInputValue('');
    setIsOpen(false);
    onInputChange('');
  };

  return (
    <Combobox
      items={items}
      inputValue={inputValue}
      onInputValueChange={handleInputChange}
      onValueChange={handleValueChange}
      onOpenChange={handleOpenChange}
      filter={() => true}>
      <div ref={anchorRef}>
        <ComboboxInput placeholder="Search a country..." className="w-full" autoFocus showTrigger={false}>
          <InputGroupAddon>{isFetching ? <Spinner size="sm" /> : <SearchIcon />}</InputGroupAddon>
          {(displayCountResults || inputValue.length > 0) && (
            <InputGroupAddon align="inline-end">
              {displayCountResults && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {items.length} {items.length === 1 ? 'Result' : 'Results'}
                </span>
              )}
              {inputValue.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        size="icon-xs"
                        aria-label="Clear"
                        onMouseDown={e => e.preventDefault()}
                        onClick={handleClear}>
                        <XIcon />
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent className="pb-2">Clear</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </InputGroupAddon>
          )}
        </ComboboxInput>
      </div>
      <ComboboxContent anchor={anchorRef} className="min-w-0">
        <ComboboxResults
          query={inputValue}
          items={items}
          isFetching={isFetching}
          isError={isError}
          errorMessage={errorMessage}
          onRetry={onRetry}
        />
      </ComboboxContent>
    </Combobox>
  );
}

interface ComboboxResultsProps {
  query: string;
  items: Country[];
  isFetching?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

function ComboboxResults({ query, items, isFetching, isError, errorMessage, onRetry }: ComboboxResultsProps) {
  if (query.trim().length === 0) return <ComboboxEmpty>Type to search.</ComboboxEmpty>;
  if (isError)
    return (
      <ErrorView error={new Error(errorMessage ?? 'Something went wrong.')} resetErrorBoundary={() => onRetry?.()} />
    );
  if (isFetching) return <ComboboxEmpty>Searching...</ComboboxEmpty>;
  if (items.length === 0) return <ComboboxEmpty>No items found.</ComboboxEmpty>;
  return <VirtualCountryList items={items} />;
}

function VirtualCountryListImpl({ items }: { items: Country[] }) {
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollEl,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5
  });

  return (
    <ComboboxPrimitive.List
      ref={setScrollEl}
      className="max-h-72 overflow-y-auto overscroll-contain p-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:block [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-track]:bg-muted/30">
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map(vItem => {
          const country = items[vItem.index];
          return (
            <div
              key={country.ccn3}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${vItem.start}px)`
              }}>
              <ComboboxItem value={country.name.common}>
                <div className="flex flex-col">
                  <span>{country.name.common}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {country.name.official || country.name.common}
                  </span>
                </div>
              </ComboboxItem>
            </div>
          );
        })}
      </div>
    </ComboboxPrimitive.List>
  );
}

const VirtualCountryList = memo(VirtualCountryListImpl);
