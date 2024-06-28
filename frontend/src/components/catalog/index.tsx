import { useState } from "react";
import {
    Datagrid,
    TextField,
    Show,
    SimpleShowLayout,
    ArrayField,
    SingleFieldList,
    useRecordContext,
} from "react-admin";
import MuiTextField from "@mui/material/TextField";
import MuiButton from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { Link } from 'react-router-dom';


const CreateContractNegotiation = ({ assetId, counterPartyAddress }) => {
    const record = useRecordContext()

    return (
        <MuiButton
            component={Link}
            to={{
                pathname: '/contractnegotiations/create',
            }}
            state={{
                record: {
                    policy: {
                        '@type': record['@type'].replace('odrl:', ''),
                        '@id': record['@id'],
                        // 'assigner': record['odrl:assigner'],
                        'assigner': 'company1',
                        'obligation': record['odrl:obligation'],
                        'permission': record['odrl:permission'],
                        'prohibition': record['odrl:prohibition'],
                        'target': assetId
                    },
                    counterPartyAddress
                }
            }}
        >
            Negotiate
        </MuiButton>
    )
}

const ExtendedPolicyPanel = () => {
    return (
        <SimpleShowLayout>
            {/* <ArrayField source="odrl:permission" label="Permissions">
                <Datagrid bulkActionButtons={false}>
                    <TextField source="@type" label="Type" />
                    <TextField source="odrl:action" label="Action" />
                    <TextField source="odrl:target" label="Target" />
                    <TextField source="odrl:leftOperand" label="Left Operand" />
                    <TextField source="odrl:rightOperand" label="Right Operand" />
                </Datagrid>
            </ArrayField>
            <ArrayField source="odrl:prohibition" label="Prohibitions">
                <Datagrid bulkActionButtons={false}>
                    <TextField source="@type" />
                    <TextField source="odrl:action" label="Action" />
                    <TextField source="odrl:target" label="Target" />
                    <TextField source="odrl:leftOperand" label="Left Operand" />
                    <TextField source="odrl:rightOperand" label="Right Operand" />
                </Datagrid>
            </ArrayField>
            <ArrayField source="odrl:obligation" label="Obligations">
                <Datagrid bulkActionButtons={false}>
                    <TextField source="@type" />
                    <TextField source="odrl:action" label="Action" />
                    <TextField source="odrl:target" label="Target" />
                    <TextField source="odrl:leftOperand" label="Left Operand" />
                    <TextField source="odrl:rightOperand" label="Right Operand" />
                </Datagrid>
            </ArrayField> */}
        </SimpleShowLayout>
    );
};

const ExtendedDatasetPanel = () => {
    return (
        <SimpleShowLayout>
            <ArrayField source="odrl:hasPolicy" label="Policies">
                <Datagrid bulkActionButtons={false} expand={<ExtendedPolicyPanel />}>
                    <TextField source="@type" label="Type" />
                    <TextField source="odrl:assigner" label="Assigner" />
                    <TextField source="odrl:assignee" label="Assignee" />
                </Datagrid>
            </ArrayField>
            <ArrayField source="dcat:distribution" label="Distributions">
                <Datagrid bulkActionButtons={false}>
                    <TextField source="@type" label="Type" />
                    <TextField source="dct:format.@id" label="Format" />
                    <TextField source="dcat:accessService" label="Access Service" />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    );
};

const PoliciesShow = ({ counterPartyAddress }) => {
    const record = useRecordContext()
    return (
        <ArrayField source="odrl:hasPolicy" label="Policies">
            <SingleFieldList sx={{ flexDirection: "column" }}>
                <CreateContractNegotiation assetId={record['@id']} counterPartyAddress={counterPartyAddress}/>
            </SingleFieldList>
        </ArrayField>
    )
}

const CatalogShow = ({ counterPartyAddress }) => {
    return (
        <SimpleShowLayout>
            <TextField source="@id" />
            <TextField source="dspace:participantId" />
            <ArrayField source="dcat:dataset" label="Datasets">
                <Datagrid bulkActionButtons={false} expand={<ExtendedDatasetPanel />}>
                    <TextField source="@id" label="Id" />
                    <TextField source="name" label="Name" />
                    <TextField source="contenttype" label="Content Type" />
                    <PoliciesShow counterPartyAddress={counterPartyAddress}/>
                </Datagrid>
            </ArrayField>
            <ArrayField source="dcat:service" label="Services">
                <Datagrid bulkActionButtons={false}>
                    <TextField source="@id" label="Id" />
                    <TextField source="@type" label="Type" />
                    <TextField source="dct:terms" label="Terms" />
                    <TextField source="dct:endpointUrl" label="Endpoint URL" />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    );
};

export const Catalog = () => {
    const [inputValue, setInputValue] = useState("");
    const [counterPartyAddress, setCounterPartyAddress] = useState("");
    const [error, setError] = useState()

    const connect = () => {
        setCounterPartyAddress(inputValue);
    };

    const onError = () => {
        // error = 
    };

    return (
        <>
            <MuiTextField
                label="EDC Address"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                defaultValue={"http://192-168-178-60.nip.io/protocol"}
                InputProps={{
                    endAdornment: <MuiButton onClick={connect}>Connect</MuiButton>,
                }}
                fullWidth
            />
            {error && (
                <Alert severity="error">Unable to fetch catalog {counterPartyAddress}</Alert>
            )}
            {counterPartyAddress && (
                <Show resource="catalog" id={counterPartyAddress} queryOptions={{ onError }}>
                    <CatalogShow counterPartyAddress={counterPartyAddress}/>
                </Show>
            )}
        </>
    );
};
