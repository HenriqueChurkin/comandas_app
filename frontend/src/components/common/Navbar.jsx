import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Dashboard, People, Group, RestaurantMenu, Receipt, PointOfSale, Logout, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useState } from 'react';

const Navbar = () => {

  // useNavigate é um hook do React Router que permite programaticamente navegar entre rotas
  const navigate = useNavigate();

  // useAuth é um hook personalizado que fornece acesso ao contexto de autenticação
  // logouut é uma função que realiza o logout do usuário
  // isAuthenticated é um booleano que indica se o usuário está autenticado ou não
  const { isAuthenticated, logout } = useAuth();

  // Estado para controlar a abertura do drawer mobile
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Chama a função de logout do contexto de autenticação
  const handleLogout = () => {
    logout();
  };

  // Itens do menu com ícones e rotas
  const menuItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/home' },
    { label: 'Funcionários', icon: <People />, path: '/funcionarios' },
    { label: 'Clientes', icon: <Group />, path: '/clientes' },
    { label: 'Produtos', icon: <RestaurantMenu />, path: '/produtos' },
    { label: 'Comandas', icon: <Receipt />, path: '/comandas' },
    { label: 'Caixa', icon: <PointOfSale />, path: '/caixa' }
  ];

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Componente do drawer mobile
  // parte 1 - copiar da próxima página
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'left', width: 250 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          Menu
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} onClick={() => navigate(item.path)} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}>
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem onClick={handleLogout} sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' } }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Sair" sx={{ color: 'error.main' }} />
        </ListItem>
      </List>
    </Box>
  );
  // Componente do navbar
  // parte 2 - copiar da próxima página
  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar sx={{ minHeight: 64, px: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700, background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', display: 'flex', alignItems: 'center', gap: 1,
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }}
          >
            <RestaurantMenu sx={{ color: '#f59e0b', fontSize: { xs: '1.5rem', sm: '2rem' } }} />
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Comandas do Zé
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Zé
            </Box>
          </Typography>
        </Box>
        {isAuthenticated && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

            {/*  parte 3 - copiar menus da próxima página */}

            {/* Menu Desktop - sm e acima */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              {menuItems.map((item) => (
                <Tooltip key={item.path} title={item.label} arrow>
                  <Button
                    color="inherit"
                    onClick={() => navigate(item.path)}
                    sx={{
                      minWidth: 'auto', px: 1.5, py: 1, borderRadius: 2, alignItems: 'center', gap: 0.5,
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                  >
                    {item.icon}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>{item.label}</Typography>
                  </Button>
                </Tooltip>
              ))}
              <Tooltip title="Perfil" arrow>
                <IconButton color="inherit">
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#f59e0b' }}>
                    <AccountCircle />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Tooltip title="Sair" arrow>
                <IconButton
                  color="inherit" onClick={handleLogout} sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
                >
                  <Logout />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Menu Mobile - xs e abaixo */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
              <Tooltip title="Perfil" arrow>
                <IconButton color="inherit">
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#f59e0b' }}>
                    <AccountCircle />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <IconButton
                color="inherit" onClick={handleDrawerToggle} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

          </Box>
        )}
      </Toolbar>

      {/* Drawer Mobile */}
      <Drawer
        variant="temporary" open={mobileDrawerOpen} onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 }, }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );

};

export default Navbar;