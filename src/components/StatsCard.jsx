import { memo } from "react";

function trackGrowth(prev, current) {
  let growth;

  if (prev !== 0) {
    return (growth = Math.round(((current - prev) / prev) * 100));
  }

  if (prev === 0 && current >= 0) {
    return (growth = "NEW");
  }

  return growth;
}

const StatsCard = ({ data }) => {
  const { count, text, Icon } = data;
  const value = trackGrowth(count.previousWeek, count.current);

  return (
    <div className="min-w-60 shrink-0 h-33 px-5 py-3 flex items-center justify-center rounded-md shadow-md bg-white">
      <div className="flex items-start gap-2">
        <Icon aria-hidden="true" size={28} strokeWidth={2.4} color="#215B63" />
        <div>
          <div className="relative inline-block">
            <h2 className="text-2xl text-[#215B63] font-semibold">
              {count.current}
            </h2>
            <span
              className={`text-xs absolute top-0 ${value >= 0 || value === "NEW" ? "text-green-500" : "text-red-500"} left-full ml-1`}
            >
              {value !== "NEW"
                ? value >= 0
                  ? `+${value}%`
                  : `${value}%`
                : value}
            </span>
          </div>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(StatsCard);
