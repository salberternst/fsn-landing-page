import { useState } from "react";
import {
  Datagrid,
  TextField,
  Show,
  SimpleShowLayout,
  ArrayField,
  SingleFieldList,
  useRecordContext,
  useStore,
} from "react-admin";
import MuiTextField from "@mui/material/TextField";
import MuiButton from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";

const CreateContractNegotiationButton = ({
  assetId,
  counterPartyAddress,
  participantId,
}) => {
  const record = useRecordContext();
  return (
    <MuiButton
      component={Link}
      to={{
        pathname: "/contractnegotiations/create",
      }}
      state={{
        record: {
          policy: {
            "@type": record["@type"].replace("odrl:", ""),
            "@id": record["@id"],
            assigner: participantId,
            obligation: record["odrl:obligation"],
            permission: record["odrl:permission"],
            prohibition: record["odrl:prohibition"],
            target: assetId,
          },
          counterPartyAddress,
        },
      }}
    >
      Negotiate
    </MuiButton>
  );
};

const ExtendedPolicyPanel = () => {
  return (
    <SimpleShowLayout>
      <ArrayField source="odrl:permission" label="Permissions">
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
      </ArrayField>
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

const PoliciesShow = ({ counterPartyAddress, participantId }) => {
  const record = useRecordContext();
  return (
    <ArrayField source="odrl:hasPolicy" label="Policies">
      <SingleFieldList sx={{ flexDirection: "column" }} linkType="show">
        <CreateContractNegotiationButton
          assetId={record["@id"]}
          participantId={participantId}
          counterPartyAddress={counterPartyAddress}
        />
      </SingleFieldList>
    </ArrayField>
  );
};

const CatalogShow = ({ counterPartyAddress }) => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <SimpleShowLayout>
      <TextField source="@id" />
      <TextField source="dspace:participantId" />
      <ArrayField source="dcat:dataset" label="Datasets">
        <Datagrid bulkActionButtons={false} expand={<ExtendedDatasetPanel />}>
          <TextField source="@id" label="Id" />
          <TextField source="name" label="Name" />
          <TextField source="contenttype" label="Content Type" />
          <PoliciesShow
            counterPartyAddress={counterPartyAddress}
            participantId={record.participantId}
          />
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

const CatalogConnect = () => {
  const [counterPartyAddress, setCounterPartyAddress] = useStore(
    "counterPartyAddress"
  );
  const [inputValue, setInputValue] = useState(
    "http://192-168-178-60.nip.io/protocol"
  );
  const connect = () => {
    setCounterPartyAddress(inputValue);
  };
  const CatalogConnectButton = () => {
    if (counterPartyAddress) {
      return (
        <MuiButton onClick={() => setCounterPartyAddress(null)}>
          Disconnect
        </MuiButton>
      );
    } else {
      return <MuiButton onClick={connect}>Connect</MuiButton>;
    }
  };
  return (
    <MuiTextField
      label="EDC Address"
      value={inputValue}
      disabled={counterPartyAddress !== null}
      onChange={(e) => setInputValue(e.target.value)}
      InputProps={{
        endAdornment: <CatalogConnectButton />,
      }}
      fullWidth
    />
  );
};

export const Catalog = () => {
  const [counterPartyAddress] = useStore("counterPartyAddress");
  const [error, setError] = useState();

  const onError = (e) => {
    setError(e);
  };

  const onSuccess = () => {
    setError(null);
  };

  return (
    <>
      <CatalogConnect />
      {error && (
        <Alert severity="error">
          Unable to fetch catalog {counterPartyAddress}
        </Alert>
      )}
      {counterPartyAddress && (
        <Show
          resource="catalog"
          id={counterPartyAddress}
          queryOptions={{
            onError,
            onSuccess,
          }}
        >
          <CatalogShow counterPartyAddress={counterPartyAddress} />
        </Show>
      )}
    </>
  );
};
