'use client';

import { useTranslations } from 'next-intl';
import { useChangePassword } from './change-password.hook';
import Form from '@/components/ui/form';
import { CHANGE_PASSWORD_FIELDS } from '@/consts/auth.const';

export function ChangePassword() {
  const t = useTranslations();
  const { form, error, success, onSubmit } = useChangePassword();
  const {
    formState: { isSubmitting },
  } = form;

  return (
    <Form error={error} success={success} onSubmit={form.handleSubmit(onSubmit)}>
      <Form.Error />
      <Form.Success />

      <Form.Fields form={form} fields={CHANGE_PASSWORD_FIELDS} translations={t} />

      <Form.Submit
        isLoading={isSubmitting}
        loadingText={t('loading')}
        submitText={t('change_password')}
      />
    </Form>
  );
}

export default ChangePassword;
