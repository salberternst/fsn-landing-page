import {
  Labeled,
  List,
  Datagrid,
  TextField,
  Show,
  SimpleShowLayout,
  BooleanField,
  ArrayField,
} from "react-admin";
import Divider from "@mui/material/Divider";

export const UsersList = () => (
  <List empty={false} hasCreate={true} exporter={false}>
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField source="id" sortable={false} />
      <TextField source="email" label="Email" sortable={false} />
      <BooleanField
        source="emailVerified"
        label="Email Verified"
        sortable={false}
      />
      <TextField source="firstName" label="First Name" sortable={false} />
      <TextField source="lastName" label="Last Name" sortable={false} />
      <BooleanField source="isAdmin" label="Admin" sortable={false} />
    </Datagrid>
  </List>
);

export const UserShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <Labeled fullWidth label="ID">
          <TextField source="id" />
        </Labeled>
        <Labeled fullWidth label="Email">
          <TextField source="email" />
        </Labeled>
        <Labeled fullWidth label="Email Verified">
          <TextField source="emailVerified" />
        </Labeled>
        <Labeled fullWidth label="First Name">
          <TextField source="firstName" />
        </Labeled>
        <Labeled fullWidth label="Last Name">
          <TextField source="lastName" />
        </Labeled>
      </SimpleShowLayout>
      <Divider>Groups</Divider>
      <ArrayField source="groups">
        <Datagrid bulkActionButtons={false}>
          <TextField source="id" />
          <TextField source="name" />
        </Datagrid>
      </ArrayField>
    </Show>
  );
};
