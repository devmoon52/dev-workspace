import {
  ChevronsRightLeft,
  ChevronsLeftRight,
  ChevronRight,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { navigation } from "../data/listData";
import { memo } from "react";
import { useDispatch } from "react-redux";
import { setAccModal } from "../redux/slice/modalSlice";

const Sidebar = ({
  setIsExpand,
  isExpand,
  setCurrentPage,
  setMobileMenuBar,
}) => {
  const dispatch = useDispatch();

  return (
    <>
      {/* sidebar handle */}
      <div className="px-3.5 hidden md:flex">
        <button
          aria-label="Toggle sidebar button"
          aria-expanded={isExpand}
          aria-controls="sidebar"
          onClick={() => setIsExpand((prev) => !prev)}
          className="bg-[#67c09085] cursor-pointer p-2 rounded-full text-[#215B63]"
        >
          {isExpand ? (
            <ChevronsRightLeft aria-hidden="true" size={20} />
          ) : (
            <ChevronsLeftRight aria-hidden="true" size={20} />
          )}
        </button>
      </div>

      {/* mobile sidebar handle */}
      <div className="mb-4 md:hidden flex items-start justify-between w-full">
        <div className="-space-y-0.5">
          <h1 className="uppercase text-lg font-semibold">Dev workspace</h1>
          <p className="text-xs">Distribution Of Works</p>
        </div>
        <button
          onClick={() => setMobileMenuBar(false)}
          aria-label="Close mobile menu"
          className="p-1.5 border border-gray-400 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
        >
          <X aria-hidden="true" />
        </button>
      </div>

      <div className="md:mt-4 flex flex-col items-center justify-between flex-1 w-full">
        {/* navlinks */}
        <nav className="flex flex-col md:gap-2 gap-1 w-full">
          {navigation.map((nav) => (
            <NavLink
              key={nav.id}
              to={nav.link}
              onClick={() => setMobileMenuBar(false)}
              aria-label={`Navigate to ${nav.location}`}
              className={({ isActive }) =>
                `${isActive ? "bg-[#67c09085] text-[#215B63]" : "hover:bg-gray-400/20 active:bg-gray-400/30"} flex items-center px-5 w-full rounded-md md:py-3 py-2.5`
              }
            >
              <nav.icon
                aria-hidden="true"
                className="md:w-7 md:h-7"
                strokeWidth={2.2}
              />
              <span
                className={`font-semibold lg:text-lg ${isExpand ? "md:w-50 md:ml-3 md:opacity-100" : "md:w-0 md:opacity-0 md:ml-0"} whitespace-nowrap transition-all duration-200 overflow-hidden ml-3`}
              >
                {nav.location}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* account */}
        <button
          onClick={() => {
            setMobileMenuBar(false);
            dispatch(setAccModal());
          }}
          aria-label="Open modal for account"
          className={`bg-[#67c09085] hover:bg-[#67c090a1] w-full px-2 py-2 flex items-center rounded-full justify-between`}
        >
          <div className={`flex items-center gap-2`}>
            <div className="bg-[#215B63] text-white rounded-full w-10 h-10 flex justify-center items-center">
              <h2 className="font-semibold">A</h2>
            </div>

            <div
              className={`${isExpand ? "md:w-7.5 md:opacity-100" : "md:w-0 md:opacity-0"} transition-all duration-200`}
            >
              <h2 className="text-lg text-nowrap font-semibold text-[#215B63]">
                ADMIN
              </h2>
            </div>
          </div>

          <div
            className={`${isExpand ? "md:w-7.5" : "md:w-0 md:opacity-0"} overflow-hidden transition-all duration-200`}
          >
            <ChevronRight
              aria-hidden="true"
              size={28}
              strokeWidth={2.2}
              color="#215B63"
            />
          </div>
        </button>
      </div>
    </>
  );
};

export default memo(Sidebar);
