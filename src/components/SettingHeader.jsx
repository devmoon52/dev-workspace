import { CornerUpLeft, SettingsIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { settingRouteMap } from "../data/listData";

const SettingHeader = ({ isMediumScreen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const currentPage = settingRouteMap[pathname];

  return (
    <header className="sm:px-4 px-1.5 md:pt-5 pt-3 md:space-y-10 space-y-5">
      <div className="flex md:gap-3 gap-2">
        <button
          onClick={() => {
            isMediumScreen ? navigate(-1) : navigate("/");
          }}
          className="md:px-4 px-2 py-1 flex items-center gap-1 rounded-md bg-[#124170] text-white hover:bg-[#164c83] active:bg-[#164c83]"
        >
          <CornerUpLeft aria-hidden="true" size={20} />
          <span className="text-sm">Go Back</span>
        </button>
        <div>
          <h1 className="md:text-xl font-semibold">DEV WORKSPACE</h1>
          <p className="md:text-sm text-xs text-gray-500">
            Distribution Of Works
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 my-5 md:my-10">
        {/* path - not /setting, md:block hidden */}
        <SettingsIcon
          aria-hidden="true"
          className={`md:h-9.5 slowSpin md:w-9.5 h-7 w-7 ${pathname !== "/setting" && "md:block hidden"}`}
          strokeWidth={2.6}
        />
        <h2
          className={`md:text-3xl text-2xl font-semibold ${pathname !== "/setting" && "md:block hidden"}`}
        >
          Settings
        </h2>

        {/* mobile header - while path is not /setting */}
        <currentPage.icon
          className={`md:hidden block ${pathname === "/setting" && "hidden"}`}
          size={26}
          strokeWidth={2.4}
        />
        <h2
          className={`text-[20px] font-semibold md:hidden block ${pathname === "/setting" && "hidden"}`}
        >
          {currentPage?.title}
        </h2>
      </div>
    </header>
  );
};

export default SettingHeader;
