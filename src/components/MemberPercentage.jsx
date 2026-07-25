import { Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { update_assetManager } from "../redux/slice/settingSlice";
import { useDispatch, useSelector } from "react-redux";

const MemberPercentage = () => {
  const { memberPercentage } = useSelector(
    (state) => state.settings.asset_manager,
  );
  const [sliderValue, setSliderValue] = useState(memberPercentage);
  const [showTooltip, setShowTooltip] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        update_assetManager({ key: "memberPercentage", value: sliderValue }),
      );
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [sliderValue]);

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-1">
        <Receipt />
        <h2 className="text-lg">Member percentage</h2>
      </div>

      <div className="space-y-2">
        <h3 className="text-4xl font-semibold">{memberPercentage}%</h3>
        <div role="list" className="pl-0.5 flex gap-1 flex-wrap text-sm">
          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => {
            return (
              <button
                role="listitem"
                key={v}
                onClick={() => setSliderValue(v)}
                className="bg-white shadow hover:border-gray-300 border border-transparent px-2 py-1"
              >
                {v}%
              </button>
            );
          })}
        </div>
        <div className="relative max-w-lg overflow-x-clip">
          <input
            value={sliderValue}
            onChange={(e) => {
              setSliderValue(Number(e.target.value));
            }}
            onPointerDown={() => setShowTooltip(true)}
            onPointerUp={() => setShowTooltip(false)}
            onPointerLeave={() => setShowTooltip(false)}
            type="range"
            className=" border w-full peer modernRange"
          />
          {/* tooltip */}
          <div
            className={`absolute bottom-7 ${showTooltip ? 'flex':'hidden'} peer-hover:flex -translate-x-1/2 bg-[#124170] z-10 text-white w-18 h-8 rounded-sm justify-center items-center text-sm shadow after:absolute after:top-full after:content-[''] after:w-0 after:h-0 after:border-l-8 after:border-l-transparent after:border-r-8 after:border-r-transparent after:border-b-8 after:border-b-[#124170] after:rotate-x-180`}
            style={{
              left: `${sliderValue}%`,
            }}
          >
            {sliderValue}%
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberPercentage;
