import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

// PrivateRoute é um componente React usado para proteger rotas que requerem autenticação.
// Ele verifica se o usuário está autenticado e pertence a um dos grupos permitidos (se especificado).
// decide se renderiza o conteúdo protegido (children),
// ou redireciona o usuário para a página de login/home.
export default function PrivateRoute({ children, allowedGroups }) {

    // O hook useAuth é usado para acessar o contexto de autenticação.
    const { isAuthenticated, user, loading } = useAuth();

    // Enquanto está carregando, não renderiza nada
    // Evita redirecionamento incorreto
    if (loading) {
        return null;
    }

    // Se não estiver autenticado, redireciona para o login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Se houver restrição de grupos e o grupo do usuário não estiver na lista permitida, redireciona para home
    if (allowedGroups && (!user || !allowedGroups.includes(user.grupo))) {
        return <Navigate to="/home" replace />;
    }

    // Se o usuário estiver autenticado e autorizado, renderiza os filhos
    return children;
}
// Validação das props do componente
PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired, // children deve ser um nó React e é obrigatório
    allowedGroups: PropTypes.arrayOf(PropTypes.number) // allowedGroups é uma array de números de grupo
};