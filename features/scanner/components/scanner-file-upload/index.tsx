'use client';

import { useTranslations } from 'next-intl';
import { Box, Typography, Chip, Alert, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useMedia } from './scanner.hook';
import Form from '@/components/ui/form';
import { SCANNER_FIELDS } from '@/consts/scanner.const';
import { FileItem } from '@/components/ui/files/file-input/file-item';
import { useCallback, useState } from 'react';
import { FilePreview } from '@/components/ui/files/file-preview';

export function ScannerFileUpload() {
  const t = useTranslations();
  const { 
    form, 
    error, 
    onSubmit, 
    onSubmitMagicScannerBatch, 
    onSubmitMagicScannerChunked,
    isLoading, 
    isMagicScannerBatchLoading, 
    isMagicScannerChunkedLoading,
    response 
  } = useMedia(t);
  const {
    formState: { isSubmitting },
  } = form;
  const [previewUrl, setPreviewUrl] = useState<boolean>(false);

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

        <Box className="flex gap-2 flex-wrap">
          <Form.Submit
            isLoading={isSubmitting || isLoading}
            loadingText={t('loading')}
            submitText={t('scan_files')}
          />
          <Button
            type="button"
            variant="contained"
            fullWidth
            disabled={isSubmitting || isLoading || isMagicScannerBatchLoading || isMagicScannerChunkedLoading}
            onClick={() => {
              form.handleSubmit(onSubmitMagicScannerBatch)();
            }}
            className="mt-2"
          >
            {isMagicScannerBatchLoading ? t('loading') : (t('magic_scanner_batch') || 'Magic Scanner Batch')}
          </Button>
          <Button
            type="button"
            variant="contained"
            fullWidth
            disabled={isSubmitting || isLoading || isMagicScannerBatchLoading || isMagicScannerChunkedLoading}
            onClick={() => {
              form.handleSubmit(onSubmitMagicScannerChunked)();
            }}
            className="mt-2"
          >
            {isMagicScannerChunkedLoading ? t('loading') : (t('magic_scanner_chunked') || 'Magic Scanner Chunked')}
          </Button>
        </Box>
      </Form>
      {(response as any)?.results[0]?.id &&
        <Box className="mt-6 w-full">
          <FileItem key={(response as any)?.results[0]?.id}
            file={(response as any)?.results[0]?.fileUrl}
            flags={{ isImage: false, isPdf: true, isWord: false, isTxt: false }}
            onPreview={() => setPreviewUrl(true)}
            onRemove={() => setPreviewUrl(false)}
            previewUrl={(response as any)?.results[0]?.fileUrl}
          />
          {previewUrl && (
            <FilePreview
              open={true}
              onClose={() => { setPreviewUrl(false) }}
              file={new File([], 'preview', { type: 'application/pdf' })}
              previewUrl={(response as any)?.results[0]?.fileUrl}
            />
          )}
        </Box>
      }
    </>
  );
}

export default ScannerFileUpload;
