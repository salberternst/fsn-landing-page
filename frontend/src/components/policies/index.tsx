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
  SelectInput,
  DateField,
} from "react-admin";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

const PolicyShowBar = () => {
  return (
    <TopToolbar>
      <DeleteButton mutationMode="pessimistic" />
    </TopToolbar>
  );
};

export const PoliciesList = () => (
  <List empty={false} hasCreate={true} exporter={false}>
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField source="id" />
      <TextField source="privateProperties.name" label="Name" />
      <DateField showTime={true} source="createdAt" label="Created At" />
    </Datagrid>
  </List>
);

export const PolicyShow = () => (
  <Show actions={<PolicyShowBar />}>
    <SimpleShowLayout>
      <SimpleShowLayout>
        <TextField source="id" />
        <DateField source="createdAt" label="Created At" showTime />
        <TextField label="Type" source="@type" />
        <TextField label="Policy Type" source="policy.@type" />
        <TextField label="Name" source="privateProperties.name" />
        <TextField label="Description" source="privateProperties.description" />
      </SimpleShowLayout>
    </SimpleShowLayout>
  </Show>
);

export const PolicyCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <SelectInput
            source="policy.@type"
            label="Type"
            choices={[{ id: "odrl:Set", name: "Set" }]}
            fullWidth
            helperText="lorem ipsum"
            required
          />
        </Grid>
        <Grid item xs={9}>
          <TextInput
            source="privateProperties.name"
            label="Name"
            required
            fullWidth
          />
        </Grid>
      </Grid>
      <TextInput
        source="privateProperties.description"
        label="Description"
        fullWidth
        multiline
        rows={3}
      />
      <Divider>Permissions</Divider>
      <ArrayInput source="policy.odrl:permissions">
        <SimpleFormIterator inline>
          <TextInput source="subject" label="Subject" />
          <TextInput source="permission" label="Permission" />
        </SimpleFormIterator>
      </ArrayInput>
      <Divider>Prohibitions</Divider>
      <ArrayInput source="policy.odrl:prohibitions">
        <SimpleFormIterator inline>
          <TextInput source="subject" label="Subject" />
          <TextInput source="prohibition" label="Prohibition" />
        </SimpleFormIterator>
      </ArrayInput>
      <Divider>Obligations</Divider>
      <ArrayInput source="policy.odrl:obligations">
        <SimpleFormIterator inline>
          <TextInput source="subject" label="Subject" />
          <TextInput source="obligation" label="Obligation" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
