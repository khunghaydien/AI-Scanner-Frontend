'use client';

import { useUserProfile } from './user-profile.hook';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function UserProfile() {
  const { user, isAuthenticated, isLoading, signOut } = useUserProfile();
  const t = useTranslations();

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center p-2">
        <CircularProgress size={20} className="mr-1" />
        <Typography>{t('loading')}</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Typography onClick={signOut} className="cursor-pointer hover:underline">
      {user?.name}
    </Typography>
  );
}
