import axios from 'axios';
import type { Country } from '@/types/country';

const BASE = 'https://restcountries.com/v3.1';
const FIELDS = 'name,currencies,flags,coatOfArms,car';

export async function searchCountriesByName(name: string): Promise<Country[]> {
  const { data } = await axios.get<Country[]>(`${BASE}/name/${name}?fields=name`);
  return data;
}

export async function getCountryByNameFullText(name: string): Promise<Country[]> {
  const { data } = await axios.get<Country[]>(
    `${BASE}/name/${encodeURIComponent(name)}?fullText=true&fields=${FIELDS}`
  );
  return data;
}
