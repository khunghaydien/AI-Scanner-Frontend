// Shared form field configuration interface
export interface FormFieldConfig {
  name: string;
  type: string;
  labelKey?: string;
  placeholderKey: string;
  required?: boolean;
  accept?: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

// Common auth form data interfaces
export interface BaseAuthData {
  email: string;
}

export interface PasswordAuthData extends BaseAuthData {
  password: string;
}

export interface ConfirmPasswordAuthData extends PasswordAuthData {
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Common form field configurations
export const EMAIL_FIELD: FormFieldConfig = {
  name: 'email',
  type: 'email',
  labelKey: 'email',
  placeholderKey: 'email',
  required: true,
};

export const PASSWORD_FIELD: FormFieldConfig = {
  name: 'password',
  type: 'password',
  labelKey: 'password',
  placeholderKey: 'password',
  required: true,
};

export const CONFIRM_PASSWORD_FIELD: FormFieldConfig = {
  name: 'confirmPassword',
  type: 'password',
  labelKey: 'confirm_password',
  placeholderKey: 'confirm_password',
  required: true,
};

export const CURRENT_PASSWORD_FIELD: FormFieldConfig = {
  name: 'currentPassword',
  type: 'password',
  labelKey: 'current_password',
  placeholderKey: 'current_password',
  required: true,
};

export const NEW_PASSWORD_FIELD: FormFieldConfig = {
  name: 'newPassword',
  type: 'password',
  labelKey: 'new_password',
  placeholderKey: 'new_password',
  required: true,
};

export const CONFIRM_NEW_PASSWORD_FIELD: FormFieldConfig = {
  name: 'confirmNewPassword',
  type: 'password',
  labelKey: 'confirm_new_password',
  placeholderKey: 'confirm_new_password',
  required: true,
};

export const CHANGE_PASSWORD_FIELDS: FormFieldConfig[] = [
  CURRENT_PASSWORD_FIELD,
  NEW_PASSWORD_FIELD,
  CONFIRM_NEW_PASSWORD_FIELD,
];

export const FORGOT_PASSWORD_FIELDS: FormFieldConfig[] = [EMAIL_FIELD];

export const SIGN_IN_FIELDS: FormFieldConfig[] = [EMAIL_FIELD, PASSWORD_FIELD];

export const SIGN_UP_FIELDS: FormFieldConfig[] = [
  EMAIL_FIELD,
  PASSWORD_FIELD,
  CONFIRM_PASSWORD_FIELD,
];
