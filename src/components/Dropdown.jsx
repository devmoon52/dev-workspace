import { useState, useEffect } from "react";

function createRanges(total, size = 10) {
  const ranges = [];

  for (let start = 0; start < total; start += size) {
    ranges.push({
      start,
      end: start + size,
      label: `${start + 1} - ${start + size}`,
    });
  }

  return ranges;
}

const Dropdown = ({ label, total, size = 10, setFn, list, setStart }) => {
  const [dropdown, setDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState({
    start: 0,
    count: `1 - ${size}`,
  });

  useEffect(() => {
    function handler() {
      setDropdown(false);
    }

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  useEffect(() => {
    const [f, s] = dropdownValue.count.split(" - ").map(Number);
    const first = f - 1;

    const sliced = list.slice(first, s);
    if (setStart) {
      setStart(first);
    }
    setFn(sliced);
  }, [dropdownValue]);

  const range = createRanges(total, size);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <p>{label}</p>
        <button
          aria-label="Pagination"
          onClick={(e) => {
            e.stopPropagation();
            setDropdown((prev) => !prev);
          }}
          className="bg-gray-200 min-w-16.75 py-1 cursor-pointer"
        >
          {dropdownValue.count}
        </button>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-gray-200 absolute right-0 z-20 min-w-16.75 space-y-1 text-center text-sm ${dropdown ? "block" : "hidden"}`}
      >
        {range.map((p) => (
          <p
            role="button"
            onClick={() => {
              setDropdownValue({
                start: p.start,
                count: p.label,
              });
              setDropdown(false);
            }}
            className="w-full py-1 hover:bg-amber-100 cursor-default"
            key={p.start}
          >
            {p.label}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
