'use client';

import { useTranslations } from 'next-intl';
import { Box, Typography, Divider, Button, Link, Stack } from '@mui/material';
import { useSocialAuth } from './social-sign-in.hook';
import { IconGoogle } from '@/components/icons';

export function SocialSignIn() {
  const t = useTranslations();
  const { signInWithGoogle, isLoading, error } = useSocialAuth();

  return (
    <Box>
      <Stack spacing={3}>
        {/* Divider */}
        <Box className="flex items-center gap-2">
          <Divider className="flex-1" />
          <Typography color="text.secondary" className="px-2">
            {t('or')}
          </Typography>
          <Divider className="flex-1" />
        </Box>

        {/* Social buttons */}
        <Box className="flex gap-2">
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
        </Box>

        {/* Terms and policies */}
        <Typography color="text.secondary" textAlign="center">
          {t('by_continuing')}
          <Link href="/terms-and-policies" color="primary" className="cursor-pointer">
            {t('terms_and_policies')}
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}

export default SocialSignIn;
