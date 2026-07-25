import { createSlice } from "@reduxjs/toolkit";
import { activities } from "../../data/activityData";
import { notifications } from "../../data/notificationData";

const initialState = {
  all_activity: activities,
  all_notification: notifications,
};

const activitySlice = createSlice({
  initialState,
  name: "activities",
  reducers: {
    addActivity: (state, action) => {
      const { type, log } = action.payload;
      state.all_activity.unshift({
        type,
        log,
        day: 1,
      });
    },

    // remove all activity
    removeAllActivity: (state, action) => {
      state.all_activity = [];
    },

    // remove all notification
    removeAllNotification: (state, action) => {
      state.all_notification = [];
    },
  },
});

export const { addActivity, removeAllActivity, removeAllNotification } = activitySlice.actions;
export default activitySlice.reducer;
