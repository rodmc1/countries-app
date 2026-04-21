import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { searchCountriesByName, getCountryByNameFullText } from '@/api/countries';
import type { Country } from '@/types/country';

function extractErrorMessage(error: unknown): string | undefined {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return undefined;
}

export function useCountrySearch(query: string, disabled = false) {
  const trimmedQuery = query.trim();
  const [debouncedQuery] = useDebounce(trimmedQuery, 500);

  const { data, isFetching, isError, error } = useQuery<Country[]>({
    queryKey: ['countries', 'search', debouncedQuery],
    queryFn: () => searchCountriesByName(debouncedQuery),
    enabled: !disabled && debouncedQuery.length > 0,
    staleTime: 1000 * 60 * 10,
    retry: false
  });

  return {
    countries: data ?? [],
    isFetching: isFetching && debouncedQuery.length > 0,
    isError,
    errorMessage: extractErrorMessage(error)
  };
}

export function useCountrySearchByFullName(query: string) {
  const { data, isFetching, isError, error } = useQuery<Country[]>({
    queryKey: ['countries', 'search', 'fullText', query],
    queryFn: () => getCountryByNameFullText(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 10,
    retry: false,
    throwOnError: true
  });

  return {
    countryDetail: data?.[0] ?? null,
    isFetching: isFetching && query.length > 0,
    isError,
    errorMessage: extractErrorMessage(error)
  };
}
