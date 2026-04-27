import { useMemo, useState } from 'react';
import SearchInput from '@/components/country/SearchInput';
import CountryDetail, { CountryDetailSkeleton } from '@/components/country/CountryDetail';
import { useCountrySearch, useCountrySearchByFullName, useUserCountry } from '@/hooks/useCountry';
import { type Country } from '@/types/country';
import { DataBoundary } from '../shared/DataBoundary';

function CountryDetailPanel({ country }: { country: Country }) {
  const needsFetch = !!country.name.common;
  const { countryDetail, isFetching } = useCountrySearchByFullName(needsFetch ? country.name.common : '');
  const display = needsFetch ? countryDetail : country;

  if (!display) return <CountryDetailSkeleton />;
  return <CountryDetail country={display} isLoading={isFetching} />;
}

export default function CountryExplorer() {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [pinnedCountry, setPinnedCountry] = useState<Country | null>(null);
  const { countries, isFetching, isError, errorMessage, refetch } = useCountrySearch(query, !!selectedCountry);
  const { country: userCountry } = useUserCountry();
  const displayedCountry = pinnedCountry ?? userCountry;

  const handleInputChange = (value: string) => {
    setQuery(value);
    // Reset results
    if (selectedCountry && value !== selectedCountry.name.common) {
      setSelectedCountry(null);
    }
  };

  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
    setPinnedCountry(country);
  };

  const handleRetry = () => {
    refetch();
  };

  const displayItems = useMemo(() => (selectedCountry ? [selectedCountry] : countries), [selectedCountry, countries]);

  return (
    <div className="w-full flex flex-col gap-4">
      <SearchInput
        items={displayItems}
        isFetching={isFetching}
        isError={isError}
        errorMessage={errorMessage}
        onInputChange={handleInputChange}
        onSelect={handleSelect}
        onRetry={handleRetry}
      />
      {displayedCountry && (
        <DataBoundary fallbackSkeleton={<CountryDetailSkeleton />}>
          <CountryDetailPanel country={displayedCountry} />
        </DataBoundary>
      )}
    </div>
  );
}
