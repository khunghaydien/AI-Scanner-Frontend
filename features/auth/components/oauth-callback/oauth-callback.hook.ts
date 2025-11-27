'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { tokenStorage } from '@/lib/auth/token-storage';

export function useOAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken) {
      // Lưu tokens vào localStorage
      tokenStorage.setTokens(accessToken, refreshToken || undefined);

      // Xóa tokens khỏi URL để bảo mật
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('accessToken');
      newUrl.searchParams.delete('refreshToken');
      
      // Replace URL mà không reload page
      window.history.replaceState({}, '', newUrl.pathname);

      // Invalidate và refetch user profile
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.refetchQueries({ queryKey: ['auth', 'me'] });

      // Nếu đang ở sign-in page, redirect về home
      if (window.location.pathname === '/sign-in') {
        router.push('/');
        router.refresh();
      }
    }
  }, [searchParams, router, queryClient]);
}

