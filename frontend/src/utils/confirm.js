/**
* showConfirm - Função utilitária global para confirmações
*
* Esta função permite mostrar diálogos de confirmação em qualquer componente
*
* Funcionalidades:
* - Uso simplificado: showConfirm(title, message, onConfirm)
* - Disponibilidade global: Em qualquer parte da aplicação
* - Comunicação via eventos customizados
* - Callback para ação de confirmação
*/

const showConfirm = (title, message, onConfirm) => {
    // Emite evento customizado para o ConfirmDialog
    const event = new CustomEvent('showConfirm', {
        detail: { title, message, onConfirm }
    });
    window.dispatchEvent(event);
};

export default showConfirm;