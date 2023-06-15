import React, {useState, useEffect} from 'react';
import { CssBaseline, Container, Box, Typography, Button, Switch, FormControlLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Routes, Route } from 'react-router-dom';

// Páginas
import FormCadastro from './Pages/FormCadastro';
import TableBilling from './Pages/TableBilling';
import FormCadastroLote from './Pages/FormCadastroLote';

// Componentes
import Header from './Components/Header/Header';

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#cd2122',
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

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#cd2122',
      light: '#ff983f',
      dark: '#ff983f',
    },
    accent: {
      main: '#1D1F21',
      light: '#7a7a7a',
    },
    text: {
      primary: '#1D1F21',
      secondary: '#1D1F21',
    },
    background: {
      paper: '#FFFFFF',
      default: '#F5F5F5',
      dark: '#e0e0e0',
    },
  },
});

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") === "dark" ? darkTheme : lightTheme);

  useEffect(() => {
    localStorage.setItem("theme", theme === darkTheme ? "dark" : "light");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === darkTheme ? lightTheme : darkTheme);
  };

  return (
    <ThemeProvider theme={theme}>    
    <Header />   
    <Box sx={{bgColor: theme.palette.background.paper}}>      
      <CssBaseline />      
      <Container sx={{ bgcolor: theme.palette.background.dark, minHeight: '100vh', paddingBottom: '60px' }} maxWidth="lg" >
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'end'}}>
          <FormControlLabel
            control={<Switch checked={theme === lightTheme} onChange={toggleTheme} />}
            label={theme === lightTheme ? 'Modo Escuro' : 'Modo Claro'}
            labelPlacement="top"
          /> 
        </Box>           
        <Routes>
          <Route path={`${process.env.REACT_APP_PATH}`} element={<FormCadastro />} />
          <Route path={`${process.env.REACT_APP_PATH}/cobranca_lote`} element={<FormCadastroLote />} />
          <Route path={`${process.env.REACT_APP_PATH}/table`} element={<TableBilling />} />
        </Routes>        
      </Container>
    </Box>
    </ThemeProvider>
  );
}

export default App;