'use client';

import { useTranslations } from 'next-intl';
import { Link, Box } from '@mui/material';
import { useSignIn } from './sign-in.hook';
import Form from '@/components/ui/form';
import FormInput from '@/components/ui/form/form-input';
import { SIGN_IN_FIELDS } from '@/consts/auth.const';
import { SocialSignIn } from '../social-sign-in';

export function SignIn() {
  const t = useTranslations();
  const { form, error, onSubmit } = useSignIn();
  const {
    formState: { isSubmitting },
  } = form;

  return (
    <Form error={error} onSubmit={form.handleSubmit(onSubmit)}>
      <Form.Error />
      <Form.Fields form={form} fields={SIGN_IN_FIELDS} translations={t} />

      {/* Remember Me and Forgot Password Row */}
      <Form.Content>
        <Box className="flex items-center justify-between">
          <FormInput name="rememberMe" type="checkbox" label={t('remember_me')} form={form} />
          <Link href="/forgot-password" className="cursor-pointer">
            {t('forgot_password')}
          </Link>
        </Box>
      </Form.Content>

      <Form.Submit isLoading={isSubmitting} loadingText={t('loading')} submitText={t('sign_in')} />
      <SocialSignIn />
    </Form>
  );
}

export default SignIn;
