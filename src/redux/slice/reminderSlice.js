import { createSlice } from "@reduxjs/toolkit";
const dummy = {
  id: Date.now(),
  note: "Create Notes. Set a goal. Get Project Details.",
  createdAt: Date.now(),
  reminderTime: Date.now(),
  extraOptions: {
    avgDeadline: true,
    currentRevenue: true,
    overdue: true,
  },
};

const initialState = {
  reminder: [dummy],
};

const reminderSlice = createSlice({
  name: "reminder",
  initialState,
  reducers: {
    updateReminder: (state, action) => {
      state.reminder = action.payload;
    },

    addNewReminder: (state, action) => {
      state.reminder.unshift(action.payload);
    },

    removeAllReminder: (state, action) => {
      state.reminder = [];
    },
  },
});

export const { updateReminder, addNewReminder, removeAllReminder } =
  reminderSlice.actions;
export default reminderSlice.reducer;
