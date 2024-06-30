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
  ReferenceField,
} from "react-admin";

const ContractDefinitionShowBar = () => (
  <TopToolbar>
    <DeleteButton mutationMode="pessimistic" />
  </TopToolbar>
);

export const ContractDefinitionsList = () => (
  <List empty={false} hasCreate={true} exporter={false}>
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField source="id" />
      <TextField label="Name" source="privateProperties.name" />
      <TextField label="Description" source="privateProperties.description" />
    </Datagrid>
  </List>
);

export const ContractDefinitionShow = () => (
  <Show actions={<ContractDefinitionShowBar />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField label="Type" source="@type" />
      <ReferenceField source="accessPolicyId" reference="policies" link="show">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceField
        source="contractPolicyId"
        reference="policies"
        link="show"
      >
        <TextField source="id" />
      </ReferenceField>
      <ArrayField label="Asset Selector" source="assetsSelector">
        <Datagrid bulkActionButtons={false}>
          <TextField source="operandLeft" />
          <TextField source="operator" />
          <ReferenceField source="operandRight" reference="assets" link="show">
            <TextField source="id" />
          </ReferenceField>
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export const ContractDefinitionCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput
        source="privateProperties.name"
        fullWidth
        validate={[required()]}
      />
      <TextInput
        source="privateProperties.description"
        fullWidth
        multiline
        rows={4}
      />
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
