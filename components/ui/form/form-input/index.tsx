import React from 'react';
import { Box, Typography } from '@mui/material';
import { FormInputProps, inputRenderers } from '@/components/ui/input';

interface FormInputWrapperProps {
  label?: string;
  required?: boolean;
  type: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormInputWrapper: React.FC<FormInputWrapperProps> = ({
  label,
  required,
  type,
  error,
  children,
  className,
}) => {
  const hasError = !!error;

  return (
    <Box className={`relative flex-1 ${className}`}>
      {/* Label */}
      {label && type !== 'checkbox' && (
        <Typography
          variant="body2"
          component="label"
          className="block font-medium mb-1 text-primary"
        >
          {label}
          {required && (
            <Typography component="span" className="text-error ml-0.5">
              *
            </Typography>
          )}
        </Typography>
      )}

      {/* Input Component */}
      {children}

      {/* Error Message */}
      {hasError && (
        <Typography
          variant="caption"
          className="text-error absolute bottom-[-20px] left-0 text-0.75rem"
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

const FormInput: React.FC<FormInputProps> = (props) => {
  const { name, form, type, label, required = false, className } = props;
  const {
    register,
    formState: { errors },
  } = form;
  const error = errors[name]?.message as string;

  // Get the static renderer for this input type
  const renderInput = inputRenderers[type];
  const inputElement = renderInput({ props, register: register(name) });

  return (
    <FormInputWrapper
      label={label}
      required={required}
      type={type}
      error={error}
      className={className}
    >
      {inputElement}
    </FormInputWrapper>
  );
};

export default FormInput;
