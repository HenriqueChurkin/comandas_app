import { useEffect, useMemo, useState } from 'react';
import {
    Alert, Avatar, Box, Button, Card, CardContent, Checkbox, Chip, CircularProgress,
    Dialog, DialogActions, DialogContent, Divider, IconButton, Paper, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
    Tooltip, Typography
} from '@mui/material';
import {
    Close, Image as ImageIcon, PointOfSale, Print, Refresh, ReceiptLong,
} from '@mui/icons-material';
import PageLayout from '../components/common/PageLayout';
import recebimentoService from '../services/recebimentoService';
import showSnackbar from '../utils/snackbar';

const currency = (value) => Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const productImageSrc = (foto) => {
    if (!foto || typeof foto !== 'string') return null;
    if (foto.startsWith('data:image') || foto.startsWith('http')) return foto;
    return `data:image/jpeg;base64,${foto}`;
};

const Caixa = () => {
    const [comandas, setComandas] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [detalhe, setDetalhe] = useState(null);
    const [comprovante, setComprovante] = useState(null);
    
    // CORREÇÃO: Inicializar como string vazia (em vez de 0) para que o input fique totalmente limpo
    const [desconto, setDesconto] = useState('');
    const [acrescimo, setAcrescimo] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [loadingDetalhe, setLoadingDetalhe] = useState(false);
    const [recebendo, setRecebendo] = useState(false);

    const valorBruto = Number(detalhe?.valor_bruto || 0);
    const valorFinal = useMemo(() => {
        // Conversão segura: se for string vazia, trata como 0 na conta
        return Math.max(valorBruto - Number(desconto || 0) + Number(acrescimo || 0), 0);
    }, [valorBruto, desconto, acrescimo]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const data = await recebimentoService.dashboard();
            setComandas(data);
        } catch (error) {
            const mensagem = error.apiMessage || 'Erro ao carregar comandas abertas';
            showSnackbar(mensagem, 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadDetalhe = async (ids) => {
        if (ids.length === 0) {
            setDetalhe(null);
            return;
        }

        try {
            setLoadingDetalhe(true);
            const data = await recebimentoService.detalhe(ids);
            setDetalhe(data);
        } catch (error) {
            const mensagem = error.apiMessage || 'Erro ao carregar detalhes das comandas';
            showSnackbar(mensagem, 'error');
            setDetalhe(null);
        } finally {
            setLoadingDetalhe(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    useEffect(() => {
        loadDetalhe(selectedIds);
    }, [selectedIds]);

    const handleSelect = (id) => {
        setSelectedIds((current) => (
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        ));
    };

    const handleSelectAll = () => {
        if (selectedIds.length === comandas.length) {
            setSelectedIds([]);
            return;
        }
        setSelectedIds(comandas.map((comanda) => comanda.id));
    };

    const handleReceber = async () => {
        if (selectedIds.length === 0) {
            showSnackbar('Selecione ao menos uma comanda', 'warning');
            return;
        }

        try {
            setRecebendo(true);
            const recebimento = await recebimentoService.receber({
                comanda_ids: selectedIds,
                // Garante que manda número pro backend
                desconto: Number(desconto || 0),
                acrescimo: Number(acrescimo || 0),
            });
            const comprovanteData = await recebimentoService.comprovante(recebimento.id);
            setComprovante(comprovanteData);
            setSelectedIds([]);
            setDetalhe(null);
            setDesconto(''); // Limpa o estado voltando pra string vazia
            setAcrescimo(''); // Limpa o estado voltando pra string vazia
            await loadDashboard();
            showSnackbar('Recebimento realizado com sucesso!', 'success');
        } catch (error) {
            const mensagem = error.apiMessage || 'Erro ao processar recebimento';
            showSnackbar(mensagem, 'error');
        } finally {
            setRecebendo(false);
        }
    };

    const actions = (
        <Tooltip title="Atualizar comandas" arrow>
            <IconButton color="inherit" onClick={loadDashboard} disabled={loading}>
                <Refresh />
            </IconButton>
        </Tooltip>
    );

    const renderComandas = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (comandas.length === 0) {
            return (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Nenhuma comanda aberta encontrada no momento.
                </Alert>
            );
        }

        return (
            <TableContainer component={Paper} elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    checked={comandas.length > 0 && selectedIds.length === comandas.length}
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < comandas.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Comanda</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Abertura</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Itens</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {comandas.map((comanda) => (
                            <TableRow
                                key={comanda.id}
                                hover
                                selected={selectedIds.includes(comanda.id)}
                                onClick={() => handleSelect(comanda.id)}
                                sx={{ cursor: 'pointer', '&.Mui-selected': { bgcolor: 'action.selected' } }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox color="primary" checked={selectedIds.includes(comanda.id)} />
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
                                        {comanda.comanda}
                                    </Typography>
                                </TableCell>
                                <TableCell>{new Date(comanda.data_hora).toLocaleString('pt-BR')}</TableCell>
                                <TableCell>{comanda.cliente?.nome || comanda.cliente_id || '-'}</TableCell>
                                <TableCell align="right">
                                    <Chip label={comanda.quantidade_itens} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 500 }}>
                                    {currency(comanda.total)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const renderDetalhe = () => {
        if (selectedIds.length === 0) return null;

        if (loadingDetalhe) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (!detalhe) return null;

        return (
            <Stack spacing={2} sx={{ mt: 3 }}>
                {detalhe.comandas.map((comanda) => (
                    <Card key={comanda.id} elevation={2} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                        Comanda {comanda.comanda}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {comanda.cliente?.nome || 'Cliente não identificado'}
                                    </Typography>
                                </Box>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                    {currency(comanda.total)}
                                </Typography>
                            </Box>

                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Produto</TableCell>
                                            <TableCell align="center">Qtd.</TableCell>
                                            <TableCell align="right">Unitário</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {comanda.produtos.map((item) => {
                                            const src = productImageSrc(item.produto?.foto);
                                            return (
                                                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                            <Avatar
                                                                src={src || undefined}
                                                                variant="rounded"
                                                                sx={{ width: 40, height: 40, bgcolor: 'grey.100', color: 'grey.500' }}
                                                            >
                                                                <ImageIcon fontSize="small" />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                                                    {item.produto?.nome || `Produto ${item.produto_id}`}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                                    {item.produto?.descricao || '-'}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={`${item.quantidade}x`} size="small" sx={{ height: 24 }} />
                                                    </TableCell>
                                                    <TableCell align="right">{currency(item.valor_unitario)}</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 600 }}>{currency(item.valor_total)}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        );
    };

    const renderComprovante = () => {
        if (!comprovante) return null;

        const recebimento = comprovante.recebimento;

        return (
            <Dialog 
                open={!!comprovante} 
                onClose={() => setComprovante(null)}
                PaperProps={{
                    sx: {
                        maxWidth: '380px',
                        width: '100%',
                        bgcolor: '#fafafa',
                        borderRadius: 1,
                        m: 2
                    }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1, pr: 1 }}>
                    <IconButton size="small" onClick={() => setComprovante(null)}>
                        <Close fontSize="small" />
                    </IconButton>
                </Box>
                
                <DialogContent sx={{ 
                    pt: 0, 
                    pb: 3, 
                    px: 3, 
                    fontFamily: "'Courier New', Courier, monospace",
                    color: '#000',
                    '& *': { fontFamily: 'inherit' }
                }}>
                    
                    <Typography align="center" sx={{ fontWeight: 'bold', fontSize: '1.2rem', mb: 1, textTransform: 'uppercase' }}>
                        Recibo de Pagamento
                    </Typography>
                    <Typography align="center" sx={{ fontSize: '0.9rem', mb: 2 }}>
                        Nº {String(recebimento.id).padStart(6, '0')}
                    </Typography>

                    <Box sx={{ borderBottom: '1px dashed #000', mb: 1.5, pb: 1.5 }}>
                        <Typography sx={{ fontSize: '0.85rem' }}>
                            DATA: {new Date(recebimento.data_hora).toLocaleString('pt-BR')}
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem' }}>
                            OPERADOR: {recebimento.funcionario?.nome || `FUNC. ${recebimento.funcionario_id}`.toUpperCase()}
                        </Typography>
                    </Box>

                    {comprovante.detalhes.comandas.map((comanda) => (
                        <Box key={comanda.id} sx={{ mb: 2 }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem', mt: 1 }}>
                                COMANDA: {comanda.comanda}
                            </Typography>
                            <Box sx={{ borderBottom: '1px dashed #000', my: 1 }} />
                            
                            <Box sx={{ display: 'flex', fontWeight: 'bold', fontSize: '0.8rem', mb: 0.5 }}>
                                <Box sx={{ width: '35px' }}>QTD</Box>
                                <Box sx={{ flex: 1 }}>ITEM</Box>
                                <Box sx={{ width: '80px', textAlign: 'right' }}>V. TOTAL</Box>
                            </Box>
                            
                            {comanda.produtos.map((item) => (
                                <Box key={item.id} sx={{ display: 'flex', fontSize: '0.8rem', mb: 0.5, alignItems: 'flex-start' }}>
                                    <Box sx={{ width: '35px' }}>{item.quantidade}x</Box>
                                    <Box sx={{ flex: 1, pr: 1, textTransform: 'uppercase' }}>
                                        {item.produto?.nome || `PROD ${item.produto_id}`}
                                    </Box>
                                    <Box sx={{ width: '80px', textAlign: 'right' }}>
                                        {currency(item.valor_total)}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ))}

                    <Box sx={{ borderBottom: '1px dashed #000', my: 1.5 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, fontSize: '0.9rem' }}>
                        <Typography>SUBTOTAL:</Typography>
                        <Typography>{currency(recebimento.valor_bruto)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, fontSize: '0.9rem' }}>
                        <Typography>DESCONTO:</Typography>
                        <Typography>{currency(recebimento.desconto)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, fontSize: '0.9rem' }}>
                        <Typography>ACRÉSCIMO:</Typography>
                        <Typography>{currency(recebimento.acrescimo)}</Typography>
                    </Box>

                    <Box sx={{ borderBottom: '1px dashed #000', my: 1.5 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>TOTAL:</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{currency(recebimento.valor_final)}</Typography>
                    </Box>
                    
                    <Box sx={{ borderBottom: '1px dashed #000', mt: 2, mb: 1.5 }} />
                    
                    <Typography align="center" sx={{ fontSize: '0.8rem', mt: 2, textTransform: 'uppercase' }}>
                        Obrigado pela preferência!
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2, justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <Button 
                        startIcon={<Print />} 
                        onClick={() => window.print()}
                        variant="contained"
                        fullWidth
                        sx={{ 
                            bgcolor: '#333', 
                            color: '#fff', 
                            '&:hover': { bgcolor: '#000' }
                        }}
                    >
                        IMPRIMIR CUPOM
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <PageLayout title="Caixa" actions={actions}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'minmax(0, 1fr)',
                        lg: 'minmax(0, 1fr) 380px',
                    },
                    gap: 3,
                    width: '100%',
                }}
            >
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ReceiptLong color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Comandas abertas
                        </Typography>
                    </Box>
                    {renderComandas()}
                    
                    {selectedIds.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <PointOfSale color="primary" />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Detalhes das Comandas
                                </Typography>
                            </Box>
                            {renderDetalhe()}
                        </Box>
                    )}
                </Box>

                <Box>
                    <Card elevation={3} sx={{ borderRadius: 2, position: 'sticky', top: 24 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <PointOfSale color="primary" fontSize="large" />
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    Recebimento
                                </Typography>
                            </Box>

                            <Stack spacing={2.5}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                                    <Typography color="text.secondary">Selecionadas</Typography>
                                    <Chip label={selectedIds.length} color="primary" sx={{ fontWeight: 700 }} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                    <Typography color="text.secondary">Subtotal</Typography>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{currency(valorBruto)}</Typography>
                                </Box>
                                
                                <Divider sx={{ my: 1 }} />
                                
                                <TextField
                                    label="Desconto (R$)"
                                    type="number"
                                    value={desconto}
                                    onChange={(event) => setDesconto(event.target.value)}
                                    inputProps={{ min: 0, step: '0.01' }}
                                    fullWidth
                                    variant="outlined"
                                    disabled={selectedIds.length === 0}
                                    placeholder="0,00"
                                />
                                <TextField
                                    label="Acréscimo (R$)"
                                    type="number"
                                    value={acrescimo}
                                    onChange={(event) => setAcrescimo(event.target.value)}
                                    inputProps={{ min: 0, step: '0.01' }}
                                    fullWidth
                                    variant="outlined"
                                    disabled={selectedIds.length === 0}
                                    placeholder="0,00"
                                />
                                
                                <Box sx={{ 
                                    bgcolor: 'background.default', 
                                    p: 2, 
                                    borderRadius: 1, 
                                    mt: 2,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Total Final</Typography>
                                        <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
                                            {currency(valorFinal)}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<PointOfSale />}
                                    onClick={handleReceber}
                                    disabled={recebendo || selectedIds.length === 0 || loadingDetalhe}
                                    fullWidth
                                    sx={{ mt: 2, py: 1.5, fontWeight: 700, fontSize: '1.05rem' }}
                                >
                                    {recebendo ? 'Processando...' : 'Finalizar Recebimento'}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {renderComprovante()}
        </PageLayout>
    );
};

export default Caixa;