import axios from 'axios';
import type { Country, GeojsResponse, IpapiResponse } from '@/types/country';

const BASE = 'https://restcountries.com/v3.1';
const FIELDS = 'name,currencies,flags,coatOfArms,car,ccn3';

export async function searchCountriesByName(name: string, signal?: AbortSignal): Promise<Country[]> {
  const { data } = await axios.get<Country[]>(`${BASE}/name/${encodeURIComponent(name)}?fields=name,ccn3`, { signal });
  return data;
}

export async function getCountryByNameFullText(name: string): Promise<Country[]> {
  const { data } = await axios.get<Country[]>(
    `${BASE}/name/${encodeURIComponent(name)}?fullText=true&fields=${FIELDS}`
  );
  return data;
}

export async function getCountryByCode(code: string): Promise<Country> {
  const { data } = await axios.get<Country | Country[]>(`${BASE}/alpha/${encodeURIComponent(code)}?fields=${FIELDS}`);
  return Array.isArray(data) ? data[0] : data;
}

export async function getUserCountryCode(): Promise<string> {
  try {
    const { data } = await axios.get<IpapiResponse>('https://ipapi.co/json/');
    if (data.country_code) return data.country_code;
  } catch (error) {
    console.warn('Primary geolocation provider failed, falling back to geojs.io', error);
  }
  const { data } = await axios.get<GeojsResponse>('https://get.geojs.io/v1/ip/country.json');
  return data.country;
}
