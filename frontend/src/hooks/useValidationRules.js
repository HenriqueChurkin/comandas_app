export const useValidationRules = () => ({
    nome: { required: 'Nome é obrigatório' },
    cpf: { required: 'CPF é obrigatório' },
    telefone: {},
    matricula: { required: 'Matrícula é obrigatória' },
    senha: {
        required: 'Senha é obrigatória',
        minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
    },
    grupo: { required: 'Grupo é obrigatório' },
    descricao: { required: 'Descrição é obrigatória' },
    valor_unitario: {
        required: 'Valor unitário é obrigatório',
        min: { value: 0, message: 'Valor deve ser maior que 0' }
    },
});

export default useValidationRules;