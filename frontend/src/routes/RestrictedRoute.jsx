import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// RestrictedRoute é um componente React usado para restringir acesso a rotas específicas.
// Ele verifica se o usuário NÃO está autenticado e, com base nisso,
// decide se redireciona o usuário para uma rota específica
// ou permite acesso à rota atual.
export default function RestrictedRoute({ children }) {

  // O hook useAuth é usado para acessar o contexto de autenticação.
  const { isAuthenticated, loading } = useAuth();

  // Enquanto está carregando, não renderiza nada
  // evita redirecionamento incorreto
  if (loading) {
    return null;
  }

  // O valor de isAuthenticated indica se o usuário está autenticado ou não.
  // Se o usuário está autenticado, redireciona para home
  // Se não está autenticado, permite acesso à rota
  return !isAuthenticated ? children : <Navigate to="/home" replace />;
  
}