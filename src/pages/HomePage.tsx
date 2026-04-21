import Instructions from '@/components/country/Instructions';
import CountryExplorer from '@/components/country/CountryExplorer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <header className="flex flex-col items-center text-center gap-3">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Country Explorer</h1>
            <p className="text-sm text-muted-foreground">Discover country details from around the world.</p>
          </div>
        </header>
        <Instructions />
        <CountryExplorer />
      </div>
    </main>
  );
}
