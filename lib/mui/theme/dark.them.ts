import { createTheme } from '@mui/material/styles';
import { MuiTheme } from './index';
// Create dark theme with MUI theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'hsl(20.5, 90.2%, 48.2%)', // --primary dark from globals.css
    },
    secondary: {
      main: 'hsl(12, 6.5%, 15.1%)', // --secondary dark from globals.css
    },
    background: {
      default: 'hsl(20, 14.3%, 4.1%)', // --background dark from globals.css
      paper: 'hsl(20, 14.3%, 4.1%)', // --card dark from globals.css
    },
    text: {
      primary: 'hsl(60, 9.1%, 97.8%)', // --foreground dark from globals.css
      secondary: 'hsl(24, 5.4%, 63.9%)', // --muted-foreground dark from globals.css
    },
    divider: 'hsl(12, 6.5%, 15.1%)', // --border dark from globals.css
    error: {
      main: 'hsl(0, 72.2%, 50.6%)', // --destructive dark from globals.css
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  shape: {
    borderRadius: 8,
  },
  components: MuiTheme(true),
});
