'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@mui/material';
import { useSocialAuth } from './social-sign-in.hook';
import { IconGoogle } from '@/components/icons';

export function SocialSignIn() {
  const t = useTranslations();
  const { signInWithGoogle, isLoading } = useSocialAuth();

  return (
    <div className="flex gap-2">
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={signInWithGoogle}
        disabled={isLoading}
        startIcon={<IconGoogle />}
        className="justify-start"
      >
        {isLoading ? t('loading') : t('google')}
      </Button>
    </div>
  );
}

export default SocialSignIn;
