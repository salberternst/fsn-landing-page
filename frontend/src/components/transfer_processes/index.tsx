import {
    List,
    Datagrid,
    TextField,
    Show,
    SimpleShowLayout,
    Create,
    SimpleForm,
    TextInput,
} from "react-admin";

export const TransferProcessesList = () => (
    <List empty={false} hasCreate={true} exporter={false}>
        <Datagrid bulkActionButtons={false} rowClick="show">
            <TextField source="id" />
            <TextField source="type" />
            <TextField source="state" />
            <TextField source="dataDestination.type" />
        </Datagrid>
    </List>
);

export const TransferProcessesShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            
        </SimpleShowLayout>
    </Show>
);

export const TransferProcessesCreate = () => (
    <Create>
        <SimpleForm>
            {/* <TextInput source="connectorId" fullWidth/> */}
            <TextInput
                label="Counter Party Address"
                source="counterPartyAddress" 
                fullWidth
            />
            <TextInput source="contractId" fullWidth/>
            <TextInput source="assetId" fullWidth/>
            <TextInput source="protocol" defaultValue="dataspace-protocol-http" fullWidth/>
            <TextInput source="transferType" defaultValue="HttpData-PULL" fullWidth/>
            <TextInput source="dataDestination.type" defaultValue="HttpData" fullWidth/>
            <TextInput source="dataDestination.baseUrl" fullWidth/>
        </SimpleForm>
    </Create>
);