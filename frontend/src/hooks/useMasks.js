import { IMask } from 'react-imask';
// Hook para máscaras de CPF e Telefone
export const useMasks = () => {
    // Função para limpar CPF (remover máscara)
    const cleanCpf = (value) => {
        if (!value) return '';
        return value.replace(/\D/g, '');
    };
    // Função para limpar Telefone (remover máscara)
    const cleanPhone = (value) => {
        if (!value) return '';
        return value.replace(/\D/g, '');
    };
    // Função para aplicar máscara de CPF
    const applyCpfMask = (value) => {
        if (!value) return '';
        // Remove caracteres não numéricos
        const numbersOnly = cleanCpf(value);
        // Aplica máscara: XXX.XXX.XXX-XX
        if (numbersOnly.length <= 3) {
            return numbersOnly;
        } else if (numbersOnly.length <= 6) {
            return numbersOnly.slice(0, 3) + '.' + numbersOnly.slice(3);
        } else if (numbersOnly.length <= 9) {
            return numbersOnly.slice(0, 3) + '.' + numbersOnly.slice(3, 6) + '.' + numbersOnly.slice(6);
        } else {
            return numbersOnly.slice(0, 3) + '.' + numbersOnly.slice(3, 6) + '.' + numbersOnly.slice(6, 9) + '-' + numbersOnly.slice(9, 11);
        }
    };
    // Função para aplicar máscara de Telefone
    const applyPhoneMask = (value) => {
        if (!value) return '';
        // Remove caracteres não numéricos
        const numbersOnly = cleanPhone(value);
        // Aplica máscara: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        if (numbersOnly.length <= 2) {
            return numbersOnly;
        } else if (numbersOnly.length <= 7) {
            return '(' + numbersOnly.slice(0, 2) + ') ' + numbersOnly.slice(2);
        } else {
            return '(' + numbersOnly.slice(0, 2) + ') ' + numbersOnly.slice(2, 7) + '-' + numbersOnly.slice(7, 11);
        }
    };
    return { applyCpfMask, applyPhoneMask, cleanCpf, cleanPhone, };
};
export default useMasks;