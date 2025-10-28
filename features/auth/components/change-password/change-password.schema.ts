import { z } from 'zod';
export const createChangePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      currentPassword: z.string().min(1, t('current_password_required')),
      newPassword: z
        .string()
        .min(1, t('new_password_required'))
        .min(6, t('new_password_min_length')),
      confirmNewPassword: z.string().min(1, t('confirm_new_password_required')),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t('passwords_must_match'),
      path: ['confirmNewPassword'],
    });
