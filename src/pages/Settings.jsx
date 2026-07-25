import {
  BellDot,
  CornerUpLeft,
  FileText,
  MonitorCog,
  SettingsIcon,
  ShieldAlert,
  UserCog,
  Wallet,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import SettingHeader from "../components/SettingHeader";
import { useDispatch, useSelector } from "react-redux";
import { removeShortCut, setShortCut } from "../redux/slice/modalSlice";
import { Helmet } from "react-helmet-async";

const Settings = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shortCutSuggetion } = useSelector((state) => state.modals);

  const [isMediumScreen, setisMediumScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    let timer;
    function checkScreen() {
      clearTimeout(timer);

      timer = setTimeout(() => {
        setisMediumScreen(window.innerWidth < 768);
      }, 200);
    }

    window.addEventListener("resize", checkScreen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  useEffect(() => {
    if (!isMediumScreen && pathname === "/setting") {
      navigate("/setting/profile-setting");
    }
  }, []);

  // key press to go back = shift + backspace
  useEffect(() => {
    function handler(e) {
      if (e.shiftKey && e.key === "Backspace") {
        e.preventDefault();
        navigate("/");
      }
    }

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [navigate]);

  useEffect(() => {
    if (!shortCutSuggetion.isSettingpageFirstTime) {
      dispatch(
        setShortCut({
          ...shortCutSuggetion,
          id: "setting-page",
          alert: true,
          isSettingpageFirstTime: true,
        }),
      );
    }

    return () => {
      dispatch(removeShortCut());
    };
  }, [dispatch]);

  return (
    <div className="flex flex-col h-dvh">
      <Helmet>
        <title>Settings | Dev Workspace</title>
      </Helmet>
      <SettingHeader isMediumScreen={isMediumScreen} />

      <div className="sm:px-4 px-1.5 md:space-y-10 space-y-6 flex grow min-h-0 pb-5 gap-3">
        {/* while path /setting - then visible in each device */}
        {/* while path not /setting - then desktop visible, mobile hidden */}
        <aside
          className={`h-full grow basis-70 ${pathname !== "/setting" ? "md:block hidden" : "block"}`}
        >
          <nav className="space-y-1 h-full">
            <NavLink
              to={"/setting/profile-setting"}
              state={{ page: "Admin Setting", icon: "UserCog" }}
              className={({ isActive }) => {
                return `${isActive ? "bg-[#12417020] text-[#124170]" : " hover:bg-gray-400/20"} flex items-center gap-1.5 px-3 py-1.5 rounded-sm active:bg-[#12417020] active:text-[#124170]`;
              }}
            >
              <UserCog />
              <span>Admin Setting</span>
            </NavLink>
            <NavLink
              to={"/setting/data-center"}
              state={{ page: "Data Center", icon: "FileText" }}
              className={({ isActive }) => {
                return `${isActive ? "bg-[#12417020] text-[#124170]" : " hover:bg-gray-400/20"} flex items-center gap-1.5 px-3 py-1.5 rounded-sm active:bg-[#12417020] active:text-[#124170]`;
              }}
            >
              <FileText />
              <span>Data Center</span>
            </NavLink>
            <NavLink
              to={"/setting/system"}
              state={{ page: "System", icon: "MonitorCog" }}
              className={({ isActive }) => {
                return `${isActive ? "bg-[#12417020] text-[#124170]" : " hover:bg-gray-400/20"} flex items-center gap-1.5 px-3 py-1.5 rounded-sm active:bg-[#12417020] active:text-[#124170]`;
              }}
            >
              <MonitorCog />
              <span>System</span>
            </NavLink>
            <NavLink
              to={"/setting/notification"}
              state={{ page: "Notification", icon: "BellDot" }}
              className={({ isActive }) => {
                return `${isActive ? "bg-[#12417020] text-[#124170]" : " hover:bg-gray-400/20"} flex items-center gap-1.5 px-3 py-1.5 rounded-sm active:bg-[#12417020] active:text-[#124170]`;
              }}
            >
              <BellDot />
              <span>Notification</span>
            </NavLink>
            <NavLink
              to={"/setting/asset-manager"}
              state={{ page: "Asset Manager", icon: "Wallet" }}
              className={({ isActive }) => {
                return `${isActive ? "bg-[#12417020] text-[#124170]" : "hover:bg-gray-400/20"} flex items-center gap-1.5 px-3 py-1.5 rounded-sm active:bg-[#12417020] active:text-[#124170]`;
              }}
            >
              <Wallet />
              <span>Asset Manager</span>
            </NavLink>
            <NavLink
              to={"/setting/security"}
              state={{ page: "Security", icon: "ShieldAlert" }}
              className={({ isActive }) => {
                return `${isActive ? "bg-[#12417020] text-[#124170]" : "hover:bg-gray-400/20"} flex items-center gap-1.5 px-3 py-1.5 rounded-sm active:bg-[#12417020] active:text-[#124170]`;
              }}
            >
              <ShieldAlert />
              <span>Security</span>
            </NavLink>
          </nav>
        </aside>

        {/* while path /setting - then desktop block, mobile hidden */}
        {/* while path not /setting - then visible in each device */}
        <main
          className={`basis-70 grow-3 overflow-y-auto md:pr-3 pr-1.5 flex-1 smScroll ${pathname !== "/setting" ? "block" : "md:block hidden"}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Settings;
