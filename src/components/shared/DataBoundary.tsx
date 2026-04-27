import { Suspense } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorView from './ErrorView';

interface Props {
  children: React.ReactNode;
  fallbackSkeleton?: React.ReactNode;
  customErrorView?: React.ComponentType<FallbackProps>;
}

export const DataBoundary = ({ children, fallbackSkeleton, customErrorView }: Props) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary onReset={reset} FallbackComponent={customErrorView || ErrorView}>
        <Suspense fallback={fallbackSkeleton || <LoadingSkeleton />}>{children}</Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
