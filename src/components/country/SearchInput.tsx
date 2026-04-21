import { memo, useRef, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Country } from '@/types/country';
import ErrorView from '@/components/shared/ErrorView';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem } from '@/components/ui/combobox';
import { InputGroupAddon } from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';

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
  // base-ui fires synthetic onInputValueChange after selection and on open/close — this skips that one event
  const ignoreNextInputEvent = useRef(false);
  const lastUserValue = useRef('');
  const displayCountResults = !isFetching && isOpen && items.length > 0;

  function handleInputChange(value: string) {
    if (ignoreNextInputEvent.current) {
      ignoreNextInputEvent.current = false;
      return;
    }
    lastUserValue.current = value;
    setInputValue(value);
    onInputChange(value);
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    ignoreNextInputEvent.current = true;
    if (!open) setInputValue(lastUserValue.current);
  }

  function handleValueChange(value: string | null) {
    const country = value ? items.find(c => c.name.common === value) : null;
    if (!country) return;
    ignoreNextInputEvent.current = true;
    lastUserValue.current = country.name.common;
    setInputValue(country.name.common);
    onSelect(country);
  }

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
          {displayCountResults && (
            <InputGroupAddon align="inline-end">
              <span className="text-xs text-muted-foreground pr-2 whitespace-nowrap">
                {items.length} {items.length === 1 ? 'result' : 'results'}
              </span>
            </InputGroupAddon>
          )}
        </ComboboxInput>
      </div>
      <ComboboxContent anchor={anchorRef} className="min-w-0">
        {isFetching && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
            <Spinner size="sm" />
            Searching...
          </div>
        )}
        {!isFetching && isError && (
          <ErrorView
            error={new Error(errorMessage ?? 'Failed to fetch countries.')}
            resetErrorBoundary={() => onRetry?.()}
          />
        )}
        {!isFetching && !isError && (
          <>
            <ComboboxEmpty>
              {inputValue.trim().length === 0
                ? 'Please enter a country name to search.'
                : 'No countries found. Try a different name.'}
            </ComboboxEmpty>
            <VirtualCountryList items={items} />
          </>
        )}
      </ComboboxContent>
    </Combobox>
  );
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
    <div
      ref={setScrollEl}
      className="max-h-72 overflow-y-auto overscroll-contain p-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:block [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-track]:bg-muted/30">
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map(vItem => {
          const country = items[vItem.index];
          return (
            <div
              key={country.name.official}
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
    </div>
  );
}

const VirtualCountryList = memo(VirtualCountryListImpl);
