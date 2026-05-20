import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Container, ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme"; // estilos globais
import { ToastContainer } from 'react-toastify';
import Navbar from "./components/common/Navbar"; // componente reutilizável de navegação
import AppRoutes from "./routes/Router"; // rotas da aplicação

function App() {
  return (
    // aplica o tema global ao aplicativo - Material UI
    <ThemeProvider theme={theme}>
      {/* normaliza estilos CSS */}
      <CssBaseline />
      {/* BrowserRouter é o roteador principal que gerencia as rotas da aplicação */}
      <BrowserRouter>
        {/* O AuthProvider envolve toda a aplicação, permitindo que os componentes filhos acessem o contexto de autenticação */}
        <AuthProvider>
          {/* Navbar é o componente de navegação que contém os links para as diferentes páginas da aplicação */}
          <Navbar />
          {/* Container é um componente do Material-UI que fornece um layout responsivo e centralizado */}
          <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}>
            {/* AppRoutes é o componente que contém as rotas da aplicação, definindo quais componentes devem ser renderizados em cada rota */}
            <AppRoutes />
          </Container>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;
