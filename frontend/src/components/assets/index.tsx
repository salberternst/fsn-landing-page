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
  BooleanInput,
  BooleanField,
} from "react-admin";

const AssetShowBar = () => {
  return (
    <TopToolbar>
      <DeleteButton />
    </TopToolbar>
  );
};

export const AssetsList = () => (
  <List empty={false} hasCreate={true} exporter={false}>
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField source="id" sortable={false} />
      <TextField source="properties.name" label="Name" sortable={false} />
      <TextField
        source="dataAddress.type"
        label="Data Address Type"
        sortable={false}
      />
    </Datagrid>
  </List>
);

export const AssetShow = () => {
  return (
    <Show actions={<AssetShowBar />}>
      <SimpleShowLayout>
        <Labeled fullWidth label="ID">
          <TextField source="@id" />
        </Labeled>
        <Labeled label="Properties">
          <SimpleShowLayout>
            <Labeled fullWidth label="Name">
              <TextField source="properties.name" />
            </Labeled>
            <Labeled fullWidth label="Content Type">
              <TextField source="properties.contenttype" />
            </Labeled>
          </SimpleShowLayout>
        </Labeled>
        <Labeled label="Data Address">
          <SimpleShowLayout>
            <Labeled fullWidth label="Type">
              <TextField source="dataAddress.type" />
            </Labeled>
            <Labeled fullWidth label="Base URL">
              <TextField source="dataAddress.baseUrl" />
            </Labeled>
            <Labeled fullWidth label="Proxy Path">
              <BooleanField source="dataAddress.proxyPath" looseValue />
            </Labeled>
            <Labeled fullWidth label="Proxy Query Params">
              <BooleanField source="dataAddress.proxyQueryParams" looseValue />
            </Labeled>
            <Labeled fullWidth label="Proxy Body">
              <BooleanField source="dataAddress.proxyBody" looseValue />
            </Labeled>
            <Labeled fullWidth label="Proxy Method">
              <BooleanField source="dataAddress.proxyMethod" looseValue />
            </Labeled>
          </SimpleShowLayout>
        </Labeled>
      </SimpleShowLayout>
    </Show>
  );
};

export const AssetCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput
          source="properties.name"
          label="Asset Name"
          fullWidth
          required
        />
        <TextInput
          source="properties.contenttype"
          label="Content Type"
          helperText="The content type of the asset."
          fullWidth
          required
        />
        <TextInput
          source="dataAddress.type"
          label="Data Address Type"
          helperText="The type of the data address e.g. HttpData"
          fullWidth
          required
        />
        <TextInput
          source="dataAddress.baseUrl"
          label="Base URL"
          helperText="The base URL of the data address e.g. http://example.com/api/v1/"
          fullWidth
          required
        />
        <BooleanInput
          source="dataAddress.proxyPath"
          helperText="Allows specifying additional path segments."
          defaultValue={"false"}
          parse={(v) => (v ? "true" : "false")}
          format={(v) => v === "true"}
        />
        <BooleanInput
          source="dataAddress.proxyQueryParams"
          helperText="Allows specifying query params."
          defaultValue={"false"}
          parse={(v) => (v ? "true" : "false")}
          format={(v) => v === "true"}
        />
        <BooleanInput
          source="dataAddress.proxyBody"
          helperText="Allows attaching a body."
          defaultValue={"false"}
          parse={(v) => (v ? "true" : "false")}
          format={(v) => v === "true"}
        />
        <BooleanInput
          source="dataAddress.proxyMethod"
          helperText="Allows specifying the Http Method (default `GET`)"
          defaultValue={"false"}
          parse={(v) => (v ? "true" : "false")}
          format={(v) => v === "true"}
        />
      </SimpleForm>
    </Create>
  );
};
