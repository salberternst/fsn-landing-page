import {
  Admin,
  Resource,
  CustomRoutes,
  Layout,
  Menu,
  AppBar,
  useGetIdentity,
} from "react-admin";
import { Route } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import DeviceHub from "@mui/icons-material/DeviceHub";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PolicyIcon from "@mui/icons-material/Policy";
import GroupsIcon from "@mui/icons-material/Groups";
import GavelIcon from "@mui/icons-material/Gavel";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useLocation } from "react-router-dom";
import dataSource from "./data-source";
import authProvider from "./auth-provider";
import { SparqlPage } from "./custom_pages/sparql";
import Thingsboard from "./components/thingsboard";
import {
  ThingDescriptionCreate,
  ThingDescriptionEdit,
  ThingDescriptionList,
  ThingDescriptionShow,
} from "./components/thing_description";
import { AssetCreate, AssetShow, AssetsList } from "./components/assets";
import {
  CustomerCreate,
  CustomerShow,
  CustomersList,
  CustomerUpdate,
} from "./components/customers";
import { UserShow, UsersList } from "./components/users";
import { PoliciesList, PolicyCreate, PolicyShow } from "./components/policies";
import {
  ContractDefinitionCreate,
  ContractDefinitionShow,
  ContractDefinitionsList,
} from "./components/contract_definitions";
import { Catalog } from "./components/catalog";
import { ContractNegotationCreate, ContractNegotationShow } from "./components/contract_negotiations";
import { ContractAgreementNegotiation, ContractAgreementShow, ContractAgreementsList } from "./components/contract_agreements";

const CustomUserMenu = () => {
  const { isLoading, identity } = useGetIdentity();

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Typography variant="button">{identity?.email}</Typography>
    </>
  );
};

const CustomAppBar = () => <AppBar userMenu={<CustomUserMenu />} />;

const CustomMenu = () => {
  const { isLoading, identity } = useGetIdentity();
  if (isLoading) {
    return null;
  }

  const isAdmin = identity?.groups.includes("role:admin");

  return (
    <Menu>
      <Menu.ResourceItem name="thingDescriptions" />
      <Menu.ResourceItem name="devices" />
      {isAdmin && <Menu.ResourceItem name="customers" />}
      {isAdmin && <Menu.ResourceItem name="users" />}
      <Menu.Item
        to="/sparql"
        primaryText="Query"
        leftIcon={<QueryStatsIcon />}
      />
      <Divider />
      <Menu.ResourceItem name="assets" />
      <Menu.ResourceItem name="policies" />
      <Menu.ResourceItem name="contractdefinitions" />
      <Menu.Item
        to="/catalog"
        primaryText="Catalog"
        leftIcon={<AutoStoriesIcon />}
      />
      <Menu.ResourceItem name="contractagreements" />
      <Divider />
      <Menu.Item
        to="/thingsboard"
        primaryText="Thingsboard"
        leftIcon={<DashboardIcon />}
      />
    </Menu>
  );
};

const CustomLayout = (props: any) => {
  const location = useLocation();

  if (location.pathname === "/thingsboard") {
    return (
      <Layout menu={CustomMenu} appBar={CustomAppBar}>
        {props.children}
      </Layout>
    );
  }

  return (
    <Layout menu={CustomMenu} appBar={CustomAppBar}>
      <Container maxWidth="lg">{props.children}</Container>
    </Layout>
  );
};

export const App = () => (
  <Admin
    loginPage={false}
    dataProvider={dataSource}
    layout={CustomLayout}
    authProvider={authProvider}
  >
    <CustomRoutes>
      <Route path="/sparql" element={<SparqlPage />} />
      <Route path="/thingsboard" element={<Thingsboard />} />
      <Route path="/catalog" element={<Catalog />} />
    </CustomRoutes>
    <Resource
      name="thingDescriptions"
      options={{ label: "Thing Descriptions" }}
      icon={DeviceHub}
      list={ThingDescriptionList}
      show={ThingDescriptionShow}
      create={ThingDescriptionCreate}
      edit={ThingDescriptionEdit}
    />
    <Resource
      name="assets"
      options={{ label: "Assets" }}
      icon={AccountBalanceIcon}
      list={AssetsList}
      show={AssetShow}
      create={AssetCreate}
    />
    <Resource
      name="customers"
      options={{ label: "Customers" }}
      icon={GroupsIcon}
      list={CustomersList}
      show={CustomerShow}
      create={CustomerCreate}
      edit={CustomerUpdate}
    />
    <Resource
      name="users"
      options={{ label: "Users" }}
      icon={PeopleOutlineIcon}
      list={UsersList}
      show={UserShow}
    />
    <Resource
      name="policies"
      options={{ label: "Policies" }}
      icon={PolicyIcon}
      list={PoliciesList}
      show={PolicyShow}
      create={PolicyCreate}
    />
    <Resource
      name="contractdefinitions"
      options={{ label: "Contract Definitions" }}
      icon={GavelIcon}
      list={ContractDefinitionsList}
      show={ContractDefinitionShow}
      create={ContractDefinitionCreate}
    />
    <Resource
      name="contractnegotiations"
      options={{ label: "Contract Negotiations" }}
      create={ContractNegotationCreate}
      show={ContractNegotationShow}
    />
    <Resource
      name="contractagreements"
      options={{ label: "Contract Agreements" }}
      list={ContractAgreementsList}
      show={ContractAgreementShow}
    />
  </Admin>
);
