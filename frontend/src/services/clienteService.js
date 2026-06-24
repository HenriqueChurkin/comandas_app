import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const { CLIENTE } = API_ENDPOINTS;

const clienteService = {
    list: async (params = {}) => {
        const { skip = 0, limit = 100 } = params;
        const queryParams = new URLSearchParams();

        queryParams.append('skip', skip);
        queryParams.append('limit', limit);

        const response = await api.get(`${CLIENTE.LIST}?${queryParams.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(CLIENTE.GET.replace(':id', id));
        return response.data;
    },

    create: async (clienteData) => {
        const response = await api.post(CLIENTE.CREATE, clienteData);
        return response.data;
    },

    update: async (id, clienteData) => {
        const response = await api.put(CLIENTE.UPDATE.replace(':id', id), clienteData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(CLIENTE.DELETE.replace(':id', id));
        return response.data;
    },
};

export default clienteService;