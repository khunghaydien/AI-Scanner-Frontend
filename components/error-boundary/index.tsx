'use client';

import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Fallback translations when context is not available
const fallbackTranslations: Record<string, string> = {
  error_boundary_title: 'Oops! Something went wrong',
  error_boundary_message: "We're sorry, but something unexpected happened. Please try again.",
  try_again: 'Try Again',
};

// ErrorFallback component - uses fallback translations since ErrorBoundary
// is placed outside NextIntlClientProvider to catch errors from it
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  // Use fallback translations since ErrorBoundary is outside NextIntlClientProvider
  // This ensures the error boundary always works, even if NextIntlClientProvider fails
  const title = fallbackTranslations.error_boundary_title;
  const message = fallbackTranslations.error_boundary_message;
  const tryAgainText = fallbackTranslations.try_again;

  return (
    <Box className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <Paper elevation={3} className="p-4 max-w-[500px] text-center">
        <Typography variant="h4" className="text-error mb-2">
          {title}
        </Typography>

        <Typography variant="body1" className="text-secondary mb-2">
          {message}
        </Typography>

        {process.env.NODE_ENV === 'development' && (
          <Box className="mt-2 p-2 bg-grey-100 rounded-1">
            <Typography variant="caption" component="pre" className="text-0.75rem">
              {error.message}
            </Typography>
          </Box>
        )}

        <Button variant="contained" color="primary" onClick={resetErrorBoundary} className="mt-2">
          {tryAgainText}
        </Button>
      </Paper>
    </Box>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default function ErrorBoundary({
  children,
  fallback: Fallback = ErrorFallback,
  onError,
}: ErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Error caught by boundary:', error, errorInfo);
      // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
    } else {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    onError?.(error, errorInfo);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={Fallback}
      onError={handleError}
      onReset={() => {
        // Clear any error state
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
