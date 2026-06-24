import { useState, useEffect } from 'react';
import { TextField, Box, Button, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { Clear, FilterList } from '@mui/icons-material';
/*
opções de filtro de produto
id, integer | (integer | null) - Filtrar por ID
nome, string | (string | null) - Filtrar por nome
descricao, string | (string | null) - Filtrar por descrição
valor, number | (number | null) - Filtrar por valor exato
valor_min, number | (number | null) - Filtrar por valor mínimo (maior ou igual)
valor_max, number | (number | null) - Filtrar por valor máximo (menor ou igual)
*/
const ProdutoFilters = ({ onFilter, onClear, filters: externalFilters = {} }) => {
    const [filters, setFilters] = useState({ id: '', nome: '', descricao: '', valor: '', valor_min: '', valor_max: '' });
    // Sincronizar estado local com props externas
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            ...externalFilters
        }));
    }, [externalFilters]);
    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const handleFilter = () => {
        // Limpar valores vazios antes de enviar
        const cleanedFilters = Object.keys(filters).reduce((acc, key) => {
            const value = filters[key];
            if (value !== '' && value !== null && value !== undefined) {
                acc[key] = key === 'valor_min' || key === 'valor_max' ? parseFloat(value) : value;
            }
            return acc;
        }, {});
        onFilter(cleanedFilters);
    };
    const handleClear = () => {
        setFilters({ id: '', nome: '', descricao: '', valor: '', valor_min: '', valor_max: '' });
        onClear();
    };
    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    // conteúdo do componente - return
    return (
        <Accordion>
            <AccordionSummary expandIcon={<FilterList />}>
                <Typography variant="h6" component="div">
                    Opções de Filtros {hasActiveFilters && '(ativos)'}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
                        <Box>
                            <TextField fullWidth label="ID" value={filters.id} onChange={handleInputChange('id')} placeholder="Buscar por ID..." type="number" size="small" />
                        </Box>
                        <Box>
                            <TextField fullWidth label="Nome" value={filters.nome} onChange={handleInputChange('nome')} placeholder="Buscar por nome..." size="small" />
                        </Box>
                        <Box>
                            <TextField fullWidth label="Descrição" value={filters.descricao} onChange={handleInputChange('descricao')} placeholder="Buscar por descrição..." size="small" />
                        </Box>
                        <Box>
                            <TextField fullWidth label="Valor" value={filters.valor} onChange={handleInputChange('valor')} placeholder="0,00" type="number" size="small" />
                        </Box>
                        <Box>
                            <TextField fullWidth label="Valor Mínimo" value={filters.valor_min} onChange={handleInputChange('valor_min')} placeholder="0,00" type="number" size="small" />
                        </Box>
                        <Box>
                            <TextField fullWidth label="Valor Máximo" value={filters.valor_max} onChange={handleInputChange('valor_max')} placeholder="999,99" type="number" size="small" />
                        </Box>
                        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' }, display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Button variant="outlined" startIcon={<Clear />} onClick={handleClear} disabled={!hasActiveFilters} size="small">
                                Limpar
                            </Button>
                            <Button variant="contained" onClick={handleFilter} size="small">
                                Filtrar
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};
export default ProdutoFilters;