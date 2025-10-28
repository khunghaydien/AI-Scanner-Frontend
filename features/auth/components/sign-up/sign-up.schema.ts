import { z } from 'zod';

export const createSignUpSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z.string().min(1, t('email_required')).email(t('invalid_email')),
      password: z.string().min(1, t('password_required')).min(6, t('password_min_length')),
      confirmPassword: z.string().min(1, t('confirm_password_required')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwords_must_match'),
      path: ['confirmPassword'],
    });
