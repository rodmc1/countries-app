import Instructions from '@/components/country/Instructions';
import CountryExplorer from '@/components/country/CountryExplorer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">🌍 Country Explorer</h1>
        </div>
        <Instructions />
        <CountryExplorer />
      </div>
    </main>
  );
}
