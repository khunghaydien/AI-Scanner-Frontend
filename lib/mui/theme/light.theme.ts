import { createTheme } from '@mui/material/styles';
import { MuiTheme } from './index';
// Create light theme with MUI theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'hsl(24.6, 95%, 53.1%)', // --primary from globals.css
    },
    secondary: {
      main: 'hsl(60, 4.8%, 95.9%)', // --secondary from globals.css
    },
    background: {
      default: 'hsl(0, 0%, 100%)', // --background from globals.css
      paper: 'hsl(0, 0%, 100%)', // --card from globals.css
    },
    text: {
      primary: 'hsl(20, 14.3%, 4.1%)', // --foreground from globals.css
      secondary: 'hsl(25, 5.3%, 44.7%)', // --muted-foreground from globals.css
    },
    divider: 'hsl(20, 5.9%, 90%)', // --border from globals.css
    error: {
      main: 'hsl(0, 84.2%, 60.2%)', // --destructive from globals.css
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  shape: {
    borderRadius: 8, // Matches --radius: 0.5rem
  },
  components: MuiTheme(false),
});
