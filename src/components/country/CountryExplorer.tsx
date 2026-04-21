import { useState } from 'react';
import SearchInput from '@/components/country/SearchInput';
import CountryDetail, { CountryDetailSkeleton } from '@/components/country/CountryDetail';
import { useCountrySearch, useCountrySearchByFullName } from '@/hooks/useCountry';
import { type Country } from '@/types/country';
import { DataBoundary } from '../shared/DataBoundary';
import { useQueryClient } from '@tanstack/react-query';

function CountryDetailPanel({ countryName }: { countryName: string }) {
  const { countryDetail, isFetching } = useCountrySearchByFullName(countryName);

  if (!countryDetail) return <CountryDetailSkeleton />;
  return <CountryDetail country={countryDetail} isLoading={isFetching} />;
}

export default function CountryExplorer() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const { countries, isFetching, isError, errorMessage } = useCountrySearch(query, !!selectedCountry);

  const handleInputChange = (value: string) => {
    setQuery(value);
    // Only clear selection when the user actively types something different (not on synthetic empty events from base-ui)
    if (selectedCountry && value.length > 0 && value !== selectedCountry.name.common) {
      setSelectedCountry(null);
    }
  };

  const handleRetry = () => {
    queryClient.refetchQueries({ queryKey: ['countries', 'search'] });
  };

  // When a country is selected, show it as the only item so re-opening the dropdown shows 1 result
  const displayItems = selectedCountry ? [selectedCountry] : countries;

  return (
    <div className="w-full flex flex-col gap-4">
      <SearchInput
        items={displayItems}
        isFetching={isFetching}
        isError={isError}
        errorMessage={errorMessage}
        onInputChange={handleInputChange}
        onSelect={setSelectedCountry}
        onRetry={handleRetry}
      />
      {selectedCountry && (
        <DataBoundary fallback={<CountryDetailSkeleton />}>
          <CountryDetailPanel countryName={selectedCountry.name.common} />
        </DataBoundary>
      )}
    </div>
  );
}
