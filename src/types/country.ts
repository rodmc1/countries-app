export interface Country {
  name: { common: string; official: string };
  currencies?: Record<string, { name: string; symbol: string }>;
  flags: { svg: string; alt?: string };
  coatOfArms: { svg?: string };
  car: { side: 'left' | 'right' };
  ccn3: string;
}

export type IpapiResponse = { country_code: string };
export type GeojsResponse = { country: string };
