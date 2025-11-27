'use client';

import { Suspense } from 'react';
import { useOAuthCallback } from './oauth-callback.hook';

function OAuthCallbackHandler() {
  useOAuthCallback();
  return null;
}

export function OAuthCallback() {
  return (
    <Suspense fallback={null}>
      <OAuthCallbackHandler />
    </Suspense>
  );
}

