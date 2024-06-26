import {
    Labeled,
    List,
    Datagrid,
    TextField,
    Show,
    TabbedShowLayout,
    Tab,
    SimpleShowLayout,
    TopToolbar,
    DeleteButton,
    Create,
    TextInput,
    SimpleForm,
    BooleanInput,
    BooleanField,
    EditButton,
    Edit,
  } from "react-admin";
  
  const CustomerShowBar = () => {
    return (
      <TopToolbar>
        <EditButton />
        <DeleteButton />
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
  }

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
          <TextInput source="description" label="Description" fullWidth/>
        </SimpleForm>
      </Edit>
    );
  }