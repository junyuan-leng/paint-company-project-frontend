import { Admin, Resource, useGetIdentity } from "react-admin";
import { devDataProvider, dataProvider } from "./dataProvider";
import { devAuthProvider, authProvider } from "./authProvider";
import { PaintEdit } from "./components/list";
import { PaintDashboard } from "./components";

// export const isLocalDev = process.env.NODE_ENV === "development";
export const isLocalDev = false;

export const App = () => {
  return (
    <Admin
      dataProvider={isLocalDev ? devDataProvider : dataProvider}
      authProvider={isLocalDev ? devAuthProvider : authProvider}
    >
      <Resource
        name="paints"
        list={PaintDashboard}
        edit={PaintEdit}
      />
    </Admin>
  );
};
