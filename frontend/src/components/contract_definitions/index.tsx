import {
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
  ArrayInput,
  SimpleFormIterator,
  ReferenceInput,
  AutocompleteInput,
  required,
  ArrayField,
} from "react-admin";

const ContractDefinitionShowBar = () => {
  return (
    <TopToolbar>
      <DeleteButton mutationMode="pessimistic" />
    </TopToolbar>
  );
};

export const ContractDefinitionsList = () => (
  <List empty={false} hasCreate={true} exporter={false}>
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField source="id" />
    </Datagrid>
  </List>
);


export const ContractDefinitionShow = (props: any) => (
  <Show {...props} actions={<ContractDefinitionShowBar />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField label="Type" source="@type" />
      <TextField source="accessPolicyId" />
      <TextField source="contractPolicyId" />
      <ArrayField label="Asset Selector" source="assetsSelector" >
        <Datagrid bulkActionButtons={false}>
          <TextField source="operandLeft" />
          <TextField source="operator" />
          <TextField source="operandRight" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export const ContractDefinitionCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="accessPolicyId" reference="policies">
        <AutocompleteInput
          optionText="privateProperties.name"
          fullWidth
          validate={[required()]}
        />
      </ReferenceInput>
      <ReferenceInput source="contractPolicyId" reference="policies">
        <AutocompleteInput
          optionText="privateProperties.name"
          fullWidth
          validate={[required()]}
        />
      </ReferenceInput>
      <ArrayInput source="assetsSelector" label="Asset Selector" fullWidth>
        <SimpleFormIterator inline fullWidth>
          <TextInput
            source="operandLeft"
            defaultValue="https://w3id.org/edc/v0.0.1/ns/id"
            fullWidth
          />
          <TextInput source="operator" defaultValue="=" fullWidth />
          <ReferenceInput source="operandRight" reference="assets">
            <AutocompleteInput
              optionText="@id"
              validate={[required()]}
              fullWidth
            />
          </ReferenceInput>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
