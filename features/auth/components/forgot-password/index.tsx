'use client';

import { useTranslations } from 'next-intl';
import { Link, Box } from '@mui/material';
import { useForgotPassword } from './forgot-password.hook';
import Form from '@/components/ui/form';
import { FORGOT_PASSWORD_FIELDS } from '@/consts/auth.const';

export function ForgotPassword() {
  const t = useTranslations();
  const { form, error, success, onSubmit } = useForgotPassword();
  const {
    formState: { isSubmitting },
  } = form;

  return (
    <Form error={error} success={success} onSubmit={form.handleSubmit(onSubmit)}>
      <Form.Error />
      <Form.Success />

      <Form.Fields form={form} fields={FORGOT_PASSWORD_FIELDS} translations={t} />

      <Form.Submit
        isLoading={isSubmitting}
        loadingText={t('loading')}
        submitText={t('send_reset_email')}
      />

      {/* Back to Sign In Link */}
      <Form.Content>
        <Box className="text-center mt-2">
          <Link href="/sign-in" className="cursor-pointer">
            {t('back_to_sign_in')}
          </Link>
        </Box>
      </Form.Content>
    </Form>
  );
}

export default ForgotPassword;
