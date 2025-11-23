'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '../user-profile/user-profile.hook';
import { Box, CircularProgress } from '@mui/material';

type AuthGateProps = {
  children: React.ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
  const { isAuthenticated, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    // Nếu đã load xong và không authenticated (không có user hoặc có lỗi)
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isLoading, isAuthenticated, router]);

  // Hiển thị loading khi đang kiểm tra authentication
  if (isLoading) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  // Nếu không authenticated, không render children (sẽ redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
