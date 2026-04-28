import { CarFrontIcon, CoinsIcon, Loader2Icon, ShieldIcon, FlagIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { Country } from '@/types/country';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CountryDetailProps {
  country: Country;
  isLoading?: boolean;
}

export default function CountryDetail({ country, isLoading }: CountryDetailProps) {
  if (isLoading) return <CountryDetailSkeleton />;

  const currencies = country.currencies ? Object.values(country.currencies) : [];
  const drivingSide = country.car.side === 'right' ? 'Right' : 'Left';

  return (
    <Card className="w-full">
      <CardHeader className="border-b pb-4">
        <CardDescription className="text-xs uppercase tracking-widest font-medium">Official Name</CardDescription>
        <CardTitle className="text-lg font-semibold leading-tight">{country.name.official}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <DetailField icon={FlagIcon} label="Flag">
            <DetailImage
              key={`flag-${country.name.official}`}
              src={country.flags.svg}
              alt={country.flags.alt ?? `Flag of ${country.name.common}`}
              fit="contain"
            />
          </DetailField>

          <DetailField icon={ShieldIcon} label="Coat of Arms">
            {country.coatOfArms.svg ? (
              <DetailImage
                key={`coat-${country.name.official}`}
                src={country.coatOfArms.svg}
                alt={`Coat of arms of ${country.name.common}`}
                fit="contain"
              />
            ) : (
              <div className="rounded-lg ring-1 ring-foreground/10 bg-muted/30 h-36 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Not available</span>
              </div>
            )}
          </DetailField>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <DetailField icon={CoinsIcon} label="Currency">
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
          </DetailField>

          <DetailField icon={CarFrontIcon} label="Driving Side">
            <span className="flex font-medium">{drivingSide}</span>
          </DetailField>
        </div>
      </CardContent>
    </Card>
  );
}

interface DetailFieldProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}

function DetailField({ icon: Icon, label, children }: DetailFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <Icon className="size-3" />
        {label}
      </span>
      {children}
    </div>
  );
}

interface DetailImageProps {
  src: string;
  alt: string;
  fit: 'cover' | 'contain';
}

function DetailImage({ src, alt, fit }: DetailImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative rounded-lg overflow-hidden ring-1 ring-foreground/10 bg-muted/30 h-36">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2Icon className="size-6 text-muted-foreground animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full shadow-xl ${fit === 'cover' ? 'object-cover' : 'object-contain p-3'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export function CountryDetailSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="border-b pb-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-3/4 mt-1" />
      </CardHeader>

      <CardContent className="flex flex-col gap-6 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <SkeletonField imageHeight />
          <SkeletonField imageHeight />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <SkeletonField />
          <SkeletonField />
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonField({ imageHeight }: { imageHeight?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className={imageHeight ? 'h-36 w-full rounded-lg' : 'h-5 w-32'} />
    </div>
  );
}
