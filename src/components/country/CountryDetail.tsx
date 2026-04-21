import { useState, useEffect } from 'react';
import { CarFrontIcon, CoinsIcon, Loader2Icon, ShieldIcon, FlagIcon } from 'lucide-react';
import type { Country } from '@/types/country';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CountryDetailProps {
  country: Country;
  isLoading?: boolean;
}

export function CountryDetailSkeleton() {
  return (
    <Card className="w-full">
      {/* Official Name */}
      <CardHeader className="border-b pb-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-3/4 mt-1" />
      </CardHeader>

      <CardContent className="flex flex-col gap-6 pt-4">
        {/* Flag & Coat of Arms */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-36 w-full rounded-lg" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-36 w-full rounded-lg" />
          </div>
        </div>

        {/* Currency & Driving Side */}
        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CountryDetail({ country, isLoading }: CountryDetailProps) {
  if (isLoading) return <CountryDetailSkeleton />;

  const [flagLoaded, setFlagLoaded] = useState(false);
  const [coatLoaded, setCoatLoaded] = useState(false);

  useEffect(() => {
    setFlagLoaded(false);
    setCoatLoaded(false);
  }, [country.name.official]);

  const currencies = country.currencies ? Object.values(country.currencies) : [];
  const hasCoatOfArms = !!country.coatOfArms.svg;
  const drivingSide = country.car.side;

  return (
    <Card className="w-full">
      {/* Official Name */}
      <CardHeader className="border-b pb-4">
        <CardDescription className="text-xs uppercase tracking-widest font-medium">Official Name</CardDescription>
        <CardTitle className="text-lg font-semibold leading-tight">{country.name.official}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 pt-4">
        {/* Flag & Coat of Arms */}
        <div className="grid grid-cols-2 gap-4">
          {/* Flag */}
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <FlagIcon className="size-3" />
              Flag
            </span>
            <div className="relative rounded-lg overflow-hidden ring-1 ring-foreground/10 bg-muted/30 h-36">
              {!flagLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2Icon className="size-6 text-muted-foreground animate-spin" />
                </div>
              )}
              <img
                src={country.flags.svg}
                alt={country.flags.alt ?? `Flag of ${country.name.common}`}
                className="w-full h-36 object-cover"
                onLoad={() => setFlagLoaded(true)}
              />
            </div>
          </div>

          {/* Coat of Arms */}
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <ShieldIcon className="size-3" />
              Coat of Arms
            </span>
            <div className="relative rounded-lg overflow-hidden ring-1 ring-foreground/10 bg-muted/30 flex items-center justify-center h-36">
              {hasCoatOfArms ? (
                <>
                  {!coatLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2Icon className="size-6 text-muted-foreground animate-spin" />
                    </div>
                  )}
                  <img
                    src={country.coatOfArms.svg}
                    alt={`Coat of arms of ${country.name.common}`}
                    className="h-full w-full object-contain p-3"
                    onLoad={() => setCoatLoaded(true)}
                  />
                </>
              ) : (
                <span className="text-xs text-muted-foreground">Not available</span>
              )}
            </div>
          </div>
        </div>

        {/* Currency & Driving Side */}
        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          {/* Currency */}
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <CoinsIcon className="size-3" />
              Currency
            </span>
            {currencies.length > 0 ? (
              <div className="flex flex-col gap-1">
                {currencies.map(currency => (
                  <div key={currency.name} className="flex items-baseline gap-2">
                    <span className="font-medium text-sm">{currency.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                      {currency.symbol}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>

          {/* Driving Side */}
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <CarFrontIcon className="size-3" />
              Driving Side
            </span>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold`}>
                {drivingSide === 'right' ? 'Right' : 'Left'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
