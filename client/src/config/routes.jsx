import HomeIcon from "@mui/icons-material/Home";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import Dashboard from "../pages/dashboard/Dashboard";
import MediaAdConnect from "../pages/media-ad-connect/MediaAdConnect";
import AccountSetting from "../pages/accounts/AccountSetting";
import Login from "../pages/signin/Login";
import Page404 from "../pages/404";
import SnapAds from "../pages/snapads-connect/SnapAds";
import KeyIcon from "@mui/icons-material/Key";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import SocialDashboard from "../pages/socials/SocialDashboard";
import WebhookIcon from "@mui/icons-material/Webhook";

const routes = [
  {
    id: "dashboard",
    path: "/",
    text: "Dashboard",
    icon: <HomeIcon />,
    private: true,
    component: <Dashboard />,
  },
  {
    id: "media-ad-connect",
    path: "/media-ad-connect",
    text: "Media & AdSources",
    private: true,
    icon: <HubOutlinedIcon />,
    component: <MediaAdConnect />,
  },
  {
    id: "account-setting",
    path: "/account-setting",
    text: "API Account",
    private: true,
    icon: <FingerprintIcon />,
    component: <AccountSetting />,
  },
  {
    id: "snapset-setting",
    path: "/snapset-setting",
    text: "Data Key",
    private: true,
    icon: <KeyIcon />,
    component: <SnapAds />,
  },
  {
    id: "social-api",
    path: "/social-api",
    text: "Social API Settings",
    private: true,
    icon: <WebhookIcon />,
    component: <SocialDashboard />,
  },
  {
    id: "login",
    path: "/login",
    standAlone: true,
    component: <Login />,
  },
  {
    id: "404",
    path: "/page-404",
    standAlone: true,
    component: <Page404 />,
  },
];

export default routes;
