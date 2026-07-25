import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminSetting: {
    name: "Mehedi Moon",
    email: "devworkspace@gmail.com",
    phone: 682594729474,
    position: "Admin",
    department: "Dev Workspace",
  },
  data_center: {
    autoBackup: true,
  },

  notification: {
    toggleAlert: {
      allNotification: false,
      teamMember: true,
      client: true,
      project: true,
      reminder: false,
      workload: true,
      revenueAndAsset: true,
      messages: true,
    },
    autoCleanUp: {
      duration: 7,
    },
  },

  system: {
    projectMonitor: {
      enabled: true,
      loopDuration: 10,
      loop: true,
    },

    recentActivity: {
      autoCleanDuration: 7,
    },
    workloadAnalyzer: true,
    overdueHighlighter: true,
  },

  asset_manager: {
    memberPercentage: 50,
    autoCleanWithdrawlHistory: 30,
    smartUpdate: true,
    autoAchieveTransactions: true,
    withdrawlMethod: 'bank & card'
  },

  security: {
    twoFactorAuthentication: false,
    accPrivacy: true,
    messageEncryption: true,
    securityAlerts: true,
    stepAlerts: true,
    appPassword: null,
    adminPassword: "ADMIN1234",
  },
};

const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    update_adminSetting: (state, action) => {
      state.adminSetting = action.payload;
    },

    // update notification and toggle alert
    update_notificationToggle: (state, action) => {
      const { key, value } = action.payload;
      const notificationBlock = state.notification;

      if (key === "autoCleanUp") {
        notificationBlock.autoCleanUp.duration = value;
        return;
      }

      if (key === "allNotification") {
        const keys = Object.keys(notificationBlock.toggleAlert);
        keys.forEach((alertLabel) => {
          if (value) {
            notificationBlock.toggleAlert[alertLabel] = true;
          } else {
            notificationBlock.toggleAlert[alertLabel] = false;
          }
        });
      } else {
        notificationBlock.toggleAlert[key] =
          !notificationBlock.toggleAlert[key];

        const allEnabled = Object.entries(notificationBlock.toggleAlert)
          .filter(([key]) => key !== "allNotification")
          .every(([, value]) => value);

        notificationBlock.toggleAlert.allNotification = allEnabled;
      }
    },

    // update data-center and auto backup
    update_autoBackup: (state, action) => {
      state.data_center.autoBackup = !state.data_center.autoBackup;
    },

    // system setting
    update_System: (state, action) => {
      const { key, data } = action.payload;

      if (key === "project_monitor") {
        state.system.projectMonitor = data;
      }

      if (key === "recentActivity") {
        state.system.recentActivity.autoCleanDuration = data;
      }

      if (key === "workload") {
        state.system.workloadAnalyzer = data;
      }
      if (key === "overdue") {
        state.system.overdueHighlighter = data;
      }
    },

    // asset manager
    update_assetManager: (state, action) => {
      const { key, value } = action.payload;

      state.asset_manager[key] = value;
    },

    // security
    update_Security: (state, action) => {
      const { key, value } = action.payload;

      state.security[key] = value;
    },
  },
});

export const {
  update_adminSetting,
  update_notificationToggle,
  update_autoBackup,
  update_System,
  update_assetManager,
  update_Security,
} = settingSlice.actions;
export default settingSlice.reducer;
