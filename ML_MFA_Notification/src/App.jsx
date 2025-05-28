import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ServiceForm from './components/ServiceForm';
import './App.css';

// Create a custom theme with black and cement colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black color for primary elements
    },
    secondary: {
      main: '#ccc5b9', // Cement/gray color for secondary elements
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevents uppercase transformation of button text
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <ServiceForm />
      </div>
    </ThemeProvider>
  );
}

export default App;
