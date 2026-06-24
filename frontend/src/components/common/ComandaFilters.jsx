import { useState, useEffect } from 'react';
import { TextField, Box, Button, Accordion, AccordionSummary, AccordionDetails, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Clear, FilterList } from '@mui/icons-material';
import { getStatusOptions } from '../../constants/comandaStatus';

const ComandaFilters = ({ onFilter, onClear, filters: externalFilters = {} }) => {
    const [filters, setFilters] = useState({ id: '', comanda: '', status: '', funcionario_id: '', cliente_id: '', data_inicio: '', data_fim: '' });
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
        // Limpar filtros vazios antes de enviar
        const cleanedFilters = Object.keys(filters).reduce((acc, key) => {
            const value = filters[key];
            if (value !== '' && value !== null && value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});
        onFilter(cleanedFilters);
    };

    const handleClear = () => {
        setFilters({ id: '', comanda: '', status: '', funcionario_id: '', cliente_id: '', data_inicio: '', data_fim: '' });
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
                            <TextField fullWidth label="Comanda" value={filters.comanda} onChange={handleInputChange('comanda')} placeholder="Buscar por comanda..." type="number" size="small" />
                        </Box>
                        <Box>
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select value={filters.status} label="Status" onChange={handleInputChange('status')}>
                                    <MenuItem value="">Todos</MenuItem>
                                    {getStatusOptions().map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <TextField fullWidth label="Funcionário" value={filters.funcionario_id} onChange={handleInputChange('funcionario_id')} placeholder="Buscar por funcionário..." size="small" />
                        </Box>
                        <Box>
                            <TextField fullWidth label="Cliente" value={filters.cliente_id} onChange={handleInputChange('cliente_id')} placeholder="Buscar por cliente..." size="small" />
                        </Box>
                        <Box>
                            <TextField fullWidth label="Data Inicial" type="date" value={filters.data_inicio} onChange={handleInputChange('data_inicio')} size="small" inputlabelprops={{ shrink: true }} />
                        </Box>
                        <Box>
                            <TextField fullWidth label="Data Final" type="date" value={filters.data_fim} onChange={handleInputChange('data_fim')} size="small" inputlabelprops={{ shrink: true }} />
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
export default ComandaFilters;