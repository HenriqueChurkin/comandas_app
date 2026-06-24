/**
* showSnackbar - Função utilitária global para notificações
*
* Esta função permite mostrar notificações Snackbar em qualquer componente
*
* Funcionalidades:
* - Uso simplificado: showSnackbar(message, severity)
* - Disponibilidade global: Em qualquer parte da aplicação
* - Severidades: success, error, warning, info
* - Comunicação via eventos customizados
*/

const showSnackbar = (message, severity = 'error') => {
    // Emite evento customizado para o SnackbarGlobal
    const event = new CustomEvent('showSnackbar', {
        detail: { message, severity }
    });
    window.dispatchEvent(event);
};

export default showSnackbar;