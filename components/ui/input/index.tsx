'use client';
import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  Box,
} from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import { UseFormReturn } from 'react-hook-form';
import { FileInput } from '../files';

// All supported input types
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'textarea'
  | 'number'
  | 'tel'
  | 'date'
  | 'datetime-local'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'files';

// Option for select/multiselect
export interface SelectOption {
  value: string | number;
  label: string;
}

export interface FormInputProps {
  name: string;
  type: InputType;
  label?: string;
  placeholder?: string;
  form: UseFormReturn<any>;
  required?: boolean;
  disabled?: boolean;
  className?: string;

  // For textarea
  rows?: number;
  multiline?: boolean;

  // For select/multiselect
  options?: SelectOption[];

  // For checkbox
  size?: 'small' | 'medium';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';

  // For files
  accept?: string;

  // For text-based inputs
  textFieldProps?: Partial<TextFieldProps>;
}

// Shared TextField renderer for all TextField-based inputs
const createTextField = (inputType: string, extraProps?: Partial<TextFieldProps>) => {
  const TextFieldComponent = (props: FormInputProps, register: any, error?: string) => (
    <TextField
      type={inputType}
      placeholder={props.placeholder}
      disabled={props.disabled}
      fullWidth
      variant="outlined"
      error={!!error}
      {...extraProps}
      {...props.textFieldProps}
      helperText={error}
      sx={{
        ...extraProps?.sx,
        ...props.textFieldProps?.sx,
      }}
      InputProps={{
        ...extraProps?.InputProps,
        ...props.textFieldProps?.InputProps,
      }}
      InputLabelProps={{
        ...extraProps?.InputLabelProps,
        ...props.textFieldProps?.InputLabelProps,
      }}
      {...register}
    />
  );
  TextFieldComponent.displayName = `TextField-${inputType}`;
  return TextFieldComponent;
};

// Select input renderer
const SelectInput: React.FC<{
  props: FormInputProps;
  register: any;
  error?: string;
}> = ({ props, register, error }) => (
  <FormControl fullWidth variant="outlined">
    <InputLabel>{props.label}</InputLabel>
    <Select
      disabled={props.disabled}
      label={props.label}
      input={<OutlinedInput label={props.label} />}
      {...register}
    >
      {props.options?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

// Multi-select input renderer
const MultiSelectInput: React.FC<{
  props: FormInputProps;
  register: any;
  error?: string;
}> = ({ props, register, error }) => (
  <FormControl fullWidth variant="outlined">
    <InputLabel>{props.label}</InputLabel>
    <Select
      multiple
      disabled={props.disabled}
      label={props.label}
      input={<OutlinedInput label={props.label} />}
      renderValue={(selected) => (
        <Box className="flex flex-wrap gap-0.5">
          {(selected as string[]).map((value) => {
            const option = props.options?.find((opt) => opt.value === value);
            return <Chip key={value} label={option?.label || value} size="small" />;
          })}
        </Box>
      )}
      {...register}
    >
      {props.options?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

// Checkbox input renderer
const CheckboxInput: React.FC<{
  props: FormInputProps;
  register: any;
  error?: string;
}> = ({ props, register, error }) => (
  <FormControlLabel
    control={
      <Checkbox size={props.size} color={props.color} disabled={props.disabled} {...register} />
    }
    label={props.label}
    labelPlacement={props.labelPlacement}
  />
);

// Files input renderer
const FilesInput: React.FC<{
  props: FormInputProps;
  register: any;
  error?: string;
}> = ({ props, register, error }) => {
  const { onChange, onBlur, ref } = register || {};
  return (
    <FileInput
      name={props.name}
      disabled={props.disabled}
      accept={props.accept}
      error={error}
      onChange={(files: FileList | null) => {
        if (onChange) {
          try {
            // Create a proper event-like object for react-hook-form
            const eventObj = {
              target: {
                name: props.name,
                files: files || null,
                value:
                  files && files.length > 0
                    ? Array.from(files)
                        .map((f) => f.name)
                        .join(', ')
                    : '',
                type: 'file',
              },
              currentTarget: {
                name: props.name,
                files: files || null,
                type: 'file',
              },
            };
            onChange(eventObj);
          } catch (err) {
            console.error('Error in FilesInput onChange:', err);
          }
        }
      }}
      onBlur={onBlur}
      ref={ref}
    />
  );
};

// Textarea input renderer
const TextareaInput: React.FC<{
  props: FormInputProps;
  register: any;
  error?: string;
}> = ({ props, register, error }) =>
  createTextField('text', {
    multiline: true,
    rows: props.rows || 4,
  })(props, register, error);

// Static input renderers object - no recreation on each render
export const inputRenderers = {
  text: (props: any) => createTextField('text')(props.props, props.register, props.error),
  email: (props: any) => createTextField('email')(props.props, props.register, props.error),
  password: (props: any) => createTextField('password')(props.props, props.register, props.error),
  number: (props: any) => createTextField('number')(props.props, props.register, props.error),
  tel: (props: any) => createTextField('tel')(props.props, props.register, props.error),
  date: (props: any) =>
    createTextField('date', { InputLabelProps: { shrink: true } })(
      props.props,
      props.register,
      props.error
    ),
  'datetime-local': (props: any) =>
    createTextField('datetime-local', { InputLabelProps: { shrink: true } })(
      props.props,
      props.register,
      props.error
    ),
  textarea: TextareaInput,
  select: SelectInput,
  multiselect: MultiSelectInput,
  checkbox: CheckboxInput,
  files: FilesInput,
} as const;
