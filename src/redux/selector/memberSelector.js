import { createSelector } from "@reduxjs/toolkit";

const selectMembers = (state) => state.members.team_members;

export const calculatedMembers = createSelector([selectMembers], (members) => {
  const map = {
    overloaded: { count: 0, list: [] },
    active: { count: 0, list: [] },
    inActive: { count: 0, list: [] },
    available: { count: 0, list: [] },
    total: { count: members.length, list: members },
  };
  for (const m of members) {
    if (!m.isNew && m.role.length > 1) {
      map.overloaded.count++;
      map.overloaded.list.push(m);
    }

    if (m.isActive) {
      map.active.count++;
      map.active.list.push(m);
    }

    if (!m.isActive && !m.isNew) {
      map.inActive.count++;
      map.inActive.list.push(m);
    }

    if (m.isNew) {
      map.available.count++;
      map.available.list.push(m);
    }
  }

  return map;
});
