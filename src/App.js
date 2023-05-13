import React from 'react';
import { CssBaseline, Container, Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Components
import FormCreateBilling from './Components/FormCreateBilling/FormCreateBilling';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6600',
      light: '#ff983f',
      dark: '#ffffa1',
    },
    accent: {
      main: '#F5F5F5',
      light: '#929292',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#e0e0e0',
    },
    background: {
      paper: '#1D1F21',
      default: '#2c2e30',
      dark: '#444648',
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
    <Box sx={{bgColor: theme.palette.background.paper}}>
      <CssBaseline />
      <Container sx={{ bgcolor: theme.palette.background.dark, height: '100vh' }} maxWidth="lg" >
        <Typography variant="h4" color={theme.palette.primary.light}>
          Sistema de Cobrança de Boletos
        </Typography>
        <FormCreateBilling />
      </Container>
    </Box>
    </ThemeProvider>
  );
}

export default App;