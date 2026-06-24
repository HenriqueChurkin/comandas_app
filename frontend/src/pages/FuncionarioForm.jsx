import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {Box, Button, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import PageLayout from '../components/common/PageLayout';
import { GROUP_OPTIONS } from '../constants/userGroups';
import { useMasks } from '../hooks/useMasks';
import { useValidationRules } from '../hooks/useValidationRules';
import funcionarioService from '../services/funcionarioService';
import showSnackbar from '../utils/snackbar';

const FuncionarioForm = () => {
    const { id, opr } = useParams();
    const navigate = useNavigate();
    const validationRules = useValidationRules();
    const { applyCpfMask, applyPhoneMask, cleanCpf, cleanPhone } = useMasks();
    const isReadOnly = opr === 'view';
    const isEditing = Boolean(id);
    const title = isReadOnly
        ? `Visualizar Funcionario: ${id}`
        : isEditing
            ? `Editar Funcionario: ${id}`
            : 'Novo Funcionario';

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nome: '',
            matricula: '',
            cpf: '',
            telefone: '',
            grupo: '',
            senha: '',
        },
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(isEditing);

    useEffect(() => {
        const loadFuncionario = async () => {
            if (!id) return;

            try {
                const data = await funcionarioService.getById(id);
                reset({
                    nome: data.nome || '',
                    matricula: data.matricula || '',
                    cpf: applyCpfMask(data.cpf),
                    telefone: applyPhoneMask(data.telefone),
                    grupo: data.grupo || '',
                    senha: '',
                });
            } catch (error) {
                showSnackbar(error.apiMessage || 'Erro ao carregar funcionario', 'error');
            } finally {
                setLoadingData(false);
            }
        };

        loadFuncionario();
    }, [id, reset]);

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const funcionarioData = {
                nome: data.nome.trim(),
                matricula: data.matricula.trim(),
                cpf: cleanCpf(data.cpf),
                telefone: cleanPhone(data.telefone),
                grupo: Number(data.grupo),
            };

            if (data.senha) {
                funcionarioData.senha = data.senha;
            }

            if (isEditing) {
                await funcionarioService.update(id, funcionarioData);
                showSnackbar('Funcionario atualizado com sucesso!', 'success');
            } else {
                await funcionarioService.create(funcionarioData);
                showSnackbar('Funcionario cadastrado com sucesso!', 'success');
            }

            navigate('/funcionarios');
        } catch (error) {
            showSnackbar(error.apiMessage || 'Erro ao salvar funcionario', 'error');
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
                    name="matricula"
                    control={control}
                    rules={{
                        ...validationRules.matricula,
                        maxLength: {
                            value: 10,
                            message: 'Matricula deve conter no maximo 10 caracteres',
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Matricula"
                            fullWidth
                            margin="normal"
                            error={!!errors.matricula}
                            helperText={errors.matricula?.message}
                            disabled={loading || isReadOnly}
                            inputProps={{ maxLength: 10 }}
                        />
                    )}
                />

                <Controller
                    name="cpf"
                    control={control}
                    rules={{
                        ...validationRules.cpf,
                        validate: (value) => (
                            cleanCpf(value).length === 11 || 'CPF deve conter 11 digitos'
                        ),
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
                            return (
                                (length === 10 || length === 11)
                                || 'Telefone deve conter 10 ou 11 digitos'
                            );
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

                <Controller
                    name="grupo"
                    control={control}
                    rules={validationRules.grupo}
                    render={({ field }) => (
                        <FormControl
                            fullWidth
                            margin="normal"
                            error={!!errors.grupo}
                            disabled={loading || isReadOnly}
                        >
                            <InputLabel id="grupo-label">Grupo</InputLabel>
                            <Select {...field} labelId="grupo-label" label="Grupo">
                                {GROUP_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{errors.grupo?.message}</FormHelperText>
                        </FormControl>
                    )}
                />

                {!isReadOnly && (
                    <Controller
                        name="senha"
                        control={control}
                        rules={{
                            required: isEditing ? false : 'Senha e obrigatoria',
                            minLength: {
                                value: 6,
                                message: 'A senha deve conter no minimo 6 caracteres',
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={isEditing ? 'Nova senha (opcional)' : 'Senha'}
                                type="password"
                                fullWidth
                                margin="normal"
                                error={!!errors.senha}
                                helperText={
                                    errors.senha?.message
                                    || (isEditing ? 'Deixe em branco para manter a senha atual' : '')
                                }
                                disabled={loading}
                            />
                        )}
                    />
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/funcionarios')}
                        disabled={loading}
                    >
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

export default FuncionarioForm;