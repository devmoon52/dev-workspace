import { CreditCard, Landmark, WalletCards } from "lucide-react";
import { useSelector } from "react-redux";
import { getMonthAndDay } from "../utils/calculateDate";

function maskNumber(number) {
  const str = String(number);

  return str.slice(0, 2) + "x".repeat(str.length - 5) + str.slice(-3);
}

const WithdrawlHistory = () => {
  const { recent_withdrawls } = useSelector((state) => state.assets);

  return (
    <section className="space-y-2">
      <div className="flex text-gray-700 items-center gap-2">
        <WalletCards strokeWidth={2.4} size={26} />
        <h2 className="text-lg font-semibold">Recent Withdrawl</h2>
      </div>

      <ul className="space-y-1.5">
        {recent_withdrawls.map((w) => (
          <li
            key={w.id}
            className="bg-white px-3 py-2 rounded-md shadow-md space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {w.method === "bank" ? (
                  <Landmark strokeWidth={1.4} />
                ) : (
                  <CreditCard strokeWidth={1.4} />
                )}
                <h3>
                  {w.method === "bank" ? "Bank Transfer" : "Card Transfer"}
                </h3>
              </div>
              <p>${w.ammount}</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>Date: {getMonthAndDay(w.date)}</p>
              <p>
                {w.method === "bank" ? "Acc:" : "Card:"} {maskNumber(w.number)}
              </p>
              <p>Amount: ${w.ammount}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WithdrawlHistory;
