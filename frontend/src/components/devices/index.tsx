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
  DateField,
  BooleanInput,
  BooleanField,
  ArrayField,
  Labeled,
  AutocompleteInput,
  FunctionField,
  Edit,
  EditButton,
  useEditController,
  useGetList,
  required,
} from "react-admin";

const ThingModelSelector = ({ defaultValue = "" }) => {
  return (
    <AutocompleteInput
      source="thingModel"
      choices={[
        { id: "", name: "None" },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/carbon_dioxide.json",
          name: "Carbon Dioxide",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/carbon_monoxide.json",
          name: "Carbon Monoxide",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/connectivity.json",
          name: "Connectivity",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/data_rate.json",
          name: "Data Rate",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/energy.json",
          name: "Energy",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/enum.json",
          name: "Enum",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/garage.json",
          name: "Garage",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/gas.json",
          name: "Gas",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/generic.json",
          name: "Generic",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/human_activity.json",
          name: "Human Activity",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/humidity.json",
          name: "Humidity",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/moisture.json",
          name: "Moisture",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/motion.json",
          name: "Motion",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/netzanschlusspunkt.json",
          name: "Netzanschlusspunkt",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/outlet.json",
          name: "Outlet",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/power.json",
          name: "Power",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/solar.json",
          name: "Solar",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/temperature.json",
          name: "Temperature",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/timestamp.json",
          name: "Timestamp",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/waermpepumpe.json",
          name: "Waermpepumpe",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/wechselrichter.json",
          name: "Wechselrichter",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/wärmepumpe.json",
          name: "Wärmepumpe",
        },
        {
          id: "https://raw.githubusercontent.com/salberternst/thing-models/main/home_assistant/balkonkraftwerk.json",
          name: "Balkonkraftwerk",
        },
      ]}
      defaultValue={defaultValue}
      fullWidth
    />
  );
};

const CustomerSelector = ({ defaultValue }) => {
  const { data, isLoading } = useGetList("customers");
  if (isLoading) return null;
  return (
    <AutocompleteInput
      source="customer"
      choices={data}
      defaultValue={defaultValue}
      optionText="name"
      optionValue="thingsboard.id"
      emptyText="None"
      emptyValue="13814000-1dd2-11b2-8080-808080808080"
      fullWidth
      isLoading={isLoading}
    />
  );
};

export const DeviceEdit = () => {
  const transform = (data: any) => {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      gateway: data.gateway,
      thingModel: data.thingModel,
      customer: data.customer,
    };
  };
  const { record } = useEditController();

  return (
    <Edit transform={transform}>
      <SimpleForm>
        <TextInput source="id" fullWidth disabled />
        <TextInput source="name" fullWidth disabled />
        <TextInput
          multiline
          source="description"
          fullWidth
          defaultValue={record?.additionalInfo.description}
        />
        <BooleanInput
          source="gateway"
          label="Gateway"
          defaultValue={record?.additionalInfo.gateway}
        />
        <ThingModelSelector
          defaultValue={
            record?.attributes.find((v) => v.key === "thing-model")?.value
          }
        />
        <CustomerSelector defaultValue={record?.customerId.id} />
      </SimpleForm>
    </Edit>
  );
};

export const DeviceCreate = () => (
  <Create redirect="show">
    <SimpleForm>
      <TextInput source="name" fullWidth validate={[required()]} />
      <TextInput multiline source="description" fullWidth />
      <BooleanInput source="gateway" label="Gateway" />
      <ThingModelSelector />
    </SimpleForm>
  </Create>
);

const DeviceShowBar = () => {
  return (
    <TopToolbar>
      <EditButton />
      <DeleteButton />
    </TopToolbar>
  );
};

export const DeviceShow = () => (
  <Show actions={<DeviceShowBar />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="type" />
      <TextField source="name" />
      <TextField
        source="additionalInfo.description"
        label="Description"
        emptyText="-"
      />
      <BooleanField source="additionalInfo.gateway" label="Gateway" />
      <DateField source="createdTime" label="Created Time" showTime />
      <TextField source="customerId.id" label="Customer Id" />
      <TextField source="label" emptyText="-" />
      <ArrayField source="attributes">
        <Datagrid bulkActionButtons={false}>
          <TextField source="key" />
          <FunctionField
            source="value"
            render={(record) => {
              if (typeof record.value === "object") {
                return JSON.stringify(record.value, null, 4);
              } else if (typeof record.value === "boolean") {
                return record.value ? "true" : "false";
              }
              return record.value;
            }}
          />
        </Datagrid>
      </ArrayField>
      <Labeled label="Credentials">
        <SimpleShowLayout>
          <TextField source="credentials.id.id" label="Id" />
          <TextField
            source="credentials.credentialsId"
            label="Credentials Id"
          />
          <TextField
            source="credentials.credentialsType"
            label="Credentials Type"
          />
          <TextField
            source="credentials.credentialsValue"
            label="Credentials Value"
            emptyText="-"
          />
        </SimpleShowLayout>
      </Labeled>
    </SimpleShowLayout>
  </Show>
);

export const DevicesList = () => (
  <List empty={false} hasCreate={true} exporter={false}>
    <Datagrid bulkActionButtons={false} rowClick="show">
      <TextField source="id" sortable={false} />
      <TextField source="name" label="Name" sortable={false} />
      <BooleanField
        source="additionalInfo.gateway"
        label="Gateway"
        defaultValue={false}
        sortable={false}
      />
      <DateField
        showTime={true}
        source="createdTime"
        label="Created At"
        sortable={false}
      />
    </Datagrid>
  </List>
);
