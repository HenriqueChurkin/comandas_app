import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageLayout from "../components/common/PageLayout";
import ActionButtons from "../components/common/ActionButtons";

function ClienteList() {

    const navigate = useNavigate();

    const clientes = [
        {
            id: 1,
            nome: 'Neymar Jr',
            cpf: '10',
            telefone: '499999062026'
        },
        {
            id: 2,
            nome: 'Ronaldo',
            cpf: '9',
            telefone: '49999052002'
        }
    ];

    const actions = (
        <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/cliente')}
            startIcon={<FiberNew />}
            sx={{ fontWeight: 600, px: 2, py: 1 }}
        >
            Novo
        </Button>
    );

    const handleView = (cliente) =>
        console.log("Visualizar cliente:", cliente);

    const handleEdit = (cliente) =>
        navigate(`/cliente/${cliente.id}`);

    const handleDelete = (cliente) =>
        console.log("Excluir cliente:", cliente);

    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'nome', headerName: 'Nome' },
        { field: 'cpf', headerName: 'CPF' },
        { field: 'telefone', headerName: 'Telefone' },
        { field: 'actions', headerName: 'Ações' }
    ];

    // Desktop
    const renderDesktopRow = (cliente) => (
        <TableRow key={cliente.id} hover>

            <TableCell>
                {cliente.id}
            </TableCell>

            <TableCell sx={{ fontWeight: 500 }}>
                {cliente.nome}
            </TableCell>

            <TableCell>
                {cliente.cpf}
            </TableCell>

            <TableCell>
                {cliente.telefone}
            </TableCell>

            <TableCell>
                <ActionButtons
                    item={cliente}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </TableCell>

        </TableRow>
    );

    // Mobile
    const renderMobileCard = (cliente) => (
        <Card key={cliente.id} sx={{ mb: 2, elevation: 2 }}>

            <CardContent sx={{ p: 2 }}>

                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: '1.1rem',
                            fontWeight: 600
                        }}
                    >
                        {cliente.nome}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        ID: {cliente.id}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>

                    <Typography variant="body2">
                        <strong>CPF:</strong> {cliente.cpf}
                    </Typography>

                    <Typography variant="body2">
                        <strong>Telefone:</strong> {cliente.telefone}
                    </Typography>

                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}
                >
                    <ActionButtons
                        item={cliente}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </Box>

            </CardContent>

        </Card>
    );

    return (

        <PageLayout title="Clientes" actions={actions}>

            {/* Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>

                <TableContainer component={Paper}>

                    <Table>

                        <TableHead>
                            <TableRow>

                                {columns.map((column, index) => (
                                    <TableCell
                                        key={index}
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {column.headerName}
                                    </TableCell>
                                ))}

                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {clientes.map((cliente) =>
                                renderDesktopRow(cliente)
                            )}
                        </TableBody>

                    </Table>

                </TableContainer>

            </Box>

            {/* Mobile */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>

                {clientes.map((cliente) =>
                    renderMobileCard(cliente)
                )}

            </Box>

        </PageLayout>

    );

}

export default ClienteList;