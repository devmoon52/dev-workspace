import { useState } from "react";
import MemberPercentage from "../../components/MemberPercentage";
import { HandCoins, History } from "lucide-react";
import { update_assetManager } from "../../redux/slice/settingSlice";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

const AssetManager = () => {
  const {
    autoCleanWithdrawlHistory,
    smartUpdate,
    autoAchieveTransactions,
    withdrawlMethod,
  } = useSelector((state) => state.settings.asset_manager);

  const methods = [
    { id: 1, method: "bank" },
    { id: 2, method: "card" },
    { id: 3, method: "bank & card" },
  ];

  const dispatch = useDispatch();

  return (
    <div className="space-y-6 md:space-y-10">
      <Helmet>
        <title>Asset Manager | Settings | Dev Workspace</title>
      </Helmet>

      <MemberPercentage />

      <section className="bg-gray-200 px-2 py-2.5 space-y-2">
        <div className="flex items-center gap-1">
          <History />
          <h2 className="text-lg">Withdrawl history</h2>
        </div>

        <div>
          <h3>Keep history for :</h3>
          <ul className="text-sm">
            {[7, 15, 30].map((v, i) => {
              const isSelected = v === autoCleanWithdrawlHistory;

              return (
                <li key={i + 1} className="space-x-1">
                  <input
                    id={`day-number-${v}`}
                    type="radio"
                    name="peak-date"
                    checked={isSelected}
                    onChange={(e) => {
                      dispatch(
                        update_assetManager({
                          key: "autoCleanWithdrawlHistory",
                          value: v,
                        }),
                      );
                    }}
                    className="relative top-0.5 h-3.5 w-3.5 text-indigo-600 border-gray-300 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <label htmlFor={`day-number-${v}`} className="text-sm">
                    {v} days {v === 30 && "(recommended)"}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-gray-500 h-2.5 w-2.5 rounded-full" />
            <p>Smart update weekly revenue</p>
          </div>
          <div className="flex">
            <input
              checked={smartUpdate}
              onChange={(e) => {
                dispatch(
                  update_assetManager({
                    key: "smartUpdate",
                    value: !smartUpdate,
                  }),
                );
              }}
              className={`appearance-none cursor-pointer h-5 rounded-full w-9.5 after:absolute relative after:h-4 after:w-4 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-0.5 after:bg-white transition-colors duration-200 after:transition-transform after:duration-200
                          ${
                            smartUpdate
                              ? "after:translate-x-4.5 bg-green-600"
                              : "bg-gray-400 after:translate-x-0"
                          }
                          `}
              type="checkbox"
              name="workload analyzer"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-gray-500 h-2.5 w-2.5 rounded-full" />
            <p>Auto achieve transactions</p>
          </div>
          <div className="flex">
            <input
              checked={autoAchieveTransactions}
              onChange={(e) => {
                dispatch(
                  update_assetManager({
                    key: "autoAchieveTransactions",
                    value: !autoAchieveTransactions,
                  }),
                );
              }}
              className={`appearance-none cursor-pointer h-5 rounded-full w-9.5 after:absolute relative after:h-4 after:w-4 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-0.5 after:bg-white transition-colors duration-200 after:transition-transform after:duration-200
                          ${
                            autoAchieveTransactions
                              ? "after:translate-x-4.5 bg-green-600"
                              : "bg-gray-400 after:translate-x-0"
                          }
                          `}
              type="checkbox"
              name="workload analyzer"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-200 px-2 py-2.5 space-y-2">
        <div className="flex items-center gap-1">
          <HandCoins />
          <h2 className="text-lg">Withdrawl method</h2>
        </div>

        <div>
          <h3>Select specific method</h3>
          <ul className="text-sm">
            {methods.map((v, i) => {
              const isSelected = v.method === withdrawlMethod;

              return (
                <li key={v.id} className="space-x-1">
                  <input
                    id={`method-${v.method}`}
                    type="radio"
                    name="peak-withdrawl-method"
                    checked={isSelected}
                    onChange={(e) => {
                      dispatch(
                        update_assetManager({
                          key: "withdrawlMethod",
                          value: v.method,
                        }),
                      );
                    }}
                    className="relative top-0.5 h-3.5 w-3.5 text-indigo-600 border-gray-300 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <label htmlFor={`method-${v.method}`} className="text-sm">
                    {v.method} {v.method === "bank & card" && "(recommended)"}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AssetManager;
