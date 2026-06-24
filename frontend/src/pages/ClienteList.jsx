import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Alert, Box, Button, Card, CardContent, CircularProgress, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,} from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import ActionButtons from '../components/common/ActionButtons';
import PageLayout from '../components/common/PageLayout';
import { useMasks } from '../hooks/useMasks';
import clienteService from '../services/clienteService';
import showConfirm from '../utils/confirm';
import showSnackbar from '../utils/snackbar';

const ClienteList = () => {
    const navigate = useNavigate();
    const { applyCpfMask, applyPhoneMask } = useMasks();
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadClientes = useCallback(async () => {
        try {
            setLoading(true);
            const data = await clienteService.list({ limit: 1000 });
            setClientes(data);
        } catch (error) {
            const mensagem = error.apiMessage || 'Erro ao carregar clientes';
            showSnackbar(mensagem, 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadClientes();
    }, [loadClientes]);

    const handleView = (cliente) => navigate(`/cliente/view/${cliente.id}`);
    const handleEdit = (cliente) => navigate(`/cliente/edit/${cliente.id}`);

    const handleDelete = (cliente) => {
        showConfirm(
            'Excluir Cliente',
            `Tem certeza que deseja excluir "${cliente.nome}"?`,
            async () => {
                try {
                    await clienteService.delete(cliente.id);
                    setClientes((current) => current.filter((item) => item.id !== cliente.id));
                    showSnackbar('Cliente excluido com sucesso!', 'success');
                } catch (error) {
                    const mensagem = error.apiMessage || 'Erro ao excluir cliente';
                    showSnackbar(mensagem, 'error');
                }
            },
        );
    };

    const actions = (
        <Button
            variant="contained"
            onClick={() => navigate('/cliente')}
            startIcon={<FiberNew />}
            sx={{ fontWeight: 600 }}
        >
            Novo
        </Button>
    );

    if (loading) {
        return (
            <PageLayout title="Clientes" actions={actions}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Clientes" actions={actions}>
            {clientes.length === 0 ? (
                <Alert severity="info">
                    Nenhum cliente cadastrado.
                </Alert>
            ) : (
                <>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>CPF</TableCell>
                                        <TableCell>Telefone</TableCell>
                                        <TableCell>Acoes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clientes.map((cliente) => (
                                        <TableRow key={cliente.id} hover>
                                            <TableCell>{cliente.id}</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>{cliente.nome}</TableCell>
                                            <TableCell>{applyCpfMask(cliente.cpf)}</TableCell>
                                            <TableCell>{applyPhoneMask(cliente.telefone)}</TableCell>
                                            <TableCell>
                                                <ActionButtons
                                                    item={cliente}
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
                        {clientes.map((cliente) => (
                            <Card key={cliente.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {cliente.nome}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {cliente.id}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body2">
                                        <strong>CPF:</strong> {applyCpfMask(cliente.cpf)}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Telefone:</strong> {applyPhoneMask(cliente.telefone)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <ActionButtons
                                            item={cliente}
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

export default ClienteList;