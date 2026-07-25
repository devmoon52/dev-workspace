import { CircleDollarSign, Wallet } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateAsset, updateRevenue } from "../redux/slice/assetSlice";
import { useEffect, useRef, useState } from "react";
import WithdrawModal from "./modals/WithdrawModal";
import { AnimatePresence } from "motion/react";

function getPercentage(now, last) {
  return Math.round(((now - last) / last) * 100);
}

const Assets = ({ transactionRef, setHighlight }) => {
  const [staticLastWeekAsset, staticLastWeekRevenue] = [420, 3500];
  const [staticLastMonthAsset, staticLastMonthRevenue] = [610, 1200];

  const { total_asset } = useSelector((state) => state.assets);
  const [openWithDrawModal, setOpenWithDrawModal] = useState(null);

  const monthlyGrowthAsset = getPercentage(total_asset, staticLastMonthAsset);
  const monthlyGrowthRevenue = getPercentage(3500, staticLastMonthRevenue);

  useEffect(() => {
    if (!openWithDrawModal) return;

    function closeModal(e) {
      if (e.key === "Escape") {
        setOpenWithDrawModal(null);
      }
    }

    window.addEventListener("keydown", closeModal);

    return () => {
      window.removeEventListener("keydown", closeModal);
    };
  }, [openWithDrawModal]);

  function viewTransaction() {
    transactionRef.current?.scrollIntoView({
      behavour: "smooth",
    });
    setHighlight(true);
  }

  return (
    <section className="flex gap-3 flex-wrap">
      {/* withdrawl modal */}
      <AnimatePresence>
        {openWithDrawModal && (
          <WithdrawModal
            asset={total_asset}
            onClose={() => setOpenWithDrawModal(null)}
          />
        )}
      </AnimatePresence>

      {/* assets */}
      <div className="bg-white px-3 rounded-md shadow-md basis-80 grow flex justify-center items-center py-5">
        <div className="space-y-3 max-w-80 w-full">
          <div className="flex items-center gap-1 text-gray-700">
            <Wallet size={26} aria-hidden="true" strokeWidth={2.3} />
            <h2 className="font-semibold text-lg">Total Assets</h2>
          </div>

          <h2 className="text-4xl text-[#195DA0] font-semibold heading-font">
            ${total_asset.toFixed(2)}
          </h2>

          <div className="flex gap-2 justify-between w-full text-sm text-gray-600">
            <p>
              Monthly Growth:{" "}
              {monthlyGrowthAsset < 0
                ? monthlyGrowthAsset
                : "+" + monthlyGrowthAsset}
              %
            </p>
            <p>Last Week: ${staticLastWeekAsset}</p>
          </div>

          <button
            onClick={() => setOpenWithDrawModal(total_asset)}
            className="bg-[#195DA0] hover:bg-[#175491] w-full py-2 text-white"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* revenue */}
      <div className="bg-white px-3 flex justify-center items-center py-5 rounded-md shadow-md basis-80 grow">
        <div className="space-y-3 max-w-80 w-full">
          <div className="flex items-center gap-1 text-gray-700">
            <CircleDollarSign size={26} aria-hidden="true" strokeWidth={2.3} />
            <h2 className="font-semibold text-lg">Current Revenue</h2>
          </div>

          <h2 className="text-4xl text-[#195DA0] font-semibold heading-font">
            $3800.00
          </h2>

          <div className="flex gap-2 justify-between text-sm text-gray-600">
            <p>
              Monthly Growth:{" "}
              {monthlyGrowthRevenue < 0
                ? monthlyGrowthRevenue
                : "+" + monthlyGrowthRevenue}
              %
            </p>
            <p>Last Week: ${staticLastWeekRevenue}</p>
          </div>

          <button
            onClick={viewTransaction}
            className="bg-[#195DA0] hover:bg-[#175491] w-full py-2 text-white"
          >
            View Transactions
          </button>
        </div>
      </div>
    </section>
  );
};

export default Assets;
