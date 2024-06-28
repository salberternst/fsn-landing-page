import {
    Create,
    SimpleForm,
    TextInput,
    useInput,
    Labeled,
    SaveButton,
    Toolbar,
    Show,
    SimpleShowLayout,
    TextField,
    ShowGuesser,
    useRefresh,
    DateField,
    useShowController,
    LinearProgress
} from "react-admin";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorState } from "@codemirror/state";
import { useEffect } from "react";

const ContractNegotiationPolicyInput = () => {
    const { field } = useInput({ source: "policy" });
    return (
        <Labeled label="Policy">
            <CodeMirror
                {...field}
                value={JSON.stringify(field.value, null, 4)}
                extensions={[json(), EditorState.readOnly.of(true)]}
                basicSetup={{
                    lineNumbers: false,
                    foldGutter: false,
                }}
            />
        </Labeled>
    );
};

const ContractNegotiationsCreateToolbar = props => (
    <Toolbar {...props} >
        <SaveButton alwaysEnable />
    </Toolbar>
);

export const ContractNegotationCreate = () => {
    return (
        <Create >
            <SimpleForm toolbar={<ContractNegotiationsCreateToolbar />}>
                <TextInput source="counterPartyAddress" fullWidth />
                <ContractNegotiationPolicyInput />
                <TextInput source="protocol" defaultValue={"dataspace-protocol-http"} fullWidth />
            </SimpleForm>
        </Create>
    );
};

export const ContractNegotationShow = () => {
    const refresh = useRefresh()
    const { error, isLoading, record } = useShowController()

    if (isLoading) {
        return <LinearProgress />
    }
    
    if (error) {
        return <div>Error!</div>;
    }

    useEffect(() => {
        const interval = setInterval(refresh, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Show>
            <SimpleShowLayout>
                <LinearProgress sx={{ width: "100%" }} />
                <TextField source="@id" label="Id" />
                {record.createdAt && <DateField source="createdAt" showTime label="Created At"/>}
                <TextField source="counterPartyAddress" label="Counter Party Adress"/>
                <TextField source="protocol" />
                <TextField source="state" />
                {record.contractAgreementId && <TextField source="contractAgreementId" label="Contract Agreement Id"/>}
                {record.errorDetail && <TextField source="errorDetail" label="Error"/>}
            </SimpleShowLayout>
        </Show>
    )
}