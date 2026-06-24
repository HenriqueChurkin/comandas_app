import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Box, Button, Chip, Typography, Card, CardContent, Divider, IconButton } from '@mui/material';
import { FiberNew, ShoppingCart as CartIcon, Cancel as CancelIcon, AddCircle, Visibility, Edit, Delete } from '@mui/icons-material';
import PageLayout from '../components/common/PageLayout';
import ActionButtons from '../components/common/ActionButtons';
import comandaService from '../services/comandaService';
import showSnackbar from '../utils/snackbar';
import { getStatusConfig } from '../constants/comandaStatus';
import showConfirm from '../utils/confirm';
import Pagination from '../components/common/Pagination';
import ComandaFilters from '../components/common/ComandaFilters';

// Definição do componente ComandaList
function ComandaList() {
    // Hook de navegação
    const navigate = useNavigate();
    // Estados do componente
    const [comandas, setComandas] = useState([]); // Lista de comandas da API
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [filters, setFilters] = useState({}); // Estados para filtros
    const [pagination, setPagination] = useState({ skip: 0, limit: 10, currentPage: 1 }); // Estados para paginação
    const [hasItems, setHasItems] = useState(true); // Controla se há itens na página atual, utilizado na paginação
    // Funções de navegação
    const handleView = (comanda) => navigate(`/comanda/view/${comanda?.id}`); // Navega para a página de visualização da comanda
    const handleEdit = (comanda) => navigate(`/comanda/edit/${comanda?.id}`); // Navega para a página de edição da comanda
    const handleAddItem = (comanda) => navigate(`/comanda/consumo/${comanda?.id}`); // Navega para página de consumo

    // Funções de manipulação de filtros
    const handleFilter = (newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, skip: 0, currentPage: 1 }));
    };
    const handleClearFilters = () => {
        setFilters({});
        setPagination(prev => ({ ...prev, skip: 0, currentPage: 1 }));
    };

    // Funções de manipulação de paginação
    const handlePageChange = (newPage) => {
        const newSkip = (newPage - 1) * pagination.limit;
        setPagination(prev => ({ ...prev, skip: newSkip, currentPage: newPage }));
    };
    const handleItemsPerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, skip: 0, currentPage: 1 }));
    };

    // Função de cancelar comanda com confirmação
    const handleCancel = (comanda) => {
        showConfirm('Cancelar Comanda', `Tem certeza que deseja cancelar a comanda "${comanda?.comanda}"?`,
            async () => {
                try {
                    await comandaService.cancel(comanda.id);
                    showSnackbar('Comanda cancelada com sucesso!', 'success');
                    // Recarregar lista após cancelamento
                    const updatedComandas = comandas.filter(c => c.id !== comanda.id);
                    setComandas(updatedComandas);
                } catch (error) {
                    const mensagem = error.apiMessage || 'Erro ao cancelar comanda';
                    showSnackbar(mensagem, 'error');
                }
            }
        );
    };

    // Função de excluir comanda com confirmação
    const handleDelete = (comanda) => {
        showConfirm('Excluir Comanda', `Tem certeza que deseja excluir a comanda "${comanda?.comanda}"?`,
            async () => {
                try {
                    await comandaService.delete(comanda.id);
                    showSnackbar('Comanda excluída com sucesso!', 'success');
                    // Recarregar lista após exclusão
                    const updatedComandas = comandas.filter(c => c.id !== comanda.id);
                    setComandas(updatedComandas);
                } catch (error) {
                    const mensagem = error.apiMessage || 'Erro ao excluir comanda';
                    showSnackbar(mensagem, 'error');
                }
            }
        );
    };

    // Configuração de ações da página
    const actions = (
        <Button variant="contained" color="primary" onClick={() => navigate('/comanda')} startIcon={<FiberNew />} sx={{ fontWeight: 600, px: 2, py: 1 }}>
            Abrir Comanda
        </Button>
    );

    // Efeito para carregar comandas abertas
    useEffect(() => {
        const loadComandas = async () => {
            try {
                setLoading(true);
                const data = await comandaService.list({ ...filters, ...pagination });
                
                // Proteção: Garante que "data" extraído seja sempre uma Array (evita crash caso o backend traga paginação envelopada em objeto)
                const listaTratada = Array.isArray(data) ? data : (data?.items || data?.data || []);
                
                setComandas(listaTratada);
                setHasItems(listaTratada.length > 0);
            } catch (error) {
                const mensagem = error.apiMessage || 'Erro ao carregar comandas';
                showSnackbar(mensagem, 'error');
            } finally {
                setLoading(false);
            }
        };
        loadComandas();
    }, [filters, pagination]);

    // Configuração das colunas da tabela
    const columns = [
        { field: 'comanda', headerName: 'Comanda' },
        { field: 'data_hora', headerName: 'Abertura' },
        { field: 'cliente_nome', headerName: 'Cliente' },
        { field: 'status', headerName: 'Status' },
        { field: 'actions', headerName: 'Ações' }
    ];

    // Helper seguro para formatação de data (evita RangeError caso a string venha corrompida do banco)
    const formatarDataSegura = (dataStr) => {
        if (!dataStr) return '-';
        const d = new Date(dataStr);
        return isNaN(d.getTime()) ? dataStr : d.toLocaleString('pt-BR');
    };

    // Renderização desktop (tabela)
    const renderDesktopRow = (comanda, index) => {
        // Proteção: Fallback caso o statusConfig retorne undefined devido a um código não mapeado
        const statusConfig = getStatusConfig(comanda?.status) || { label: 'Desconhecido', color: 'default' };
        return (
            <TableRow key={comanda?.id || index}>
                <TableCell>{comanda?.comanda}</TableCell>
                <TableCell>{formatarDataSegura(comanda?.data_hora)}</TableCell>
                <TableCell>{comanda?.cliente_nome || comanda?.cliente_id || '-'}</TableCell>
                <TableCell>
                    <Chip
                        label={statusConfig.label || 'Desconhecido'}
                        color={statusConfig.color || 'default'}
                        size="small"
                    />
                </TableCell>
                <TableCell>
                    <ActionButtons onView={handleView} onEdit={handleEdit} onDelete={handleDelete} item={comanda}>
                        <IconButton size="small" color="success" title="Adicionar Consumo"
                            sx={{ width: 40, height: 40, '&:hover': { backgroundColor: 'success.light', color: 'white' } }}
                            onClick={() => handleAddItem(comanda)}
                        >
                            <AddCircle fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="warning" title="Cancelar Comanda"
                            sx={{ width: 40, height: 40, '&:hover': { backgroundColor: 'warning.light', color: 'white' } }}
                            onClick={() => handleCancel(comanda)}
                        >
                            <CancelIcon fontSize="small" />
                        </IconButton>
                    </ActionButtons>
                </TableCell>
            </TableRow>
        );
    };

    // Renderização mobile (cards)
    const renderMobileCard = (comanda, index) => {
        const statusConfig = getStatusConfig(comanda?.status) || { label: 'Desconhecido', color: 'default' };
        return (
            <Card key={comanda?.id || index} sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Comanda {comanda?.comanda}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {formatarDataSegura(comanda?.data_hora)}
                            </Typography>
                        </Box>
                        <Chip label={statusConfig.label || 'Desconhecido'} color={statusConfig.color || 'default'} size="small" />
                    </Box>
                    {(comanda?.cliente_nome || comanda?.cliente_id) && (
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Cliente: {comanda?.cliente_nome || comanda.cliente_id}
                        </Typography>
                    )}
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <IconButton
                            size="small" color="primary" title="Visualizar"
                            sx={{ width: 40, height: 40, '&:hover': { backgroundColor: 'primary.light', color: 'white' } }}
                            onClick={() => handleView(comanda)}
                        >
                            <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small" color="secondary" title="Editar"
                            sx={{ width: 40, height: 40, '&:hover': { backgroundColor: 'secondary.light', color: 'white' } }}
                            onClick={() => handleEdit(comanda)}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small" color="error" title="Excluir"
                            sx={{ width: 40, height: 40, '&:hover': { backgroundColor: 'error.light', color: 'white' } }}
                            onClick={() => handleDelete(comanda)}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small" color="success" title="Adicionar Consumo"
                            sx={{ width: 40, height: 40, '&:hover': { backgroundColor: 'success.light', color: 'white' } }}
                            onClick={() => handleAddItem(comanda)}
                        >
                            <AddCircle fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small" color="warning" title="Cancelar Comanda"
                            sx={{ width: 40, height: 40, '&:hover': { backgroundColor: 'warning.light', color: 'white' } }}
                            onClick={() => handleCancel(comanda)}
                        >
                            <CancelIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    // Renderizar loading
    if (loading) {
        return (
            <PageLayout title="Comandas" actions={actions}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <Typography>Carregando comandas...</Typography>
                </Box>
            </PageLayout>
        );
    }

    // Renderizar página - return
    return (
        <PageLayout title="Comandas" actions={actions}>
            <ComandaFilters onFilter={handleFilter} onClear={handleClearFilters} filters={filters} />
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell key={index}>{column.headerName}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(comandas) && comandas.map((comanda, index) => renderDesktopRow(comanda, index))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {Array.isArray(comandas) && comandas.map((comanda, index) => renderMobileCard(comanda, index))}
            </Box>
            <Pagination
                currentPage={pagination.currentPage}
                itemsPerPage={pagination.limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                loading={loading}
                hasItems={hasItems}
            />
        </PageLayout>
    );
}
export default ComandaList;