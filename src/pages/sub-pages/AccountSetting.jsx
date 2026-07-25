import { SquarePen, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { update_adminSetting } from "../../redux/slice/settingSlice";
import { Helmet } from "react-helmet-async";

const AccountSetting = () => {
  const dispatch = useDispatch();

  const { adminSetting } = useSelector((state) => state.settings);

  const [editingField, setEditingField] = useState(null);

  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
  });

  useEffect(() => {
    if (adminSetting) {
      setAdminData(adminSetting);
    }
  }, [adminSetting]);

  const fields = [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Phone",
      key: "phone",
    },
    {
      label: "Position",
      key: "position",
    },
    {
      label: "Department",
      key: "department",
    },
  ];

  const handleSave = (field) => {
    const edit = adminData[field];
    if (!edit.trim()) return;

    dispatch(
      update_adminSetting({
        ...adminSetting,
        [field]: adminData[field].trim(),
      }),
    );

    setEditingField(null);
  };

  const handleCancel = () => {
    setAdminData(adminSetting);
    setEditingField(null);
  };

  return (
    <div className="space-y-5">
      <Helmet>
        <title>Account | Settings | Dev Workspace</title>
      </Helmet>

      {fields.map((field) => (
        <div key={field.key}>
          <h2 className="text-lg font-semibold text-gray-700">{field.label}</h2>

          <div className="flex gap-3 w-full mt-0.5">
            {editingField === field.key ? (
              <>
                <input
                  type="text"
                  value={adminData[field.key]}
                  onChange={(e) =>
                    setAdminData((prev) => ({
                      ...prev,
                      [field.key]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSave(field.key);
                    }
                  }}
                  autoFocus
                  name={`Fill the field`}
                  className="border text-sm grow px-3 py-2 rounded-sm border-gray-400 outline-none"
                />

                <button
                  onClick={() => handleSave(field.key)}
                  className="px-3 bg-green-200 text-green-700 rounded-sm hover:bg-green-300"
                >
                  <Check size={18} />
                </button>

                <button
                  onClick={handleCancel}
                  className="px-3 bg-red-200 text-red-700 rounded-sm hover:bg-red-300"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                <div className="bg-gray-300/70 px-3 grow py-2 rounded-sm text-sm border border-gray-300">
                  <h3>
                    {field.key === "phone"
                      ? `+${adminData[field.key]}`
                      : adminData[field.key]}
                  </h3>
                </div>

                <button
                  disabled={
                    field.key === "position" || field.key === "department"
                  }
                  onClick={() => setEditingField(field.key)}
                  className={`bg-gray-300/70 px-3 rounded-sm ${field.key === "position" || field.key === "department" ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-300"}`}
                >
                  <SquarePen size={20} strokeWidth={1.4} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountSetting;
