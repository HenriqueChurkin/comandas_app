import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import PageLayout from "../components/common/PageLayout";
import ProdutoFilters from '../components/common/ProdutoFilters';
import Pagination from '../components/common/Pagination';
import { produtoService } from '../services/produtoService';
// Definição do componente ProdutoListPublic
function ProdutoListPublic() {
    // Estados do componente
    const [produtos, setProdutos] = useState([]); // Lista de produtos da API
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [filters, setFilters] = useState({}); // Estados para filtros
    const [pagination, setPagination] = useState({ skip: 0, limit: 3, currentPage: 1 }); // Estados para paginação
    const [hasItems, setHasItems] = useState(true); // Controla se há itens na página atual, utilizado na paginação
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
    // Funções utilitárias
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // Efeito para carregar produtos públicos
    useEffect(() => {
        const loadProdutosPublic = async () => {
            try {
                setLoading(true);
                const params = { skip: pagination.skip, limit: pagination.limit, ...filters }; // Parâmetros para a requisição
                const response = await produtoService.listPublic(params); // Executa o serviço de listagem pública, passando os parâmetros
                const produtosData = response.data || response; // Obtém os dados da resposta
                setProdutos(produtosData); // Atribui os produtos à lista
                setHasItems(produtosData && produtosData.length > 0); // Define se há itens na página atual
            } catch (error) {
                console.error('Erro ao carregar produtos públicos:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProdutosPublic(); // Carrega os produtos públicos
    }, [pagination.skip, pagination.limit, filters]); // Executa quando os parâmetros de paginação ou filtros mudarem

    // Renderiza a página
    return (
        <PageLayout title="Cardápio">
            {/* Componente de Filtros */}
            <ProdutoFilters
                onFilter={handleFilter}
                onClear={handleClearFilters}
                filters={filters}
            />
            {/* Grid de Produtos */}
            <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
                {produtos.map((produto) => (
                    <Card key={produto.nome} sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.100', overflow: 'hidden', position: 'relative' }}>
                            <Box sx={{ width: 60, height: 60, borderRadius: 2, overflow: 'hidden', backgroundColor: 'grey.100' }}>
                                {produto.foto ? (
                                    <img src={produto.foto} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                ) : (
                                    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey.200', color: 'grey.500', fontSize: '10px', textAlign: 'center' }}>
                                        Sem foto
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                            <Typography variant="h6" component="h3" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1, color: 'primary.main', minHeight: 48 }}>
                                {produto.nome}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 60 }}>
                                {produto.descricao}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main', textAlign: 'center', mt: 'auto' }}>
                                {formatCurrency(produto.valor_unitario)}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
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
export default ProdutoListPublic;