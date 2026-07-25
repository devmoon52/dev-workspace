import { Eye, EyeOff, Form, ShieldUser, UserKey } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update_Security } from "../../redux/slice/settingSlice";
import RasetAndRemoveModal from "../../components/modals/RasetAndRemoveModal";
import DotLoader from "../../components/DotLoader";
import FormErr from "../../components/modals/FormErr";
import { AnimatePresence } from "motion/react";
import DelConfirmation from "../../components/modals/DelConfirmation";
import { setSuccessAlert } from "../../redux/slice/modalSlice";
import { Helmet } from "react-helmet-async";

const Security = () => {
  const [appPassForm, setAppPassForm] = useState({
    isOpen: false,
    value: "",
    inputType: "password",
    isLoading: false,
    formError: null,
  });
  const [removeAppPass, setRemoveAppPass] = useState(null);

  const [logOutAllDevice, setLogOutAllDevice] = useState(null);

  const [changePassForm, setChangePassForm] = useState({
    isOpened: false,
    isLoading: false,

    inputType1: "password",
    inputType2: "password",

    oldPassword: "",
    newPassword: "",

    errors: {
      oldPassword: null,
      newPassword: null,
    },
  });

  const {
    twoFactorAuthentication,
    accPrivacy,
    securityAlerts,
    stepAlerts,
    messageEncryption,
    appPassword,
    adminPassword,
  } = useSelector((state) => state.settings.security);

  const timerRef = useRef();
  const dispatch = useDispatch();

  const securityToggles1 = [
    {
      id: 1,
      title: "Enable 2FA",
      label: "twoFactorAuthentication",
      value: twoFactorAuthentication,
    },
    {
      id: 2,
      title: "Hide account privacy",
      label: "accPrivacy",
      value: accPrivacy,
    },
  ];

  const securityToggles2 = [
    {
      id: 1,
      title: "Enable security alerts",
      label: "securityAlerts",
      value: securityAlerts,
    },
    {
      id: 2,
      title: "Ask before taking sensitive action",
      label: "stepAlerts",
      value: stepAlerts,
    },
    {
      id: 3,
      title: "Enable message encryption",
      label: "messageEncryption",
      value: messageEncryption,
    },
  ];

  // set password fnc
  function setPassword() {
    if (!appPassForm.value.trim()) {
      return setAppPassForm((prev) => ({
        ...prev,
        formError: "Password is required",
      }));
    }

    if (appPassForm.value.length < 4 || appPassForm.value.length > 8) {
      setAppPassForm((prev) => ({
        ...prev,
        formError: "Password length must be 4 to 8",
      }));
    }

    setAppPassForm((prev) => {
      return {
        ...prev,
        inputType: "password",
        isLoading: true,
      };
    });

    timerRef.current = setTimeout(() => {
      dispatch(
        update_Security({ key: "appPassword", value: appPassForm.value }),
      );
      setAppPassForm((prev) => ({
        formError: null,
        inputType: "password",
        isLoading: false,
        value: "",
        isOpen: false,
      }));
      dispatch(
        setSuccessAlert({
          id: "app-password",
          message: "App password successfully created",
        }),
      );
    }, 1000);
  }

  // change password fnc
  function changeAdminPassword() {
    const oldPass = changePassForm.oldPassword.trim();

    const newPass = changePassForm.newPassword.trim();

    const errors = {
      oldPassword: null,
      newPassword: null,
    };

    if (!oldPass) {
      errors.oldPassword = "Current password is required";
    } else if (oldPass !== adminPassword) {
      errors.oldPassword = "Current password is incorrect";
    }

    if (!newPass) {
      errors.newPassword = "New password is required";
    } else if (newPass.length < 6 || newPass.length > 22) {
      errors.newPassword = "Password must be 6-22 characters";
    } else if (newPass === oldPass) {
      errors.newPassword = "New password must be different";
    }

    if (errors.oldPassword || errors.newPassword) {
      return setChangePassForm((prev) => ({
        ...prev,
        errors,
      }));
    }

    setChangePassForm((prev) => ({
      ...prev,
      isLoading: true,
    }));

    timerRef.current = setTimeout(() => {
      dispatch(
        update_Security({
          key: "adminPassword",
          value: newPass,
        }),
      );

      setChangePassForm({
        isOpened: false,
        isLoading: false,
        inputType1: "password",
        inputType2: "password",
        oldPassword: "",
        newPassword: "",
        errors: {
          oldPassword: null,
          newPassword: null,
        },
      });

      dispatch(
        setSuccessAlert({
          id: "change-admin-password",
          message: "Password has been changed successfully",
        }),
      );
    }, 1000);
  }

  // clear timer out - timerRef
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6 md:space-y-10">
      <Helmet>
        <title>Security | Settings | Dev Workspace</title>
      </Helmet>

      <AnimatePresence>
        {/* set app pass */}
        {appPassForm.isOpen && (
          <RasetAndRemoveModal
            onClose={() =>
              setAppPassForm((prev) => ({
                formError: null,
                inputType: "password",
                isLoading: false,
                value: "",
                isOpen: false,
              }))
            }
            key={"app_password"}
          >
            <div className="flex flex-col gap-3 items-center">
              <div className="flex items-center gap-1">
                <UserKey size={20} strokeWidth={2.2} />
                <h2 className="font-semibold">Set App Password</h2>
              </div>
              <div className="relative max-w-70 w-full">
                <input
                  type={appPassForm.inputType}
                  placeholder="Type here"
                  value={appPassForm.value}
                  onChange={(e) => {
                    setAppPassForm((prev) => ({
                      ...prev,
                      formError: null,
                      value: e.target.value,
                    }));
                  }}
                  required
                  className="border-b-2 border-gray-300 focus:border-green-500 valid:border-green-500 w-full text-center transition-all duration-200 outline-none"
                />
                <AnimatePresence>
                  {appPassForm.formError && (
                    <FormErr message={appPassForm.formError} />
                  )}
                </AnimatePresence>
                <button
                  onClick={() => {
                    setAppPassForm((prev) => {
                      return {
                        ...prev,
                        inputType:
                          prev.inputType === "password" ? "text" : "password",
                      };
                    });
                  }}
                  className="absolute right-0 cursor-pointer"
                >
                  {appPassForm.inputType === "password" ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              <button
                onClick={setPassword}
                className="bg-green-500 flex justify-center items-center rounded-full text-white hover:bg-green-600 w-24 h-9 text-sm"
              >
                {appPassForm.isLoading ? (
                  <DotLoader size="sm" isBright={true} />
                ) : (
                  <span>Set Now</span>
                )}
              </button>
            </div>
          </RasetAndRemoveModal>
        )}

        {/* remove app pass */}
        {removeAppPass && (
          <DelConfirmation
            key={"remove-app-password"}
            message={removeAppPass.message}
            callback={() => {
              dispatch(update_Security({ key: "appPassword", value: null }));
            }}
            offClick={setRemoveAppPass}
          />
        )}

        {/* log out all device */}
        {logOutAllDevice && (
          <DelConfirmation
            key={"log-out-all-device"}
            message={logOutAllDevice.message}
            callback={() => {}}
            offClick={setLogOutAllDevice}
          />
        )}

        {/* change admin password modal */}
        {changePassForm.isOpened && (
          <RasetAndRemoveModal
            key={"change-admin-password"}
            onClose={() =>
              setChangePassForm({
                isOpened: false,
                isLoading: false,
                inputType1: "password",
                inputType2: "password",
                oldPassword: "",
                newPassword: "",
                errors: {
                  oldPassword: null,
                  newPassword: null,
                },
              })
            }
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <ShieldUser />
                <h2 className="font-semibold text-lg">Change Admin Password</h2>
              </div>

              {/* OLD PASSWORD */}
              <div className="space-y-1 relative">
                <label className="text-sm text-gray-600">
                  Current Password - {adminPassword}
                </label>

                <div className="relative">
                  <input
                    type={changePassForm.inputType1}
                    placeholder="Enter current password"
                    value={changePassForm.oldPassword}
                    onChange={(e) =>
                      setChangePassForm((prev) => ({
                        ...prev,
                        oldPassword: e.target.value,
                        errors: {
                          ...prev.errors,
                          oldPassword: null,
                        },
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 outline-none focus:border-green-500"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() =>
                      setChangePassForm((prev) => ({
                        ...prev,
                        inputType1:
                          prev.inputType1 === "password" ? "text" : "password",
                      }))
                    }
                  >
                    {changePassForm.inputType1 === "password" ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {changePassForm.errors.oldPassword && (
                    <FormErr message={changePassForm.errors.oldPassword} />
                  )}
                </AnimatePresence>
              </div>

              {/* NEW PASSWORD */}
              <div className="space-y-1 relative">
                <label className="text-sm text-gray-600">New Password</label>

                <div className="relative">
                  <input
                    type={changePassForm.inputType2}
                    placeholder="Enter new password"
                    value={changePassForm.newPassword}
                    onChange={(e) =>
                      setChangePassForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                        errors: {
                          ...prev.errors,
                          newPassword: null,
                        },
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 outline-none focus:border-green-500"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() =>
                      setChangePassForm((prev) => ({
                        ...prev,
                        inputType2:
                          prev.inputType2 === "password" ? "text" : "password",
                      }))
                    }
                  >
                    {changePassForm.inputType2 === "password" ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {changePassForm.errors.newPassword && (
                    <FormErr message={changePassForm.errors.newPassword} />
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={changeAdminPassword}
                disabled={changePassForm.isLoading}
                className="w-full h-10 rounded-md bg-green-600 text-white hover:bg-green-700 flex justify-center items-center"
              >
                {changePassForm.isLoading ? (
                  <DotLoader size="sm" isBright />
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </RasetAndRemoveModal>
        )}
      </AnimatePresence>

      <section className="bg-gray-200 px-2 py-2.5 space-y-2">
        <div className="flex items-center gap-1">
          <ShieldUser />
          <h2 className="text-lg">Acount Security</h2>
        </div>

        <div className="flex gap-x-2 gap-y-1 flex-wrap">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (appPassword) {
                setRemoveAppPass({
                  message: "Sure want to remove app password ?",
                });
              } else {
                setAppPassForm((prev) => ({ ...prev, isOpen: true }));
              }
            }}
            className="text-sm bg-[#124170] hover:bg-[#164c83] text-white px-4 py-2 rounded-sm"
          >
            {appPassword ? "Remove App Password" : "Set App Password"}
          </button>

          {/* change admin password btn */}
          <button
            onClick={() =>
              setChangePassForm((prev) => ({
                ...prev,
                isOpened: true,
              }))
            }
            className="text-sm bg-[#124170] hover:bg-[#164c83] text-white px-4 py-2 rounded-sm"
          >
            Change Admin Password
          </button>
        </div>

        <ul className="space-y-1">
          {securityToggles1.map((st) => (
            <li key={st.id} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-gray-500 h-2.5 w-2.5 rounded-full" />
                <p>{st.title}</p>
              </div>
              <div className="flex">
                <input
                  checked={st.value}
                  onChange={(e) => {
                    dispatch(
                      update_Security({
                        key: st.label,
                        value: !st.value,
                      }),
                    );
                  }}
                  className={`appearance-none cursor-pointer h-5 rounded-full w-9.5 after:absolute relative after:h-4 after:w-4 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-0.5 after:bg-white transition-colors duration-200 after:transition-transform after:duration-200
                          ${
                            st.value
                              ? "after:translate-x-4.5 bg-green-600"
                              : "bg-gray-400 after:translate-x-0"
                          }
                          `}
                  type="checkbox"
                  name="workload analyzer"
                />
              </div>
            </li>
          ))}
        </ul>

        {/* log out all device btn */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLogOutAllDevice({
              message: "Are you sure want to log out from all devices ?",
            });
          }}
          className="text-[#c00000] text-sm underline hover:text-[#eb0000] cursor-pointer"
        >
          Log out all device
        </button>
      </section>

      <section>
        <ul className="space-y-1">
          {securityToggles2.map((st) => (
            <li key={st.id} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-gray-500 h-2.5 w-2.5 rounded-full" />
                <p>{st.title}</p>
              </div>
              <div className="flex">
                <input
                  checked={st.value}
                  onChange={(e) => {
                    dispatch(
                      update_Security({
                        key: st.label,
                        value: !st.value,
                      }),
                    );
                  }}
                  className={`appearance-none cursor-pointer h-5 rounded-full w-9.5 after:absolute relative after:h-4 after:w-4 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:left-0.5 after:bg-white transition-colors duration-200 after:transition-transform after:duration-200
                          ${
                            st.value
                              ? "after:translate-x-4.5 bg-green-600"
                              : "bg-gray-400 after:translate-x-0"
                          }
                          `}
                  type="checkbox"
                  name="workload analyzer"
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Security;
