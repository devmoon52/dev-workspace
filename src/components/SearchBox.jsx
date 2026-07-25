import { X } from "lucide-react";
import React from "react";
import { motion } from "motion/react";

const SearchBox = ({ setIsOpenModal, action, searchQuery, setSearchQuery }) => {
  return (
    <motion.div
      aria-modal="true"
      role="dialog"
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      exit={{ y: -20 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white mt-10 shadow relative max-w-sm w-[90%] px-4 py-2 rounded-md"
    >
      <div className="mt-10 flex w-full border border-gray-400 rounded-md">
        <input
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter") {
              action();
            }
          }}
          aria-label="Search input"
          type="text"
          id="mobile-search-input"
          placeholder="Type & Search"
          className="px-3 w-full outline-none"
        />
        <button
          aria-label="Search button"
          onClick={action}
          className="bg-[#124170] text-white px-3 py-1.5 my-0.5 mr-0.5 rounded-md"
        >
          Search
        </button>
      </div>
      <button
        aria-label="Close search modal"
        onClick={() => setIsOpenModal(false)}
        className="absolute cursor-pointer right-1 top-1"
      >
        <X aria-hidden="true" />
      </button>
    </motion.div>
  );
};

export default SearchBox;
