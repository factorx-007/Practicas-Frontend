'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

// Type for error with response property
interface ErrorWithResponse extends Error {
  response?: {
    status?: number;
  };
}

// Type guard for ErrorWithResponse
function isErrorWithResponse(error: unknown): error is ErrorWithResponse {
  return (
    error instanceof Error &&
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            retry: (failureCount, error) => {
              // Use the type guard to check for error with response
              if (isErrorWithResponse(error)) {
                const status = error.response?.status;
                // Don't retry on 4xx errors except 408, 409, 429
                if (status && status >= 400 && status < 500) {
                  if (status === 408 || status === 409 || status === 429) {
                    return failureCount < 2;
                  }
                  return false;
                }
              }
              // For other errors, retry up to 3 times
              return failureCount < 3;
            },
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: 'always',
          },
          mutations: {
            retry: (failureCount, error) => {
              // Don't retry mutations on client errors (4xx)
              if (isErrorWithResponse(error) && error.response?.status) {
                if (error.response.status >= 400 && error.response.status < 500) {
                  return false;
                }
              }
              // Retry network errors up to 2 times
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}