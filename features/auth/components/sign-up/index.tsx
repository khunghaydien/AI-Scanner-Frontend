'use client';

import { useTranslations } from 'next-intl';
import { useSignUp } from './sign-up.hook';
import Form from '@/components/ui/form';
import { SIGN_UP_FIELDS } from '@/consts/auth.const';
import { SocialSignIn } from '../social-sign-in';

export function SignUp() {
  const t = useTranslations();
  const { form, error, onSubmit } = useSignUp();
  const {
    formState: { isSubmitting },
  } = form;

  return (
    <Form error={error} onSubmit={form.handleSubmit(onSubmit)}>
      <Form.Error />

      <Form.Fields form={form} fields={SIGN_UP_FIELDS} translations={t} />

      <SocialSignIn />
      <Form.Submit
        isLoading={isSubmitting}
        loadingText={t('loading')}
        submitText={t('create_account')}
      />
    </Form>
  );
}

export default SignUp;
