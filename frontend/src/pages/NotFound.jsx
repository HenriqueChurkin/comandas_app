import { Typography } from "@mui/material";
import PageLayout from "../components/common/PageLayout";

const NotFound = () => {
  return (
    <PageLayout title="404 - NotFound">
      <Typography variant="body1" color="textDisabled">
        Página não encontrada. Verifique a URL ou retorne à página inicial.
      </Typography>
    </PageLayout>
  );
};

export default NotFound;