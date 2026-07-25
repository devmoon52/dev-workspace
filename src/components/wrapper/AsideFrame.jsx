const AsideFrame = ({ children, isExpand, mobileMenuBar }) => {
  // toggle style fnc
  const sidebarClass = isExpand
    ? "md:pr-8 pr-4 md:w-auto border-r"
    : "md:pr-4 md:border-r md:w-auto";

  return (
    <aside
      onClick={(e) => e.stopPropagation()}
      id="sidebar"
      className={`shrink-0 flex-col items-start overflow-hidden border-gray-400 ${sidebarClass} transition-transform duration-200 md:z-8888 z-9999 flex md:static fixed bg-white md:bg-transparent right-0 top-0 h-full md:h-auto md:p-0 py-5 px-3 max-w-120 w-full md:shadow-none shadow-md ${mobileMenuBar ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
    >
      {children}
    </aside>
  );
};

export default AsideFrame;
// md:flex absolute z-9999 top-0 right-0
