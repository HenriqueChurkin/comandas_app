// Configurações da API com variáveis de ambiente VITE
// Endpoints da API centralizados
const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login', // POST - retorna access e refresh token
        REFRESH: '/auth/refresh', // POST - retorna novos access e refresh token
        ME: '/auth/me', // GET - dados do usuário atual
        LOGOUT: '/auth/logout', // POST - logout de usuário
    },

    FUNCIONARIO: {
        LIST: '/funcionario/', // GET - listar funcionários
        GET: '/funcionario/:id', // GET - buscar funcionário por id
        CREATE: '/funcionario/', // POST - criar funcionário
        UPDATE: '/funcionario/:id', // PUT - atualizar funcionário
        DELETE: '/funcionario/:id', // DELETE - remover funcionário
    },

    CLIENTE: {
        LIST: '/cliente/', // GET - listar clientes
        GET: '/cliente/:id', // GET - buscar cliente por id
        CREATE: '/cliente/', // POST - criar cliente
        UPDATE: '/cliente/:id', // PUT - atualizar cliente
        DELETE: '/cliente/:id', // DELETE - remover cliente
    },

    PRODUTO: {
        PUBLIC: '/produto/public', // GET - listar produtos públicos
        LIST: '/produto/', // GET - listar produtos
        GET: '/produto/:id', // GET - buscar produto
        CREATE: '/produto/', // POST - criar produto
        UPDATE: '/produto/:id', // PUT - atualizar produto
        DELETE: '/produto/:id', // DELETE - remover produto
    },

    COMANDA: {
        LIST: '/comanda/', // GET - listar comandas
        GET: '/comanda/:id', // GET - buscar comanda
        CREATE: '/comanda/', // POST - criar comanda
        UPDATE: '/comanda/:id', // PUT - atualizar comanda
        DELETE: '/comanda/:id', // DELETE - remover comanda
        CANCEL: '/comanda/:id/cancelar', // PUT - cancelar comanda
        ADD_ITEM: '/comanda/:id/produto', // POST - adicionar produto
        LIST_ITEMS: '/comanda/:id/produtos', // GET - listar produtos da comanda
        UPDATE_ITEM: '/comanda/produto/:id', // PUT - atualizar produto
        REMOVE_ITEM: '/comanda/produto/:id', // DELETE - remover produto
    },

    RECEBIMENTO: {
        DASHBOARD: '/recebimento/dashboard', // GET - dashboard comandas abertas
        DETALHE: '/recebimento/comandas/detalhe/:ids', // GET - detalhar comandas
        RECEBER: '/recebimento/completo', // POST - processar recebimento
        COMPROVANTE: '/recebimento/comprovante/:id', // GET - gerar comprovante
    },

    AUDITORIA: {
        LIST: '/auditoria', // GET - listar auditorias
        ACOES: '/auditoria/acoes', // GET - listar ações
    },
    
};
// Exportar configurações
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000;
export { API_ENDPOINTS };