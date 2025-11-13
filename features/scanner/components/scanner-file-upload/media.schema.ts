import { z } from 'zod';

export const createMediaSchema = (t: (key: string) => string) =>
  z.object({
    files: z
      .any()
      .refine(
        (files) => {
          if (!files) return false;
          // Handle FileList
          if (files instanceof FileList) return files.length > 0;
          // Handle array of files
          if (Array.isArray(files)) return files.length > 0;
          return false;
        },
        {
          message: t('files_required'),
        }
      )
      .refine(
        (files) => {
          if (!files) return false;
          const length = files instanceof FileList ? files.length : files?.length || 0;
          return length <= 100;
        },
        {
          message: t('max_files_exceeded'),
        }
      ),
  });

