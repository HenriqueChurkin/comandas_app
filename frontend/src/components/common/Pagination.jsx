import { Box, Button, Typography, TextField } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

/*
opções de paginação na API:
    skip, integer, default 0, minimum 0 - Número de registros para pular
    limit, integer, default 100, minimum 1, maximum 1000 - Número máximo de registros
*/

const Pagination = ({
    currentPage = 1, itemsPerPage = 3, onPageChange, onItemsPerPageChange, loading = false, hasItems = true
}) => {
    const handlePrevious = () => {
        if (currentPage > 1 && !loading) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (!loading) {
            onPageChange(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = parseInt(event.target.value);
        if (newItemsPerPage > 0 && newItemsPerPage <= 1000) {
            onItemsPerPageChange(newItemsPerPage);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        
            {/* Controles de página */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button size="small" onClick={handlePrevious} disabled={currentPage === 1 || loading} startIcon={<KeyboardArrowLeft />}>
                    Anterior
                </Button>
                <Typography variant="body2" sx={{ mx: 1 }}>
                    Página {currentPage}
                </Typography>
                <Button size="small" onClick={handleNext} disabled={loading || !hasItems} endIcon={<KeyboardArrowRight />}>
                    Próxima
                </Button>
            </Box>
            
            {/* Itens por página */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    Itens por página:
                </Typography>
                <TextField size="small" type="number" value={itemsPerPage} onChange={handleItemsPerPageChange} sx={{ width: '90px' }} disabled={loading} />
            </Box>
        </Box>
    );
};

export default Pagination;