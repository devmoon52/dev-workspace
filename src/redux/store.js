import { configureStore } from "@reduxjs/toolkit";

import modalReducer from "./slice/modalSlice";
import projectReducer from "./slice/projectSlice";
import clientReducer from "./slice/clientSlice";
import memberReducer from "./slice/memberSlice";
import reminderReducer from "./slice/reminderSlice";
import assetReducer from "./slice/assetSlice";
import activityReducer from "./slice/activitySlice";
import settingReducer from "./slice/settingSlice";

export const store = configureStore({
  reducer: {
    modals: modalReducer,
    projects: projectReducer,
    clients: clientReducer,
    members: memberReducer,
    reminders: reminderReducer,
    assets: assetReducer,
    activities: activityReducer,
    settings: settingReducer,
  },
});
