import {
    Labeled,
    List,
    Datagrid,
    DateField,
    BooleanField,
    TextField,
    Show,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    ArrayField,
    BooleanInput,
    ArrayInput,
    SimpleFormIterator,
    FileInput,
    FileField,
    useRecordContext,
    TabbedShowLayout,
    SimpleShowLayout,
    TopToolbar,
    EditButton,
    Button,
} from "react-admin";
import { Divider, Typography } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import lzs from "lz-string";

export const ThingList = () => (
    <List empty={false} hasCreate={true} exporter={false}>
        <Datagrid bulkActionButtons={false} rowClick="show">
            <TextField source="id" />
            <DateField showTime={true} source="createdAt" />
            <DateField showTime={true} source="updatedAt" />
            <TextField source="title" />
            <TextField source="types" />
        </Datagrid>
    </List>
);

export const ThingShowProperties = () => {
    const record = useRecordContext();
    return (
        <>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
                Properties
            </Typography>
            <Divider />
            {record.properties?.map((_, index) => (
                <div key={record.properties[index].id}>
                    <Labeled fullWidth label="Name">
                        <TextField source={`properties.${index}.name`} />
                    </Labeled>
                    <Labeled fullWidth label="Title">
                        <TextField source={`properties.${index}.title`} emptyText="-" />
                    </Labeled>
                    <Labeled fullWidth label="Description">
                        <TextField
                            label="description"
                            source={`properties.${index}.description`}
                            emptyText="-"
                        />
                    </Labeled>
                    <Labeled fullWidth label="Unit">
                        <TextField source={`properties.${index}.unit`} emptyText="-" />
                    </Labeled>
                    <ArrayField source={`properties.${index}.forms`}>
                        <Datagrid bulkActionButtons={false} hover={false} sx={{}}>
                            <TextField source="op" label="Operation" emptyText="-" />
                            <TextField source="href" label="Target" />
                            <BooleanField source="public" />
                        </Datagrid>
                    </ArrayField>
                </div>
            ))}
        </>
    );
};

export const ThingShowActions = () => {
    const record = useRecordContext();
    return (
        <>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
                Actions
            </Typography>
            <Divider />
            {record.actions?.map((_, index) => (
                <div key={record.actions[index].id}>
                    <Labeled fullWidth label="Name">
                        <TextField source={`actions.${index}.name`} />
                    </Labeled>
                    <Labeled fullWidth label="Title">
                        <TextField source={`actions.${index}.title`} emptyText="-" />
                    </Labeled>
                    <Labeled fullWidth label="Description">
                        <TextField source={`actions.${index}.description`} emptyText="-" />
                    </Labeled>
                    <Labeled fullWidth label="Unit">
                        <TextField source={`actions.${index}.unit`} emptyText="-" />
                    </Labeled>
                    <ArrayField source={`actions.${index}.forms`}>
                        <Datagrid bulkActionButtons={false} hover={false} sx={{}}>
                            <TextField source="op" label="Operation" emptyText="-" />
                            <TextField source="href" label="Target" />
                            <BooleanField source="public" />
                        </Datagrid>
                    </ArrayField>
                </div>
            ))}
        </>
    );
};

export const ThingShowEvents = () => {
    const record = useRecordContext();
    if (record.events?.length === 0) {
        return null;
    }

    return (
        <>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
                Events
            </Typography>
            <Divider />
            {record.events?.map((_, index) => (
                <div key={record.events[index].id}>
                    <Labeled fullWidth label="Name">
                        <TextField source={`events.${index}.name`} />
                    </Labeled>
                    <Labeled fullWidth label="Title">
                        <TextField source={`events.${index}.title`} emptyText="-" />
                    </Labeled>
                    <Labeled fullWidth label="Description">
                        <TextField source={`events.${index}.description`} emptyText="-" />
                    </Labeled>
                    <Labeled fullWidth label="Unit">
                        <TextField source={`events.${index}.unit`} emptyText="-" />
                    </Labeled>
                    <ArrayField source={`events.${index}.forms`}>
                        <Datagrid bulkActionButtons={false} hover={false} sx={{}}>
                            <TextField source="op" label="Operation" emptyText="-" />
                            <TextField source="href" label="Target" />
                            <BooleanField source="public" />
                        </Datagrid>
                    </ArrayField>
                </div>
            ))}
        </>
    );
};

export const ThingShowDescription = () => {
    const record = useRecordContext();
    return (
        <CodeMirror
            value={JSON.stringify(record.description, null, 4)}
            extensions={[json(), EditorState.readOnly.of(true)]}
            basicSetup={{
                lineNumbers: false,
                foldGutter: false,
            }}
            maxHeight="100%"
        />
    );
};

export const ThingShowCredentials = () => {
    return (
        <>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
                Security Definitions
            </Typography>
            <Divider />
            <ArrayField source="securityDefinitions">
                <Datagrid bulkActionButtons={false}>
                    <TextField source="name" />
                    <TextField source="scheme" />
                    <TextField source="description" emptyText="-" />
                </Datagrid>
            </ArrayField>
        </>
    );
};

export const ThingShowLinks = () => (
    <>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
            Links
        </Typography>
        <Divider />
        <ArrayField source={`description.links`}>
            <Datagrid bulkActionButtons={false} hover={false} sx={{}}>
                <TextField source="rel" label="Relation" emptyText="-" />
                <TextField source="type" label="Type" emptyText="-" />
                <TextField source="href" label="Link" emptyText="-" />
            </Datagrid>
        </ArrayField>
    </>
);

export const ThingShowTitle = () => {
    const record = useRecordContext();
    return (
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {record.description?.title}
        </Typography>
    );
};

export const ThingShowActionBar = () => {
    const record = useRecordContext();
    const onClick = () => {
        if (record) {
            const data = "td" + "json" + JSON.stringify(record.description, null, 4);
            const compressed = lzs.compressToEncodedURIComponent(data);
            window.open(`http://plugfest.thingweb.io/playground/#${compressed}`);
        }
    };

    return (
        <TopToolbar>
            <EditButton />
            <Button color="primary" onClick={onClick} label="Open in Editor" />
        </TopToolbar>
    );
};

export const ThingShow = () => {
    return (
        <Show actions={<ThingShowActionBar />}>
            <SimpleShowLayout>
                <ThingShowTitle />
                <Divider />
                <Labeled fullWidth label="Id">
                    <TextField source="description.id" />
                </Labeled>
                <Labeled fullWidth label="Title">
                    <TextField source="description.title" />
                </Labeled>
                <Labeled fullWidth label="Description">
                    <TextField source="description.description" emptyText="-" />
                </Labeled>
            </SimpleShowLayout>
            <TabbedShowLayout>
                <TabbedShowLayout.Tab label="summary">
                    <ThingShowLinks />
                    <ThingShowCredentials />
                    <ThingShowProperties />
                    <ThingShowActions />
                    <ThingShowEvents />
                </TabbedShowLayout.Tab>
                <TabbedShowLayout.Tab label="Thing Description">
                    <ThingShowDescription />
                </TabbedShowLayout.Tab>
            </TabbedShowLayout>
        </Show>
    );
};

export const ThingEdit = () => {
    return (
        <Edit mutationMode="pessimistic">
            <SimpleForm>
                <TextInput fullWidth source="description.id" label="Id" disabled />
                <TextInput fullWidth source="description.title" label="Title" />
                <TextInput
                    fullWidth
                    source="description.description"
                    label="Description"
                />
                <ArrayInput source="properties">
                    <SimpleFormIterator fullWidth inline>
                        <TextInput fullWidth source="name" />
                        <TextInput fullWidth source="description" />
                        <ArrayInput source="forms">
                            <SimpleFormIterator fullWidth inline>
                                <TextInput sx={{ flex: 1 }} source="href" label="Target" />
                                <BooleanInput source="public" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleFormIterator>
                </ArrayInput>
                <ArrayInput source="actions">
                    <SimpleFormIterator fullWidth inline>
                        <TextInput fullWidth source="name" />
                        <TextInput fullWidth source="description" />
                        <ArrayInput source="forms">
                            <SimpleFormIterator fullWidth inline>
                                <TextInput sx={{ flex: 1 }} source="href" label="Target" />
                                <BooleanInput source="public" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleFormIterator>
                </ArrayInput>
                <ArrayInput source="events">
                    <SimpleFormIterator fullWidth inline>
                        <TextInput fullWidth source="name" />
                        <TextInput fullWidth source="description" />
                        <ArrayInput source="forms">
                            <SimpleFormIterator fullWidth inline>
                                <TextInput sx={{ flex: 1 }} source="href" label="Target" />
                                <BooleanInput source="public" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleFormIterator>
                </ArrayInput>
            </SimpleForm>
        </Edit>
    );
};

export const ThingCreate = () => (
    <Create redirect="show">
        <SimpleForm>
            <FileInput source="attachments" accept="application/json">
                <FileField source="src" title="title" />
            </FileInput>
        </SimpleForm>
    </Create>
);



