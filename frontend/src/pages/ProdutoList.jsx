import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageLayout from "../components/common/PageLayout";
import ActionButtons from "../components/common/ActionButtons";

function ProdutoList() {
  const navigate = useNavigate();

  const produtos = [
    { id: 1, nome: 'Hambúrguer Clássico', descricao: 'Pão, carne, alface, tomate, queijo', valor_unitario: 25.90, foto: '/src/assets/hero.png' },
    { id: 2, nome: 'Batata Frita', descricao: 'Porção média de batata crocante', valor_unitario: 12.50, foto: '/src/assets/vite.svg' },
    { id: 3, nome: 'Refrigerante', descricao: 'Lata 350ml', valor_unitario: 8.00, foto: '/src/assets/react.svg' }
  ];

  const actions = (
    <Button variant="contained" color="primary" onClick={() => navigate('/produto')} startIcon={<FiberNew />} sx={{ fontWeight: 600, px: 2, py: 1 }}>
      Novo
    </Button>
  );

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const handleView = (produto) => console.log("Visualizar produto:", produto);
  const handleEdit = (produto) => navigate(`/produto/${produto.id}`);
  const handleDelete = (produto) => console.log("Excluir produto:", produto);

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'nome', headerName: 'Nome' },
    { field: 'descricao', headerName: 'Descrição' },
    { field: 'valor_unitario', headerName: 'Valor Unitário' },
    { field: 'actions', headerName: 'Ações', renderCell: (params) => <ActionButtons onView={handleView} onEdit={handleEdit} onDelete={handleDelete} item={params.row} /> }
  ];

  const renderDesktopRow = (produto) => (
    <TableRow key={produto.id} hover>
      {columns.map((column, index) => {
        if (column.field === 'id') return <TableCell key={index}>{produto.id}</TableCell>;
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
            <ActionButtons onView={handleView} onEdit={handleEdit} onDelete={handleDelete} item={produto} />
          </TableCell>
        );
        return null;
      })}
    </TableRow>
  );

  const renderMobileCard = (produto) => (
    <Card key={produto.id} sx={{ mb: 2, elevation: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: 2, overflow: 'hidden', backgroundColor: 'grey.100' }}>
              <img src={produto.foto} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <PageLayout title="Produtos" actions={actions}>
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
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {produtos.map((produto) => renderMobileCard(produto))}
      </Box>
    </PageLayout>
  );
}

export default ProdutoList;