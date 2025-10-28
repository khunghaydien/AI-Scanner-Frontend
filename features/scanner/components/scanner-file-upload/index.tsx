'use client';

import { useTranslations } from 'next-intl';
import { useScanner } from './scanner.hook';
import Form from '@/components/ui/form';
import { SCANNER_FIELDS } from '@/consts/scanner.const';

export function ScannerFileUpload() {
  const t = useTranslations();
  const { form, error, onSubmit } = useScanner(t);
  const {
    formState: { isSubmitting },
  } = form;

  return (
    <Form error={error} onSubmit={form.handleSubmit(onSubmit)}>
      <Form.Error />

      <Form.Fields
        form={form}
        fields={SCANNER_FIELDS.map((field) => ({
          ...field,
          labelKey: '',
        }))}
        translations={t}
      />

      <Form.Submit
        isLoading={isSubmitting}
        loadingText={t('loading')}
        submitText={t('scan_files')}
      />
    </Form>
  );
}

export default ScannerFileUpload;
