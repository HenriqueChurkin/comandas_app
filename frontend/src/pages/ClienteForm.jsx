import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import PageLayout from '../components/common/PageLayout';
import { useMasks } from '../hooks/useMasks';
import { useValidationRules } from '../hooks/useValidationRules';
import clienteService from '../services/clienteService';
import showSnackbar from '../utils/snackbar';

const ClienteForm = () => {
    const { id, opr } = useParams();
    const navigate = useNavigate();
    const validationRules = useValidationRules();
    const { applyCpfMask, applyPhoneMask, cleanCpf, cleanPhone } = useMasks();
    const isReadOnly = opr === 'view';
    const isEditing = Boolean(id);
    const title = isReadOnly ? `Visualizar Cliente: ${id}` : isEditing ? `Editar Cliente: ${id}` : 'Novo Cliente';

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nome: '',
            cpf: '',
            telefone: '',
        },
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(isEditing);

    useEffect(() => {
        const loadCliente = async () => {
            if (!id) return;

            try {
                const data = await clienteService.getById(id);
                reset({
                    nome: data.nome || '',
                    cpf: applyCpfMask(data.cpf),
                    telefone: applyPhoneMask(data.telefone),
                });
            } catch (error) {
                const mensagem = error.apiMessage || 'Erro ao carregar cliente';
                showSnackbar(mensagem, 'error');
            } finally {
                setLoadingData(false);
            }
        };

        loadCliente();
    }, [id, reset]);

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const clienteData = {
                nome: data.nome.trim(),
                cpf: cleanCpf(data.cpf),
                telefone: cleanPhone(data.telefone),
            };

            if (isEditing) {
                await clienteService.update(id, clienteData);
                showSnackbar('Cliente atualizado com sucesso!', 'success');
            } else {
                await clienteService.create(clienteData);
                showSnackbar('Cliente cadastrado com sucesso!', 'success');
            }

            navigate('/clientes');
        } catch (error) {
            const mensagem = error.apiMessage || 'Erro ao salvar cliente';
            showSnackbar(mensagem, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <PageLayout title={title}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout title={title}>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ maxWidth: 650, mx: 'auto' }}
            >
                <Controller
                    name="nome"
                    control={control}
                    rules={validationRules.nome}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Nome"
                            fullWidth
                            margin="normal"
                            error={!!errors.nome}
                            helperText={errors.nome?.message}
                            disabled={loading || isReadOnly}
                        />
                    )}
                />

                <Controller
                    name="cpf"
                    control={control}
                    rules={{
                        ...validationRules.cpf,
                        validate: (value) => cleanCpf(value).length === 11 || 'CPF deve conter 11 digitos',
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="CPF"
                            fullWidth
                            margin="normal"
                            value={field.value || ''}
                            onChange={(event) => field.onChange(applyCpfMask(event.target.value))}
                            error={!!errors.cpf}
                            helperText={errors.cpf?.message}
                            disabled={loading || isReadOnly}
                            inputProps={{ maxLength: 14 }}
                        />
                    )}
                />

                <Controller
                    name="telefone"
                    control={control}
                    rules={{
                        required: 'Telefone e obrigatorio',
                        validate: (value) => {
                            const length = cleanPhone(value).length;
                            return (length === 10 || length === 11) || 'Telefone deve conter 10 ou 11 digitos';
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Telefone"
                            fullWidth
                            margin="normal"
                            value={field.value || ''}
                            onChange={(event) => field.onChange(applyPhoneMask(event.target.value))}
                            error={!!errors.telefone}
                            helperText={errors.telefone?.message}
                            disabled={loading || isReadOnly}
                            inputProps={{ maxLength: 15 }}
                        />
                    )}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button variant="outlined" onClick={() => navigate('/clientes')} disabled={loading}>
                        {isReadOnly ? 'Voltar' : 'Cancelar'}
                    </Button>
                    {!isReadOnly && (
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Cadastrar'}
                        </Button>
                    )}
                </Box>
            </Box>
        </PageLayout>
    );
};

export default ClienteForm;