import {
  Typography,
  Box
} from "@mui/material";
import PageLayout from "../components/common/PageLayout";

const Dashboard = () => {
  return (
    <PageLayout title="Dashboard" maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Bem-vindo ao Comandas do Zé!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {`Data: ${new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}`}
        </Typography>
      </Box>
    </PageLayout>
  );
};

export default Dashboard;