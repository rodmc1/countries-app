import type { FallbackProps } from 'react-error-boundary';
import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorView({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
      <AlertCircleIcon className="size-8 text-destructive" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-destructive">Failed to load data</p>
        <p className="text-xs text-muted-foreground max-w-xs">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
        <RefreshCwIcon className="size-3.5" />
        Try again
      </Button>
    </div>
  );
}
