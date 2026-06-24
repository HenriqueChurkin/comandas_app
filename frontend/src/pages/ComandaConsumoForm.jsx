import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, CircularProgress, Typography, MenuItem, FormControl, InputLabel, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import PageLayout from "../components/common/PageLayout";
import ActionButtons from '../components/common/ActionButtons';
import { useValidationRules } from '../hooks/useValidationRules';
import comandaService from '../services/comandaService';
import produtoService from '../services/produtoService';
import showSnackbar from '../utils/snackbar';
import showConfirm from '../utils/confirm';
import { useAuth } from '../context/AuthContext';

const ComandaConsumoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Proteção 1: Evita quebra se o useAuth retornar undefined
    const authContext = useAuth() || {};
    const user = authContext.user || null;

    // Proteção 2: Evita quebra se as regras de validação falharem ao carregar
    const validationRules = useValidationRules() || {};
    const campoObrigatorio = validationRules.required || "Campo obrigatório";

    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        defaultValues: {
            produto_id: '',
            quantidade: 1,
            funcionario_id: user?.id || ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [comanda, setComanda] = useState(null);
    const [itens, setItens] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [loadingProdutos, setLoadingProdutos] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);

    // Atualiza o funcionário no formulário assim que o usuário logado estiver disponível
    useEffect(() => {
        if (user?.id) {
            setValue('funcionario_id', user.id);
        }
    }, [user, setValue]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const comandaData = await comandaService.getById(id);
                setComanda(comandaData);
                
                const itensResponse = await comandaService.listItems(id);
                const itensArray = Array.isArray(itensResponse) ? itensResponse : (itensResponse?.data || itensResponse?.items || []);
                setItens(itensArray);
                
                setLoadingProdutos(true);
                const produtosResponse = await produtoService.list({ limit: 1000 });
                const produtosArray = Array.isArray(produtosResponse) ? produtosResponse : (produtosResponse?.data || produtosResponse?.items || []);
                setProdutos(produtosArray);
                
            } catch (error) {
                const mensagem = error.apiMessage || 'Erro ao carregar dados da comanda';
                showSnackbar(mensagem, 'error');
                setItens([]);
                setProdutos([]);
            } finally {
                setLoadingData(false);
                setLoadingProdutos(false);
            }
        };
        if (id) {
            loadData();
        }
    }, [id]);

    // Função auxiliar para formatar datas com segurança sem travar o render
    const formatarData = (dataString) => {
        if (!dataString) return 'Não informada';
        try {
            const d = new Date(dataString);
            return isNaN(d.getTime()) ? 'Data inválida' : d.toLocaleString('pt-BR');
        } catch (e) {
            return 'Erro na formatação da data';
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const listaProdutos = Array.isArray(produtos) ? produtos : [];
            const itemData = {
                produto_id: parseInt(data.produto_id),
                quantidade: parseInt(data.quantidade),
                funcionario_id: user?.id || data.funcionario_id,
                valor_unitario: listaProdutos.find(p => p?.id === parseInt(data.produto_id))?.valor_unitario || 0
            };

            if (editingItemId) {
                await comandaService.updateItem(editingItemId, itemData);
                showSnackbar('Item atualizado com sucesso!', 'success');
                setEditingItemId(null);
            } else {
                await comandaService.addItem(id, itemData);
                showSnackbar('Item adicionado com sucesso!', 'success');
            }

            reset({
                produto_id: '',
                quantidade: 1,
                funcionario_id: user?.id || ''
            });

            const itensResponse = await comandaService.listItems(id);
            setItens(Array.isArray(itensResponse) ? itensResponse : []);
        } catch (error) {
            const mensagem = error.apiMessage || 'Erro ao processar item';
            showSnackbar(mensagem, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditItem = (item) => {
        if (!item) return;
        setEditingItemId(item.id);
        setValue('produto_id', item.produto_id);
        setValue('quantidade', item.quantidade);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingItemId(null);
        reset({
            produto_id: '',
            quantidade: 1,
            funcionario_id: user?.id || ''
        });
    };

    const handleRemoveItem = (item) => {
        if (!item) return;
        const listaProdutos = Array.isArray(produtos) ? produtos : [];
        const pNome = item.produto?.nome || listaProdutos.find(p => p?.id === item.produto_id)?.nome || 'Produto';
        
        showConfirm('Remover Item', `Tem certeza que deseja remover "${pNome}", quantidade ${item.quantidade}?`,
            async () => {
                try {
                    await comandaService.removeItem(item.id);
                    showSnackbar('Item removido com sucesso!', 'success');
                    const itensResponse = await comandaService.listItems(id);
                    setItens(Array.isArray(itensResponse) ? itensResponse : []);
                } catch (error) {
                    const mensagem = error.apiMessage || 'Erro ao remover item';
                    showSnackbar(mensagem, 'error');
                }
            }
        );
    };

    const handleCancel = () => {
        navigate('/comandas');
    };

    if (loadingData) {
        return (
            <PageLayout title={`Consumo - Comanda ${id || ''}`}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout title={`Consumo - Comanda ${comanda?.comanda || ''}`}>
            {/* Informações da Comanda com Safe Navigation */}
            {comanda && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Comanda {comanda?.comanda}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Cliente: {comanda?.cliente_nome || comanda?.cliente_id || 'Não identificado'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Abertura: {formatarData(comanda?.data_hora)}
                    </Typography>
                </Box>
            )}

            {/* Formulário para adicionar itens */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Adicionar Item de Consumo</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    
                    {/* Campo Produto protegido contra regras nulas */}
                    <Controller 
                        name="produto_id" 
                        control={control} 
                        rules={{ required: campoObrigatorio }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.produto_id}>
                                <InputLabel id="produto-label">Produto</InputLabel>
                                <Select 
                                    {...field} 
                                    labelId="produto-label" 
                                    label="Produto"
                                    disabled={loading || loadingProdutos || !!editingItemId}
                                    value={field.value || ''}
                                >
                                    <MenuItem value="" disabled>Selecione um produto</MenuItem>
                                    {Array.isArray(produtos) && produtos.map((produto, idx) => {
                                        if (!produto) return null;
                                        return (
                                            <MenuItem key={produto.id || idx} value={produto.id}>
                                                {produto.nome || 'Sem nome'} - R$ {Number(produto.valor_unitario || 0).toFixed(2)}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        )}
                    />

                    {/* Campo Quantidade */}
                    <Controller 
                        name="quantidade" 
                        control={control} 
                        rules={{
                            required: campoObrigatorio, 
                            min: { value: 1, message: 'Quantidade deve ser maior que 0' }
                        }} 
                        render={({ field }) => (
                            <TextField 
                                {...field} 
                                label="Quantidade" 
                                type="number" 
                                sx={{ width: 150 }}
                                error={!!errors.quantidade}
                                helperText={errors.quantidade?.message}
                                disabled={loading}
                            />
                        )}
                    />
                </Box>

                <Controller 
                    name="funcionario_id" 
                    control={control} 
                    rules={{ required: false }}
                    render={({ field }) => (
                        <input {...field} type="hidden" value={field.value || user?.id || ''} />
                    )}
                />

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button type="submit" variant="contained" disabled={loading || loadingProdutos} startIcon={editingItemId ? <EditIcon /> : <AddIcon />}>
                        {loading ? 'Processando...' : (editingItemId ? 'Atualizar Item' : 'Adicionar Item')}
                    </Button>
                    {editingItemId && (
                        <Button variant="outlined" onClick={handleCancelEdit} disabled={loading}>Cancelar Edição</Button>
                    )}
                </Box>
            </Box>

            {/* Lista de itens de consumo com mapeamento ultra seguro */}
            <Typography variant="h6" sx={{ mb: 2 }}>Itens de Consumo</Typography>
            {(!Array.isArray(itens) || itens.length === 0) ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    Nenhum item de consumo registrado
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Produto</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Valor Unitário</TableCell>
                                <TableCell>Valor Total</TableCell>
                                <TableCell>Funcionário</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itens.map((item, index) => {
                                if (!item) return null;
                                const listaProd = Array.isArray(produtos) ? produtos : [];
                                const produtoEncontrado = listaProd.find(p => p?.id === item.produto_id);
                                
                                const pNome = item.produto?.nome || produtoEncontrado?.nome || 'Produto não encontrado';
                                const fNome = item.funcionario?.nome || '-';
                                const vUnitario = Number(item.valor_unitario || 0);
                                const qtd = Number(item.quantidade || 0);

                                return (
                                    <TableRow key={item.id || index}>
                                        <TableCell>{pNome}</TableCell>
                                        <TableCell>{qtd}</TableCell>
                                        <TableCell>R$ {vUnitario.toFixed(2)}</TableCell>
                                        <TableCell>R$ {(vUnitario * qtd).toFixed(2)}</TableCell>
                                        <TableCell>{fNome}</TableCell>
                                        <TableCell>
                                            <ActionButtons 
                                                item={item} 
                                                onEdit={handleEditItem} 
                                                onDelete={handleRemoveItem} 
                                                disabled={editingItemId === item.id} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleCancel} disabled={loading}>Voltar</Button>
            </Box>
        </PageLayout>
    );
};

export default ComandaConsumoForm;