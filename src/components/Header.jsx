import { Menu, Search, User, UserRound, Users } from "lucide-react";
import SearchBox from "./SearchBox";
import { useEffect, useState, useRef, memo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Header = ({ setMobileMenuBar }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const isMobile = useRef(window.innerWidth < 768);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  function action() {
    if (!searchQuery.trim()) return;

    navigate(`/search?search-for=${searchQuery}`);
  }

  function getResult() {
    if (isMobile.current) {
      setIsOpenModal(true);
    } else {
      action();
    }
  }

  useEffect(() => {
    const handler = () => {
      isMobile.current = window.innerWidth < 768;
    };

    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return (
    <header className="flex justify-between sm:px-4 px-1.5 md:py-5 py-3 gap-5 md:bg-transparent">
      <NavLink to={"/"} className="-space-y-0.5">
        <h1 className="text-xl font-semibold text-gray-600">DEV WORKSPACE</h1>
        <p className="text-sm text-gray-400">Distribution Of Works</p>
      </NavLink>

      <div className="flex-1 flex gap-2 justify-end items-center">
        {/* search bar */}
        <div className="md:bg-white md:shadow-md rounded-full w-full md:max-w-100 max-w-max h-11 flex items-center">
          <input
            autoComplete="off"
            autoCorrect="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            spellCheck={false}
            onKeyDown={(e) => e.key === "Enter" && action()}
            aria-label="Search input"
            id="search"
            type="text"
            placeholder="Type & Search"
            className="outline-none md:block hidden px-5 h-full grow rounded-[50px_0_0_50px]"
          />
          <button
            aria-label="Search button"
            onClick={getResult}
            className="rounded-full md:w-9.5 md:h-9.5 px-2.5 py-2.5 md:p-0 mr-0.5 bg-[#124170] hover:bg-[#195da0] text-white cursor-pointer flex items-center justify-center"
          >
            <Search aria-hidden="true" />
          </button>
        </div>

        {/* search box */}
        <AnimatePresence>
          {isOpenModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex justify-center items-start md:hidden z-9999 w-full h-full bg-black/40"
            >
              <SearchBox
                setSearchQuery={setSearchQuery}
                action={action}
                searchQuery={searchQuery}
                setIsOpenModal={setIsOpenModal}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ID or Profile */}
        <div className="md:flex hidden items-center bg-[#67C090] px-4 py-2.5 rounded-full text-white gap-1 whitespace-nowrap">
          <UserRound aria-hidden="true" />
          <span>ADMIN</span>
        </div>

        {/* team */}
        <div className="group relative md:block hidden">
          <div
            role="button"
            aria-label="Open menu item"
            className="bg-[#67C090] text-[#124170] px-2.5 py-2.5 rounded-full cursor-pointer transition-colors duration-200"
          >
            <Users aria-hidden="true" />
          </div>
          <div
            role="menu"
            className={`absolute group-hover:block hidden top-[115%] right-0 w-52 rounded-md bg-white shadow border border-black/5 px-3 py-4 after:absolute after:-top-2 after:right-3 after:border-l-10 after:border-r-10 after:border-b-10 after:border-l-transparent after:border-r-transparent space-y-3 after:border-b-white z-1200`}
          >
            <div role="menuitem" className="flex gap-2 items-center">
              <User aria-hidden="true" />
              <span>ADMIN</span>
            </div>
            <div role="menuitem" className="flex gap-2 items-center">
              <Users aria-hidden="true" />
              <span>Team-01</span>
            </div>
          </div>
        </div>

        {/* mobile menu */}
        <div className="flex md:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuBar((prev) => !prev);
            }}
            className="px-2.25 py-2.25 rounded-full border border-gray-400 bg-white"
          >
            <Menu strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
