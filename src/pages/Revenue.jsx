import { useRef, useState, useEffect } from "react";
import Assets from "../components/Assets";
import PrivacySystem from "../components/PrivacySystem";
import TeamPerformace from "../components/TeamPerformace";
import Transactions from "../components/Transactions";
import WithdrawlHistory from "../components/WithdrawlHistory";
import { Helmet } from "react-helmet-async";

const Revenue = () => {
  const transactionRef = useRef(null);

  const [highlight, setHighlight] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setHighlight(false);
    }, 400);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [highlight]);

  return (
    <div className="mb-5 flex flex-wrap space-y-10 gap-3">
      <Helmet>
        <title>Revenue | Dev Workspace</title>
      </Helmet>

      <div className="space-y-10 grow-4 basis-150">
        <h1
          role="heading"
          className="text-3xl heading-font font-semibold"
        >
          Revenue
        </h1>

        <Assets transactionRef={transactionRef} setHighlight={setHighlight} />
        <TeamPerformace />
        <PrivacySystem />
        <WithdrawlHistory />
      </div>

      <aside
        ref={transactionRef}
        className={`bg-white shadow-md shrink-0 basis-80 grow px-3 py-4 rounded-md ${highlight && "scale-101"} transition-transform duration-200`}
      >
        <Transactions />
      </aside>
    </div>
  );
};

export default Revenue;
