'use client';

import { useEffect } from 'react';
import clsx from 'clsx';
import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import FormInput from '@/components/ui/form/form-input';

interface GlobalSearchProps {
  className?: string;
  placeholderKey?: string;
  debounceMs?: number;
  defaultValue?: string;
  onSearch?: (value: string) => void;
}

type GlobalSearchFormValues = {
  query: string;
};

const GlobalSearch = ({
  className,
  placeholderKey = 'global_search_placeholder',
  debounceMs = 300,
  defaultValue = '',
  onSearch,
}: GlobalSearchProps) => {
  const t = useTranslations();
  const form = useForm<GlobalSearchFormValues>({
    mode: 'onChange',
    defaultValues: {
      query: defaultValue,
    },
  });

  const queryValue = form.watch('query');
  const safeDebounce = Math.max(0, debounceMs);

  useEffect(() => {
    if (!onSearch) return;

    const handler = setTimeout(() => {
      onSearch(queryValue?.trim() ?? '');
    }, safeDebounce);

    return () => clearTimeout(handler);
  }, [queryValue, safeDebounce, onSearch]);

  const handleSubmit = form.handleSubmit(({ query }) => {
    onSearch?.((query ?? '').trim());
  });

  return (
    <Box
      component="form"
      role="search"
      onSubmit={handleSubmit}
      className={clsx('w-full', className)}
    >
      <FormInput
        name="query"
        type="text"
        form={form}
        placeholder={t(placeholderKey)}
        className="w-full"
      />
    </Box>
  );
};

export default GlobalSearch;

