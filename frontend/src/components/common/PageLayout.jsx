import { Box, Typography, Paper } from '@mui/material';
import fotolinda from '../../assets/fotolinda.jpeg';

const PageLayout = ({ children, title, actions, maxWidth = 'lg' }) => (
    <Box sx={{
        width: '100%',
        maxWidth: maxWidth === 'lg' ? 1200 : maxWidth === 'md' ? 900 : 600,
        mx: 'auto',
        p: { xs: 1, sm: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }}>

        <Box sx={{ width: '100%', maxWidth: '100%' }}>

            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 3,
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    color: 'white',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >

                    <img
                        src="/src/assets/fotolinda.jpeg"
                        alt="Perfil"
                        style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid white'
                        }}
                    />

                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 600,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: {
                                xs: '1.5rem',
                                sm: '2rem',
                                md: '2.5rem'
                            }
                        }}
                    >
                        {title}
                    </Typography>

                </Box>

                {actions && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center'
                        }}
                    >
                        {actions}
                    </Box>
                )}

            </Paper>

            <Paper
                elevation={1}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3,
                    backgroundColor: 'background.paper',
                    minHeight: 400,
                    width: '100%'
                }}
            >
                {children}
            </Paper>

        </Box>

    </Box>
);

export default PageLayout;