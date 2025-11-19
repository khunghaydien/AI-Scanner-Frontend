export const MuiTheme = (isDark: boolean) => ({
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        height: '40px',
        borderRadius: 8,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: isDark ? 'hsl(20, 5.9%, 90%)' : 'hsl(20, 5.9%, 90%)',
        },
        '&:hover': {
          '& .MuiOutlinedInput-notchedOutline': {
            border: `1px solid ${isDark ? 'hsl(20, 5.9%, 90%)' : 'hsl(20, 5.9%, 90%)'}`,
          },
        },
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            border: `1px solid ${isDark ? 'hsl(20, 5.9%, 90%)' : 'hsl(20, 5.9%, 90%)'}`,
          },
        },
        '&.MuiInputBase-multiline': {
          height: 'auto',
        },
      },
      input: {
        padding: '0 12px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        fontSize: '16px',
        fontWeight: 600,
        height: '50px',
        borderRadius: 8,
        textTransform: 'none' as const,
      },
      containedPrimary: {
        color: '#ffffff !important',
        '&:hover': {
          color: '#ffffff !important',
        },
        '&:focus': {
          color: '#ffffff !important',
        },
        '&:active': {
          color: '#ffffff !important',
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        borderBottom: 'none',
      },
      indicator: {
        backgroundColor: isDark ? 'hsl(20.5, 90.2%, 48.2%)' : 'hsl(24.6, 95%, 53.1%)',
        height: 2,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none' as const,
        fontSize: '16px',
        fontWeight: 500,
        color: isDark ? 'hsl(24, 5.4%, 63.9%)' : 'hsl(25, 5.3%, 44.7%)',
        '&.Mui-selected': {
          color: isDark ? 'hsl(60, 9.1%, 97.8%)' : 'hsl(20, 14.3%, 4.1%)',
          fontWeight: 600,
        },
        '&:hover': {
          color: isDark ? 'hsl(20.5, 90.2%, 48.2%)' : 'hsl(24.6, 95%, 53.1%)',
        },
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: isDark ? 'hsl(24, 5.4%, 63.9%)' : 'hsl(25, 5.3%, 44.7%)',
        '&.Mui-checked': {
          color: isDark ? 'hsl(20.5, 90.2%, 48.2%)' : 'hsl(24.6, 95%, 53.1%)',
        },
        '&:hover': {
          backgroundColor: isDark ? 'hsl(20.5, 90.2%, 48.2%, 0.1)' : 'hsl(24.6, 95%, 53.1%, 0.1)',
        },
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      label: {
        fontSize: '14px',
        color: isDark ? 'hsl(60, 9.1%, 97.8%)' : 'hsl(20, 14.3%, 4.1%)',
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        textDecoration: 'none',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        color: isDark ? 'hsl(24, 5.4%, 63.9%)' : 'hsl(25, 5.3%, 44.7%)',
        '& .MuiSvgIcon-root': {
          fontSize: '1.5rem',
        },
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          color: isDark ? 'hsl(60, 9.1%, 97.8%)' : 'hsl(20, 14.3%, 4.1%)',
          transform: 'scale(1.05)',
        },
        "&.Mui-selected, &[aria-pressed='true']": {
          backgroundColor: isDark ? 'hsl(20.5, 90.2%, 48.2%)' : 'hsl(24.6, 95%, 53.1%)',
          color: '#ffffff',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          transform: 'scale(1.05)',
          '&:hover': {
            backgroundColor: isDark ? 'hsl(20.5, 90.2%, 48.2%)' : 'hsl(24.6, 95%, 53.1%)',
            color: '#ffffff',
          },
        },
        // Custom size variants
        '&.MuiIconButton-sizeSmall': {
          width: '32px',
          height: '32px',
          '& .MuiSvgIcon-root': {
            fontSize: '1.25rem',
          },
        },
        '&.MuiIconButton-sizeLarge': {
          width: '48px',
          height: '48px',
          '& .MuiSvgIcon-root': {
            fontSize: '2rem',
          },
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: isDark ? 'hsl(60, 9.1%, 97.8%)' : 'hsl(20, 14.3%, 4.1%)',
        color: isDark ? 'hsl(20, 14.3%, 4.1%)' : 'hsl(60, 9.1%, 97.8%)',
        fontSize: '0.75rem',
        fontWeight: 400,
        padding: '4px 8px',
        borderRadius: '4px',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        maxWidth: 'none',
        whiteSpace: 'nowrap',
      },
      arrow: {
        color: isDark ? 'hsl(60, 9.1%, 97.8%)' : 'hsl(20, 14.3%, 4.1%)',
      },
    },
  },
});
