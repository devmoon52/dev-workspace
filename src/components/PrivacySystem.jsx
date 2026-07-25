import { Coins, TextSearch } from "lucide-react";
import React from "react";
const payoutRules = [
  {
    id: 1,
    rule: "Click withdraw from total assets and it will open modal box.",
  },
  {
    id: 2,
    rule: "Enter the amount of money in the Amount field of the form.",
  },
  { id: 3, rule: "Select where to withdraw your money." },
  { id: 4, rule: "Enter your details and click to the Withdraw now button." },
  { id: 5, rule: "You will get your assets within 1-3 days." },
];

const PrivacySystem = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <TextSearch aria-hidden="true" size={28} />
        <h2 className="text-2xl">Privacy System</h2>
      </div>

      <div>
        <p className="text-gray-600">
          Minimum withdrawal amount is $50. All withdrawal requests are
          processed within 1-3 business days. Users can withdraw funds through
          supported bank accounts or debit/credit cards. Revenue is calculated from completed and approved projects. Refunds or chargebacks may affect available assets and future payouts.
          <br />
          <br />
          All payouts are transferred only to verified bank accounts or registered payment cards provided by the user. It is the user's responsibility to ensure that all banking and payment information is accurate and up to date before submitting a withdrawal request.
        </p>
      </div>

      <div className="bg-white px-3 py-2 rounded-md shadow-md">
        <h3 className="text-lg font-semibold">Payout Rules</h3>
        <ul className="mt-2 space-y-1">
          {payoutRules.map((r) => (
            <li className="flex items-start gap-2" key={r.id}>
              <div aria-hidden="true" className="rounded-full bg-[#124170]/30 flex items-center justify-center h-3.5 w-3.5 shrink-0 mt-1.25">
                <span className="h-1.5 w-1.5 rounded-full bg-[#124170]"></span>
              </div>
              <p>{r.rule}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Banking Policy</h3>
        <div>
          <p className="text-gray-600">
            Users are responsible for providing accurate banking information.
            The platform is not responsible for delays caused by incorrect
            account details.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Data Privacy</h3>
        <div>
          <p className="text-gray-600">
            Banking and payment information is securely stored and processed.
            Sensitive financial information is never shared with unauthorized
            third parties. By using this platform, users agree to all payout,
            withdrawal, and privacy policies. Policies may be updated without
            prior notice.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacySystem;
