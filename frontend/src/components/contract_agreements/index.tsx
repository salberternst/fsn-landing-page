import {
    Labeled,
    List,
    Datagrid,
    TextField,
    Show,
    SimpleShowLayout,
    DateField
} from "react-admin";

export const ContractAgreementShow = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <TextField label="Id" source="id" />
                <TextField label="Type" source="contractAgreement.@type" />
                <TextField label="Asset Id" source="contractAgreement.assetId" />
                <TextField label="Consumer Id" source="contractAgreement.consumerId" />
                <TextField label="Provider Id" source="contractAgreement.providerId" />
                <DateField 
                    label="Contract Signing Date" 
                    source="contractAgreement.contractSigningDate"
                    transform={(v: number) => new Date(v * 1000)}
                    showTime
                />
                <Labeled label="Asset">
                    <SimpleShowLayout>
                        <TextField label="Id" source="dataset.@id" />
                        <TextField label="Name" source="dataset.name" />
                        <TextField label="Content Type" source="dataset.contenttype" />
                    </SimpleShowLayout>
                </Labeled>
                <Labeled label="Policy">
                    <SimpleShowLayout>
                        <TextField label="Type" source="contractAgreement.policy.@type" />
                        <TextField label="Target" source="contractAgreement.policy.odrl:target.@id" />
                    </SimpleShowLayout>
                </Labeled>
                <Labeled label="Negotiation">
                    <SimpleShowLayout>
                        <TextField label="Id" source="negotiation.id" />
                        <TextField label="Type" source="negotiation.@type" />
                        <TextField label="Contract Agreement Id" source="negotiation.contractAgreementId" />
                        <TextField label="Counter Party Address" source="negotiation.counterPartyAddress" />
                        <TextField label="Counter Party Id" source="negotiation.counterPartyId" />
                        <TextField label="Protocol" source="negotiation.protocol" />
                        <TextField label="State" source="negotiation.state" />
                    </SimpleShowLayout>
                </Labeled>
            </SimpleShowLayout>
        </Show>
    )
}

export const ContractAgreementsList = () => (
    <List empty={false} hasCreate={true} exporter={false}>
        <Datagrid bulkActionButtons={false} rowClick="show">
            <TextField source="id" />
            <TextField source="assetId" />
            <TextField source="consumerId" />
            <TextField source="providerId" />
            <DateField 
                label="Contract Signing Date"
                source="contractSigningDate"
                transform={(v: number) => new Date(v * 1000)}
                showTime
            />
        </Datagrid>
    </List>
);