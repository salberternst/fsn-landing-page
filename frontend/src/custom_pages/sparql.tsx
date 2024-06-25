import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import SparqlQuery from "../components/sparql_query";
import { Title } from "react-admin";

export const SparqlPage = () => (
  <Paper sx={{ mt: 5, p: 1 }}>
    <Title title="SPARQL Query" />
    <Typography variant="h6" gutterBottom>
      SPARQL Query
    </Typography>
    <SparqlQuery />
  </Paper>
);
