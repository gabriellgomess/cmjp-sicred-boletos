import { Link } from "react-router-dom";

import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  Container,
  Button,
  MenuItem,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";

import Logo from "../../assets/img/logo_grey.png";

function Header() {
  const theme = useTheme();

  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <img
              width={80}
              src={Logo}
              alt="Logo Casa do Menino Jesus de Praga"
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to={`${process.env.REACT_APP_PATH}`}>
                  <Button
                    sx={{ color: theme.palette.text.primary }}
                    variant="text"
                  >
                    Cadastrar Boleto
                  </Button>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to={`${process.env.REACT_APP_PATH}/cobranca_lote`}>
                  <Button
                    sx={{ color: theme.palette.text.secondary }}
                    variant="text"
                  >
                    Gerar Cobranças em Lote
                  </Button>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to={`${process.env.REACT_APP_PATH}/table`}>
                  <Button
                    sx={{ color: theme.palette.text.primary }}
                    variant="text"
                  >
                    Histórico de boletos
                  </Button>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
            <img
              width={80}
              src={Logo}
              alt="Logo Casa do Menino Jesus de Praga"
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Link to={`${process.env.REACT_APP_PATH}`}>
              <Button
                sx={{ color: theme.palette.text.secondary }}
                variant="text"
              >
                Cadastrar Boleto
              </Button>
            </Link>
            <Link to={`${process.env.REACT_APP_PATH}/cobranca_lote`}>
              <Button
                sx={{ color: theme.palette.text.secondary }}
                variant="text"
              >
                Gerar Cobranças em Lote
              </Button>
            </Link>
            <Link to={`${process.env.REACT_APP_PATH}/table`}>
              <Button
                sx={{ color: theme.palette.text.secondary }}
                variant="text"
              >
                Histórico de boletos
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
