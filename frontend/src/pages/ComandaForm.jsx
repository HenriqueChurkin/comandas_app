import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import PageLayout from '../components/common/PageLayout';
import ComandaValidator, { useComandaValidation } from '../components/common/ComandaValidator';
import { useAuth } from '../context/AuthContext';
import { useValidationRules } from '../hooks/useValidationRules';
import clienteService from '../services/clienteService';
import comandaService from '../services/comandaService';
import showSnackbar from '../utils/snackbar';

// Função para pegar a data atual compensando o fuso horário (UTC-3)
// Evita que as horas sejam adiantadas ao converter para string ISO
const getLocalISOTime = (date = new Date()) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const ComandaForm = () => {
    const { id, opr } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors, dirtyFields },
        reset,
    } = useForm({
        defaultValues: {
            comanda: '',
            data_hora: getLocalISOTime(), // Aplicação da correção aqui
            cliente_id: '',
            funcionario_id: user?.id || '',
        },
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingClientes, setLoadingClientes] = useState(false);
    const [clientes, setClientes] = useState([]);

    const validationRules = useValidationRules();
    const isReadOnly = opr === 'view';
    const title = opr === 'view' ? `Visualizar Comanda: ${id}` : id ? `Editar Comanda: ${id}` : 'Nova Comanda';
    const { dialog: comandaDialog, validateComanda, closeDialog, clearField } = useComandaValidation(comandaService, id);

    const handleDialogCancel = () => {
        closeDialog();
        clearField();
        reset((prev) => ({ ...prev, comanda: '' }));
    };

    const handleDialogView = (comanda) => {
        closeDialog();
        navigate(`/comanda/view/${comanda.id}`);
    };

    const handleDialogEdit = (comanda) => {
        closeDialog();
        navigate(`/comanda/edit/${comanda.id}`);
    };

    const handleCancel = () => {
        navigate('/comandas');
    };

    useEffect(() => {
        const loadClientes = async () => {
            try {
                setLoadingClientes(true);
                const data = await clienteService.list({ limit: 1000 });
                setClientes(data);
            } catch (error) {
                const mensagem = error.apiMessage || 'Erro ao carregar clientes';
                showSnackbar(mensagem, 'error');
            } finally {
                setLoadingClientes(false);
            }
        };

        loadClientes();
    }, []);

    useEffect(() => {
        const loadComanda = async () => {
            if (id && id !== 'new') {
                try {
                    const data = await comandaService.getById(id);

                    if (data.data_hora) {
                        const dataAbertura = new Date(data.data_hora);
                        if (!isNaN(dataAbertura.getTime())) {
                            // Aplicação da correção ao carregar do banco
                            data.data_hora = getLocalISOTime(dataAbertura);
                        }
                    }

                    data.cliente_id = data.cliente_id || '';
                    reset(data);
                } catch (error) {
                    const mensagem = error.apiMessage || 'Erro ao carregar comanda';
                    showSnackbar(mensagem, 'error');
                } finally {
                    setLoadingData(false);
                }
                return;
            }

            reset({
                comanda: '',
                data_hora: getLocalISOTime(), // Aplicação da correção ao resetar o form
                cliente_id: '',
                funcionario_id: user?.id || '',
            });
            setLoadingData(false);
        };

        loadComanda();
    }, [id, reset, user?.id]);

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const isEditing = id && id !== 'new';
            const comandaData = {
                comanda: data.comanda,
                // Aplicação da correção no momento do salvamento
                data_hora: isEditing ? data.data_hora : getLocalISOTime(),
                cliente_id: data.cliente_id ? parseInt(data.cliente_id, 10) : (isEditing ? 0 : null),
                funcionario_id: isEditing ? data.funcionario_id : user?.id || '',
                status: 0,
            };

            if (isEditing) {
                await comandaService.update(id, comandaData);
                showSnackbar('Comanda atualizada com sucesso!', 'success');
            } else {
                await comandaService.create(comandaData);
                showSnackbar('Comanda aberta com sucesso!', 'success');
            }

            navigate('/comandas');
        } catch (error) {
            const mensagem = error.apiMessage || 'Erro ao salvar comanda';
            console.error('Erro ao salvar comanda:', error);
            showSnackbar(mensagem, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <PageLayout title={title}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout title={title}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, mx: 'auto' }}>
                <Controller
                    name="comanda"
                    control={control}
                    rules={{
                        required: validationRules.required,
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value || ''}
                            fullWidth
                            label="Comanda"
                            margin="normal"
                            error={!!errors.comanda}
                            helperText={errors.comanda?.message || 'Numero da comanda deve ser unico e estar disponivel'}
                            disabled={loading || isReadOnly}
                            onBlur={() => {
                                if (!isReadOnly) {
                                    const isNovaComanda = !id || id === 'new';
                                    if (isNovaComanda || dirtyFields.comanda) {
                                        validateComanda(field.value);
                                    }
                                }
                            }}
                        />
                    )}
                />

                {isReadOnly && (
                    <Controller
                        name="data_hora"
                        control={control}
                        render={({ field }) => {
                            // Formatação manual segura para evitar que o navegador aplique o fuso horário incorretamente
                            let exibicaoData = '';
                            if (field.value && field.value.includes('T')) {
                                const [datePart, timePart] = field.value.split('T');
                                const [year, month, day] = datePart.split('-');
                                exibicaoData = `${day}/${month}/${year} ${timePart}`;
                            }

                            return (
                                <TextField
                                    {...field}
                                    value={exibicaoData}
                                    fullWidth
                                    label="Data e Hora de Abertura"
                                    margin="normal"
                                    disabled
                                />
                            );
                        }}
                    />
                )}

                {isReadOnly && (
                    <Controller
                        name="funcionario_id"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                value={`ID: ${field.value || 'N/A'} - ${user?.nome || 'Funcionario'}`}
                                fullWidth
                                label="Funcionario Responsavel"
                                margin="normal"
                                disabled
                            />
                        )}
                    />
                )}

                <Controller
                    name="cliente_id"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth margin="normal" error={!!errors.cliente_id}>
                            <InputLabel id="cliente-label">Cliente (opcional)</InputLabel>
                            <Select
                                {...field}
                                labelId="cliente-label"
                                label="Cliente (opcional)"
                                value={field.value || ''}
                                disabled={loading || loadingClientes || isReadOnly}
                            >
                                <MenuItem value="">Sem cliente identificado</MenuItem>
                                {clientes.map((cliente) => (
                                    <MenuItem key={cliente.id} value={cliente.id}>
                                        {cliente.nome} - CPF {cliente.cpf}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                />

                {!isReadOnly && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button variant="outlined" onClick={handleCancel} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Salvando...' : (id ? 'Atualizar' : 'Abrir Comanda')}
                        </Button>
                    </Box>
                )}

                {isReadOnly && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="outlined" onClick={handleCancel} disabled={loading}>
                            Voltar
                        </Button>
                    </Box>
                )}
            </Box>

            <ComandaValidator
                open={comandaDialog.open}
                onClose={handleDialogCancel}
                existingRecord={comandaDialog.record}
                recordType="comanda"
                onView={handleDialogView}
                onEdit={handleDialogEdit}
            />
        </PageLayout>
    );
};

export default ComandaForm;