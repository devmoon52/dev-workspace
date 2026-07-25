import { createSelector } from "@reduxjs/toolkit";

const selectActivity = (state) => state.activities.all_activity;

export const calculatedActivity = createSelector(
  [selectActivity],
  (activities) => {
    const map = {
      total: { count: activities.length, list: activities },
      newActivities: { count: 0, list: [] },
      oldActivities: { count: 0, list: [] },
      project: { count: 0 },
      member: { count: 0 },
      reminder: { count: 0 },
      asset: { count: 0 },
      message: { count: 0 },
      setting: { count: 0 },
      filteredByDay: {
        1: { count: 0, list: [] },
        2: { count: 0, list: [] },
        3: { count: 0, list: [] },
        4: { count: 0, list: [] },
        5: { count: 0, list: [] },
        6: { count: 0, list: [] },
        7: { count: 0, list: [] },
      },
    };

    for (const a of activities) {
      if (a.day === 1) {
        map["newActivities"].count++;
        map["newActivities"].list.push(a);
      }
      if (a.day !== 1) {
        map["oldActivities"].count++;
        map["oldActivities"].list.push(a);
      }

      if (map[a.type]) {
        map[a.type].count++;
      }

      if (map.filteredByDay[a.day]) {
        map.filteredByDay[a.day].count++;
        map.filteredByDay[a.day].list.push(a);
      }
    }

    return map;
  },
);
