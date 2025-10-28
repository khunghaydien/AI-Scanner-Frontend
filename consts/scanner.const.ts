// Shared form field configuration interface
import { FormFieldConfig } from './auth.const';

export const FILES_FIELD: FormFieldConfig = {
  name: 'files',
  type: 'files',
  placeholderKey: 'select_files',
  accept: 'image/*,.doc,.docx,.txt,.pdf,.xlsx,.xls',
  required: true,
};

export const SCANNER_FIELDS: FormFieldConfig[] = [FILES_FIELD];
