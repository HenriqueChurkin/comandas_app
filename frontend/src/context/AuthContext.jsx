import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
// Criação do contexto
const AuthContext = createContext();
// Provedor do contexto
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Verificar autenticação ao carregar o componente
    useEffect(() => {
        const checkAuth = () => {
            if (authService.isAuthenticated()) {
                setIsAuthenticated(true);
                // Buscar dados do usuário logado
                authService.getUserData().then(userData => {
                    if (userData) {
                        setUser(userData);
                    }
                });
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // Função para login com API real
    const login = async (cpf, senha) => {
        try {
            setLoading(true);
            // chama o service de autenticação para fazer o login
            const result = await authService.login(cpf, senha);
            if (result.success) {
                setIsAuthenticated(true);
                // Buscar dados do usuário após login
                const userData = await authService.getUserData();
                setUser(userData);
                navigate("/home");
                return true;
            } else {
                // Emite evento para SnackbarGlobal
                window.dispatchEvent(new CustomEvent('showSnackbar', {
                    detail: { message: result.error, severity: 'error' }
                }));
                return false;
            }
        } catch (error) {
            console.error('Erro no login:', error);
            window.dispatchEvent(new CustomEvent('showSnackbar', {
                detail: { message: 'Erro ao conectar com o servidor', severity: 'error' }
            }));
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Função para logout
    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };
    // Objeto com os valores e funções do contexto
    const value = { isAuthenticated, user, loading, login, logout, isTokenExpiringSoon: authService.isTokenExpiringSoon(), };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);