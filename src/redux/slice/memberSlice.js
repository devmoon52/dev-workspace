import { createSlice } from "@reduxjs/toolkit";
import { teamMembers } from "../../data/membersData";

const initialState = {
  team_members: teamMembers,
};

const memberSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    updateMember: (state, actions) => {
      state.team_members = actions.payload;
    },

    removeProject: (state, action) => {
      const { projectID, mid } = action.payload;
      const updated = state.team_members.find((m) => m.mid === mid);

      updated.role = updated.role.filter((r) => r.projectID !== projectID);
    },

    addProject: (state, action) => {
      const { project, mid } = action.payload;
      const currentMember = state.team_members.find((m) => m.mid === mid);

      currentMember.role.push({
        project: project.project,
        projectID: project.projectID,
        status: "pending",
        deadline: project.deadline,
        isOverdue: project.isOverdue ? true : false,
      });
    },

    // adding new member
    addNewMember: (state, action) => {
      const mid = action.payload;

      let currentMember = state.team_members.find((m) => m.mid === mid);
      currentMember.isNew = false;
      currentMember.isActive = true;
      currentMember.role = [];
      currentMember.oldProjects = [];
    },

    // remove all members
    removeAllMembers: (state, action) => {
      state.team_members = [];
    },
  },
});

export const {
  updateMember,
  removeProject,
  addProject,
  addNewMember,
  removeAllMembers,
} = memberSlice.actions;
export default memberSlice.reducer;
