import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import App from "../App.jsx";
import Overview from "../pages/Overview";
import Management from "../pages/Management.jsx";
import TeamMembers from "../pages/TeamMembers.jsx";
import Revenue from "../pages/Revenue.jsx";
import Settings from "../pages/Settings.jsx";
import Clients from "../pages/Clients.jsx";
import Notification from "../pages/Notification.jsx";
import ActivityLog from "../pages/ActivityLog.jsx";
import AccountSetting from "../pages/sub-pages/AccountSetting.jsx";
import DataCenter from "../pages/sub-pages/DataCenter.jsx";
import System from "../pages/sub-pages/System.jsx";
import NotificationSetting from "../pages/sub-pages/NotificationSetting.jsx";
import AssetManager from "../pages/sub-pages/AssetManager.jsx";
import Security from "../pages/sub-pages/Security.jsx";
import SearchResult from "../pages/sub-pages/SearchResult.jsx";

import "nprogress/nprogress.css";
import NProgress from "nprogress";
import ProgressBar from "../components/wrapper/ProgressBar.jsx";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 120,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <ProgressBar key={"overview"}>
            <Overview />
          </ProgressBar>
        ),
      },
      {
        path: "/management",
        element: (
          <ProgressBar key={"management"}>
            <Management />
          </ProgressBar>
        ),
      },
      {
        path: "/team-members",
        element: (
          <ProgressBar key={"team-members"}>
            <TeamMembers />
          </ProgressBar>
        ),
      },
      {
        path: "/revenue",
        element: (
          <ProgressBar key={"revenue"}>
            <Revenue />
          </ProgressBar>
        ),
      },
      {
        path: "/clients",
        element: (
          <ProgressBar key={"clients"}>
            <Clients />
          </ProgressBar>
        ),
      },
      {
        path: "/notification",
        element: (
          <ProgressBar key={"notification"}>
            <Notification />
          </ProgressBar>
        ),
      },
      {
        path: "/activity-log",
        element: (
          <ProgressBar>
            <ActivityLog key={"activity-log"} />
          </ProgressBar>
        ),
      },
    ],
  },
  {
    path: "/setting",
    element: (
      <ProgressBar key={'settings'}>
        <Settings />
      </ProgressBar>
    ),
    children: [
      {
        path: "profile-setting",
        element: <AccountSetting />,
      },
      {
        path: "data-center",
        element: <DataCenter />,
      },
      {
        path: "system",
        element: <System />,
      },
      {
        path: "data-center",
        element: <DataCenter />,
      },
      {
        path: "notification",
        element: <NotificationSetting />,
      },
      {
        path: "asset-manager",
        element: <AssetManager />,
      },
      {
        path: "security",
        element: <Security />,
      },
    ],
  },
  {
    path: "/search",
    element: (
      <ProgressBar key={'search-result'}>
        <SearchResult />
      </ProgressBar>
    ),
  },
  {
    path: "*",
    element: <Navigate to={"/"} />,
  },
]);

const Router = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default Router;
