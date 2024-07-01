import {
  List,
  Datagrid,
  TextField,
  Show,
  SimpleShowLayout,
  Create,
  SimpleForm,
  TextInput,
  Labeled,
} from "react-admin";

export const TransferProcessesList = () => (
  <List empty={false} hasCreate={true} exporter={false}>
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField source="id" sortable={false} />
      <TextField source="type" sortable={false} />
      <TextField source="state" sortable={false} />
      <TextField
        label="Data Destination Type"
        source="dataDestination.type"
        sortable={false}
      />
    </Datagrid>
  </List>
);

export const TransferProcessesShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="@type" label="Type" />
      <TextField source="type" />
      <TextField source="state" />
      <Labeled label="Data Destination">
        <SimpleShowLayout>
          <TextField source="dataDestination.type" label="Type" />
          <TextField source="dataDestination.baseUrl" label="Base Url" />
        </SimpleShowLayout>
      </Labeled>
    </SimpleShowLayout>
  </Show>
);

export const TransferProcessesCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput
        label="Counter Party Address"
        source="counterPartyAddress"
        fullWidth
      />
      <TextInput source="contractId" fullWidth />
      <TextInput source="assetId" fullWidth />
      <TextInput
        source="protocol"
        defaultValue="dataspace-protocol-http"
        fullWidth
      />
      <TextInput source="transferType" defaultValue="HttpData-PULL" fullWidth />
      <TextInput
        source="dataDestination.type"
        defaultValue="HttpData"
        fullWidth
      />
      <TextInput source="dataDestination.baseUrl" fullWidth />
    </SimpleForm>
  </Create>
);
