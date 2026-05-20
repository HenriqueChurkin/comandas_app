// Enum para grupos de usuários
export const USER_GROUPS = {
    ADMINISTRADOR: 1,
    ATENDENTE: 2,
    CAIXA: 3
};
// Configuração dos grupos (labels, cores, etc.)
export const GROUP_CONFIG = {
    [USER_GROUPS.ADMINISTRADOR]: {
        label: 'Administrador',
        color: 'error'
    },
    [USER_GROUPS.ATENDENTE]: {
        label: 'Atendente',
        color: 'primary'
    },
    [USER_GROUPS.CAIXA]: {
        label: 'Caixa',
        color: 'success'
    }
};
// Função utilitária para obter informações do grupo
export const getGrupoInfo = (grupo) => {
    return GROUP_CONFIG[grupo] || { label: 'Não definido', color: 'default' };
};
// Array de opções para selects/dropdowns
export const GROUP_OPTIONS = [
    { value: USER_GROUPS.ADMINISTRADOR, label: 'Administrador' },
    { value: USER_GROUPS.ATENDENTE, label: 'Atendente' },
    { value: USER_GROUPS.CAIXA, label: 'Caixa' }
];