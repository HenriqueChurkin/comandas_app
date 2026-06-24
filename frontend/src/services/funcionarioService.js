import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const { FUNCIONARIO } = API_ENDPOINTS;

const funcionarioService = {
    list: async () => {
        const response = await api.get(FUNCIONARIO.LIST);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(FUNCIONARIO.GET.replace(':id', id));
        return response.data;
    },

    create: async (funcionarioData) => {
        const response = await api.post(FUNCIONARIO.CREATE, funcionarioData);
        return response.data;
    },

    update: async (id, funcionarioData) => {
        const response = await api.put(
            FUNCIONARIO.UPDATE.replace(':id', id),
            funcionarioData,
        );
        return response.data;
    },

    delete: async (id) => {
        await api.delete(FUNCIONARIO.DELETE.replace(':id', id));
    },
};

export default funcionarioService;