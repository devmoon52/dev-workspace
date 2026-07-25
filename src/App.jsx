import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BodyFrame from "./components/wrapper/BodyFrame";
import AsideFrame from "./components/wrapper/AsideFrame";

function App() {
  const [isExpand, setIsExpand] = useState(false);
  const [mobileMenuBar, setMobileMenuBar] = useState(false);

  useEffect(() => {
    if (!mobileMenuBar) return;

    const handler = () => setMobileMenuBar(false);

    window.addEventListener("click", handler);

    return () => window.removeEventListener("click", handler);
  }, [mobileMenuBar]);

  return (
    <div className="h-dvh flex flex-col overflow-x-clip">
      <Header setMobileMenuBar={setMobileMenuBar} />

      <div className="flex flex-1 min-h-0 sm:pl-4 pl-1.5 md:mt-4 mt-0 mb-4 overflow-x-hidden">
        <AsideFrame mobileMenuBar={mobileMenuBar} isExpand={isExpand}>
          <Sidebar
            isExpand={isExpand}
            setIsExpand={setIsExpand}
            setMobileMenuBar={setMobileMenuBar}
          />
        </AsideFrame>

        <BodyFrame isExpand={isExpand}>
          <Outlet />
        </BodyFrame>
      </div>
    </div>
  );
}

export default App;
