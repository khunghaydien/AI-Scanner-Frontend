import { z } from 'zod';

export const createSignInSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t('email_required')).email(t('invalid_email')),
    password: z.string().min(1, t('password_required')).min(6, t('password_min_length')),
    rememberMe: z.boolean().optional(),
  });
