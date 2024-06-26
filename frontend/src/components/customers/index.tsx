import {
  Labeled,
  List,
  Datagrid,
  TextField,
  Show,
  SimpleShowLayout,
  TopToolbar,
  DeleteButton,
  Create,
  TextInput,
  SimpleForm,
  EditButton,
  Edit,
  useShowController,
} from "react-admin";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";

const CustomerShowBar = () => {
  return (
    <TopToolbar>
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </TopToolbar>
  );
};

export const CustomersList = () => (
  <List empty={false} hasCreate={true} exporter={false}>
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField source="id" />
      <TextField source="name" label="Name" />
      <TextField source="description" label="Description" />
    </Datagrid>
  </List>
);

export const CustomerShow = () => {
  const { record, isLoading } = useShowController();
  if (isLoading) return null;

  return (
    <Show actions={<CustomerShowBar />}>
      <SimpleShowLayout>
        <Labeled fullWidth label="ID">
          <TextField source="id" />
        </Labeled>
        <Labeled fullWidth label="Name">
          <TextField source="name" />
        </Labeled>
        <Labeled fullWidth label="Description">
          <TextField source="description" />
        </Labeled>
      </SimpleShowLayout>
      <Divider>Thingsboard</Divider>
      {record.thingsboard.error !== undefined && (
        <Alert severity="error">{record.thingsboard.error}</Alert>
      )}
      {record.thingsboard.error === undefined && (
        <SimpleShowLayout>
          <TextField source="thingsboard.id" label="ID" />
          <TextField source="thingsboard.title" label="Title" />
          <TextField
            source="thingsboard.country"
            label="Country"
            defaultValue="-"
          />
          <TextField source="thingsboard.city" label="City" defaultValue="-" />
          <TextField
            source="thingsboard.address"
            label="Address"
            defaultValue="-"
          />
          <TextField source="thingsboard.phone" label="Phone" defaultValue="-" />
          <TextField source="thingsboard.email" label="Email" defaultValue="-" />
          <TextField source="thingsboard.zip" label="ZIP" defaultValue="-" />
        </SimpleShowLayout>
      )}
      <Divider>Fuseki</Divider>
      {record.fuseki.error !== undefined && (
        <Alert severity="error">{record.fuseki.error}</Alert>
      )}
      {record.fuseki.error === undefined && (
        <SimpleShowLayout>
          <TextField source="fuseki.name" label="Name" />
          <TextField source="fuseki.state" label="State" />
        </SimpleShowLayout>
      )}
    </Show>
  );
};

export const CustomerCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" label="Name" />
        <TextInput source="description" label="Description" />
      </SimpleForm>
    </Create>
  );
};

export const CustomerUpdate = () => {
  return (
    <Edit>
      <SimpleForm>
        <Labeled fullWidth label="ID">
          <TextField source="id" />
        </Labeled>
        <Labeled fullWidth label="Name">
          <TextField source="name" />
        </Labeled>
        <TextInput source="description" label="Description" fullWidth />
      </SimpleForm>
    </Edit>
  );
};
