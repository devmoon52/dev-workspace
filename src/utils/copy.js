export const copyToClipboard = async (value) => {
  try {
    // Modern browser API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }

    // Fallback
    const textarea = document.createElement("textarea");
    textarea.value = value;

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    return success;
  } catch (err) {
    console.error("Copy failed:", err);
    return false;
  }
};

import { setCopyToast, removeCopyToast } from "../redux/slice/modalSlice";
let copyToastTimer = null;

export function displayCopyToast(dispatch, offCopy, value) {
  dispatch(setCopyToast(value));

  clearTimeout(copyToastTimer);

  copyToastTimer = setTimeout(() => {
    dispatch(removeCopyToast());
    offCopy(null);
  }, 3000);

  return {
    cleanUp: () => {
      clearTimeout(copyToastTimer);
    },
  };
}
