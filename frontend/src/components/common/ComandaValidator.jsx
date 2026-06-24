import { useState } from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Typography, Box } from '@mui/material';
import { Button } from '@mui/material';

const ComandaValidator = ({ open, onClose, existingRecord, recordType = 'comanda', onView, onEdit }) => {

    const handleCancel = () => {
        if (onClose.clearField) {
            onClose.clearField();
        }
        onClose();
    };

    const handleView = () => {
        if (onView && existingRecord) {
            onView(existingRecord);
        }
        handleCancel();
    };

    const handleEdit = () => {
        if (onEdit && existingRecord) {
            onEdit(existingRecord);
        }
        handleCancel();
    };

    // Renderizar o diálogo
    return (
        <Dialog open={open} onClose={handleCancel} aria-labelledby="unique-dialog-title" aria-describedby="unique-dialog-description" maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 600, color: 'white', backgroundColor: 'error.main', mb: 2 }}>
                Registro já existente em {recordType}
            </DialogTitle>
            <DialogContent id="unique-dialog-description">
                <Box sx={{ p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
                    {existingRecord?.id && (
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            ID: {existingRecord.id}
                        </Typography>
                    )}
                    {existingRecord?.comanda && (
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Comanda: {existingRecord.comanda}
                        </Typography>
                    )}
                    {existingRecord?.data_hora && (
                        <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 1 }}>
                            Abertura: {new Date(existingRecord.data_hora).toLocaleString('pt-BR')}
                        </Typography>
                    )}
                    {existingRecord?.status !== undefined && (
                        <Typography variant="body2" color="text.secondary">
                            Status: {existingRecord.status === 1 ? 'Fechada' : existingRecord.status === 2 ? 'Cancelada' : 'Aberta'}
                        </Typography>
                    )}
                    {existingRecord?.cliente_id && (
                        <Typography variant="body2" color="text.secondary">
                            Cliente: {existingRecord.cliente_id}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} variant="outlined">
                    Fechar
                </Button>
                {onView && (
                    <Button onClick={handleView} variant="contained" color="primary">
                        Visualizar
                    </Button>
                )}
                {onEdit && (
                    <Button onClick={handleEdit} variant="contained" color="primary">
                        Editar
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

// export useComandaValidation
export const useComandaValidation = (service, currentId = null, validationMethod = 'checkComandaExists') => {
    const [dialog, setDialog] = useState({ open: false, record: null });

    const validateComanda = async (comandaValue) => {
        if (!comandaValue) return; // Não validar se campo estiver vazio
        try {
            // melhorar a busca, já filtrando por status = 0 e comanda igual ao valor informado
            const response = await service.checkEmUso(comandaValue);
            const comanda = response;
            // se houver comandas com status 0, retornar true
            if (comanda) {
                // Remover foco do elemento ativo antes de abrir diálogo
                const activeElement = document.activeElement;
                if (activeElement && activeElement.blur) {
                    activeElement.blur();
                }
                setDialog({
                    open: true,
                    record: comanda
                });
                // Mover foco para o primeiro botão do diálogo quando abrir
                setTimeout(() => {
                    const firstButton = document.querySelector('[role="dialog"] button');
                    if (firstButton) {
                        firstButton.focus();
                    }
                }, 100);
            }
        } catch (error) {
            // Erro na validação, mas não bloquear o usuário
            console.error('Erro ao validar campo:', error);
        }
    };

    const closeDialog = () => {
        setDialog({ open: false, record: null });
    };

    const clearField = (fieldName, reset) => {
        // Será implementado no componente que usar o hook
        setDialog({ open: false, record: null });
    };
    return { dialog, validateComanda, closeDialog, clearField };
};

export default ComandaValidator;