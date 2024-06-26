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
import GroupsIcon from "@mui/icons-material/Groups";
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
import { CustomerCreate, CustomerShow, CustomersList, CustomerUpdate } from "./components/customers";

const CustomUserMenu = () => {
  const { isLoading, identity } = useGetIdentity();

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Typography variant="button">{identity.fullName}</Typography>
    </>
  );
};

const CustomAppBar = () => <AppBar userMenu={<CustomUserMenu />} />;

const CustomMenu = () => (
  <Menu>
    <Menu.ResourceItem name="assets" />
    <Menu.ResourceItem name="thingDescriptions" />
    <Menu.ResourceItem name="devices" />
    <Menu.ResourceItem name="customers" />
    <Menu.Item to="/sparql" primaryText="Query" leftIcon={<QueryStatsIcon />} />
    <Divider />
    <Menu.Item
      to="/thingsboard"
      primaryText="Thingsboard"
      leftIcon={<DashboardIcon />}
    />
  </Menu>
);

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
  </Admin>
);
