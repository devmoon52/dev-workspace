import { AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";
import CopyToast from "../components/modals/CopyToast";
import FailedPopup from "../components/modals/FailedPopup";
import SuccessPopup from "../components/modals/SuccessPopup";
import ShortCutSuggetion from "../components/modals/ShortCutSuggetion";
import AccountModal from "../components/modals/AccountModal";

const Global = () => {
  const { clipboardAlert, failedPopUp, successAlert } = useSelector(
    (state) => state.modals,
  );
  const { shortCutSuggetion } = useSelector((state) => state.modals);

  const { accModal } = useSelector((state) => state.modals);

  return (
    <AnimatePresence>
      {clipboardAlert && <CopyToast key={clipboardAlert} />}
      {failedPopUp && (
        <FailedPopup key={failedPopUp.id} message={failedPopUp.message} />
      )}
      {successAlert && (
        <SuccessPopup key={successAlert.id} message={successAlert.message} />
      )}
      {shortCutSuggetion.alert && (
        <ShortCutSuggetion key={shortCutSuggetion.id} />
      )}

      {accModal && <AccountModal />}
    </AnimatePresence>
  );
};

export default Global;
