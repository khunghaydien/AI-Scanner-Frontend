import { z } from 'zod';

export const createForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t('email_required')).email(t('invalid_email')),
  });
