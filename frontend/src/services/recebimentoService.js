import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const { RECEBIMENTO } = API_ENDPOINTS;

const recebimentoService = {
    dashboard: async () => {
        const response = await api.get(RECEBIMENTO.DASHBOARD);
        return response.data;
    },

    detalhe: async (ids) => {
        const idsParam = Array.isArray(ids) ? ids.join(',') : ids;
        const response = await api.get(RECEBIMENTO.DETALHE.replace(':ids', idsParam));
        return response.data;
    },

    receber: async (recebimentoData) => {
        const response = await api.post(RECEBIMENTO.RECEBER, recebimentoData);
        return response.data;
    },

    comprovante: async (id) => {
        const response = await api.get(RECEBIMENTO.COMPROVANTE.replace(':id', id));
        return response.data;
    },
};

export default recebimentoService;