import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Criação do contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
    // Inicializa o estado com base no valor do sessionStorage
    // // sessionStorage é um armazenamento temporário que persiste enquanto a aba estiver aberta
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem("loginRealizado") === "true";
    });

    // useNavigate é um hook do React Router que permite programaticamente navegar entre rotas
    const navigate = useNavigate();

    // Função para login
    // // ainda com dados fixos, posteriormente será implementado chamada à API
    const login = (cpf, senha) => {
        if (cpf === "1" && senha === "senhaforte") {
            setIsAuthenticated(true);
            sessionStorage.setItem("loginRealizado", "true");
            navigate("/home");
        } else {
            alert("Usuário ou senha inválidos!");
        }
    };

    // Função para logout
    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("loginRealizado");
        navigate("/login");
    };
    
    return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};
// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);