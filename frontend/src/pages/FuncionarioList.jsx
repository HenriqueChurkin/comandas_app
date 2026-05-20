import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageLayout from "../components/common/PageLayout";
import ActionButtons from "../components/common/ActionButtons";

function FuncionarioList() {
    const navigate = useNavigate();

    const funcionarios = [
        { id: 1, nome: 'Henrique Churkin', matricula: '12345', cpf: '1', telefone: '49999999999', grupo: 1 },
        { id: 2, nome: 'Nicolas', matricula: '87535', cpf: '69', telefone: '49978653824', grupo: 2 },
        { id: 3, nome: 'Zé das Batatas', matricula: '9876', cpf: '1210', telefone: '49947251086', grupo: 2 },
    ];

    const actions = (
        <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/funcionario')}
            startIcon={<FiberNew />}
            sx={{ fontWeight: 600, px: 2, py: 1 }}
        >
            Novo
        </Button>
    );

    const handleView = (funcionario) => console.log("Visualizar funcionário:", funcionario);
    const handleEdit = (funcionario) => navigate(`/funcionario/${funcionario.id}`);
    const handleDelete = (funcionario) => console.log("Excluir funcionário:", funcionario);

    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'nome', headerName: 'Nome' },
        { field: 'matricula', headerName: 'Matrícula' },
        { field: 'cpf', headerName: 'CPF' },
        { field: 'telefone', headerName: 'Telefone' },
        { field: 'grupo', headerName: 'Grupo' },
        { field: 'actions', headerName: 'Ações' }
    ];

    const renderDesktopRow = (funcionario) => (
        <TableRow key={funcionario.id} hover>
            <TableCell>{funcionario.id}</TableCell>
            <TableCell sx={{ fontWeight: 500 }}>{funcionario.nome}</TableCell>
            <TableCell>{funcionario.matricula}</TableCell>
            <TableCell>{funcionario.cpf}</TableCell>
            <TableCell>{funcionario.telefone}</TableCell>
            <TableCell>{funcionario.grupo}</TableCell>
            <TableCell>
                <ActionButtons
                    item={funcionario}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </TableCell>
        </TableRow>
    );

    const renderMobileCard = (funcionario) => (
        <Card key={funcionario.id} sx={{ mb: 2, elevation: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                        {funcionario.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ID: {funcionario.id}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2"><strong>Matrícula:</strong> {funcionario.matricula}</Typography>
                    <Typography variant="body2"><strong>CPF:</strong> {funcionario.cpf}</Typography>
                    <Typography variant="body2"><strong>Telefone:</strong> {funcionario.telefone}</Typography>
                    <Typography variant="body2"><strong>Grupo:</strong> {funcionario.grupo}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ActionButtons
                        item={funcionario}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <PageLayout title="Funcionários" actions={actions}>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell key={index} sx={{ fontWeight: 600 }}>
                                        {column.headerName}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {funcionarios.map((funcionario) => renderDesktopRow(funcionario))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {funcionarios.map((funcionario) => renderMobileCard(funcionario))}
            </Box>
        </PageLayout>
    );
}

export default FuncionarioList;