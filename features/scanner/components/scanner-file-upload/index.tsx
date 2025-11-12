'use client';

import { useTranslations } from 'next-intl';
import { Box, Typography, Chip, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useMedia } from './scanner.hook';
import Form from '@/components/ui/form';
import { SCANNER_FIELDS } from '@/consts/scanner.const';
import { FileItem } from '@/components/ui/files/file-input/file-item';
import { useCallback, useState } from 'react';
import { FilePreview } from '@/components/ui/files/file-preview';

function UploadResponse({ response }: { response: any }) {
  if (!response) return null;
  const { results } = response;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  return (
    <Box className="mt-6 w-full">
      {results && results.length > 0 && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item: any) => (
            <FileItem key={item.scanned?.id}
              file={item.scanned}
              flags={{ isImage: false, isPdf: true, isWord: false, isTxt: false }}
              onPreview={() => { setPreviewUrl(item.scanned?.fileUrl) }}
              onRemove={() => { setPreviewUrl(null) }}
              previewUrl={item.scanned?.fileUrl}
            />
          ))}
        </Box>
      )}

      {previewUrl && (
        <FilePreview
          open={true}
          onClose={() => { setPreviewUrl(null) }}
          file={new File([], 'preview', { type: 'application/pdf' })}
          previewUrl={previewUrl}
        />
      )}
    </Box>
  );
}

export function ScannerFileUpload() {
  const t = useTranslations();
  const { form, error, onSubmit, response } = useMedia(t);
  const {
    formState: { isSubmitting },
  } = form;

  return (
    <>
      <Form error={error} onSubmit={form.handleSubmit(onSubmit)}>
        
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
      <UploadResponse response={response} />
    </>
  );
}

export default ScannerFileUpload;
