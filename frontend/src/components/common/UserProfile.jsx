import { Menu, Typography, Box, Avatar, Chip } from '@mui/material';
import { Email, Phone, Badge, AccountCircle, Work } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getGrupoInfo } from '../../constants/userGroups';
const UserProfile = ({ anchorEl, onClose }) => {
    // Obtém o usuário do contexto de autenticação
    const { user } = useAuth();
    const open = Boolean(anchorEl);
    return (
        <Menu
            anchorEl={anchorEl} open={open} onClose={onClose} onClick={onClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            sx={{
                '& .MuiPaper-root': {
                    overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))', mt: 1.5,
                    '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                    '&:before': {
                        content: '""', display: 'block', position: 'absolute',
                        top: 0, right: 14, width: 10, height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
        >
            {/* Cabeçalho do perfil */}
            <Box sx={{ p: 2, minWidth: 280 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: '#f59e0b', fontSize: '1.2rem' }}>
                        {user?.nome ? user.nome.charAt(0).toUpperCase() : <AccountCircle />}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {user?.nome || 'Carregando...'}
                        </Typography>
                        <Chip
                            label={getGrupoInfo(user?.grupo).label} color={getGrupoInfo(user?.grupo).color}
                            size="small" sx={{ fontSize: '0.7rem' }}
                        />
                    </Box>
                </Box>
                {/* Informações detalhadas do usuário */}
                {user && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {user.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                            </Box>
                        )}
                        {user.cpf && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Badge sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    CPF: {user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                                </Typography>
                            </Box>
                        )}
                        {user.telefone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {user.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                                </Typography>
                            </Box>
                        )}
                        {user.matricula && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Work sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">Matrícula: {user.matricula}</Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Menu>
    );
};
export default UserProfile;