import { API_ENDPOINTS } from '../config/apiConfig';
import api from './api';

// Extrair apenas endpoints utilizados no service
const { PRODUTO } = API_ENDPOINTS;

// Serviços de produtos
export const produtoService = {

    // Listar todos os produtos com filtros e paginação
    list: async (params = {}) => {
        const { skip = 0, limit = 100, id, nome, descricao, valor, valor_min, valor_max } = params;
        const queryParams = new URLSearchParams(); // Construir query params, para passar como parâmetros na URL
        // paginação
        queryParams.append('skip', skip);
        queryParams.append('limit', limit);
        // filtros
        if (id !== undefined && id !== null) queryParams.append('id', id);
        if (nome !== undefined && nome !== null && nome !== '') queryParams.append('nome', nome);
        if (descricao !== undefined && descricao !== null && descricao !== '') queryParams.append('descricao', descricao);
        if (valor !== undefined && valor !== null) queryParams.append('valor', valor);
        if (valor_min !== undefined && valor_min !== null) queryParams.append('valor_min', valor_min);
        if (valor_max !== undefined && valor_max !== null) queryParams.append('valor_max', valor_max);
        // executar requisição GET com query params - exemplo de url: /produtos?skip=0&limit=100&id=1&nome=Produto&descricao=Descrição&valor=10.00&valor_min=5.00&valor_max=15.00
        const response = await api.get(`${PRODUTO.LIST}?${queryParams.toString()}`);
        return response.data;
    },

    // Buscar produto por ID
    getById: async (id) => {
        const response = await api.get(PRODUTO.GET.replace(':id', id));
        return response.data;
    },

    // Criar novo produto
    create: async (produtoData) => {
        const response = await api.post(PRODUTO.CREATE, produtoData);
        return response.data;
    },

    // Atualizar produto existente
    update: async (id, produtoData) => {
        const response = await api.put(PRODUTO.UPDATE.replace(':id', id), produtoData);
        return response.data;
    },

    // Excluir produto
    delete: async (id) => {
        await api.delete(PRODUTO.DELETE.replace(':id', id));
        return { success: true };
    },

    // Listar produtos públicos, com filtros e paginação
    listPublic: async (params = {}) => {
        const { skip = 0, limit = 100, id, nome, descricao, valor, valor_min, valor_max } = params;
        const queryParams = new URLSearchParams();
        queryParams.append('skip', skip);
        queryParams.append('limit', limit);
        if (id !== undefined && id !== null) queryParams.append('id', id);
        if (nome !== undefined && nome !== null && nome !== '') queryParams.append('nome', nome);
        if (descricao !== undefined && descricao !== null && descricao !== '') queryParams.append('descricao', descricao);
        if (valor !== undefined && valor !== null) queryParams.append('valor', valor);
        if (valor_min !== undefined && valor_min !== null) queryParams.append('valor_min', valor_min);
        if (valor_max !== undefined && valor_max !== null) queryParams.append('valor_max', valor_max);
        
        const response = await api.get(`${PRODUTO.PUBLIC}?${queryParams.toString()}`);
        return response.data;
    },
};

export default produtoService;