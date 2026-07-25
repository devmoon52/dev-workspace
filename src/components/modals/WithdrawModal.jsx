import {
  CheckLine,
  CreditCard,
  FileText,
  HandCoins,
  Landmark,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import FormErr from "./FormErr";
import { setSuccessAlert } from "../../redux/slice/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { addNewWithdrawl, updateAsset } from "../../redux/slice/assetSlice";
import useAsyncDelay from "../../utils/useAsyncDelay";
import DotLoader from "../DotLoader";
import { addActivity } from "../../redux/slice/activitySlice";

const WithdrawModal = ({ asset, onClose }) => {
  const { withdrawlMethod } = useSelector(
    (state) => state.settings.asset_manager,
  );

  const dispatch = useDispatch();
  const delay = useAsyncDelay();

  const [method, setMethod] = useState(
    withdrawlMethod === "bank & card" ? "bank" : withdrawlMethod,
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // form state
    method: method,
    ammount: 0,
    bank: {
      bank_name: "",
      acc_holder: "",
      acc_number: "",
    },
    card: {
      card_holder: "",
      card_number: "",
      exp_date: "",
    },
  });
  const [fieldError, setFieldError] = useState({
    ammount: null,
    bank_name: null,
    acc_holder: null,
    acc_number: null,
    card_holder: null,
    card_number: null,
    exp_date: null,
  });

  const currentAsset =
    asset >= formData.ammount ? asset - formData.ammount : asset;

  function withdrawAction() {
    if (formData.ammount > asset) {
      return setFieldError((prev) => ({ ...prev, ammount: "Invalid ammount" }));
    }
    if (formData.ammount < 50) {
      return setFieldError((prev) => ({
        ...prev,
        ammount: "Minimum ammount must be 50",
      }));
    }

    const accountNumber = String(formData.bank.acc_number).trim();
    const cardNumber = String(formData.card.card_number).trim();

    if (method === "bank") {
      if (!/^\d+$/.test(accountNumber)) {
        return setFieldError((prev) => ({
          ...prev,
          acc_number: "Account number must contain only digits",
        }));
      }

      if (accountNumber.length < 10 || accountNumber.length > 16) {
        return setFieldError((prev) => ({
          ...prev,
          acc_number: "Account number must be 10-16 digits",
        }));
      }
    }

    if (method === "card") {
      if (!/^\d+$/.test(cardNumber)) {
        return setFieldError((prev) => ({
          ...prev,
          card_number: "Card number must contain only digits",
        }));
      }

      if (cardNumber.length !== 16) {
        return setFieldError((prev) => ({
          ...prev,
          card_number: "Card number must be 16 digits",
        }));
      }
    }

    setLoading(true);

    delay(1500, () => {
      const { method, bank, card, ammount } = formData;
      dispatch(updateAsset(currentAsset));
      // add withdrawl history
      dispatch(
        addNewWithdrawl({
          method: method,
          ammount: ammount,
          number: method === "bank" ? bank.acc_number : card.card_number,
        }),
      );
      dispatch(
        addActivity({
          type: "asset",
          log: `New withdrawl created on ${method} & ammount $${ammount}`,
        }),
      );

      onClose();
      setLoading(false);
      dispatch(
        setSuccessAlert({
          id: "success",
          message: `Withdraw succeed on ${formData.method}`,
        }),
      );
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      className="fixed z-1000 inset-0 bg-black/20 flex justify-center items-center h-screen overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white relative rounded-md max-w-lg w-[95%] px-3 py-4 shadow-md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            withdrawAction();
          }}
          className="space-y-4"
        >
          {/* onclose */}
          <button
            onClick={onClose}
            type="button"
            className="absolute right-2 top-2 cursor-pointer"
          >
            <X aria-hidden="true" />
          </button>

          <div className="flex items-center gap-1">
            <FileText aria-hidden="true" />
            <h2 className="text-lg">Withdraw from your assets</h2>
          </div>

          {/* current asset */}
          <div>
            <p className="text-sm text-gray-600">Current Asset</p>
            <h3 className="text-2xl font-semibold text-[#195DA0]">
              ${currentAsset?.toFixed(2)}
            </h3>
          </div>

          {/* set ammount */}
          <div className="flex gap-3">
            <div className="relative grow">
              <input
                type="text"
                id="ammount"
                required
                value={formData.ammount === 0 ? "" : formData.ammount}
                onChange={(e) => {
                  const value = e.target.value;

                  if (!/^\d*\.?\d*$/.test(value)) {
                    return;
                  }
                  setFormData((prev) => {
                    return {
                      ...prev,
                      ammount: e.target.value,
                    };
                  });
                  setFieldError((prev) => ({ ...prev, ammount: null }));
                }}
                className="border focus:border-[#195DA0] outline-none border-gray-300 w-full peer px-3 py-1.5 valid:border-[#195DA0]"
              />
              <label
                htmlFor="ammount"
                className="absolute top-1/2 -translate-y-1/2 left-3 peer-focus-within:top-0 peer-focus-within:bg-white px-1 peer-focus-within:left-1 peer-focus-within:text-[#195DA0] peer-focus-within:text-sm peer-valid:text-[#195DA0] peer-valid:left-1 peer-valid:bg-white peer-valid:text-sm peer-valid:top-0 transition-all duration-200 select-none text-gray-600"
              >
                Enter Ammount
              </label>
              <AnimatePresence>
                {fieldError.ammount && <FormErr message={fieldError.ammount} />}
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => {
                  return {
                    ...prev,
                    ammount: asset,
                  };
                });
              }}
              className="border border-gray-300 px-5 hover:bg-gray-300 transition-colors duration-200"
            >
              Total
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <HandCoins aria-hidden="true" strokeWidth={1.4} />
              <h2>Payout Info</h2>
            </div>

            {/* switching btns */}
            <div className="flex gap-3">
              <>
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setMethod("bank");
                    setFormData((prev) => ({ ...prev, method: "bank" }));
                  }}
                  className={`border px-2 py-1 w-30 ${method === "bank" ? "border-[#195ca071]" : "border-gray-200"} justify-center items-center gap-1 text-sm transition-all duration-200 ${withdrawlMethod === "bank & card" || withdrawlMethod === "bank" ? "flex" : "hidden"}`}
                >
                  <Landmark aria-hidden="true" strokeWidth={1.4} size={18} />
                  <span>Bank</span>
                </motion.button>
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setMethod("card");
                    setFormData((prev) => ({ ...prev, method: "card" }));
                  }}
                  className={`border px-2 py-1 w-30 ${method === "card" ? "border-[#195ca071]" : "border-gray-200"} justify-center gap-1 items-center text-sm transition-all duration-200 ${withdrawlMethod === "bank & card" || withdrawlMethod === "card" ? "flex" : "hidden"}`}
                >
                  <CreditCard aria-hidden="true" strokeWidth={1.4} size={18} />
                  <span>Card</span>
                </motion.button>
              </>
            </div>

            {/* input fields - changed by method */}
            <AnimatePresence key={method}>
              {method === "bank" ? (
                <motion.div
                  // key={'bank'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3 flex-wrap mt-5"
                >
                  <div className="relative  grow basis-47">
                    <input
                      value={formData.bank.bank_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bank: { ...prev.bank, bank_name: e.target.value },
                        }))
                      }
                      type="text"
                      id="bank"
                      required
                      className="border focus:border-[#195DA0] outline-none border-gray-300 w-full peer px-3 py-1.5 valid:border-[#195DA0]"
                    />
                    <label
                      htmlFor="bank"
                      className="absolute top-1/2 -translate-y-1/2 left-3 peer-focus-within:top-0 peer-focus-within:bg-white px-1 peer-focus-within:left-1 peer-focus-within:text-[#195DA0] peer-focus-within:text-sm peer-valid:text-[#195DA0] peer-valid:left-1 peer-valid:bg-white peer-valid:text-sm peer-valid:top-0 transition-all duration-200 select-none text-gray-600"
                    >
                      Bank Name
                    </label>
                  </div>
                  <div className="relative grow basis-47">
                    <input
                      type="text"
                      id="holderName"
                      value={formData.bank.acc_holder}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bank: { ...prev.bank, acc_holder: e.target.value },
                        }))
                      }
                      required
                      className="border focus:border-[#195DA0] outline-none border-gray-300 w-full peer px-3 py-1.5 valid:border-[#195DA0]"
                    />
                    <label
                      htmlFor="holderName"
                      className="absolute top-1/2 whitespace-nowrap -translate-y-1/2 left-3 peer-focus-within:top-0 peer-focus-within:bg-white px-1 peer-focus-within:left-1 peer-focus-within:text-[#195DA0] peer-focus-within:text-sm peer-valid:text-[#195DA0] peer-valid:left-1 peer-valid:bg-white peer-valid:text-sm peer-valid:top-0 transition-all duration-200 select-none text-gray-600"
                    >
                      Acc Holder Name
                    </label>
                  </div>
                  <div className="relative grow basis-47">
                    <input
                      type="text"
                      id="accNumber"
                      value={formData.bank.acc_number}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          bank: { ...prev.bank, acc_number: e.target.value },
                        }));
                        setFieldError((prev) => ({
                          ...prev,
                          acc_number: null,
                        }));
                      }}
                      required
                      className="border focus:border-[#195DA0] outline-none border-gray-300 w-full peer px-3 py-1.5 valid:border-[#195DA0]"
                    />
                    <label
                      htmlFor="accNumber"
                      className="absolute top-1/2 -translate-y-1/2 left-3 peer-focus-within:top-0 peer-focus-within:bg-white px-1 peer-focus-within:left-1 peer-focus-within:text-[#195DA0] peer-focus-within:text-sm peer-valid:text-[#195DA0] peer-valid:left-1 peer-valid:bg-white peer-valid:text-sm peer-valid:top-0 transition-all duration-200 select-none text-gray-600"
                    >
                      Account Number
                    </label>
                    <AnimatePresence>
                      {fieldError.acc_number && (
                        <FormErr message={fieldError.acc_number} />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3 flex-wrap mt-5"
                >
                  <div className="relative  grow basis-47">
                    <input
                      type="text"
                      id="card"
                      value={formData.card.card_holder}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          card: { ...prev.card, card_holder: e.target.value },
                        }))
                      }
                      required
                      className="border focus:border-[#195DA0] outline-none border-gray-300 w-full peer px-3 py-1.5 valid:border-[#195DA0]"
                    />
                    <label
                      htmlFor="card"
                      className="absolute top-1/2 -translate-y-1/2 left-3 peer-focus-within:top-0 peer-focus-within:bg-white px-1 peer-focus-within:left-1 peer-focus-within:text-[#195DA0] peer-focus-within:text-sm peer-valid:text-[#195DA0] peer-valid:left-1 peer-valid:bg-white peer-valid:text-sm peer-valid:top-0 transition-all duration-200 select-none text-gray-600"
                    >
                      Card Holder Name
                    </label>
                  </div>
                  <div className="relative grow basis-47">
                    <input
                      type="text"
                      id="holderName"
                      value={formData.card.card_number}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          card: { ...prev.card, card_number: e.target.value },
                        }));
                        setFieldError((prev) => ({
                          ...prev,
                          card_number: null,
                        }));
                      }}
                      required
                      className="border focus:border-[#195DA0] outline-none border-gray-300 w-full peer px-3 py-1.5 valid:border-[#195DA0]"
                    />
                    <label
                      htmlFor="holderName"
                      className="absolute top-1/2 whitespace-nowrap -translate-y-1/2 left-3 peer-focus-within:top-0 peer-focus-within:bg-white px-1 peer-focus-within:left-1 peer-focus-within:text-[#195DA0] peer-focus-within:text-sm peer-valid:text-[#195DA0] peer-valid:left-1 peer-valid:bg-white peer-valid:text-sm peer-valid:top-0 transition-all duration-200 select-none text-gray-600"
                    >
                      Card Number
                    </label>
                    <AnimatePresence>
                      {fieldError.card_number && (
                        <FormErr message={fieldError.card_number} />
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative grow basis-47">
                    <input
                      type="text"
                      id="accNumber"
                      value={formData.card.exp_date}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          card: { ...prev.card, exp_date: e.target.value },
                        }))
                      }
                      required
                      className="border focus:border-[#195DA0] outline-none border-gray-300 w-full peer px-3 py-1.5 valid:border-[#195DA0]"
                    />
                    <label
                      htmlFor="accNumber"
                      className="absolute top-1/2 -translate-y-1/2 left-3 peer-focus-within:top-0 peer-focus-within:bg-white px-1 peer-focus-within:left-1 peer-focus-within:text-[#195DA0] peer-focus-within:text-sm peer-valid:text-[#195DA0] peer-valid:left-1 peer-valid:bg-white peer-valid:text-sm peer-valid:top-0 transition-all duration-200 select-none text-gray-600"
                    >
                      Expire Date
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* withdraw btn */}
          <div className="mt-5">
            <button
              type="submit"
              disabled={loading}
              className={`h-10 flex justify-center bg-[#195DA0] items-center ${!loading && "hover:bg-[#154d86]"} w-full text-white`}
            >
              {loading ? (
                <DotLoader isBright={true} size="md" />
              ) : (
                <span>Withdraw Now</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default WithdrawModal;
