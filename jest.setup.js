import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key,
  getMessages: () => ({}),
  getLocale: () => 'en',
  NextIntlClientProvider: ({ children }) => children,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock Material-UI theme
jest.mock('@mui/material/styles', () => ({
  ThemeProvider: ({ children }) => children,
  createTheme: jest.fn(() => ({})),
  useTheme: jest.fn(() => ({})),
}));

// Global test setup
global.fetch = jest.fn();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
