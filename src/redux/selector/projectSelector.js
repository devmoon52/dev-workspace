import { createSelector } from "@reduxjs/toolkit";

const selectProjects = (state) => state.projects.total_projects;

export const calculatedProjects = createSelector(
  [selectProjects],
  (projects) => {
    const map = {
      pending: { count: 0, list: [] },
      running: { count: 0, list: [] },
      completed: { count: 0, list: [] },
      approved: { count: 0, list: [] },
      overdue: { count: 0, list: [] },
      blocked: { count: 0, list: [] },
      pined: { count: 0, list: [] },
      total: { count: projects.length, list: projects },
    };

    for (const p of projects) {
      const key = p.status;

      if (map[key]) {
        map[key].count++;
        map[key].list.push(p);
      }

      // blocked
      if (p.isBlocked) {
        map.blocked.count++;
        map.blocked.list.push(p);
      }

      // pined
      if (p.pined) {
        map.pined.count++;
        map.pined.list.push(p);
      }

      // completed & approved
      if (p.isApproved) {
        map.approved.count++;
        map.approved.list.push(p);
      }

      // overdue projects
      if (p.isOverdue) {
        map.overdue.count++;
        map.overdue.list.push(p);
      }
    }

    return map;
  },
);
