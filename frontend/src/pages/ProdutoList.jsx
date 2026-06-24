import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import PageLayout from "../components/common/PageLayout";
import ActionButtons from "../components/common/ActionButtons";
import ProdutoFilters from '../components/common/ProdutoFilters';
import Pagination from '../components/common/Pagination';
import { produtoService } from '../services/produtoService';
import showSnackbar from '../utils/snackbar';
import showConfirm from '../utils/confirm';
import { useAuth } from '../context/AuthContext';
import { USER_GROUPS } from '../constants/userGroups';

// Definição do componente ProdutoList
function ProdutoList() {
    // Hook de navegação
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Estados do componente
    const [produtos, setProdutos] = useState([]); // Lista de produtos da API
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [filters, setFilters] = useState({}); // Estados para filtros
    const [pagination, setPagination] = useState({ skip: 0, limit: 3, currentPage: 1 }); // Estados para paginação
    const [hasItems, setHasItems] = useState(true); // Controla se há itens na página atual, utilizado na paginação
    
    // Funções de navegação
    const handleView = (produto) => navigate(`/produto/view/${produto.id}`); // Navega para a página de visualização do produto
    const handleEdit = (produto) => navigate(`/produto/edit/${produto.id}`); // Navega para a página de edição do produto
    
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
    
    // Função de exclusão com confirmação
    const handleDelete = (produto) => {
        showConfirm('Excluir Produto', `Tem certeza que deseja excluir o produto "${produto.nome}"?`,
            async () => {
                try {
                    await produtoService.delete(produto.id);
                    showSnackbar('Produto excluído com sucesso!', 'success');
                    // Recarregar lista após exclusão
                    const updatedProdutos = produtos.filter(p => p.id !== produto.id);
                    setProdutos(updatedProdutos);
                } catch (error) {
                    showSnackbar('Erro ao excluir produto', 'error');
                }
            }
        );
    };
    
    // Funções utilitárias
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    
    // Configuração de ações da página
    const actions = (
        <Button variant="contained" color="primary" onClick={() => navigate('/produto')} startIcon={<FiberNew />} sx={{ fontWeight: 600, px: 2, py: 1 }}>
            Novo
        </Button>
    );
    
    
    // Efeito para carregar produtos
    useEffect(() => {
        const loadProdutos = async () => {
            try {
                setLoading(true);
                const params = { skip: pagination.skip, limit: pagination.limit, ...filters }; // Parâmetros para a requisição
                const response = await produtoService.list(params); // Executa o serviço de listagem, passando os parâmetros
                const produtosData = response.data || response; // Obtém os dados da resposta
                setProdutos(produtosData); // Atribui os produtos à lista
                setHasItems(produtosData && produtosData.length > 0); // Define se há itens na página atual
            } catch (error) {
                showSnackbar('Erro ao carregar produtos', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadProdutos(); // Carrega os produtos
    }, [pagination.skip, pagination.limit, filters]); // Executa quando os parâmetros de paginação ou filtros mudarem
    
    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'foto', headerName: 'Foto' },
        { field: 'nome', headerName: 'Nome' },
        { field: 'descricao', headerName: 'Descrição' },
        { field: 'valor_unitario', headerName: 'Valor Unitário' },
        { field: 'actions', headerName: 'Ações', renderCell: (params) => <ActionButtons onView={handleView} onEdit={handleEdit} onDelete={handleDelete} item={params.row || {}} /> }
    ];    
    
    // Renderização desktop: linha da tabela
    const renderDesktopRow = (produto) => (
        <TableRow key={produto.id} hover>
            {columns.map((column, index) => {
                if (column.field === 'id') return <TableCell key={index}>{produto.id}</TableCell>;
                if (column.field === 'foto') return (
                    <TableCell key={index}>
                        <Box sx={{ width: 50, height: 50, borderRadius: 1, overflow: 'hidden', backgroundColor: 'grey.100' }}>
                            {produto.foto ? (
                                <img src={produto.foto} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.200', color: 'grey.500', fontSize: '8px', textAlign: 'center' }}>
                                    Sem foto
                                </Box>
                            )}
                        </Box>
                    </TableCell>
                );
                if (column.field === 'nome') return <TableCell key={index} sx={{ fontWeight: 500 }}>{produto.nome}</TableCell>;
                if (column.field === 'descricao') return (
                    <TableCell key={index}>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {produto.descricao}
                        </Typography>
                    </TableCell>
                );
                if (column.field === 'valor_unitario') return <TableCell key={index} sx={{ fontWeight: 600, color: 'success.main' }}>{formatCurrency(produto.valor_unitario)}</TableCell>;
                if (column.field === 'actions') return (
                    <TableCell key={index}>
                        <ActionButtons onView={handleView} onEdit={user?.grupo === USER_GROUPS.ADMINISTRADOR ? handleEdit : null} onDelete={user?.grupo === USER_GROUPS.ADMINISTRADOR ? handleDelete : null} item={produto} />                    
                    </TableCell>
                );
                return null;
            })}
        </TableRow>
    );    
    
    // Renderização mobile: card
    const renderMobileCard = (produto) => (
        <Card key={produto.id} sx={{ mb: 2, elevation: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 60, height: 60, borderRadius: 2, overflow: 'hidden', backgroundColor: 'grey.100' }}>
                            {produto.foto ? (
                                <img src={produto.foto} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.200', color: 'grey.500', fontSize: '10px', textAlign: 'center' }}>
                                    Sem foto
                                </Box>
                            )}
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                {produto.nome}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ID: {produto.id}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Descrição:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {produto.descricao}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Valor Unitário:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                            {formatCurrency(produto.valor_unitario)}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ActionButtons
                        item={produto}
                        onView={handleView}
                        onEdit={user?.grupo === USER_GROUPS.ADMINISTRADOR ? handleEdit : null}
                        onDelete={user?.grupo === USER_GROUPS.ADMINISTRADOR ? handleDelete : null}
                    />
                </Box>
            </CardContent>
        </Card>
    );    
    
    // Renderização responsiva: desktop (tabela) e mobile (cards)
    return (
        <PageLayout title="Produtos" actions={actions}>
            {/* Componente de Filtros */}
            <ProdutoFilters onFilter={handleFilter} onClear={handleClearFilters} filters={filters} />
        
            {/* Tabela Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell key={index} sx={{ fontWeight: 600 }}>
                                     {column.headerName || column.header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {produtos.map((produto) => renderDesktopRow(produto))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        
            {/* Cards Mobile */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {produtos.map((produto) => renderMobileCard(produto))}
            </Box>
        
            {/* Componente de Paginação */}
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
export default ProdutoList;