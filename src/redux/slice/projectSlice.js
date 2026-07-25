import { createSlice } from "@reduxjs/toolkit";
import { projectData, completedProjects } from "../../data/projectsData";
import { getAvgDeadline } from "../../utils/calculateDate";

const initialState = {
  total_projects: [...projectData, ...completedProjects],
  avgDeadline: getAvgDeadline(projectData),
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    updateProjects: (state, action) => {
      state.total_projects = action.payload;
    },

    // finish project -> status running to completed
    finishProject: (state, action) => {
      const project = state.total_projects.find(
        (p) => p.projectID === action.payload,
      );

      if (project) {
        project.status = "completed";
        project.isOverdue = false;
        project.isApproved = false;
      }
    },

    // start project -> status pending to running
    startProject: (state, action) => {
      const projectID = action.payload;

      const project = state.total_projects.find(
        (p) => p.projectID === projectID,
      );

      if (project) {
        project.status = "running";
      }
    },

    // constrol project - handling block, delete & pin
    controlProject: (state, action) => {
      const { type, projectID } = action.payload;
      const project = state.total_projects.find(
        (p) => p.projectID === projectID,
      );

      if (type === "block") {
        project.isBlocked = !project.isBlocked;
      }
      if (type === "pin") {
        project.pined = !project.pined;
      }

      if (type === "delete") {
        state.total_projects = state.total_projects.filter(
          (p) => p.projectID !== projectID,
        );
      }
    },

    // remove all projects
    removeAllProjects: (state, action) => {
      state.total_projects = [];
    },
  },
});

export const {
  updateProjects,
  finishProject,
  startProject,
  controlProject,
  removeAllProjects,
} = projectSlice.actions;
export default projectSlice.reducer;
