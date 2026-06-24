// Enum para status da comanda
export const COMANDA_STATUS = {
    ABERTA: 0,
    FECHADA: 1,
    CANCELADA: 2,
};

// Configurações para exibição dos status
export const getStatusConfig = (status) => {
    const statusMap = {
        [COMANDA_STATUS.ABERTA]: { label: 'Aberta', color: 'success' },
        [COMANDA_STATUS.FECHADA]: { label: 'Fechada', color: 'error' },
        [COMANDA_STATUS.CANCELADA]: { label: 'Cancelada', color: 'warning' },
    };

    return statusMap[status] || { label: 'Desconecido', color: 'default' };
};

// Array de opções para selects
export const getStatusOptions = () => [
    { value: COMANDA_STATUS.ABERTA, label: 'Aberta' },
    { value: COMANDA_STATUS.FECHADA, label: 'Fechada' },
    { value: COMANDA_STATUS.CANCELADA, label: 'Cancelada' },
];

export default COMANDA_STATUS;