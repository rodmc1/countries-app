// src/components/shared/DataBoundary.tsx
import { Suspense } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorView from './ErrorView';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const DataBoundary = ({ children, fallback }: Props) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary onReset={reset} FallbackComponent={ErrorView}>
        <Suspense fallback={fallback || <LoadingSkeleton />}>{children}</Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
