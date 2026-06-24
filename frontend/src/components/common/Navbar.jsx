import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Dashboard, People, Group, RestaurantMenu, Receipt, PointOfSale, Logout, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useState } from 'react';
import UserProfile from './UserProfile';
import { USER_GROUPS } from '../../constants/userGroups';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuth();

    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);

    const handleLogout = () => {
        logout();
    };

    const menuItems = [
        { label: 'Dashboard', icon: <Dashboard />, path: '/home' },
        ...(user?.grupo === USER_GROUPS.ADMINISTRADOR ? [{ label: 'Funcionários', icon: <People />, path: '/funcionarios' }] : []),
        { label: 'Clientes', icon: <Group />, path: '/clientes' },
        { label: 'Produtos', icon: <RestaurantMenu />, path: '/produtos' },
        { label: 'Comandas', icon: <Receipt />, path: '/comandas' },
        ...(user?.grupo === USER_GROUPS.ADMINISTRADOR || user?.grupo === USER_GROUPS.CAIXA ? [{ label: 'Caixa', icon: <PointOfSale />, path: '/caixa' }] : [])
    ];

    const handleDrawerToggle = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileAnchorEl(null);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'left', width: 250 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Menu
                </Typography>
            </Box>

            <List>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}
                    >
                        <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>

            <Divider />

            <List>
                <ListItem
                    onClick={handleLogout}
                    sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' } }}
                >
                    <ListItemIcon sx={{ color: 'error.main' }}>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Sair" sx={{ color: 'error.main' }} />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <AppBar position="sticky" elevation={2}>
            <Toolbar sx={{ minHeight: 64, px: { xs: 1, sm: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: { xs: '1.2rem', sm: '1.5rem' },
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
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                            {menuItems.map((item) => (
                                <Tooltip key={item.path} title={item.label} arrow>
                                    <Button
                                        color="inherit"
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            minWidth: 'auto',
                                            px: 1.5,
                                            py: 1,
                                            borderRadius: 2,
                                            alignItems: 'center',
                                            gap: 0.5,
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            },
                                        }}
                                    >
                                        {item.icon}
                                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                                            {item.label}
                                        </Typography>
                                    </Button>
                                </Tooltip>
                            ))}

                            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#f59e0b' }}>
                                    {user?.nome ? user.nome.charAt(0).toUpperCase() : <AccountCircle />}
                                </Avatar>
                            </IconButton>

                            <Tooltip title="Sair" arrow>
                                <IconButton
                                    color="inherit"
                                    onClick={handleLogout}
                                    sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
                                >
                                    <Logout />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
                            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#f59e0b' }}>
                                    {user?.nome ? user.nome.charAt(0).toUpperCase() : <AccountCircle />}
                                </Avatar>
                            </IconButton>

                            <IconButton
                                color="inherit"
                                onClick={handleDrawerToggle}
                                sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    </Box>
                )}
            </Toolbar>

            <Drawer
                variant="temporary"
                open={mobileDrawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 250,
                    },
                }}
            >
                {drawer}
            </Drawer>

            <UserProfile anchorEl={profileAnchorEl} onClose={handleProfileMenuClose} />
        </AppBar>
    );
};

export default Navbar;