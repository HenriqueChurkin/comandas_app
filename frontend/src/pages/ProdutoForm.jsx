import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, CircularProgress, Typography } from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import PageLayout from "../components/common/PageLayout";
import { useValidationRules } from '../hooks/useValidationRules';
import { produtoService } from '../services/produtoService';
import showSnackbar from '../utils/snackbar';
import { useAuth } from '../context/AuthContext';
import { USER_GROUPS } from '../constants/userGroups';

// Definição do componente ProdutoForm
const ProdutoForm = () => {
    // Hooks de navegação e parâmetros
    const { id, opr } = useParams(); // Parâmetros da URL: id e operação (edit/view)
    const navigate = useNavigate(); // Navegação entre páginas
    // Hook de formulário
    const { control, handleSubmit, formState: { errors, dirtyFields }, reset } = useForm();
    // Estados do componente
    const [foto, setFoto] = useState(null); // Arquivo de foto selecionado
    const [fotoPreview, setFotoPreview] = useState(null); // URL para preview da foto
    const [loading, setLoading] = useState(false); // Estado de carregamento durante salvamento
    const [loadingData, setLoadingData] = useState(true); // Estado de carregamento de dados iniciais
    // Configurações e validações
    const validationRules = useValidationRules(); // Regras de validação dos campos
    const isReadOnly = opr === 'view'; // Modo somente leitura para visualização
    const title = opr === 'view' ? `Visualizar Produto: ${id}` : id ? `Editar Produto: ${id}` : 'Novo Produto'; // Título dinâmico

    // Hook de autenticação
    const { user } = useAuth();

    // Funções de manipulação de imagem
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const resizedFile = await resizeImage(file); // Redimensiona para max 100x100px
                setFoto(resizedFile);
                const previewUrl = URL.createObjectURL(resizedFile);
                setFotoPreview(previewUrl);
            } catch (error) {
                showSnackbar("Erro ao redimensionar a imagem.", "error");
            }
        } else {
            setFoto(null);
            setFotoPreview(null);
        }
    };
    
    const resizeImage = (file, maxWidth = 100, maxHeight = 100, quality = 0.7) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                let { width, height } = img;
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }
            
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
        
                canvas.toBlob((blob) => {
                    const resizedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    });
                    resolve(resizedFile);
                }, file.type, quality);
            };
    
            img.src = URL.createObjectURL(file);
        });
    };
    
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result); // Data URL completa com prefixo
            };
            reader.onerror = (error) => reject(error);
        });
    };

    // Funções de navegação
    const handleCancel = () => {
        navigate('/produtos');
    };
    
    // Função de envio do formulário
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            // Processa foto apenas se houver arquivo novo
            if (foto instanceof File) {
                try {
                    const base64 = await fileToBase64(foto);
                    data.foto = base64;
                } catch (error) {
                    showSnackbar('Erro ao processar a foto', 'error');
                    return;
                }
            } else if (!id) {
                data.foto = ""; // Base64 vazio para novos produtos sem foto
            }
    
            let retorno;
            if (id) {
                // Utiliza dirtyFields para extrair apenas campos alterados
                const changedData = {};
                Object.keys(dirtyFields).forEach(key => {
                    if (dirtyFields[key]) {
                        changedData[key] = data[key];
                    }
                });
    
                // Verificar se foi carregada nova foto e adicionar ao objeto de alterações
                if (foto instanceof File) {
                    changedData.foto = data.foto;
                }
    
                if (Object.keys(changedData).length === 0) {
                    showSnackbar('Nenhuma alteração detectada', 'info');
                    return;
                }
    
                console.log('Campos alterados:', changedData);
                retorno = await produtoService.update(id, changedData);
                showSnackbar('Produto atualizado com sucesso!', 'success');
            } else {
                retorno = await produtoService.create(data);
                showSnackbar('Produto criado com sucesso!', 'success');
            }
    
            if (!retorno?.id) {
                throw new Error(retorno.detail || "Erro ao salvar produto.");
            }
            
            navigate('/produtos');
        } catch (error) {
            const mensagem = error.apiMessage || 'Erro ao salvar produto';
            showSnackbar(mensagem, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Efeito para carregar dados do produto e verificar permissões
    useEffect(() => {
        // Se não for modo de apenas visualização e o usuário não for administrador (grupo 1), barra o acesso        
        if (opr !== 'view' && user?.grupo !== USER_GROUPS.ADMINISTRADOR) {
            showSnackbar('Acesso negado: Apenas administradores podem cadastrar ou editar produtos.', 'warning');
            navigate('/produtos');
            return;
        }
        
        const loadProduto = async () => {
            if (id) {
                try {
                    setLoadingData(true);
                    const data = await produtoService.getById(id); // Pesquisa produto pelo id
                    reset(data); // Preenche formulário com dados existentes
                    
                    if (data.foto) {
                        setFoto(data.foto);
                        setFotoPreview(data.foto);
                    }
                    
                } catch (error) {
                    showSnackbar('Erro ao carregar produto', 'error');
                    navigate('/produtos');
                } finally {
                    setLoadingData(false);
                }
            
            } else {
                setLoadingData(false);
            }
        };
            
        loadProduto();    
    }, [id, opr, user, navigate]);

    // Renderiza o formulário
    return (
        <PageLayout title={title}>
            {loadingData ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        
                    {opr === 'view' && (
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            Todos os campos estão em modo somente leitura.
                        </Typography>
                    )}
            
                    <Controller name="nome" id="nome" control={control} defaultValue="" rules={validationRules.nome}
                        render={({ field }) => (
                            <TextField {...field} disabled={isReadOnly} label="Nome" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} />
                        )}
                    />
            
                    <Controller name="descricao" id="descricao" control={control} defaultValue="" rules={validationRules.descricao}
                        render={({ field }) => (
                            <TextField {...field} disabled={isReadOnly} label="Descrição" fullWidth margin="normal" multiline rows={3} error={!!errors.descricao} helperText={errors.descricao?.message} />
                        )}
                    />
            
                    <Controller name="valor_unitario" id="valor_unitario" control={control} defaultValue="" rules={validationRules.valor_unitario}
                        render={({ field }) => (
                            <TextField {...field} disabled={isReadOnly} label="Valor Unitário" fullWidth margin="normal" type="number" step="0.01" min="0" error={!!errors.valor_unitario} helperText={errors.valor_unitario?.message} />
                        )}
                    />
            
                    {/* Campo de upload de imagem */}
                    <Box sx={{ mt: 2 }}>
                        <input id="foto-upload" name="foto-upload" type="file" accept="image/*" onChange={handleFileChange} disabled={isReadOnly} />
                        <label htmlFor="foto-upload">
                            <Button variant="outlined" component="span" startIcon={<PhotoCameraIcon />} fullWidth>
                                {id ? 'Alterar Foto' : 'Selecionar Foto'}
                            </Button>
                        </label>
                    </Box>
            
                    {/* Preview da imagem selecionada */}
                    {fotoPreview ? (
                        <Box sx={{ mt: 2 }}>
                            <img src={fotoPreview} alt="" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                        </Box>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            Sem foto
                        </Box>
                    )}
            
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button sx={{ mr: 1 }} onClick={handleCancel} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Salvando...' : (id ? 'Atualizar' : 'Cadastrar')}
                        </Button>
                    </Box>
                </Box>
            )}
        </PageLayout>
    );

};

export default ProdutoForm;