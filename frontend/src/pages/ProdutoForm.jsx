import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, InputLabel } from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageLayout from "../components/common/PageLayout";
import { useValidationRules } from '../hooks/useValidationRules';

const ProdutoForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const validationRules = useValidationRules();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Dados do produto:", data);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Arquivo selecionado:", file);
    }
  };

  const handleCancel = () => {
    navigate('/produtos');
  };

  return (
    <PageLayout title="Dados Produtos">
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="nome" control={control} defaultValue=""
          rules={validationRules.nome}
          render={({ field }) => (
            <TextField
              {...field} label="Nome" fullWidth margin="normal"
              error={!!errors.nome}
              helperText={errors.nome?.message}
            />
          )}
        />

        <Controller
          name="descricao" control={control} defaultValue=""
          rules={validationRules.descricao}
          render={({ field }) => (
            <TextField
              {...field} label="Descrição" fullWidth margin="normal" multiline rows={3}
              error={!!errors.descricao}
              helperText={errors.descricao?.message}
            />
          )}
        />

        <Controller
          name="valor_unitario" control={control} defaultValue=""
          rules={validationRules.valor_unitario}
          render={({ field }) => (
            <TextField
              {...field} label="Valor Unitário" fullWidth margin="normal" type="number"
              inputprops={{ step: "0.01", min: "0" }}
              error={!!errors.valor_unitario}
              helperText={errors.valor_unitario?.message}
            />
          )}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <InputLabel htmlFor="foto-upload" sx={{ mb: 1 }}>
            Foto do Produto
          </InputLabel>
          <input id="foto-upload" type="file" accept="image/*"
            onChange={handleFileChange} style={{ display: 'none' }}
          />
          <label htmlFor="foto-upload">
            <Button variant="outlined" component="span" startIcon={<PhotoCameraIcon />} fullWidth>
              Selecionar Foto
            </Button>
          </label>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button sx={{ mr: 1 }} onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Cadastrar
          </Button>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default ProdutoForm;