// arquivo de rotas da aplicação usando React Router v6, a versão mais recente do React Router
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import RestrictedRoute from "./RestrictedRoute";

// Lazy Loading para otimização (code-splitting)
// Os componentes das páginas são carregados de forma assíncrona usando React.lazy.
// Suspense + lazy() dividem o código em chunks separados, melhorando o desempenho.
const Dashboard = lazy(() => import("../pages/Dashboard"));
const FuncionarioList = lazy(() => import("../pages/FuncionarioList"));
const FuncionarioForm = lazy(() => import("../pages/FuncionarioForm"));
const ClienteList = lazy(() => import("../pages/ClienteList"));
const ClienteForm = lazy(() => import("../pages/ClienteForm"));
const ProdutoList = lazy(() => import("../pages/ProdutoList"));
const ProdutoForm = lazy(() => import("../pages/ProdutoForm"));
const LoginForm = lazy(() => import("../components/forms/LoginForm"));
const NotFound = lazy(() => import("../pages/Notfound"));

// Loader para o Suspense - melhora a experiência do usuário em aplicações maiores.
// Sempre que uma rota for acessada, o Suspense exibirá o fallback (Carregando...) até que o componente da rota seja carregado.
const Loading = () => <div>Carregando...</div>;

const AppRoutes = () => {
  return (
    // O componente Suspense foi adicionado ao redor do Routes para exibir um fallback (<Loading />) enquanto os componentes são carregados.
    // O fallback é exibido enquanto os componentes carregados com React.lazy estão sendo baixados.
    // Isso melhora a experiência do usuário, especialmente em aplicações maiores onde o carregamento pode levar mais tempo.
    // O Suspense é uma funcionalidade do React que permite lidar com o carregamento assíncrono de componentes.
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Redireciona a rota raiz para a página de login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas públicas - sem necessidade de autenticação */}
        <Route path="/produtos/publica" element={<ProdutoList />} />

        {/* Rotas restritas - somente se não estiver logado */}
        <Route path="/login" element={<RestrictedRoute><LoginForm /></RestrictedRoute>} />

        {/* Rotas protegidas - somente se estiver logado */}
        <Route path="/home" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/produtos" element={<PrivateRoute><ProdutoList /></PrivateRoute>} />
        <Route path="/produto" element={<PrivateRoute><ProdutoForm /></PrivateRoute>} />
        <Route path="/funcionarios" element={<PrivateRoute><FuncionarioList /></PrivateRoute>} />
        <Route path="/funcionario" element={<PrivateRoute><FuncionarioForm /></PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><ClienteList /></PrivateRoute>} />
        <Route path="/cliente" element={<PrivateRoute><ClienteForm /></PrivateRoute>} />

        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
export default AppRoutes;