import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import ActionButtons from '../components/common/ActionButtons';
import PageLayout from '../components/common/PageLayout';
import { getGrupoInfo } from '../constants/userGroups';
import { useMasks } from '../hooks/useMasks';
import funcionarioService from '../services/funcionarioService';
import showConfirm from '../utils/confirm';
import showSnackbar from '../utils/snackbar';

const FuncionarioList = () => {
    const navigate = useNavigate();
    const { applyCpfMask, applyPhoneMask } = useMasks();
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFuncionarios = useCallback(async () => {
        try {
            setLoading(true);
            const data = await funcionarioService.list();
            setFuncionarios(data);
        } catch (error) {
            showSnackbar(error.apiMessage || 'Erro ao carregar funcionarios', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFuncionarios();
    }, [loadFuncionarios]);

    const handleView = (funcionario) => navigate(`/funcionario/view/${funcionario.id}`);
    const handleEdit = (funcionario) => navigate(`/funcionario/edit/${funcionario.id}`);

    const handleDelete = (funcionario) => {
        showConfirm(
            'Excluir Funcionario',
            `Tem certeza que deseja excluir "${funcionario.nome}"?`,
            async () => {
                try {
                    await funcionarioService.delete(funcionario.id);
                    setFuncionarios((current) => (
                        current.filter((item) => item.id !== funcionario.id)
                    ));
                    showSnackbar('Funcionario excluido com sucesso!', 'success');
                } catch (error) {
                    showSnackbar(error.apiMessage || 'Erro ao excluir funcionario', 'error');
                }
            },
        );
    };

    const actions = (
        <Button
            variant="contained"
            onClick={() => navigate('/funcionario')}
            startIcon={<FiberNew />}
            sx={{ fontWeight: 600 }}
        >
            Novo
        </Button>
    );

    const renderGroup = (grupo) => {
        const info = getGrupoInfo(grupo);
        return <Chip label={info.label} color={info.color} size="small" />;
    };

    if (loading) {
        return (
            <PageLayout title="Funcionarios" actions={actions}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Funcionarios" actions={actions}>
            {funcionarios.length === 0 ? (
                <Alert severity="info">Nenhum funcionario cadastrado.</Alert>
            ) : (
                <>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Matricula</TableCell>
                                        <TableCell>CPF</TableCell>
                                        <TableCell>Telefone</TableCell>
                                        <TableCell>Grupo</TableCell>
                                        <TableCell>Acoes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {funcionarios.map((funcionario) => (
                                        <TableRow key={funcionario.id} hover>
                                            <TableCell>{funcionario.id}</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>
                                                {funcionario.nome}
                                            </TableCell>
                                            <TableCell>{funcionario.matricula}</TableCell>
                                            <TableCell>{applyCpfMask(funcionario.cpf)}</TableCell>
                                            <TableCell>{applyPhoneMask(funcionario.telefone)}</TableCell>
                                            <TableCell>{renderGroup(funcionario.grupo)}</TableCell>
                                            <TableCell>
                                                <ActionButtons
                                                    item={funcionario}
                                                    onView={handleView}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        {funcionarios.map((funcionario) => (
                            <Card key={funcionario.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {funcionario.nome}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {funcionario.id}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body2">
                                        <strong>Matricula:</strong> {funcionario.matricula}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>CPF:</strong> {applyCpfMask(funcionario.cpf)}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Telefone:</strong> {applyPhoneMask(funcionario.telefone)}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>{renderGroup(funcionario.grupo)}</Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <ActionButtons
                                            item={funcionario}
                                            onView={handleView}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </>
            )}
        </PageLayout>
    );
};

export default FuncionarioList;